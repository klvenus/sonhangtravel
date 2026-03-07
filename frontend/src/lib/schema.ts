import { pgTable, serial, text, integer, decimal, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

// ============ CATEGORIES ============
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  icon: text('icon').default('🏯'),
  image: text('image'),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============ TOURS ============
export const tours = pgTable('tours', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  shortDescription: text('short_description').notNull(),
  content: text('content'),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  duration: text('duration').notNull(),
  departure: text('departure'),
  destination: text('destination').notNull(),
  transportation: text('transportation'),
  groupSize: text('group_size'),
  thumbnail: text('thumbnail'),
  gallery: jsonb('gallery').$type<string[]>().default([]),
  itinerary: jsonb('itinerary').$type<{
    time?: string;
    title: string;
    description?: string;
    image?: string;
  }[]>().default([]),
  includes: jsonb('includes').$type<string[]>().default([]),
  excludes: jsonb('excludes').$type<string[]>().default([]),
  notes: jsonb('notes').$type<string[]>().default([]),
  policy: text('policy'),
  categoryId: integer('category_id').references(() => categories.id),
  featured: boolean('featured').default(false),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('5.0'),
  reviewCount: integer('review_count').default(0),
  bookingCount: integer('booking_count').default(0),
  departureDates: jsonb('departure_dates').$type<{
    date: string;
    price?: number;
    availableSlots: number;
    status: 'available' | 'almost_full' | 'full';
  }[]>().default([]),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============ BLOG POSTS ============
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  excerpt: text('excerpt').notNull(),
  content: jsonb('content').$type<{ type: 'heading' | 'paragraph'; text: string }[]>().default([]),
  category: text('category').notNull().default('Blog'),
  keywords: jsonb('keywords').$type<string[]>().default([]),
  thumbnail: text('thumbnail'),
  gallery: jsonb('gallery').$type<string[]>().default([]),
  published: boolean('published').default(true),
  publishedAt: timestamp('published_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ SITE SETTINGS ============
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: text('site_name').default('Sơn Hằng Travel'),
  logo: text('logo'),
  logoDark: text('logo_dark'),
  favicon: text('favicon'),
  bannerSlides: jsonb('banner_slides').$type<{
    image: string;
    title?: string;
    subtitle?: string;
    linkUrl?: string;
    linkText?: string;
  }[]>().default([]),
  phoneNumber: text('phone_number').default('0338239888'),
  zaloNumber: text('zalo_number').default('0388091993'),
  email: text('email').default('Lienhe@sonhangtravel.com'),
  address: text('address').default('Khu 5 - Phường Móng Cái - Quảng Ninh'),
  facebookUrl: text('facebook_url'),
  youtubeUrl: text('youtube_url'),
  tiktokUrl: text('tiktok_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ============ ADMIN USERS ============
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
