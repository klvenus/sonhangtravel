// Strapi API Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Timeout config (longer for production cold starts on free tier hosting)
const API_TIMEOUT = process.env.NODE_ENV === 'production' ? 30000 : 10000; // 30s prod, 10s dev

// Types
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
  ten?: string; // Vietnamese field name
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
  tourFile?: StrapiImage; // PDF file for download
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

// Helper function to get full image URL
export function getImageUrl(image?: StrapiImage, size?: 'thumbnail' | 'small' | 'medium' | 'large'): string {
  if (!image) return '/images/placeholder-tour.jpg';
  
  let url = image.url;
  
  // Try to get specific size format
  if (size && image.formats?.[size]) {
    url = image.formats[size].url;
  }
  
  // Add base URL if needed
  if (url.startsWith('/')) {
    url = `${STRAPI_URL}${url}`;
  }
  
  return url;
}

// API Headers
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }
  
  return headers;
}

// Fetch wrapper with error handling and timeout
async function fetchAPI<T>(endpoint: string, options?: RequestInit & { revalidate?: number | false; timeout?: number }): Promise<T> {
  const url = `${STRAPI_URL}/api${endpoint}`;
  
  const { revalidate, timeout = API_TIMEOUT, ...fetchOptions } = options || {};
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(url, {
      ...fetchOptions,
      headers: getHeaders(),
      signal: controller.signal,
      cache: 'force-cache', // Force cache for better performance
      next: {
        revalidate: revalidate ?? 86400, // Default: cache 24 hours (aggressive caching)
        tags: ['strapi'] // Tag for on-demand revalidation
      },
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      console.error(`API Error: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`Request timeout after ${timeout}ms for ${endpoint}`);
        throw new Error(`Request timeout: ${endpoint}`);
      }
      console.error(`Fetch error for ${endpoint}:`, error.message);
    }
    throw error;
  }
}

// ============ TOUR API ============

// Get all tours with optional filters
export async function getTours(params?: {
  featured?: boolean;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}): Promise<StrapiResponse<Tour[]>> {
  const searchParams = new URLSearchParams();
  
  // Populate all relations (simpler syntax for Strapi 5)
  searchParams.set('populate', '*');
  
  // Filters
  if (params?.featured) {
    searchParams.set('filters[featured][$eq]', 'true');
  }
  if (params?.category) {
    searchParams.set('filters[category][slug][$eq]', params.category);
  }
  
  // Pagination
  searchParams.set('pagination[page]', String(params?.page || 1));
  searchParams.set('pagination[pageSize]', String(params?.pageSize || 10));
  
  // Sort
  if (params?.sort) {
    searchParams.set('sort', params.sort);
  }
  
  return fetchAPI<StrapiResponse<Tour[]>>(`/tours?${searchParams.toString()}`);
}

// Get single tour by slug (supports draft preview)
export async function getTourBySlug(slug: string, preview = false): Promise<Tour | null> {
  const searchParams = new URLSearchParams();
  
  // Populate all relations including nested (Strapi 5 syntax)
  searchParams.append('populate[0]', 'thumbnail');
  searchParams.append('populate[1]', 'gallery');
  searchParams.append('populate[2]', 'category');
  searchParams.append('populate[3]', 'itinerary.image');
  searchParams.append('populate[4]', 'includes');
  searchParams.append('populate[5]', 'excludes');
  searchParams.append('populate[6]', 'notes');
  searchParams.append('populate[7]', 'departureDates');
  searchParams.append('populate[8]', 'tourFile');
  
  // Filter by slug
  searchParams.append('filters[slug][$eq]', slug);
  
  // Include drafts for preview mode
  if (preview) {
    searchParams.append('status', 'draft');
  }
  
  const response = await fetchAPI<StrapiResponse<Tour[]>>(`/tours?${searchParams.toString()}`);
  
  return response.data?.[0] || null;
}

// Get featured tours
export async function getFeaturedTours(limit = 6): Promise<Tour[]> {
  const response = await getTours({
    featured: true,
    pageSize: limit,
    sort: 'bookingCount:desc',
  });
  
  return response.data || [];
}

// ============ CATEGORY API ============

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const searchParams = new URLSearchParams();
  searchParams.append('populate[0]', 'image');
  searchParams.append('populate[1]', 'tours');
  searchParams.set('sort', 'order:asc');
  
  const response = await fetchAPI<StrapiResponse<Category[]>>(`/categories?${searchParams.toString()}`);
  
  return response.data || [];
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const searchParams = new URLSearchParams();
  searchParams.set('populate', '*');
  searchParams.set('filters[slug][$eq]', slug);
  
  const response = await fetchAPI<StrapiResponse<Category[]>>(`/categories?${searchParams.toString()}`);
  
  return response.data?.[0] || null;
}

// Get tours by category
export async function getToursByCategory(categorySlug: string, page = 1, pageSize = 12): Promise<StrapiResponse<Tour[]>> {
  return getTours({
    category: categorySlug,
    page,
    pageSize,
  });
}

// ============ SEARCH API ============

export async function searchTours(query: string, page = 1, pageSize = 10): Promise<StrapiResponse<Tour[]>> {
  const searchParams = new URLSearchParams();
  
  searchParams.set('populate', '*');
  
  // Search in title and description
  searchParams.set('filters[$or][0][title][$containsi]', query);
  searchParams.set('filters[$or][1][shortDescription][$containsi]', query);
  searchParams.set('filters[$or][2][destination][$containsi]', query);
  
  searchParams.set('pagination[page]', String(page));
  searchParams.set('pagination[pageSize]', String(pageSize));
  
  return fetchAPI<StrapiResponse<Tour[]>>(`/tours?${searchParams.toString()}`);
}

// ============ SITE SETTINGS API ============

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
  bannerSlides?: BannerSlide[];
  phoneNumber?: string;
  zaloNumber?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('populate[0]', 'logo');
    searchParams.append('populate[1]', 'logoDark');
    searchParams.append('populate[2]', 'bannerSlides.image');
    
    const response = await fetchAPI<{ data: SiteSettings }>(`/site-setting?${searchParams.toString()}`);
    return response.data || null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
}
