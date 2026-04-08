import { getTours, getCategories, getImageUrl, TourData, CategoryData } from '@/lib/data'
import ToursPageClient from './ToursPageClient'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

const baseMetadata: Metadata = {
  title: "Tour du lịch Trung Quốc | Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam",
  description: "Danh sách tour Trung Quốc của Sơn Hằng Travel: Đông Hưng, Hà Khẩu, Nam Ninh, Côn Minh, Đại Lý, Thành Đô và các tuyến Vân Nam đang bán.",
  keywords: ["tour trung quốc", "tour đông hưng", "tour hà khẩu", "tour nam ninh", "tour vân nam", "du lịch trung quốc từ móng cái"],
  openGraph: {
    title: "Tour du lịch Trung Quốc | Sơn Hằng Travel",
    description: "Xem danh sách tour Trung Quốc đang bán tại Sơn Hằng Travel: Đông Hưng, Hà Khẩu, Nam Ninh, Côn Minh, Đại Lý, Thành Đô và nhiều tuyến khác.",
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
    title: 'Tour du lịch Trung Quốc | Sơn Hằng Travel',
    description: 'Xem danh sách tour Trung Quốc đang bán tại Sơn Hằng Travel: Đông Hưng, Hà Khẩu, Nam Ninh, Côn Minh, Đại Lý, Thành Đô và nhiều tuyến khác.',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: `${SITE_URL}/tours`,
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : undefined
  const searchQuery = params?.search?.trim()

  if (!searchQuery) {
    return baseMetadata
  }

  return {
    title: `Tìm kiếm tour ${searchQuery}`,
    description: `Kết quả tìm kiếm tour cho từ khóa "${searchQuery}" tại Sơn Hằng Travel.`,
    alternates: {
      canonical: `${SITE_URL}/tours`,
    },
    robots: {
      index: false,
      follow: true,
    },
    openGraph: {
      title: `Tìm kiếm tour ${searchQuery} | Sơn Hằng Travel`,
      description: `Kết quả tìm kiếm tour cho từ khóa "${searchQuery}" tại Sơn Hằng Travel.`,
      url: `${SITE_URL}/tours`,
      type: 'website',
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
      title: `Tìm kiếm tour ${searchQuery} | Sơn Hằng Travel`,
      description: `Kết quả tìm kiếm tour cho từ khóa "${searchQuery}" tại Sơn Hằng Travel.`,
      images: [DEFAULT_OG_IMAGE],
    },
  }
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
      item: {
        '@id': `${SITE_URL}/tour/${tour.slug}`,
        '@type': 'TouristTrip',
        name: tour.title,
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
  const image = getImageUrl(tour.thumbnail || tour.gallery?.[0], 'large')
    || DEFAULT_OG_IMAGE

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

export default async function ToursPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string; search?: string }>
}) {
  const params = searchParams ? await searchParams : undefined
  const categorySlug = params?.category?.trim()
  const searchQuery = params?.search?.trim()

  if (categorySlug && !searchQuery) {
    redirect(`/tours/${categorySlug}`)
  }

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
