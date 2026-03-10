import { MetadataRoute } from 'next'
import { getCategories, getTours } from '@/lib/data'

const SITE_URL = 'https://sonhangtravel.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/tours`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/uu-dai`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/ve-chung-toi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Fetch all tours from Neon DB
  let tourPages: MetadataRoute.Sitemap = []
  try {
    const tours = await getTours({ pageSize: 500 })
    tourPages = (tours.data || []).map((tour) => ({
      url: `${SITE_URL}/tour/${tour.slug}`,
      lastModified: tour.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching tours for sitemap:', error)
  }

  // Fetch all categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const categories = await getCategories()
    categoryPages = (categories || []).map((cat) => ({
      url: `${SITE_URL}/tours?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return [...staticPages, ...tourPages, ...categoryPages]
}
