import type { Metadata } from 'next'
import Link from 'next/link'
import { getCategories, getTours } from '@/lib/data'

const SITE_URL = 'https://sonhangtravel.com'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Sơ Đồ Tour Trung Quốc',
  description: 'Trang tổng hợp nhanh các điểm đến và toàn bộ tour Trung Quốc đang mở bán tại Sơn Hằng Travel.',
  alternates: {
    canonical: `${SITE_URL}/so-do-tour`,
  },
  openGraph: {
    title: 'Sơ Đồ Tour Trung Quốc | Sơn Hằng Travel',
    description: 'Xem nhanh tất cả danh mục và các tour Trung Quốc đang mở bán tại Sơn Hằng Travel.',
    url: `${SITE_URL}/so-do-tour`,
    type: 'website',
  },
}

export default async function TourMapPage() {
  const [categories, toursRes] = await Promise.all([
    getCategories(),
    getTours({ pageSize: 300, sort: 'bookingCount:desc' }),
  ])

  const activeCategories = (categories || []).filter((category) => (category.tourCount || 0) > 0)
  const tours = toursRes.data || []
  const toursByCategory = new Map<string, typeof tours>()

  for (const category of activeCategories) {
    toursByCategory.set(
      category.slug,
      tours.filter((tour) => tour.categorySlug === category.slug)
    )
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Sơ đồ tour', item: `${SITE_URL}/so-do-tour` },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Sơ đồ tour Trung Quốc Sơn Hằng Travel',
    url: `${SITE_URL}/so-do-tour`,
    hasPart: activeCategories.map((category, index) => ({
      '@type': 'ItemList',
      position: index + 1,
      name: `Tour ${category.name || 'Danh mục'}`,
      itemListElement: (toursByCategory.get(category.slug) || []).map((tour, tourIndex) => ({
        '@type': 'ListItem',
        position: tourIndex + 1,
        url: `${SITE_URL}/tour/${tour.slug}`,
      })),
    })),
  }

  const supportLinks = [
    { href: '/tours', label: 'Tất cả tour Trung Quốc' },
    { href: '/uu-dai', label: 'Ưu đãi tour đang chạy' },
    { href: '/blog', label: 'Blog du lịch Trung Quốc' },
    { href: '/ve-chung-toi', label: 'Về Sơn Hằng Travel' },
    { href: '/lien-he', label: 'Liên hệ đặt tour' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="border-b bg-white">
        <div className="container-custom py-3 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#059669]">Trang chủ</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span>Sơ đồ tour</span>
        </div>
      </div>

      <div className="container-custom py-8">
        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#059669]">Hub Điều Hướng</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">Sơ đồ tour Trung Quốc đang mở bán</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-gray-600">
            Trang này gom toàn bộ danh mục và các tour đang bán thật tại Sơn Hằng Travel để khách xem nhanh, đồng thời giúp Google hiểu rõ cấu trúc điểm đến, tuyến tour và các landing page chính của website.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {supportLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 transition-colors hover:border-[#059669] hover:text-[#059669]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {activeCategories.map((category) => {
            const categoryTours = toursByCategory.get(category.slug) || []

            return (
              <div key={category.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#059669]">Danh mục điểm đến</p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">
                      <Link href={`/tours/${category.slug}`} className="hover:text-[#059669]">
                        Tour {category.name}
                      </Link>
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600">
                      {category.description || `Nhóm tour ${category.name} đang mở bán, phù hợp để so sánh nhanh các lịch trình, mức giá và thời lượng.`}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    {categoryTours.length} tour
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href={`/tours/${category.slug}`}
                    className="rounded-full bg-[#059669] px-4 py-2 text-sm font-semibold text-white hover:bg-[#047857]"
                  >
                    Xem landing page {category.name}
                  </Link>
                  <Link
                    href="/tours"
                    className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#059669] hover:text-[#059669]"
                  >
                    So sánh với danh mục khác
                  </Link>
                </div>

                <ul className="mt-6 space-y-3">
                  {categoryTours.map((tour) => (
                    <li key={tour.id}>
                      <Link
                        href={`/tour/${tour.slug}`}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-gray-200 px-4 py-3 transition-colors hover:border-[#059669] hover:bg-emerald-50/40"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{tour.title}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {tour.duration || 'Nhiều lựa chọn lịch trình'}{tour.destination ? ` • ${tour.destination}` : ''}
                          </p>
                        </div>
                        <span className="shrink-0 text-sm font-bold text-[#FF6B35]">
                          {new Intl.NumberFormat('vi-VN').format(tour.price)}đ
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </section>
      </div>
    </main>
  )
}
