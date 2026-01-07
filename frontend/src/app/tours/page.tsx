import { getTours, getCategories, getImageUrl, Tour, Category } from '@/lib/strapi'
import ToursPageClient from './ToursPageClient'

// ISR - Revalidate every hour
export const revalidate = 3600

// Transform tour for client component
function transformTour(tour: Tour) {
  const galleryImages = tour.gallery?.map(img => getImageUrl(img, 'medium')).filter(Boolean) || []
  
  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    image: getImageUrl(tour.thumbnail, 'medium'),
    gallery: galleryImages,
    location: tour.destination,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice,
    rating: tour.rating || 5,
    reviewCount: tour.reviewCount || 0,
    isHot: tour.featured,
    categorySlug: tour.category?.slug || null,
    category: tour.category?.ten || tour.category?.name || undefined,
  }
}

// Transform category for client component
function transformCategory(cat: Category) {
  return {
    id: cat.id,
    name: cat.ten || cat.name || 'Danh mục',
    slug: cat.slug,
  }
}

export default async function ToursPage() {
  let tours: ReturnType<typeof transformTour>[] = []
  let categories: ReturnType<typeof transformCategory>[] = []

  try {
    const [toursRes, categoriesData] = await Promise.all([
      getTours({ pageSize: 50 }),
      getCategories()
    ])
    
    if (toursRes.data) {
      tours = toursRes.data.map(transformTour)
    }
    if (categoriesData) {
      categories = categoriesData.map(transformCategory)
    }
  } catch (error) {
    console.error('Error fetching tours data:', error)
  }

  return <ToursPageClient initialTours={tours} initialCategories={categories} />
}
