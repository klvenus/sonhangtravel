'use client'

import TourCard from './TourCard'
import Link from 'next/link'

// Tour type for component
interface TourCardData {
  id: string
  title: string
  slug: string
  image: string
  location: string
  duration: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  isHot?: boolean
  isNew?: boolean
  category?: string
}

// Fallback data khi chưa có dữ liệu từ Strapi
const fallbackTours: TourCardData[] = [
  {
    id: '1',
    title: 'Tour Đông Hưng 2N1Đ - Khám phá thành phố biên giới',
    slug: 'tour-dong-hung-2-ngay-1-dem',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
    location: 'Đông Hưng',
    duration: '2N1Đ',
    price: 1990000,
    originalPrice: 2500000,
    rating: 4.8,
    reviewCount: 256,
    isHot: true,
    category: 'Đông Hưng',
  },
  {
    id: '2',
    title: 'Tour Nam Ninh - Quảng Châu 4N3Đ mua sắm',
    slug: 'tour-nam-ninh-quang-chau-4-ngay',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=600&q=80',
    location: 'Nam Ninh - Quảng Châu',
    duration: '4N3Đ',
    price: 5990000,
    originalPrice: 7500000,
    rating: 4.9,
    reviewCount: 189,
    isHot: true,
    category: 'Quảng Châu',
  },
  {
    id: '3',
    title: 'Tour Thượng Hải - Hàng Châu 5N4Đ',
    slug: 'tour-thuong-hai-hang-chau-5-ngay',
    image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&q=80',
    location: 'Thượng Hải',
    duration: '5N4Đ',
    price: 12990000,
    rating: 4.7,
    reviewCount: 143,
    isNew: true,
    category: 'Thượng Hải',
  },
  {
    id: '4',
    title: 'Tour Bắc Kinh - Vạn Lý Trường Thành 6N5Đ',
    slug: 'tour-bac-kinh-van-ly-truong-thanh',
    image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&q=80',
    location: 'Bắc Kinh',
    duration: '6N5Đ',
    price: 15990000,
    originalPrice: 18000000,
    rating: 4.9,
    reviewCount: 312,
    isHot: true,
    category: 'Bắc Kinh',
  },
  {
    id: '5',
    title: 'Tour Quảng Châu - Thâm Quyến 3N2Đ',
    slug: 'tour-quang-chau-tham-quyen-3-ngay',
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&q=80',
    location: 'Quảng Châu',
    duration: '3N2Đ',
    price: 4490000,
    rating: 4.6,
    reviewCount: 98,
    isNew: true,
    category: 'Quảng Châu',
  },
  {
    id: '6',
    title: 'Tour Phượng Hoàng Cổ Trấn 5N4Đ',
    slug: 'tour-phuong-hoang-co-tran',
    image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=600&q=80',
    location: 'Hồ Nam',
    duration: '5N4Đ',
    price: 11990000,
    originalPrice: 14000000,
    rating: 4.8,
    reviewCount: 178,
    isHot: true,
    category: 'Hồ Nam',
  },
]

interface Props {
  initialTours?: TourCardData[]
}

export default function FeaturedTours({ initialTours }: Props) {
  const displayTours = initialTours && initialTours.length > 0 
    ? initialTours 
    : fallbackTours

  return (
    <section className="py-4 md:py-8">
      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Section Header */}
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-gray-800">Tour Nổi Bật</h2>
          <Link href="/tours" className="text-[#00CBA9] text-sm font-medium">
            Xem tất cả →
          </Link>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
          {displayTours.slice(0, 6).map((tour) => (
            <div key={tour.id} className="shrink-0 w-40">
              <TourCard {...tour} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="px-4 mt-4">
          <Link
            href="/tours"
            className="block w-full py-3 text-center text-gray-700 font-medium border border-gray-300 rounded-full active:bg-gray-100"
          >
            Xem tất cả
          </Link>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block container-custom">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tour Nổi Bật</h2>
            <p className="text-gray-600 mt-1">Những tour được yêu thích nhất</p>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>

        {/* View More */}
        <div className="mt-8 text-center">
          <Link
            href="/tours"
            className="inline-block px-12 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:border-[#00CBA9] hover:text-[#00CBA9] transition-colors"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  )
}
