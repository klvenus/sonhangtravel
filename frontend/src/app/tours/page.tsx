import { getTours, getCategories, getImageUrl, TourData, CategoryData } from '@/lib/data'
import ToursPageClient from './ToursPageClient'
import { Metadata } from 'next'
import { Suspense } from 'react'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

// SEO Metadata for Tours page
export const metadata: Metadata = {
  title: "Tour Du Lịch Trung Quốc 2026 - Đông Hưng, Nam Ninh, Quế Lâm",
  description: "🎯 Danh sách tour du lịch Trung Quốc hot nhất 2026: Tour Đông Hưng 1-2 ngày, Tour Nam Ninh shopping, Tour Quế Lâm Dương Sóc, Tour Trương Gia Giới. Giá từ 999K!",
  keywords: ["tour trung quốc 2026", "tour đông hưng giá rẻ", "tour nam ninh mua sắm", "tour quế lâm", "du lịch trung quốc từ móng cái"],
  openGraph: {
    title: "Tour Du Lịch Trung Quốc 2026 | Sơn Hằng Travel",
    description: "Khám phá Trung Quốc với các tour chất lượng: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới. Giá tốt nhất thị trường!",
    url: `${SITE_URL}/tours`,
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Tour du lịch Trung Quốc | Sơn Hằng Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tour Du Lịch Trung Quốc 2026 | Sơn Hằng Travel',
    description: 'Khám phá Trung Quốc với các tour chất lượng: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới. Giá tốt nhất thị trường!',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/tours`,
  },
}

// ISR - Revalidate every hour
export const revalidate = 3600

function buildToursItemListSchema(tours: Array<ReturnType<typeof transformTour>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${SITE_URL}/tours#tour-list`,
    name: 'Danh sách tour du lịch Trung Quốc Sơn Hằng Travel',
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
        image: tour.image.startsWith('/') ? undefined : tour.image,
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
}

function buildToursCollectionSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tour Du Lịch Trung Quốc',
    url: `${SITE_URL}/tours`,
    about: {
      '@type': 'Thing',
      name: 'Tour du lịch Trung Quốc',
    },
    mainEntity: {
      '@id': `${SITE_URL}/tours#tour-list`,
    },
  }
}

// Transform tour for client component
function transformTour(tour: TourData) {
  const image = getImageUrl(tour.thumbnail, 'large')
    || getImageUrl(tour.gallery?.[0], 'large')
    || '/images/placeholder-tour.jpg'

  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    image,
    gallery: tour.gallery || [],
    location: tour.destination,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice || undefined,
    rating: Number(tour.rating || 5),
    reviewCount: tour.reviewCount || 0,
    isHot: Boolean(tour.featured),
    categorySlug: tour.categorySlug || null,
    category: tour.categoryName || undefined,
  }
}

// Transform category for client component
function transformCategory(cat: CategoryData) {
  return {
    id: cat.id,
    name: cat.name || 'Danh mục',
    slug: cat.slug,
  }
}

export default async function ToursPage() {
  let tours: ReturnType<typeof transformTour>[] = []
  let categories: ReturnType<typeof transformCategory>[] = []

  try {
    const [toursRes, categoriesData] = await Promise.all([
      getTours({ pageSize: 200 }),
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

  const toursItemListSchema = tours.length > 0 ? buildToursItemListSchema(tours) : null
  const toursCollectionSchema = tours.length > 0 ? buildToursCollectionSchema() : null

  return (
    <>
      {toursCollectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toursCollectionSchema) }}
        />
      )}
      {toursItemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toursItemListSchema) }}
        />
      )}
      <Suspense>
        <ToursPageClient initialTours={tours} initialCategories={categories} />
      </Suspense>
    </>
  )
}
