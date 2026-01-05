'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTourBySlug, getImageUrl, Tour } from '@/lib/strapi'
import { useParams, useSearchParams } from 'next/navigation'

// Fallback tour data khi không có từ Strapi
const fallbackTourData = {
  id: '1',
  title: 'Tour Đông Hưng 1 Ngày - Khám Phá Thành Phố Biên Giới',
  slug: 'tour-dong-hung-1-ngay',
  shortDescription: 'Đông Hưng (东兴) giáp với thành phố Móng Cái, tỉnh Quảng Ninh – nơi đây diễn ra hoạt động thương mại sôi động nhộn nhịp quanh năm, với nền ẩm thực và văn hóa đậm đà bản sắc Trung Hoa.',
  content: '',
  price: 780000,
  originalPrice: 980000,
  duration: '1 ngày',
  departure: 'Móng Cái',
  destination: 'Đông Hưng, Trung Quốc',
  transport: 'Xe du lịch',
  groupSize: '12+ người',
  schedule: 'Thứ 2, 4, 6, CN',
  rating: 4.8,
  reviewCount: 256,
  bookedCount: 1250,
  images: [
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80',
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&q=80',
    'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=800&q=80',
  ],
  highlights: [
    'Cửa khẩu Quốc tế Móng Cái – Đông Hưng',
    'Công viên Hữu Nghị Việt Trung',
    'Chùa Quan Đế',
    'Dinh thự Trần Quán Công - Đức Nhân Đường',
    'Khu phố Tây',
    'Siêu thị Sinrunfa',
  ],
  itinerary: [
    {
      time: '8h00',
      title: 'Tập trung tại Cửa khẩu Móng Cái',
      description: 'Quý khách nhận sổ thông hành, xếp hàng làm thủ tục xuất cảnh sang Đông Hưng - Trung Quốc.',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
    },
    {
      time: '10h00',
      title: 'Công viên Hữu Nghị Việt Trung',
      description: 'Quý khách qua cửa khẩu Quốc tế Đông Hưng. Sau đó, ngồi xe tham quan Công viên Hữu Nghị Việt Trung - địa điểm mang đậm dấu ấn văn hóa, lịch sử. Hai lòng bàn tay lớn của lực lượng biên phòng Việt - Trung nắm chặt vào nhau tượng trưng cho tình hữu nghị.',
      image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=600&q=80',
    },
    {
      time: '12h30',
      title: 'Chùa Quan Âm & Dinh Thự Trần Công Quán',
      description: 'Tham quan Chùa Quan Âm – ngôi miếu cổ lâu năm ra đời vào triều đại nhà Thanh, được thiết kế theo phong cách Trung Hoa. Đây là điểm đến tâm linh được yêu thích của rất nhiều du khách khi đến Đông Hưng.',
      image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&q=80',
    },
    {
      time: '13h00',
      title: 'Ăn trưa',
      description: 'Quý khách thưởng thức bữa trưa với các món ăn đậm đà bản sắc Trung Hoa - LẨU SỮA đặc biệt.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    },
    {
      time: '14h00',
      title: 'Đức Nhân Đường',
      description: 'Tham quan Đức Nhân Đường. Tại đây Quý khách sẽ tìm hiểu nền y học cổ truyền nổi tiếng Trung Hoa với các bài thuốc quý.',
      image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=600&q=80',
    },
    {
      time: '15h00',
      title: 'Khu phố Tây',
      description: 'Tham quan Khu phố Tây - nơi đây là những tòa nhà san sát nhau được thiết kế theo phong cách châu Âu đa màu sắc. Đây sẽ là một địa điểm lý tưởng cho Quý khách checkin.',
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80',
    },
    {
      time: '15h30',
      title: 'Mua sắm tại Siêu thị',
      description: 'Tham quan và mua sắm tại SIÊU THỊ Sinrunfa – siêu thị có đa dạng các loại đặc sản đặc sắc – Quý khách có thể mua về làm quà cho người thân và bạn bè.',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&q=80',
    },
    {
      time: '16h30',
      title: 'Về Việt Nam',
      description: 'Quý khách di chuyển về Cửa khẩu quốc tế Đông Hưng để xuất cảnh và di chuyển về nơi ở. Kết thúc chuyến đi!',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&q=80',
    },
  ],
  includes: [
    'Xe đưa đón phía Đông Hưng xuyên suốt hành trình',
    'Sổ thông hành',
    '01 bữa chính (tiêu chuẩn giá 200.000 VNĐ/suất) – LẨU SỮA',
    'Hướng dẫn viên chuyên nghiệp Việt Nam',
    'Miễn phí nước lọc đóng chai tiêu chuẩn 01 chai/ngày/người trên xe',
  ],
  excludes: [
    'Thuế giá trị gia tăng, phí bảo hiểm du lịch',
    'Các chi phí phát sinh (ăn uống, vui chơi, di chuyển,…) không có trong mục đã bao gồm',
    'Chi phí cá nhân: giặt ủi, điện thoại, đồ uống...',
    'Tiền tip cho HDV và tài xế',
  ],
  policies: {
    children: [
      'Trẻ bằng hoặc dưới 5 tuổi: tính 80% giá tour',
      'Trẻ em từ 6 tuổi trở lên: tính 100% giá tour',
    ],
    surcharge: 'Lễ tết phụ thu 200.000 VNĐ/người',
    documents: [
      'Người lớn: ảnh 4x6 nền trắng mắt nhìn thẳng, không đeo kính, rõ vành tai + ảnh chụp CCCD 2 mặt',
      'Trẻ em: xác nhận theo mẫu TK8 của trưởng công an phường xã + bản sao giấy khai sinh + ảnh 4x6',
      'Gửi giấy tờ trước 3 ngày làm việc (Trừ T7, CN và các ngày lễ)',
    ],
    notes: [
      'Báo giá áp dụng cho đoàn từ 12 khách trở lên',
      'Đặt cọc 50% ngay khi đăng ký tour',
      'Thanh toán số tiền còn lại vào ngày khởi hành',
      'Tuân thủ kỷ luật xuất nhập cảnh theo Pháp Luật của Trung Quốc',
      'Không tự ý rời đoàn hoặc thay đổi lịch trình',
    ],
  },
}

// Transform Strapi tour to page data
function transformStrapiTour(tour: Tour) {
  // Get images array from thumbnail and gallery
  const images: string[] = []
  if (tour.thumbnail) {
    images.push(getImageUrl(tour.thumbnail))
  }
  if (tour.gallery && tour.gallery.length > 0) {
    tour.gallery.forEach(img => images.push(getImageUrl(img)))
  }
  // Only add 1 fallback if no images at all
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
    departure: tour.departure || '',
    destination: tour.destination,
    transport: tour.transportation || '',
    groupSize: tour.groupSize || '',
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
      image: item.image ? getImageUrl(item.image) : '',
    })) || [],
    includes: tour.includes?.map(item => item.text) || [],
    excludes: tour.excludes?.map(item => item.text) || [],
    policies: {
      children: [],
      surcharge: '',
      documents: [],
      notes: tour.notes?.map(item => item.text) || [],
    },
  }
}

export default function TourDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const isPreview = searchParams.get('preview') === 'true'
  
  const [activeTab, setActiveTab] = useState('overview')
  const [currentImage, setCurrentImage] = useState(0)
  const [showAllItinerary, setShowAllItinerary] = useState(false)
  const [tourData, setTourData] = useState(fallbackTourData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTour() {
      if (!slug) return
      
      try {
        console.log('Fetching tour with slug:', slug, 'preview:', isPreview)
        const tour = await getTourBySlug(slug, isPreview)
        console.log('Tour data from Strapi:', tour)
        
        if (tour) {
          const transformed = transformStrapiTour(tour)
          console.log('Transformed tour:', transformed)
          setTourData(transformed)
        }
      } catch (error) {
        console.error('Error fetching tour:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTour()
    
    // Auto-refresh every 3 seconds in preview mode
    if (isPreview) {
      const interval = setInterval(fetchTour, 3000)
      return () => clearInterval(interval)
    }
  }, [slug, isPreview])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const discountPercent = tourData.originalPrice > tourData.price 
    ? Math.round(((tourData.originalPrice - tourData.price) / tourData.originalPrice) * 100)
    : 0

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'itinerary', label: 'Lịch trình' },
    { id: 'includes', label: 'Bao gồm' },
    { id: 'policy', label: 'Chính sách' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CBA9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium sticky top-0 z-50">
          🔍 Chế độ xem trước (Preview Mode) - Tự động cập nhật mỗi 3 giây
          <a href={`/tour/${slug}`} className="ml-2 underline hover:no-underline">
            Thoát Preview
          </a>
        </div>
      )}
      
      {/* Main Content */}
      <main className="pb-24 md:pb-8">
        {/* Mobile Gallery */}
        <div className="md:hidden relative">
          {/* Back button - Mobile only */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between">
            <Link
              href="/"
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex gap-2">
              <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative h-64 overflow-hidden">
            <Image
              src={tourData.images[currentImage]}
              alt={tourData.title}
              fill
              className="object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Back button */}
            <Link
              href="/"
              className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>

            {/* Share & Wishlist */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              {currentImage + 1}/{tourData.images.length}
            </div>

            {/* Discount badge */}
            <div className="absolute bottom-4 left-4">
              <span className="bg-[#FF6B35] text-white text-xs font-bold px-2 py-1 rounded">
                -{discountPercent}%
              </span>
            </div>
          </div>

          {/* Thumbnail images */}
          <div className="flex gap-2 p-4 overflow-x-auto bg-white">
            {tourData.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  currentImage === idx ? 'border-[#00CBA9]' : 'border-transparent'
                }`}
              >
                <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Gallery */}
        <div className="hidden md:block container-custom py-6">
          {tourData.images.length === 1 ? (
            <div className="relative h-[400px] rounded-xl overflow-hidden">
              <Image
                src={tourData.images[0]}
                alt={tourData.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 h-[400px]">
              <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden">
                <Image
                  src={tourData.images[0]}
                  alt={tourData.title}
                  fill
                  className="object-cover"
                />
              </div>
              {tourData.images.slice(1, 5).map((img: string, idx: number) => (
                <div key={idx} className="relative rounded-xl overflow-hidden">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tour Info */}
        <div className="bg-white">
          <div className="container-custom py-4 md:py-6">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              {/* Left Content */}
              <div className="md:col-span-2">
                {/* Title & Rating */}
                <div className="mb-4">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {tourData.title}
                  </h1>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{tourData.rating}</span>
                      <span className="text-gray-500">({tourData.reviewCount} đánh giá)</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">{tourData.bookedCount}+ đã đặt</span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#00CBA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{tourData.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-5 h-5 text-[#00CBA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{tourData.departure}</span>
                  </div>
                </div>

                {/* Mobile Price - Show only on mobile */}
                <div className="md:hidden bg-gradient-to-r from-[#00CBA9]/10 to-[#00A88A]/10 rounded-xl p-4 mb-4">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
                    <span className="text-gray-400 line-through text-sm">{formatPrice(tourData.originalPrice)}đ</span>
                    <span className="bg-[#FF6B35] text-white text-xs px-2 py-0.5 rounded">-{discountPercent}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Giá/khách • Chưa bao gồm VAT</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 sticky top-14 bg-white z-10 pt-2 pb-1">
                  <div className="grid grid-cols-4 gap-1 p-1.5 bg-gray-100/80 rounded-2xl">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2 py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 text-center ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-[#00CBA9] to-[#00A88A] text-white shadow-lg shadow-[#00CBA9]/30'
                            : 'text-gray-600 hover:text-[#00CBA9] hover:bg-white/60'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {/* Overview Tab */}
                  {activeTab === 'overview' && (
                    <div>
                      <p className="text-gray-600 mb-6">{tourData.shortDescription}</p>

                      {/* Content from Strapi (markdown) */}
                      {tourData.content && (
                        <div className="prose prose-sm max-w-none mb-6">
                          <h3 className="font-bold text-gray-800 mb-3">Giới thiệu chi tiết</h3>
                          <div 
                            className="text-gray-600 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: tourData.content.replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" class="rounded-lg my-4 max-w-full" />').replace(/\n/g, '<br/>') }}
                          />
                        </div>
                      )}

                      {tourData.highlights.length > 0 && (
                        <>
                          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#00CBA9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Điểm đến nổi bật
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                            {tourData.highlights.map((highlight: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                                <span className="w-2 h-2 bg-[#00CBA9] rounded-full shrink-0"></span>
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Itinerary Tab */}
                  {activeTab === 'itinerary' && (
                    <div>
                      <h3 className="font-bold text-gray-800 mb-4">Lịch trình chi tiết</h3>
                      <div className="space-y-4">
                        {(showAllItinerary ? tourData.itinerary : tourData.itinerary.slice(0, 4)).map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-[#00CBA9] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {idx + 1}
                              </div>
                              {idx < tourData.itinerary.length - 1 && (
                                <div className="w-0.5 h-full bg-[#00CBA9]/30 mt-2"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <div className="relative h-40">
                                  <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute top-2 left-2 bg-[#00CBA9] text-white text-xs font-bold px-2 py-1 rounded">
                                    {item.time}
                                  </div>
                                </div>
                                <div className="p-3">
                                  <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                                  <p className="text-sm text-gray-600">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {tourData.itinerary.length > 4 && (
                        <button
                          onClick={() => setShowAllItinerary(!showAllItinerary)}
                          className="w-full py-3 text-[#00CBA9] font-medium border border-[#00CBA9] rounded-xl mt-4"
                        >
                          {showAllItinerary ? 'Thu gọn' : `Xem thêm ${tourData.itinerary.length - 4} điểm đến`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Includes Tab */}
                  {activeTab === 'includes' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Giá tour bao gồm
                        </h3>
                        <ul className="space-y-2">
                          {tourData.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Không bao gồm
                        </h3>
                        <ul className="space-y-2">
                          {tourData.excludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Policy Tab */}
                  {activeTab === 'policy' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">👶 Chính sách trẻ em</h3>
                        <ul className="space-y-1">
                          {tourData.policies.children.map((item, idx) => (
                            <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">💰 Phụ thu</h3>
                        <p className="text-gray-600 text-sm">• {tourData.policies.surcharge}</p>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">📄 Giấy tờ cần thiết</h3>
                        <ul className="space-y-1">
                          {tourData.policies.documents.map((item, idx) => (
                            <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-800 mb-3">📌 Lưu ý quan trọng</h3>
                        <ul className="space-y-1">
                          {tourData.policies.notes.map((item, idx) => (
                            <li key={idx} className="text-gray-600 text-sm">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Desktop Only */}
              <div className="hidden md:block">
                <div className="sticky top-24">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-end gap-2 mb-1">
                        <span className="text-3xl font-bold text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
                        <span className="text-gray-400 line-through">{formatPrice(tourData.originalPrice)}đ</span>
                      </div>
                      <p className="text-sm text-gray-500">Giá/khách • Chưa bao gồm VAT</p>
                    </div>

                    {/* Date Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày khởi hành</label>
                      <input
                        type="date"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00CBA9] focus:border-transparent"
                      />
                    </div>

                    {/* Quantity */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng khách</label>
                      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                        <button className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          defaultValue="1"
                          className="flex-1 text-center border-x border-gray-300 py-3 text-sm"
                        />
                        <button className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Book Button */}
                    <button className="w-full bg-[#00CBA9] hover:bg-[#00A88A] text-white font-bold py-4 rounded-xl transition-colors mb-3">
                      Đặt Tour Ngay
                    </button>

                    {/* Contact */}
                    <div className="flex gap-2">
                      <a
                        href="tel:0123456789"
                        className="flex-1 flex items-center justify-center gap-2 border border-[#00CBA9] text-[#00CBA9] py-3 rounded-xl hover:bg-[#00CBA9]/10 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm font-medium">Gọi tư vấn</span>
                      </a>
                      <a
                        href="https://zalo.me/0123456789"
                        className="flex-1 flex items-center justify-center gap-2 border border-blue-500 text-blue-500 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                      >
                        <span className="text-sm font-medium">Chat Zalo</span>
                      </a>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Đảm bảo giá tốt nhất
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Hỗ trợ 24/7
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Xác nhận tức thì
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Fixed Bottom Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
              <span className="text-xs text-gray-400 line-through">{formatPrice(tourData.originalPrice)}đ</span>
            </div>
            <p className="text-xs text-gray-500">Giá/khách</p>
          </div>
          <button className="bg-[#00CBA9] text-white font-bold px-6 py-3 rounded-xl">
            Đặt Tour
          </button>
        </div>
      </div>


    </div>
  )
}
