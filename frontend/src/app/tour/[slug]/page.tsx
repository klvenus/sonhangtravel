import { getTourBySlug, getImageUrl, Tour } from '@/lib/strapi'
import { notFound } from 'next/navigation'
import TourDetailClient from './TourDetailClient'

// ISR - Revalidate every hour
export const revalidate = 3600

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
    // Fetch some popular tours to pre-generate at build time
    const { getTours } = await import('@/lib/strapi')
    const response = await getTours({ pageSize: 10, sort: 'bookingCount:desc' })
    
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
    const tour = await getTourBySlug(slug, isPreview)
    
    if (!tour) {
      notFound()
    }

    const tourData = transformStrapiTour(tour)

    return <TourDetailClient tourData={tourData} isPreview={isPreview} />
  } catch (error) {
    console.error('Error fetching tour:', error)
    notFound()
  }
}

