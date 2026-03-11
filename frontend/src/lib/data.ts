// Data layer - replaces Strapi API calls with direct Neon DB queries
import { db } from './db';
import { categories, tours, siteSettings } from './schema';
import { eq, desc, asc, ilike, or, and, sql } from 'drizzle-orm';

// ============ TYPES (keep compatible with existing components) ============

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
  const data = await db.select().from(categories).orderBy(asc(categories.order));
  
  // Get tour counts
  const result: CategoryData[] = [];
  for (const cat of data) {
    const countResult = await db.select({ count: sql<number>`count(*)` })
      .from(tours)
      .where(and(eq(tours.categoryId, cat.id), eq(tours.published, true)));
    
    result.push({
      ...cat,
      tourCount: Number(countResult[0]?.count || 0),
    });
  }

  return result;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryData | null> {
  const data = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return data[0] || null;
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

// Compatible getImageUrl - works with both Cloudinary URLs and direct URLs
export function getImageUrl(url?: string | null, _size?: string): string {
  if (!url) return '/images/placeholder-tour.jpg';
  return url;
}
