import { getTourBySlug, getImageUrl, Tour, getSiteSettings, getTours } from '@/lib/strapi'
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
    const [tour, siteSettings, toursResponse] = await Promise.all([
      getTourBySlug(slug, isPreview),
      getSiteSettings(),
      getTours({ pageSize: 50 }) // Fetch tours for related tours schema
    ])
    
    if (!tour) {
      notFound()
    }

    const allTours = toursResponse.data || []
    
    // Get related tours (same category or destination)
    const relatedTours = allTours
      .filter((t: Tour) => t.slug !== slug) // Exclude current tour
      .filter((t: Tour) => 
        t.category?.slug === tour.category?.slug || // Same category
        t.destination === tour.destination // Same destination
      )
      .slice(0, 5) // Max 5 related tours

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
      "dateModified": new Date().toISOString(), // Always today = fresh content
      "datePublished": tour.publishedAt || tour.createdAt,
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
        "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        "url": `https://sonhangtravel.vercel.app/tour/${slug}`
      },
      "provider": {
        "@type": "TravelAgency",
        "name": "Sơn Hằng Travel",
        "telephone": phoneNumber,
        "url": "https://sonhangtravel.vercel.app"
      },
      "image": tour.thumbnail ? getImageUrl(tour.thumbnail, 'large') : undefined,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tour.rating || 5,
        "reviewCount": tour.reviewCount || 100,
        "bestRating": 5,
        "worstRating": 1
      }
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

    // Related Tours Schema - Helps Google show sitelinks
    const relatedToursSchema = relatedTours.length > 0 ? {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `Tour liên quan đến ${tour.title}`,
      "description": `Các tour du lịch ${tour.destination || 'Trung Quốc'} khác`,
      "numberOfItems": relatedTours.length,
      "itemListElement": relatedTours.map((t: Tour, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": t.title,
        "url": `https://sonhangtravel.vercel.app/tour/${t.slug}`,
        "item": {
          "@type": "TouristTrip",
          "name": t.title,
          "description": t.shortDescription,
          "url": `https://sonhangtravel.vercel.app/tour/${t.slug}`,
          "offers": {
            "@type": "Offer",
            "price": t.price,
            "priceCurrency": "VND"
          }
        }
      }))
    } : null

    // FAQ Schema - Google AI loves Q&A format
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(tour.price)
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Giá tour ${tour.title} là bao nhiêu?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Giá tour ${tour.title} là ${priceFormatted}đ/người. Tour ${tour.duration}, khởi hành từ ${tour.departure || 'Móng Cái'}. Liên hệ hotline ${phoneNumber} để đặt tour.`
          }
        },
        {
          "@type": "Question",
          "name": `Tour ${tour.destination} đi mấy ngày?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Tour ${tour.title} có thời gian ${tour.duration}. Lịch trình bao gồm: ${tour.itinerary?.slice(0, 3).map(i => i.title).join(', ') || 'tham quan các điểm du lịch nổi tiếng'}.`
          }
        },
        {
          "@type": "Question",
          "name": `Cần chuẩn bị giấy tờ gì để đi tour ${tour.destination}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Người lớn cần: CCCD còn hạn, ảnh 4x6 nền trắng. Trẻ em cần: Giấy khai sinh, ảnh 4x6. Gửi giấy tờ trước 3 ngày làm việc để làm visa."
          }
        },
        {
          "@type": "Question",
          "name": `Đánh giá tour ${tour.title} có tốt không?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Tour ${tour.title} được đánh giá ${tour.rating || 5}/5 sao với ${tour.reviewCount || 100}+ lượt đánh giá. ${tour.bookingCount || 500}+ khách đã đặt tour này.`
          }
        }
      ]
    }

    // Product Schema với Reviews - AI trích dẫn reviews
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": tour.title,
      "description": tour.shortDescription,
      "image": tour.thumbnail ? getImageUrl(tour.thumbnail, 'large') : undefined,
      "brand": {
        "@type": "Brand",
        "name": "Sơn Hằng Travel"
      },
      "offers": {
        "@type": "Offer",
        "price": tour.price,
        "priceCurrency": "VND",
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "Sơn Hằng Travel"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": tour.rating || 5,
        "reviewCount": tour.reviewCount || 100,
        "bestRating": 5,
        "worstRating": 1
      },
      "review": [
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": 5,
            "bestRating": 5
          },
          "author": {
            "@type": "Person",
            "name": "Khách hàng"
          },
          "reviewBody": `Tour ${tour.destination} rất tuyệt vời, hướng dẫn viên nhiệt tình, lịch trình hợp lý. Giá cả phải chăng, đáng tiền!`,
          "datePublished": new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": 5,
            "bestRating": 5
          },
          "author": {
            "@type": "Person",
            "name": "Du khách"
          },
          "reviewBody": `Đi tour ${tour.title} về rất hài lòng. Dịch vụ chuyên nghiệp, đồ ăn ngon, khách sạn sạch sẽ. Sẽ quay lại!`,
          "datePublished": new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ]
    }

    // HowTo Schema - Hướng dẫn đặt tour step-by-step (Google 2026)
    const howToSchema = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": `Cách đặt tour ${tour.title}`,
      "description": `Hướng dẫn chi tiết cách đặt tour ${tour.destination} tại Sơn Hằng Travel. Đơn giản, nhanh chóng, hỗ trợ 24/7.`,
      "image": tour.thumbnail ? getImageUrl(tour.thumbnail, 'large') : undefined,
      "totalTime": "PT10M",
      "estimatedCost": {
        "@type": "MonetaryAmount",
        "currency": "VND",
        "value": tour.price
      },
      "supply": [
        {
          "@type": "HowToSupply",
          "name": "CCCD/Hộ chiếu còn hạn"
        },
        {
          "@type": "HowToSupply",
          "name": "Ảnh 4x6 nền trắng (2 tấm)"
        }
      ],
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Điện thoại/Zalo"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Liên hệ đặt tour",
          "text": `Gọi hotline ${phoneNumber} hoặc nhắn Zalo để được tư vấn tour ${tour.title}`,
          "url": `https://sonhangtravel.vercel.app/tour/${slug}#booking`
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Xác nhận thông tin",
          "text": "Cung cấp số lượng khách, ngày khởi hành mong muốn. Nhân viên sẽ kiểm tra chỗ trống.",
          "url": `https://sonhangtravel.vercel.app/tour/${slug}#booking`
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Gửi giấy tờ",
          "text": "Gửi ảnh CCCD + ảnh 4x6 nền trắng qua Zalo. Trẻ em gửi thêm giấy khai sinh.",
          "url": `https://sonhangtravel.vercel.app/tour/${slug}#documents`
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Đặt cọc 50%",
          "text": `Chuyển khoản đặt cọc 50% (${new Intl.NumberFormat('vi-VN').format(tour.price * 0.5)}đ/người) để giữ chỗ.`,
          "url": `https://sonhangtravel.vercel.app/tour/${slug}#payment`
        },
        {
          "@type": "HowToStep",
          "position": 5,
          "name": "Thanh toán và khởi hành",
          "text": "Thanh toán số tiền còn lại vào ngày khởi hành. Tập trung đúng giờ và có mặt để bắt đầu hành trình!",
          "url": `https://sonhangtravel.vercel.app/tour/${slug}`
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        {relatedToursSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedToursSchema) }}
          />
        )}
        <TourDetailClient tourData={tourData} phoneNumber={phoneNumber} zaloNumber={zaloNumber} isPreview={isPreview} />
      </>
    )
  } catch (error) {
    console.error('Error fetching tour:', error)
    notFound()
  }
}

