// Neon DB-backed compatibility layer
// Exports same types/functions as old Strapi API wrapper
import { db } from './db';
import { tours, categories, siteSettings } from './schema';
import { eq, desc, asc, ilike, or, sql } from 'drizzle-orm';

// ============ TYPES (kept for compatibility) ============

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  ten?: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: StrapiImage;
  order: number;
  tours?: Tour[];
}

export interface ItineraryItem {
  id: number;
  time?: string;
  title: string;
  description?: string;
  image?: StrapiImage;
}

export interface ListItem {
  id: number;
  text: string;
}

export interface DepartureDate {
  id: number;
  date: string;
  price?: number;
  availableSlots: number;
  status: 'available' | 'almost_full' | 'full';
}

export interface Tour {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  shortDescription: string;
  content?: string;
  price: number;
  originalPrice?: number;
  duration: string;
  departure?: string;
  destination: string;
  transportation?: string;
  groupSize?: string;
  thumbnail: StrapiImage;
  gallery?: StrapiImage[];
  tourFile?: StrapiImage;
  itinerary?: ItineraryItem[];
  includes?: ListItem[];
  excludes?: ListItem[];
  notes?: ListItem[];
  policy?: string;
  category?: Category;
  featured: boolean;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  departureDates?: DepartureDate[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface BannerSlide {
  id: number;
  image: StrapiImage;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  linkText?: string;
}

export interface SiteSettings {
  id: number;
  siteName: string;
  logo?: StrapiImage;
  logoDark?: StrapiImage;
  favicon?: StrapiImage;
  bannerSlides?: BannerSlide[];
  phoneNumber?: string;
  zaloNumber?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

// ============ HELPERS ============

function urlToStrapiImage(url: string | null | undefined, id = 1): StrapiImage | undefined {
  if (!url) return undefined;
  return { id, url, formats: { thumbnail: { url }, small: { url }, medium: { url }, large: { url } } };
}

function urlToStrapiImageRequired(url: string | null | undefined, id = 1): StrapiImage {
  const fallback = '/images/placeholder-tour.jpg';
  const u = url || fallback;
  return { id, url: u, formats: { thumbnail: { url: u }, small: { url: u }, medium: { url: u }, large: { url: u } } };
}

export function getImageUrl(image?: StrapiImage | string, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!image) return '/images/placeholder-tour.jpg';
  if (typeof image === 'string') return image || '/images/placeholder-tour.jpg';
  if (size && image.formats?.[size]) return image.formats[size].url;
  return image.url || '/images/placeholder-tour.jpg';
}

// Convert DB tour row to Tour interface
function dbTourToTour(row: Record<string, unknown>, cat?: Record<string, unknown> | null): Tour {
  const r = row as {
    id: number; title: string; slug: string; shortDescription: string; content: string | null;
    price: number; originalPrice: number | null; duration: string; departure: string | null;
    destination: string; transportation: string | null; groupSize: string | null;
    thumbnail: string | null; gallery: string[] | null;
    itinerary: { time?: string; title: string; description?: string; image?: string }[] | null;
    includes: string[] | null; excludes: string[] | null; notes: string[] | null;
    policy: string | null; categoryId: number | null;
    featured: boolean | null; rating: string | null;
    reviewCount: number | null; bookingCount: number | null;
    departureDates: { date: string; price?: number; availableSlots: number; status: 'available' | 'almost_full' | 'full' }[] | null;
    published: boolean | null; createdAt: Date | null; updatedAt: Date | null;
  };

  const category = cat ? {
    id: (cat as { id: number }).id,
    documentId: String((cat as { id: number }).id),
    name: (cat as { name: string }).name,
    ten: (cat as { name: string }).name,
    slug: (cat as { slug: string }).slug,
    description: (cat as { description?: string }).description,
    icon: (cat as { icon?: string }).icon,
    order: (cat as { order?: number }).order || 0,
  } as Category : undefined;

  return {
    id: r.id,
    documentId: String(r.id),
    title: r.title,
    slug: r.slug,
    shortDescription: r.shortDescription || '',
    content: r.content || undefined,
    price: r.price,
    originalPrice: r.originalPrice || undefined,
    duration: r.duration,
    departure: r.departure || undefined,
    destination: r.destination,
    transportation: r.transportation || undefined,
    groupSize: r.groupSize || undefined,
    thumbnail: urlToStrapiImageRequired(r.thumbnail),
    gallery: (r.gallery || []).map((url, i) => urlToStrapiImageRequired(url, i + 1)),
    itinerary: (r.itinerary || []).map((it, i) => ({
      id: i + 1,
      time: it.time,
      title: it.title,
      description: it.description,
      image: it.image ? urlToStrapiImage(it.image, i + 1) : undefined,
    })),
    includes: (r.includes || []).map((text, i) => ({ id: i + 1, text })),
    excludes: (r.excludes || []).map((text, i) => ({ id: i + 1, text })),
    notes: (r.notes || []).map((text, i) => ({ id: i + 1, text })),
    policy: r.policy || undefined,
    category,
    featured: r.featured || false,
    rating: parseFloat(r.rating || '5.0'),
    reviewCount: r.reviewCount || 0,
    bookingCount: r.bookingCount || 0,
    departureDates: (r.departureDates || []).map((dd, i) => ({ id: i + 1, ...dd })),
    createdAt: r.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: r.updatedAt?.toISOString() || new Date().toISOString(),
    publishedAt: r.createdAt?.toISOString() || new Date().toISOString(),
  };
}

function dbCatToCategory(row: Record<string, unknown>, toursList?: Tour[]): Category {
  const r = row as {
    id: number; name: string; slug: string; description: string | null;
    icon: string | null; image: string | null; order: number | null;
  };
  return {
    id: r.id,
    documentId: String(r.id),
    name: r.name,
    ten: r.name,
    slug: r.slug,
    description: r.description || undefined,
    icon: r.icon || undefined,
    image: urlToStrapiImage(r.image),
    order: r.order || 0,
    tours: toursList,
  };
}

// ============ TOUR API ============

export async function getTours(params?: {
  featured?: boolean;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}): Promise<StrapiResponse<Tour[]>> {
  try {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 10;
    const offset = (page - 1) * pageSize;

    // Build query
    let query = db
      .select()
      .from(tours)
      .leftJoin(categories, eq(tours.categoryId, categories.id))
      .where(eq(tours.published, true))
      .limit(pageSize)
      .offset(offset);

    // Apply featured filter using $dynamic
    if (params?.featured) {
      query = db
        .select()
        .from(tours)
        .leftJoin(categories, eq(tours.categoryId, categories.id))
        .where(sql`${tours.published} = true AND ${tours.featured} = true`)
        .limit(pageSize)
        .offset(offset);
    }

    if (params?.category) {
      query = db
        .select()
        .from(tours)
        .leftJoin(categories, eq(tours.categoryId, categories.id))
        .where(sql`${tours.published} = true AND ${categories.slug} = ${params.category}`)
        .limit(pageSize)
        .offset(offset);
    }

    // Sort
    const sortField = params?.sort || 'bookingCount:desc';
    const [field, direction] = sortField.split(':');
    if (field === 'bookingCount') {
      query = query.orderBy(direction === 'asc' ? asc(tours.bookingCount) : desc(tours.bookingCount)) as typeof query;
    } else if (field === 'price') {
      query = query.orderBy(direction === 'asc' ? asc(tours.price) : desc(tours.price)) as typeof query;
    } else if (field === 'createdAt') {
      query = query.orderBy(direction === 'asc' ? asc(tours.createdAt) : desc(tours.createdAt)) as typeof query;
    } else {
      query = query.orderBy(desc(tours.bookingCount)) as typeof query;
    }

    const rows = await query;

    // Count total
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(tours).where(eq(tours.published, true));
    const total = Number(countResult[0]?.count || 0);

    const data = rows.map(row => dbTourToTour(row.tours as unknown as Record<string, unknown>, row.categories as unknown as Record<string, unknown> | null));

    return {
      data,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total,
        },
      },
    };
  } catch (error) {
    console.error('Error in getTours:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

export async function getTourBySlug(slug: string, _preview = false): Promise<Tour | null> {
  try {
    const rows = await db
      .select()
      .from(tours)
      .leftJoin(categories, eq(tours.categoryId, categories.id))
      .where(eq(tours.slug, slug))
      .limit(1);

    if (!rows[0]) return null;
    return dbTourToTour(rows[0].tours as unknown as Record<string, unknown>, rows[0].categories as unknown as Record<string, unknown> | null);
  } catch (error) {
    console.error('Error in getTourBySlug:', error);
    return null;
  }
}

export async function getFeaturedTours(limit = 6): Promise<Tour[]> {
  const response = await getTours({ featured: true, pageSize: limit, sort: 'bookingCount:desc' });
  return response.data || [];
}

// ============ CATEGORY API ============

export async function getCategories(): Promise<Category[]> {
  try {
    const rows = await db.select().from(categories).orderBy(asc(categories.order));

    // For each category, count tours
    const result: Category[] = [];
    for (const row of rows) {
      const tourRows = await db
        .select()
        .from(tours)
        .where(sql`${tours.categoryId} = ${row.id} AND ${tours.published} = true`);

      const toursList = tourRows.map(t => dbTourToTour(t as unknown as Record<string, unknown>));
      result.push(dbCatToCategory(row as unknown as Record<string, unknown>, toursList));
    }

    return result;
  } catch (error) {
    console.error('Error in getCategories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (!rows[0]) return null;
    return dbCatToCategory(rows[0] as unknown as Record<string, unknown>);
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
}

export async function getToursByCategory(categorySlug: string, page = 1, pageSize = 12): Promise<StrapiResponse<Tour[]>> {
  return getTours({ category: categorySlug, page, pageSize });
}

// ============ SEARCH API ============

export async function searchTours(query: string, page = 1, pageSize = 10): Promise<StrapiResponse<Tour[]>> {
  try {
    const offset = (page - 1) * pageSize;
    const searchPattern = `%${query}%`;

    const rows = await db
      .select()
      .from(tours)
      .leftJoin(categories, eq(tours.categoryId, categories.id))
      .where(
        sql`${tours.published} = true AND (
          ${tours.title} ILIKE ${searchPattern} OR
          ${tours.shortDescription} ILIKE ${searchPattern} OR
          ${tours.destination} ILIKE ${searchPattern}
        )`
      )
      .limit(pageSize)
      .offset(offset)
      .orderBy(desc(tours.bookingCount));

    const data = rows.map(row => dbTourToTour(row.tours as unknown as Record<string, unknown>, row.categories as unknown as Record<string, unknown> | null));

    return {
      data,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(data.length / pageSize),
          total: data.length,
        },
      },
    };
  } catch (error) {
    console.error('Error in searchTours:', error);
    return { data: [], meta: { pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 } } };
  }
}

// ============ SITE SETTINGS API ============

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const rows = await db.select().from(siteSettings).limit(1);
    if (!rows[0]) return null;

    const s = rows[0];
    return {
      id: s.id,
      siteName: s.siteName || 'Son Hang Travel',
      logo: urlToStrapiImage(s.logo),
      logoDark: urlToStrapiImage(s.logoDark),
      favicon: urlToStrapiImage(s.favicon),
      bannerSlides: (s.bannerSlides || []).map((slide, i) => ({
        id: i + 1,
        image: urlToStrapiImageRequired(slide.image, i + 1),
        title: slide.title,
        subtitle: slide.subtitle,
        linkUrl: slide.linkUrl,
        linkText: slide.linkText,
      })),
      phoneNumber: s.phoneNumber || undefined,
      zaloNumber: s.zaloNumber || undefined,
      email: s.email || undefined,
      address: s.address || undefined,
      facebookUrl: s.facebookUrl || undefined,
      youtubeUrl: s.youtubeUrl || undefined,
      tiktokUrl: s.tiktokUrl || undefined,
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}
