import { getTourBySlug, getImageUrl, TourData, getSiteSettings, getTours } from '@/lib/data'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

// Dynamic import for better code splitting
const TourDetailClient = dynamic(() => import('./TourDetailClient'), {
  loading: () => null, // loading.tsx handles this
})

// SSG + ISR: Build HTML at deploy time, revalidate every 30 minutes for updates
export const revalidate = 1800

// Allow new tours to be generated on-demand (not 404)
export const dynamicParams = true

// Generate dynamic metadata for each tour (SEO)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const tour = await getTourBySlug(slug)
    if (!tour) {
      return {
        title: 'Tour không tồn tại',
      }
    }

    const imageUrl = tour.thumbnail
      ? getImageUrl(tour.thumbnail, 'large')
      : DEFAULT_OG_IMAGE

    const priceFormatted = new Intl.NumberFormat('vi-VN').format(tour.price)
    const destinationText = tour.destination || 'Trung Quốc'
    const departureText = tour.departure || 'Móng Cái'
    const description = tour.shortDescription || `Tour ${destinationText} ${tour.duration}. Khởi hành từ ${departureText}. Giá chỉ ${priceFormatted}đ/người. Đặt tour ngay!`
    const keywordSet = new Set([
      tour.title,
      `tour ${destinationText.toLowerCase()}`,
      `du lịch ${destinationText.toLowerCase()}`,
      `tour ${tour.duration}`,
      `tour ${departureText.toLowerCase()}`,
      'tour trung quốc giá rẻ',
      'sơn hằng travel',
    ])

    return {
      title: `${tour.title} - Giá ${priceFormatted}đ`,
      description,
      keywords: Array.from(keywordSet),
      openGraph: {
        title: `${tour.title} | Sơn Hằng Travel`,
        description,
        url: `${SITE_URL}/tour/${slug}`,
        type: 'website',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: tour.title,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${tour.title} | Sơn Hằng Travel`,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `${SITE_URL}/tour/${slug}`,
      },
    }
  } catch {
    return {
      title: 'Tour Du Lịch | Sơn Hằng Travel',
    }
  }
}

// Fallback data structure
const fallbackPolicies = {
  children: [
    'Trẻ bằng hoặc dưới 5 tuổi: tính 80% giá tour',
    'Trẻ em từ 6 tuổi trở lên: tính 100% giá tour',
  ],
  surcharge: 'Lễ tết phụ thu 200.000 VNĐ/người',
  documents: [
    'Người lớn: ảnh 4x6 nền trắng + ảnh CCCD 2 mặt',
    'Trẻ em: xác nhận TK8 + bản sao giấy khai sinh + ảnh 4x6',
    'Gửi giấy tờ trước 3 ngày làm việc',
  ],
  notes: [
    'Báo giá áp dụng cho đoàn từ 12 khách trở lên',
    'Đặt cọc 50% ngay khi đăng ký tour',
    'Thanh toán số tiền còn lại vào ngày khởi hành',
  ],
}

// Transform Strapi tour to page data
function transformStrapiTour(tour: TourData) {
  const images: string[] = []
  if (tour.thumbnail) {
    images.push(getImageUrl(tour.thumbnail, 'large'))
  }
  if (tour.gallery && tour.gallery.length > 0) {
    tour.gallery.forEach(img => images.push(getImageUrl(img, 'large')))
  }
  if (images.length === 0) {
    images.push(DEFAULT_OG_IMAGE)
  }

  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    shortDescription: tour.shortDescription,
    content: tour.content || '',
    price: tour.price,
    originalPrice: tour.originalPrice || tour.price,
    duration: tour.duration,
    departure: tour.departure || 'Móng Cái',
    destination: tour.destination,
    schedule: '',
    rating: Number(tour.rating || 5),
    reviewCount: tour.reviewCount || 0,
    bookedCount: tour.bookingCount || 0,
    images,
    highlights: [],
    tourFileUrl: undefined,
    itinerary: tour.itinerary?.map(item => ({
      time: item.time || '',
      title: item.title,
      description: item.description || '',
      image: item.image ? getImageUrl(item.image, 'medium') : '',
    })) || [],
    includes: tour.includes || [],
    excludes: tour.excludes || [],
    policies: {
      children: fallbackPolicies.children,
      surcharge: fallbackPolicies.surcharge,
      documents: fallbackPolicies.documents,
      notes: tour.notes || fallbackPolicies.notes,
    },
  }
}

// Generate static params for common tours (pre-render at build time)
export async function generateStaticParams() {
  try {
    const response = await getTours({ pageSize: 100, sort: 'bookingCount:desc' })

    return response.data.map((tour) => ({
      slug: tour.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

export default async function TourDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'
  
  try {
    const [tour, siteSettings] = await Promise.all([
      getTourBySlug(slug),
      getSiteSettings()
    ])
    
    if (!tour) {
      notFound()
    }

    const tourData = transformStrapiTour(tour)
    const phoneNumber = siteSettings?.phoneNumber || '0123456789'
    const zaloNumber = siteSettings?.zaloNumber || undefined

    const imageUrl = tour.thumbnail ? getImageUrl(tour.thumbnail, 'large') : DEFAULT_OG_IMAGE
    const galleryImages = [imageUrl, ...(tour.gallery || []).map((img) => getImageUrl(img, 'large'))].filter(Boolean)
    const canonicalUrl = `${SITE_URL}/tour/${slug}`
    const destinationText = tour.destination || 'Trung Quốc'
    const departureText = tour.departure || 'Móng Cái'
    const description = tour.shortDescription || `Tour ${destinationText} ${tour.duration}. Khởi hành từ ${departureText}. Giá chỉ ${new Intl.NumberFormat('vi-VN').format(tour.price)}đ/người.`

    const tourSchema = {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      '@id': `${canonicalUrl}#tour`,
      name: tour.title,
      description,
      url: canonicalUrl,
      image: galleryImages,
      touristType: 'Leisure',
      provider: {
        '@type': 'TravelAgency',
        name: 'Sơn Hằng Travel',
        telephone: phoneNumber,
        url: SITE_URL,
      },
      departureLocation: {
        '@type': 'Place',
        name: departureText,
      },
      arrivalLocation: {
        '@type': 'Place',
        name: destinationText,
      },
      offers: {
        '@type': 'Offer',
        price: tour.price,
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
        url: canonicalUrl,
      },
      itinerary: {
        '@type': 'ItemList',
        itemListElement: tour.itinerary?.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.title,
          description: item.description,
        })) || [],
      },
      aggregateRating: tour.rating ? {
        '@type': 'AggregateRating',
        ratingValue: Number(tour.rating),
        reviewCount: tour.reviewCount || 10,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
    }

    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${canonicalUrl}#service`,
      serviceType: 'Tour du lịch Trung Quốc',
      name: tour.title,
      description,
      provider: {
        '@type': 'TravelAgency',
        name: 'Sơn Hằng Travel',
        url: SITE_URL,
      },
      areaServed: {
        '@type': 'Country',
        name: 'Trung Quốc',
      },
      offers: {
        '@type': 'Offer',
        price: tour.price,
        priceCurrency: 'VND',
        url: canonicalUrl,
      },
      image: imageUrl,
    }

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tour du lịch',
          item: `${SITE_URL}/tours`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: tour.title,
          item: canonicalUrl,
        },
      ],
    }

    return (
      <>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <TourDetailClient tourData={tourData} phoneNumber={phoneNumber} zaloNumber={zaloNumber} isPreview={isPreview} />
      </>
    )
  } catch (error) {
    console.error('Error fetching tour:', error)
    notFound()
  }
}

