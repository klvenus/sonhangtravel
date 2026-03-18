import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TourCard from '@/components/TourCard'
import { getTours, getCategoryBySlug, getCategories, getImageUrl } from '@/lib/data'

const SITE_URL = 'https://sonhangtravel.com'

function buildCategoryFaqItems(categoryName: string, slug: string, tourCount: number) {
  return [
    {
      question: `Tour ${categoryName} có những lịch trình nào nổi bật?`,
      answer: `Hiện Sơn Hằng Travel đang có khoảng ${tourCount} hành trình thuộc nhóm ${categoryName}. Anh chị có thể xem trực tiếp tại ${SITE_URL}/tours/${slug} để chọn tour phù hợp về thời gian, điểm đi và ngân sách.`,
    },
    {
      question: `Nên chọn tour ${categoryName} mấy ngày?`,
      answer: `Nếu muốn đi nhanh gọn, anh chị có thể ưu tiên tour ngắn ngày. Nếu muốn kết hợp tham quan và mua sắm sâu hơn, nên chọn các hành trình 2 ngày trở lên để lịch trình thoải mái hơn.`,
    },
    {
      question: `Đặt tour ${categoryName} trước bao lâu là hợp lý?`,
      answer: `Với các tuyến bán chạy, nên giữ chỗ sớm để chủ động hồ sơ và giá tốt. Đặt sớm cũng giúp mình chọn được ngày khởi hành phù hợp hơn.`,
    },
  ]
}

// Enable ISR - revalidate every 1 hour
export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const categories = await getCategories()
    return categories
      .filter((category) => (category.tourCount || 0) > 0)
      .map((category) => ({
        slug: category.slug,
      }))
  } catch (error) {
    console.error('Error generating category static params:', error)
    return []
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  try {
    const { slug } = await params
    const [category, toursRes] = await Promise.all([
      getCategoryBySlug(slug),
      getTours({ category: slug, pageSize: 1 }),
    ])
    
    if (!category) {
      return {
        title: 'Không tìm thấy danh mục | Sơn Hằng Travel',
      }
    }

    const categoryName = category.name || 'Danh mục'
    const canonicalUrl = `${SITE_URL}/tours/${slug}`
    const categoryImage = category.image ? getImageUrl(category.image, 'large') : undefined
    const hasPublishedTours = toursRes.total > 0
    
    return {
      title: `Tour ${categoryName}`,
      description: category.description || `Khám phá các tour du lịch hấp dẫn tại ${categoryName} cùng Sơn Hằng Travel`,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: hasPublishedTours,
        follow: true,
      },
      openGraph: {
        title: `Tour ${categoryName}`,
        description: category.description || `Khám phá các tour du lịch hấp dẫn tại ${categoryName}`,
        url: canonicalUrl,
        type: 'website',
        images: categoryImage ? [categoryImage] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Tour ${categoryName} | Sơn Hằng Travel`,
        description: category.description || `Khám phá các tour du lịch hấp dẫn tại ${categoryName} cùng Sơn Hằng Travel`,
        images: categoryImage ? [categoryImage] : [],
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
    const [toursRes, category] = await Promise.all([
      getTours({ category: slug, pageSize: 200 }).catch(err => {
        console.error('[CategoryToursPage] Error fetching tours:', err)
        return { data: [], total: 0, page: 1, pageSize: 200 }
      }),
      getCategoryBySlug(slug).catch(err => {
        console.error('[CategoryToursPage] Error fetching category:', err)
        return null
      })
    ])

    // If category not found, show 404
    if (!category) {
      console.error('[CategoryToursPage] Category not found for slug:', slug)
      notFound()
    }

    const tours = toursRes.data || []
    const categoryName = category.name || 'Danh mục'
    const canonicalUrl = `${SITE_URL}/tours/${slug}`
    const categoryDescription = category.description || `Khám phá các tour du lịch hấp dẫn tại ${categoryName} cùng Sơn Hằng Travel`
    const categoryImage = category.image ? getImageUrl(category.image, 'large') : undefined
    const categorySchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Tour ${categoryName}`,
      url: canonicalUrl,
      description: categoryDescription,
      about: {
        '@type': 'Thing',
        name: categoryName,
      },
      mainEntity: {
        '@id': `${canonicalUrl}#tour-list`,
      },
      primaryImageOfPage: categoryImage || undefined,
    }
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Tours', item: `${SITE_URL}/tours` },
        { '@type': 'ListItem', position: 3, name: `Tour ${categoryName}`, item: canonicalUrl },
      ],
    }
    const itemListSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${canonicalUrl}#tour-list`,
      name: `Danh sách tour ${categoryName}`,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: tours.length,
      itemListElement: tours.map((tour, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/tour/${tour.slug}`,
        item: {
          '@type': 'TouristTrip',
          name: tour.title,
          url: `${SITE_URL}/tour/${tour.slug}`,
          image: getImageUrl(tour.thumbnail, 'large') || getImageUrl(tour.gallery?.[0], 'large') || undefined,
          offers: {
            '@type': 'Offer',
            price: tour.price,
            priceCurrency: 'VND',
            availability: 'https://schema.org/InStock',
            url: `${SITE_URL}/tour/${tour.slug}`,
          },
        },
      })),
    }
    const faqItems = buildCategoryFaqItems(categoryName, slug, tours.length)
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        {tours.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container-custom py-3">
            <Link href="/tours" className="text-gray-600 hover:text-[#059669] text-sm">
              ← Tất cả tour
            </Link>
          </div>
        </div>

        <div className="container-custom py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl p-6 sticky top-6">
                <h1 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>Tour {categoryName}</span>
                </h1>
                {category.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {category.description}
                  </p>
                )}
                {!category.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Khám phá các tour {categoryName} khởi hành thuận tiện cùng Sơn Hằng Travel.
                  </p>
                )}
              </div>
            </div>

            {/* Right Content - Tours Grid */}
            <div className="lg:col-span-9">
              {/* Results count */}
              <p className="text-gray-600 mb-4">
                Tìm thấy <span className="font-semibold text-[#059669]">{tours.length}+</span> kết quả
              </p>

              {/* Tours Grid */}
              {tours.length > 0 ? (
                <>
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
                        originalPrice={tour.originalPrice || undefined}
                        rating={Number(tour.rating || 5)}
                        reviewCount={tour.reviewCount || 0}
                        isHot={tour.featured || undefined}
                      />
                    ))}
                  </div>

                  <section className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900">Cẩm nang nhanh cho tour {categoryName}</h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      Đây là landing page tổng hợp để anh chị so sánh nhanh các lịch trình {categoryName}, xem mức giá, thời lượng và chọn tour phù hợp nhất trước khi liên hệ chốt chỗ.
                    </p>
                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      {faqItems.map((item, index) => (
                        <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <h3 className="text-base font-semibold text-gray-900">{item.question}</h3>
                          <p className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl">
                  <div className="text-6xl mb-4">🏝️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có tour nào</h3>
                  <p className="text-gray-500 mb-4">Danh mục này đang được cập nhật</p>
                  <Link 
                    href="/tours" 
                    className="inline-block bg-[#059669] text-white px-6 py-2 rounded-full hover:bg-[#047857] transition-colors"
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
