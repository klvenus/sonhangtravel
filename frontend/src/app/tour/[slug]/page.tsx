import { getTourBySlug, getImageUrl, TourData, getSiteSettings, getTours } from '@/lib/data'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Metadata } from 'next'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

interface TourFaqItem {
  question: string
  answer: string
}

// Dynamic import for better code splitting
const TourDetailClient = dynamic(() => import('./TourDetailClient'), {
  loading: () => null, // loading.tsx handles this
})

// SSG + ISR: Build HTML at deploy time, revalidate every 30 minutes for updates
export const revalidate = 1800

// Allow new tours to be generated on-demand (not 404)
export const dynamicParams = true

function formatSeoTourName(title: string) {
  const normalizedTitle = title.trim()
  return /^tour\b/i.test(normalizedTitle) ? normalizedTitle : `Tour ${normalizedTitle}`
}

function buildTourFaqItems(tour: TourData): TourFaqItem[] {
  const seoTourName = formatSeoTourName(tour.title)
  const price = `${new Intl.NumberFormat('vi-VN').format(tour.price)}đ/khách`
  const departure = tour.departure || 'Móng Cái'
  const duration = tour.duration || '1 ngày'
  const documents = (fallbackPolicies.documents || []).slice(0, 2).join('; ')
  const includedItems = (tour.includes || []).slice(0, 3).join(', ')
  const childPolicy = fallbackPolicies.children.join(' ')
  const note = (tour.notes || fallbackPolicies.notes)[0]

  return [
    {
      question: `${seoTourName} giá bao nhiêu?`,
      answer: `${seoTourName} hiện có giá từ ${price}. Giá thực tế có thể thay đổi theo ngày khởi hành, số lượng khách và thời điểm lễ tết.`,
    },
    {
      question: `${seoTourName} khởi hành từ đâu và đi trong bao lâu?`,
      answer: `${seoTourName} khởi hành từ ${departure}, thời lượng ${duration}, phù hợp cho khách muốn đi nhanh gọn trong ngày.`,
    },
    includedItems
      ? {
          question: `Giá ${seoTourName.toLowerCase()} đã bao gồm những gì?`,
          answer: `Giá tour thường đã bao gồm các hạng mục chính như ${includedItems}. Chi tiết cuối cùng sẽ được Sơn Hằng Travel xác nhận khi chốt lịch.`,
        }
      : null,
    {
      question: `Đi ${seoTourName.toLowerCase()} cần chuẩn bị giấy tờ gì?`,
      answer: `Khách nên chuẩn bị đầy đủ hồ sơ theo hướng dẫn của đơn vị tổ chức. Với tour đường bộ qua cửa khẩu, các giấy tờ thường gặp là ${documents}.`,
    },
    {
      question: `${seoTourName} có phù hợp cho trẻ em không?`,
      answer: childPolicy,
    },
    {
      question: `Nên đặt ${seoTourName.toLowerCase()} trước bao lâu?`,
      answer: note || 'Anh chị nên đặt sớm để giữ chỗ đẹp, chủ động hồ sơ và tránh tăng giá sát ngày đi.',
    },
  ].filter((item): item is TourFaqItem => Boolean(item))
}

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

    const seoTourName = formatSeoTourName(tour.title)
    const priceFormatted = new Intl.NumberFormat('vi-VN').format(tour.price)
    const destinationText = tour.destination || 'Trung Quốc'
    const departureText = tour.departure || 'Móng Cái'
    const description = tour.shortDescription || `${seoTourName}. Khởi hành từ ${departureText}, lịch trình ${tour.duration}, giá từ ${priceFormatted}đ/người. Phù hợp cho khách muốn đi Trung Quốc trong ngày nhanh gọn.`
    const keywordSet = new Set([
      seoTourName,
      seoTourName.toLowerCase(),
      `tour ${destinationText.toLowerCase()}`,
      `du lịch ${destinationText.toLowerCase()}`,
      `tour ${tour.duration}`,
      `tour ${departureText.toLowerCase()}`,
      `${seoTourName.toLowerCase()} giá rẻ`,
      'tour trung quốc giá rẻ',
      'sơn hằng travel',
    ])

    return {
      title: `${seoTourName} - Giá ${priceFormatted}đ`,
      description,
      keywords: Array.from(keywordSet),
      openGraph: {
        title: `${seoTourName} | Sơn Hằng Travel`,
        description,
        url: `${SITE_URL}/tour/${slug}`,
        type: 'website',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: seoTourName,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${seoTourName} | Sơn Hằng Travel`,
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

// Transform DB tour row to page data
function transformTour(tour: TourData) {
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
    title: formatSeoTourName(tour.title),
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
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const [tour, siteSettings] = await Promise.all([
      getTourBySlug(slug),
      getSiteSettings()
    ])
    
    if (!tour) {
      notFound()
    }

    const tourData = transformTour(tour)
    const phoneNumber = siteSettings?.phoneNumber || '0123456789'
    const zaloNumber = siteSettings?.zaloNumber || undefined
    const faqItems = buildTourFaqItems(tour)

    const imageUrl = tour.thumbnail ? getImageUrl(tour.thumbnail, 'large') : DEFAULT_OG_IMAGE
    const galleryImages = [imageUrl, ...(tour.gallery || []).map((img) => getImageUrl(img, 'large'))].filter(Boolean)
    const canonicalUrl = `${SITE_URL}/tour/${slug}`
    const seoTourName = formatSeoTourName(tour.title)
    const destinationText = tour.destination || 'Trung Quốc'
    const departureText = tour.departure || 'Móng Cái'
    const description = tour.shortDescription || `${seoTourName}. Khởi hành từ ${departureText}, lịch trình ${tour.duration}, giá từ ${new Intl.NumberFormat('vi-VN').format(tour.price)}đ/người.`

    const tourSchema = {
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      '@id': `${canonicalUrl}#tour`,
      name: seoTourName,
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
      name: seoTourName,
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
          name: seoTourName,
          item: canonicalUrl,
        },
      ],
    }

    const faqSchema = faqItems.length > 0 ? {
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
    } : null

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
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}
        <TourDetailClient tourData={tourData} phoneNumber={phoneNumber} zaloNumber={zaloNumber} faqItems={faqItems} />
      </>
    )
  } catch (error) {
    console.error('Error fetching tour:', error)
    notFound()
  }
}
