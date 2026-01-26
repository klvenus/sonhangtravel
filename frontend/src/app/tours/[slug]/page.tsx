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
  params: { slug: string } 
}): Promise<Metadata> {
  try {
    const category = await getCategoryBySlug(params.slug)
    
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
  params: { slug: string } 
}) {
  try {
    // Fetch data on server
    const [toursRes, category] = await Promise.all([
      getTours({ category: params.slug, pageSize: 20 }),
      getCategoryBySlug(params.slug)
    ])

    if (!category) {
      notFound()
    }

    const tours = toursRes.data || []
    const categoryName = category.ten || category.name || 'Danh mục'

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="relative h-48 md:h-64 bg-[#00CBA9]">
          {category.image ? (
            <>
              <Image
                src={getImageUrl(category.image)}
                alt={`Tour ${categoryName}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </>
          ) : null}
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom text-white">
              <Link href="/tours" className="text-white/80 hover:text-white text-sm mb-2 inline-block">
                ← Tất cả tour
              </Link>
              <h1 className="text-2xl md:text-4xl font-bold">Tour {categoryName}</h1>
              {category.description && (
                <p className="mt-2 text-white/80 max-w-2xl">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className="container-custom py-6">
          {/* Results count */}
          <p className="text-gray-600 mb-4">
            Tìm thấy <span className="font-semibold text-[#00CBA9]">{tours.length}</span> tour
          </p>

          {/* Tours Grid */}
          {tours.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
    )
  } catch (error) {
    console.error('Error loading category page:', error)
    notFound()
  }
}
