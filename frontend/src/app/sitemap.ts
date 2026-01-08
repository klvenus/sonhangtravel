import { MetadataRoute } from 'next'

const SITE_URL = 'https://sonhangtravel.vercel.app'
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://sonhangtravel.onrender.com'

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
  ]

  // Fetch all tours from Strapi
  let tourPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/tours?fields[0]=slug&fields[1]=updatedAt&pagination[pageSize]=100`,
      { next: { revalidate: 3600 } }
    )
    
    if (res.ok) {
      const data = await res.json()
      tourPages = data.data?.map((tour: { slug: string; updatedAt: string }) => ({
        url: `${SITE_URL}/tour/${tour.slug}`,
        lastModified: new Date(tour.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })) || []
    }
  } catch (error) {
    console.error('Error fetching tours for sitemap:', error)
  }

  // Fetch all categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/categories?fields[0]=slug&fields[1]=updatedAt&pagination[pageSize]=50`,
      { next: { revalidate: 3600 } }
    )
    
    if (res.ok) {
      const data = await res.json()
      categoryPages = data.data?.map((cat: { slug: string; updatedAt: string }) => ({
        url: `${SITE_URL}/tours?category=${cat.slug}`,
        lastModified: new Date(cat.updatedAt),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })) || []
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  return [...staticPages, ...tourPages, ...categoryPages]
}
