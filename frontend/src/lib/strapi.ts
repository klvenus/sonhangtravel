// Strapi-compatible API layer - now backed by Neon PostgreSQL
// This maintains the same export interface so all pages/components work unchanged

import { db } from './db';
import { categories as categoriesTable, tours as toursTable, siteSettings as siteSettingsTable } from './schema';
import { eq, desc, asc, ilike, or, and, sql } from 'drizzle-orm';

// ============ TYPES (unchanged from Strapi version) ============

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

// ============ HELPER: Convert DB row to Strapi-like types ============

function urlToStrapiImage(url: string | null | undefined, id = 1): StrapiImage | undefined {
  if (!url) return undefined;
  return { id, url, alternativeText: '', width: 800, height: 600 };
}

function dbTourToTour(row: {
  tour: typeof toursTable.$inferSelect;
  categoryName: string | null;
  categorySlug: string | null;
  categoryId?: number | null;
  categoryIcon?: string | null;
}): Tour {
  const t = row.tour;
  const itineraryRaw = (t.itinerary || []) as { time?: string; title: string; description?: string; image?: string }[];
  const includesRaw = (t.includes || []) as string[];
  const excludesRaw = (t.excludes || []) as string[];
  const notesRaw = (t.notes || []) as string[];
  const galleryRaw = (t.gallery || []) as string[];
  const datesRaw = (t.departureDates || []) as { date: string; price?: number; availableSlots: number; status: 'available' | 'almost_full' | 'full' }[];

  return {
    id: t.id,
    documentId: String(t.id),
    title: t.title,
    slug: t.slug,
    shortDescription: t.shortDescription,
    content: t.content || undefined,
    price: t.price,
    originalPrice: t.originalPrice || undefined,
    duration: t.duration,
    departure: t.departure || undefined,
    destination: t.destination,
    transportation: t.transportation || undefined,
    groupSize: t.groupSize || undefined,
    thumbnail: urlToStrapiImage(t.thumbnail) || { id: 0, url: '/images/placeholder-tour.jpg' },
    gallery: galleryRaw.map((url, i) => urlToStrapiImage(url, i + 100)!),
    tourFile: undefined,
    itinerary: itineraryRaw.map((item, i) => ({
      id: i + 1,
      time: item.time,
      title: item.title,
      description: item.description,
      image: item.image ? urlToStrapiImage(item.image, i + 200) : undefined,
    })),
    includes: includesRaw.map((text, i) => ({ id: i + 1, text })),
    excludes: excludesRaw.map((text, i) => ({ id: i + 1, text })),
    notes: notesRaw.map((text, i) => ({ id: i + 1, text })),
    policy: t.policy || undefined,
    category: t.categoryId && row.categoryName ? {
      id: t.categoryId,
      documentId: String(t.categoryId),
      name: row.categoryName,
      slug: row.categorySlug || '',
      order: 0,
    } : undefined,
    featured: t.featured || false,
    rating: Number(t.rating) || 5,
    reviewCount: t.reviewCount || 0,
    bookingCount: t.bookingCount || 0,
    departureDates: datesRaw.map((d, i) => ({ id: i + 1, ...d })),
    createdAt: t.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: t.updatedAt?.toISOString() || new Date().toISOString(),
    publishedAt: t.createdAt?.toISOString() || new Date().toISOString(),
  };
}

// ============ IMAGE HELPER ============

export function getImageUrl(image?: StrapiImage | string | null, _size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!image) return '/images/placeholder-tour.jpg';
  if (typeof image === 'string') return image;
  return image.url;
}

// ============ TOUR API ============

export async function getTours(params?: {
  featured?: boolean;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}): Promise<StrapiResponse<Tour[]>> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  const conditions = [eq(toursTable.published, true)];
  if (params?.featured) conditions.push(eq(toursTable.featured, true));
  if (params?.search) {
    conditions.push(
      or(
        ilike(toursTable.title, `%${params.search}%`),
        ilike(toursTable.shortDescription, `%${params.search}%`),
        ilike(toursTable.destination, `%${params.search}%`)
      )!
    );
  }
  if (params?.category) {
    const cat = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, params.category)).limit(1);
    if (cat[0]) conditions.push(eq(toursTable.categoryId, cat[0].id));
  }

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  let orderBy = desc(toursTable.bookingCount);
  if (params?.sort) {
    const [field, dir] = params.sort.split(':');
    const sortDir = dir === 'asc' ? asc : desc;
    if (field === 'price') orderBy = sortDir(toursTable.price);
    else if (field === 'createdAt') orderBy = sortDir(toursTable.createdAt);
    else if (field === 'bookingCount') orderBy = sortDir(toursTable.bookingCount);
    else if (field === 'rating') orderBy = sortDir(toursTable.rating);
  }

  const [data, countResult] = await Promise.all([
    db.select({
      tour: toursTable,
      categoryName: categoriesTable.name,
      categorySlug: categoriesTable.slug,
    })
    .from(toursTable)
    .leftJoin(categoriesTable, eq(toursTable.categoryId, categoriesTable.id))
    .where(where)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset),

    db.select({ count: sql<number>`count(*)` }).from(toursTable).where(where),
  ]);

  const total = Number(countResult[0]?.count || 0);

  return {
    data: data.map(row => dbTourToTour(row)),
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
        total,
      },
    },
  };
}

export async function getTourBySlug(slug: string, _preview = false): Promise<Tour | null> {
  const data = await db.select({
    tour: toursTable,
    categoryName: categoriesTable.name,
    categorySlug: categoriesTable.slug,
  })
  .from(toursTable)
  .leftJoin(categoriesTable, eq(toursTable.categoryId, categoriesTable.id))
  .where(eq(toursTable.slug, slug))
  .limit(1);

  if (!data[0]) return null;
  return dbTourToTour(data[0]);
}

export async function getFeaturedTours(limit = 6): Promise<Tour[]> {
  const response = await getTours({ featured: true, pageSize: limit, sort: 'bookingCount:desc' });
  return response.data || [];
}

// ============ CATEGORY API ============

export async function getCategories(): Promise<Category[]> {
  const data = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));

  const result: Category[] = [];
  for (const cat of data) {
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(toursTable)
      .where(and(eq(toursTable.categoryId, cat.id), eq(toursTable.published, true)));
    
    const tourCount = Number(countResult[0]?.count || 0);

    result.push({
      id: cat.id,
      documentId: String(cat.id),
      name: cat.name,
      ten: cat.name, // Vietnamese compatibility
      slug: cat.slug,
      description: cat.description || undefined,
      icon: cat.icon || '🏯',
      image: urlToStrapiImage(cat.image),
      order: cat.order || 0,
      tours: new Array(tourCount) as Tour[], // Fake array for .length count
    });
  }

  return result;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await db.select().from(categoriesTable).where(eq(categoriesTable.slug, slug)).limit(1);
  if (!data[0]) return null;
  return {
    id: data[0].id,
    documentId: String(data[0].id),
    name: data[0].name,
    ten: data[0].name,
    slug: data[0].slug,
    description: data[0].description || undefined,
    icon: data[0].icon || '🏯',
    image: urlToStrapiImage(data[0].image),
    order: data[0].order || 0,
  };
}

export async function getToursByCategory(categorySlug: string, page = 1, pageSize = 12): Promise<StrapiResponse<Tour[]>> {
  return getTours({ category: categorySlug, page, pageSize });
}

// ============ SEARCH API ============

export async function searchTours(query: string, page = 1, pageSize = 10): Promise<StrapiResponse<Tour[]>> {
  return getTours({ search: query, page, pageSize });
}

// ============ SITE SETTINGS API ============

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await db.select().from(siteSettingsTable).limit(1);
    if (!data[0]) return null;

    const s = data[0];
    const slidesRaw = (s.bannerSlides || []) as { image: string; title?: string; subtitle?: string; linkUrl?: string; linkText?: string }[];

    return {
      id: s.id,
      siteName: s.siteName || 'Sơn Hằng Travel',
      logo: urlToStrapiImage(s.logo),
      logoDark: urlToStrapiImage(s.logoDark),
      favicon: urlToStrapiImage(s.favicon),
      bannerSlides: slidesRaw.map((slide, i) => ({
        id: i + 1,
        image: { id: i + 1, url: slide.image } as StrapiImage,
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
