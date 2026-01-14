import { getTours, getCategories, getImageUrl, Tour, Category } from '@/lib/strapi'
import ToursPageClient from './ToursPageClient'
import { Metadata } from 'next'
import { Suspense } from 'react'

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

// ISR - Revalidate every 5 minutes
export const revalidate = 300 // 5 phút

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

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <div className="bg-[#00CBA9] text-white py-8">
          <div className="container-custom">
            <h1 className="text-2xl md:text-3xl font-bold">Tất Cả Tour Du Lịch</h1>
            <p className="mt-2 text-white/80">Đang tải...</p>
          </div>
        </div>
        <div className="container-custom py-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#00CBA9]"></div>
        </div>
      </div>
    }>
      <ToursPageClient initialTours={tours} initialCategories={categories} />
    </Suspense>
  )
}
