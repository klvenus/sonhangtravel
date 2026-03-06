import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { tours, categories } from '@/lib/schema'
import { eq } from 'drizzle-orm'

const SITE_URL = 'https://sonhangtravel.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: today, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/tours`, lastModified: today, changeFrequency: 'daily', priority: 0.9 },
  ]

  let tourPages: MetadataRoute.Sitemap = []
  try {
    const allTours = await db.select({ slug: tours.slug }).from(tours).where(eq(tours.published, true))
    tourPages = allTours.map(tour => ({
      url: `${SITE_URL}/tour/${tour.slug}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching tours for sitemap:', error)
  }

  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const allCats = await db.select({ slug: categories.slug }).from(categories)
    categoryPages = allCats.map(cat => ({
      url: `${SITE_URL}/tours?category=${cat.slug}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return [...staticPages, ...tourPages, ...categoryPages]
}
