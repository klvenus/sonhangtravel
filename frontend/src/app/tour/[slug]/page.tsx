import { getTourBySlug, getImageUrl, Tour, getSiteSettings } from '@/lib/strapi'
import { notFound } from 'next/navigation'
import nextDynamic from 'next/dynamic'
import { Metadata } from 'next'

// Dynamic import for better code splitting
const TourDetailClient = nextDynamic(() => import('./TourDetailClient'), {
  loading: () => null, // loading.tsx handles this
})

// Disable cache temporarily - fetch fresh data every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
      : 'https://sonhangtravel.vercel.app/og-image.jpg'

    const priceFormatted = new Intl.NumberFormat('vi-VN').format(tour.price)

    return {
      title: `${tour.title} - Giá ${priceFormatted}đ`,
      description: tour.shortDescription || `Tour ${tour.destination} ${tour.duration}. Khởi hành từ ${tour.departure || 'Móng Cái'}. Giá chỉ ${priceFormatted}đ/người. Đặt tour ngay!`,
      keywords: [
        tour.title,
        `tour ${tour.destination?.toLowerCase()}`,
        `du lịch ${tour.destination?.toLowerCase()}`,
        `tour ${tour.duration}`,
        'tour trung quốc giá rẻ',
      ],
      openGraph: {
        title: `${tour.title} | Sơn Hằng Travel`,
        description: tour.shortDescription || `Tour ${tour.destination} ${tour.duration}. Giá ${priceFormatted}đ/người`,
        url: `https://sonhangtravel.vercel.app/tour/${slug}`,
        type: 'article',
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
        title: tour.title,
        description: tour.shortDescription || `Tour ${tour.destination} - ${priceFormatted}đ`,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://sonhangtravel.vercel.app/tour/${slug}`,
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
function transformStrapiTour(tour: Tour) {
  // Get images array from thumbnail and gallery
  const images: string[] = []
  if (tour.thumbnail) {
    images.push(getImageUrl(tour.thumbnail, 'large'))
  }
  if (tour.gallery && tour.gallery.length > 0) {
    tour.gallery.forEach(img => images.push(getImageUrl(img, 'large')))
  }
  // Add fallback if no images
  if (images.length === 0) {
    images.push('https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80')
  }

  return {
    id: String(tour.id),
    documentId: tour.documentId,
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
    rating: tour.rating || 5,
    reviewCount: tour.reviewCount || 0,
    bookedCount: tour.bookingCount || 0,
    images,
    highlights: [],
    tourFileUrl: tour.tourFile?.url 
      ? (tour.tourFile.url.startsWith('http') ? tour.tourFile.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${tour.tourFile.url}`)
      : undefined,
    itinerary: tour.itinerary?.map(item => ({
      time: item.time || '',
      title: item.title,
      description: item.description || '',
      image: item.image ? getImageUrl(item.image, 'medium') : '',
    })) || [],
    includes: tour.includes?.map(item => item.text) || [],
    excludes: tour.excludes?.map(item => item.text) || [],
    policies: {
      children: fallbackPolicies.children,
      surcharge: fallbackPolicies.surcharge,
      documents: fallbackPolicies.documents,
      notes: tour.notes?.map(item => item.text) || fallbackPolicies.notes,
    },
  }
}

// Generate static params for common tours (pre-render at build time)
export async function generateStaticParams() {
  try {
    // Fetch ALL tours to pre-generate at build time for instant loading
    const { getTours } = await import('@/lib/strapi')
    const response = await getTours({ pageSize: 100, sort: 'bookingCount:desc' })
    
    return response.data.map((tour) => ({
      slug: tour.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return empty array if Strapi is not available at build time
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
      getTourBySlug(slug, isPreview),
      getSiteSettings()
    ])
    
    if (!tour) {
      notFound()
    }

    const tourData = transformStrapiTour(tour)
    const phoneNumber = siteSettings?.phoneNumber || '0123456789'
    const zaloNumber = siteSettings?.zaloNumber || undefined

    // JSON-LD for Tour (Product + TouristTrip schema)
    const tourSchema = {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": tour.title,
      "description": tour.shortDescription || `Tour ${tour.destination} ${tour.duration}`,
      "touristType": "Leisure",
      "itinerary": {
        "@type": "ItemList",
        "itemListElement": tour.itinerary?.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.title,
          "description": item.description
        })) || []
      },
      "offers": {
        "@type": "Offer",
        "price": tour.price,
        "priceCurrency": "VND",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString(),
        "url": `https://sonhangtravel.vercel.app/tour/${slug}`
      },
      "provider": {
        "@type": "TravelAgency",
        "name": "Sơn Hằng Travel",
        "telephone": phoneNumber,
        "url": "https://sonhangtravel.vercel.app"
      },
      "image": tour.thumbnail ? getImageUrl(tour.thumbnail, 'large') : undefined,
      "aggregateRating": tour.rating ? {
        "@type": "AggregateRating",
        "ratingValue": tour.rating,
        "reviewCount": tour.reviewCount || 10,
        "bestRating": 5,
        "worstRating": 1
      } : undefined
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Trang chủ",
          "item": "https://sonhangtravel.vercel.app"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Tour",
          "item": "https://sonhangtravel.vercel.app/tours"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": tour.title,
          "item": `https://sonhangtravel.vercel.app/tour/${slug}`
        }
      ]
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

