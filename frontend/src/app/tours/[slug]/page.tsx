import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import TourCard from '@/components/TourCard'
import { getTours, getCategoryBySlug, getImageUrl } from '@/lib/strapi'

// Enable ISR - revalidate every 1 hour
export const revalidate = 3600

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  try {
    const { slug } = await params
    const category = await getCategoryBySlug(slug)
    
    if (!category) {
      return {
        title: 'Không tìm thấy danh mục | Sơn Hằng Travel',
      }
    }

    const categoryName = category.ten || category.name || 'Danh mục'
    
    return {
      title: `Tour ${categoryName} | Sơn Hằng Travel`,
      description: category.description || `Khám phá các tour du lịch hấp dẫn tại ${categoryName} cùng Sơn Hằng Travel`,
      openGraph: {
        title: `Tour ${categoryName}`,
        description: category.description || `Khám phá các tour du lịch hấp dẫn tại ${categoryName}`,
        images: category.image ? [getImageUrl(category.image, 'large')] : [],
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Tour Du Lịch | Sơn Hằng Travel',
    }
  }
}

export default async function CategoryToursPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  try {
    const { slug } = await params
    console.log('[CategoryToursPage] Fetching data for slug:', slug)
    
    // Fetch with longer timeout and retry
    const [toursRes, category] = await Promise.all([
      getTours({ category: slug, pageSize: 20 }).catch(err => {
        console.error('[CategoryToursPage] Error fetching tours:', err)
        return { data: [], meta: { pagination: { page: 1, pageSize: 20, pageCount: 0, total: 0 } } }
      }),
      getCategoryBySlug(slug).catch(err => {
        console.error('[CategoryToursPage] Error fetching category:', err)
        return null
      })
    ])

    console.log('[CategoryToursPage] Category result:', category)
    console.log('[CategoryToursPage] Tours count:', toursRes.data?.length || 0)

    // If category not found, show 404
    if (!category) {
      console.error('[CategoryToursPage] Category not found for slug:', slug)
      notFound()
    }

    const tours = toursRes.data || []
    const categoryName = category.ten || category.name || 'Danh mục'

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container-custom py-3">
            <Link href="/tours" className="text-gray-600 hover:text-[#00CBA9] text-sm">
              ← Tất cả tour
            </Link>
          </div>
        </div>

        <div className="container-custom py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 sticky top-6">
                <h1 className="text-xl font-bold text-gray-900 mb-3">
                  TOUR {categoryName}
                </h1>
                {category.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                )}
                {!category.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Tour {categoryName} Cùng khám phá động hứng với sơn hằng travel
                  </p>
                )}
              </div>
            </div>

            {/* Right Content - Tours Grid */}
            <div className="lg:col-span-9">
              {/* Results count */}
              <p className="text-gray-600 mb-4">
                Tìm thấy <span className="font-semibold text-[#00CBA9]">{tours.length}+</span> kết quả
              </p>

              {/* Tours Grid */}
              {tours.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {tours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      id={String(tour.id)}
                      title={tour.title}
                      slug={tour.slug}
                      image={getImageUrl(tour.thumbnail, 'medium')}
                      location={tour.destination}
                      duration={tour.duration}
                      price={tour.price}
                      originalPrice={tour.originalPrice}
                      rating={tour.rating || 5}
                      reviewCount={tour.reviewCount || 0}
                      isHot={tour.featured}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🏝️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có tour nào</h3>
                  <p className="text-gray-500 mb-4">Danh mục này đang được cập nhật</p>
                  <Link 
                    href="/tours" 
                    className="inline-block bg-[#00CBA9] text-white px-6 py-2 rounded-full hover:bg-[#00A88A] transition-colors"
                  >
                    Xem tour khác
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}
