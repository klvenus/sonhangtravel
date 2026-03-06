import { getTours, getCategories, getImageUrl, Tour, Category } from '@/lib/strapi'
import ToursPageClient from './ToursPageClient'
import { Metadata } from 'next'

// SEO Metadata for Tours page
export const metadata: Metadata = {
  title: "Tour Du Lịch Trung Quốc 2026 - Đông Hưng, Nam Ninh, Quế Lâm",
  description: "🎯 Danh sách tour du lịch Trung Quốc hot nhất 2026: Tour Đông Hưng 1-2 ngày, Tour Nam Ninh shopping, Tour Quế Lâm Dương Sóc, Tour Trương Gia Giới. Giá từ 999K!",
  keywords: ["tour trung quốc 2026", "tour đông hưng giá rẻ", "tour nam ninh mua sắm", "tour quế lâm", "du lịch trung quốc từ móng cái"],
  openGraph: {
    title: "Tour Du Lịch Trung Quốc 2026 | Sơn Hằng Travel",
    description: "Khám phá Trung Quốc với các tour chất lượng: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới. Giá tốt nhất thị trường!",
    url: "https://sonhangtravel.vercel.app/tours",
    type: "website",
  },
  alternates: {
    canonical: "https://sonhangtravel.vercel.app/tours",
  },
}

// ISR - revalidate every hour
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
