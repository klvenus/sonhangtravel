// Shared data layer for direct Neon DB queries
import { db } from './db';
import { categories, tours, siteSettings } from './schema';
import { eq, desc, asc, ilike, or, and, sql } from 'drizzle-orm';

export interface CategoryData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  image?: string | null;
  order: number | null;
  tourCount?: number;
}

export interface TourData {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content?: string | null;
  price: number;
  originalPrice?: number | null;
  duration: string;
  departure?: string | null;
  destination: string;
  transportation?: string | null;
  groupSize?: string | null;
  thumbnail?: string | null;
  gallery: string[];
  itinerary: { time?: string; title: string; description?: string; image?: string }[];
  includes: string[];
  excludes: string[];
  notes: string[];
  policy?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  featured: boolean | null;
  rating: string | null;
  reviewCount: number | null;
  bookingCount: number | null;
  departureDates: { date: string; price?: number; availableSlots: number; status: string }[];
  published: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface SearchTourIndexData {
  id: number;
  title: string;
  slug: string;
  destination: string;
  duration: string;
  price: number;
}

export interface BannerSlide {
  image: string;
  imageMobile?: string;
  title?: string;
  subtitle?: string;
  linkUrl?: string;
  linkText?: string;
}

export interface SiteSettingsData {
  id: number;
  siteName: string | null;
  logo?: string | null;
  logoDark?: string | null;
  favicon?: string | null;
  bannerSlides: BannerSlide[];
  phoneNumber?: string | null;
  zaloNumber?: string | null;
  email?: string | null;
  address?: string | null;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  tiktokUrl?: string | null;
}

// ============ TOUR QUERIES ============

export async function getTours(params?: {
  featured?: boolean;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  search?: string;
}): Promise<{ data: TourData[]; total: number; page: number; pageSize: number }> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const offset = (page - 1) * pageSize;

  // Build conditions
  const conditions = [eq(tours.published, true)];
  
  if (params?.featured) {
    conditions.push(eq(tours.featured, true));
  }

  if (params?.search) {
    conditions.push(
      or(
        ilike(tours.title, `%${params.search}%`),
        ilike(tours.shortDescription, `%${params.search}%`),
        ilike(tours.destination, `%${params.search}%`)
      )!
    );
  }

  // Category filter - join with categories
  let categoryCondition: ReturnType<typeof eq> | undefined;
  if (params?.category) {
    const cat = await db.select().from(categories).where(eq(categories.slug, params.category)).limit(1);
    if (cat[0]) {
      categoryCondition = eq(tours.categoryId, cat[0].id);
      conditions.push(categoryCondition);
    }
  }

  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  // Sort
  let orderBy = desc(tours.bookingCount);
  if (params?.sort) {
    const [field, dir] = params.sort.split(':');
    const sortDir = dir === 'asc' ? asc : desc;
    if (field === 'price') orderBy = sortDir(tours.price);
    else if (field === 'createdAt') orderBy = sortDir(tours.createdAt);
    else if (field === 'bookingCount') orderBy = sortDir(tours.bookingCount);
    else if (field === 'rating') orderBy = sortDir(tours.rating);
  }

  const [data, countResult] = await Promise.all([
    db.select({
      tour: tours,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(tours)
    .leftJoin(categories, eq(tours.categoryId, categories.id))
    .where(where)
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset),
    
    db.select({ count: sql<number>`count(*)` })
    .from(tours)
    .where(where),
  ]);

  return {
    data: data.map(row => ({
      ...row.tour,
      gallery: (row.tour.gallery || []) as string[],
      itinerary: (row.tour.itinerary || []) as TourData['itinerary'],
      includes: (row.tour.includes || []) as string[],
      excludes: (row.tour.excludes || []) as string[],
      notes: (row.tour.notes || []) as string[],
      departureDates: (row.tour.departureDates || []) as TourData['departureDates'],
      categoryName: row.categoryName,
      categorySlug: row.categorySlug,
    })),
    total: Number(countResult[0]?.count || 0),
    page,
    pageSize,
  };
}

export async function getTourBySlug(slug: string): Promise<TourData | null> {
  const data = await db.select({
    tour: tours,
    categoryName: categories.name,
    categorySlug: categories.slug,
  })
  .from(tours)
  .leftJoin(categories, eq(tours.categoryId, categories.id))
  .where(eq(tours.slug, slug))
  .limit(1);

  if (!data[0]) return null;

  const row = data[0];
  return {
    ...row.tour,
    gallery: (row.tour.gallery || []) as string[],
    itinerary: (row.tour.itinerary || []) as TourData['itinerary'],
    includes: (row.tour.includes || []) as string[],
    excludes: (row.tour.excludes || []) as string[],
    notes: (row.tour.notes || []) as string[],
    departureDates: (row.tour.departureDates || []) as TourData['departureDates'],
    categoryName: row.categoryName,
    categorySlug: row.categorySlug,
  };
}

// ============ CATEGORY QUERIES ============

export async function getCategories(): Promise<CategoryData[]> {
  const data = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      icon: categories.icon,
      image: categories.image,
      order: categories.order,
      tourCount: sql<number>`count(${tours.id})`,
    })
    .from(categories)
    .leftJoin(
      tours,
      and(eq(tours.categoryId, categories.id), eq(tours.published, true))
    )
    .groupBy(
      categories.id,
      categories.name,
      categories.slug,
      categories.description,
      categories.icon,
      categories.image,
      categories.order
    )
    .orderBy(asc(categories.order), asc(categories.id));

  return data.map((row) => ({
    ...row,
    tourCount: Number(row.tourCount || 0),
  }));
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  const data = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return data[0] || null;
}

export async function getSearchTourIndex(limit = 24): Promise<SearchTourIndexData[]> {
  const data = await db
    .select({
      id: tours.id,
      title: tours.title,
      slug: tours.slug,
      destination: tours.destination,
      duration: tours.duration,
      price: tours.price,
    })
    .from(tours)
    .where(eq(tours.published, true))
    .orderBy(desc(tours.bookingCount), desc(tours.updatedAt), asc(tours.id))
    .limit(limit);

  return data;
}

// ============ SITE SETTINGS ============

export async function getSiteSettings(): Promise<SiteSettingsData | null> {
  const data = await db.select().from(siteSettings).limit(1);
  if (!data[0]) return null;
  
  return {
    ...data[0],
    bannerSlides: (data[0].bannerSlides || []) as BannerSlide[],
  };
}

// ============ HELPER FUNCTIONS ============

const CLOUDINARY_SIZE_TRANSFORMS: Record<string, string> = {
  thumb: 'f_auto,q_auto:good,dpr_auto,c_fill,g_auto,w_160,h_160',
  small: 'f_auto,q_auto:good,dpr_auto,c_fill,g_auto,w_480,h_360',
  medium: 'f_auto,q_auto:good,dpr_auto,c_fill,g_auto,w_960,h_720',
  large: 'f_auto,q_auto:best,dpr_auto,c_limit,w_1800',
  hero: 'f_auto,q_auto:best,dpr_auto,c_limit,w_2400',
};

function applyCloudinaryTransform(url: string, transform: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'res.cloudinary.com') return url;

    const uploadMarker = '/image/upload/';
    const markerIndex = parsed.pathname.indexOf(uploadMarker);
    if (markerIndex === -1) return url;

    const prefix = parsed.pathname.slice(0, markerIndex + uploadMarker.length);
    const suffix = parsed.pathname.slice(markerIndex + uploadMarker.length);
    const [firstSegment] = suffix.split('/');

    if (!firstSegment) return url;

    const transformedPath = /^v\d+$/i.test(firstSegment)
      ? `${prefix}${transform}/${suffix}`
      : url;

    if (transformedPath === url) return url;

    parsed.pathname = transformedPath;
    return parsed.toString();
  } catch {
    return url;
  }
}

// Compatible getImageUrl - shifts resizing work to Cloudinary when possible.
export function getImageUrl(url?: string | null, size?: string): string {
  if (!url) return '';

  const normalizedSize = size?.trim().toLowerCase();
  if (!normalizedSize) return url;

  const transform = CLOUDINARY_SIZE_TRANSFORMS[normalizedSize];
  if (!transform) return url;

  return applyCloudinaryTransform(url, transform);
}
