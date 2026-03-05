'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ZaloBookingButton, ZaloShareButton } from '@/components/ZaloButtons'

interface TourDetailProps {
  tourData: {
    id: string
    documentId?: string
    title: string
    slug: string
    shortDescription: string
    content: string
    price: number
    originalPrice: number
    duration: string
    departure: string
    destination: string
    schedule: string
    rating: number
    reviewCount: number
    bookedCount: number
    images: string[]
    highlights: string[]
    tourFileUrl?: string // URL to download tour PDF
    itinerary: Array<{
      time: string
      title: string
      description: string
      image: string
    }>
    includes: string[]
    excludes: string[]
    policies: {
      children: string[]
      surcharge: string
      documents: string[]
      notes: string[]
    }
  }
  phoneNumber?: string
  zaloNumber?: string
  isPreview?: boolean
}

export default function TourDetailClient({ tourData, phoneNumber = '0123456789', zaloNumber, isPreview = false }: TourDetailProps) {
  const zaloLink = zaloNumber || phoneNumber
  const [activeTab, setActiveTab] = useState('overview')
  const [currentImage, setCurrentImage] = useState(0)
  const [showAllItinerary, setShowAllItinerary] = useState(false)
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [displayReviewCount, setDisplayReviewCount] = useState(tourData.reviewCount)
  const [displayBookedCount, setDisplayBookedCount] = useState(tourData.bookedCount)

  // Track unique view and update counts
  useEffect(() => {
    const trackView = async () => {
      // Skip if preview mode or no documentId
      if (isPreview || !tourData.documentId) return

      // Check if already viewed this tour
      const viewedKey = `tour_viewed_${tourData.slug}`
      const hasViewed = localStorage.getItem(viewedKey)
      
      if (hasViewed) return // Already counted this visitor

      try {
        const response = await fetch('/api/track-view', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId: tourData.documentId,
            currentReviewCount: tourData.reviewCount,
            currentBookingCount: tourData.bookedCount,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          // Update displayed counts
          if (data.reviewCount) setDisplayReviewCount(data.reviewCount)
          if (data.bookingCount) setDisplayBookedCount(data.bookingCount)
          
          // Mark as viewed so it won't count again
          localStorage.setItem(viewedKey, Date.now().toString())
        }
      } catch (error) {
        console.error('Failed to track view:', error)
      }
    }

    // Delay tracking slightly to ensure page is loaded
    const timer = setTimeout(trackView, 1000)
    return () => clearTimeout(timer)
  }, [tourData.slug, tourData.documentId, tourData.reviewCount, tourData.bookedCount, isPreview])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setShowLightbox(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    document.body.style.overflow = ''
  }

  const goToNextImage = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % tourData.images.length)
  }, [tourData.images.length])

  const goToPrevImage = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + tourData.images.length) % tourData.images.length)
  }, [tourData.images.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showLightbox) return
      
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowRight':
          goToNextImage()
          break
        case 'ArrowLeft':
          goToPrevImage()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLightbox, goToNextImage, goToPrevImage])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Mode Banner */}
      {isPreview && (
        <div className="bg-yellow-500 text-black px-4 py-2 text-center text-sm font-medium sticky top-0 z-50">
          🔍 Chế độ xem trước (Preview Mode)
          <a href={`/tour/${tourData.slug}`} className="ml-2 underline hover:no-underline">
            Thoát Preview
          </a>
        </div>
      )}
      
      {/* Main Content */}
      <main className="pb-24 md:pb-8">
        {/* Mobile Gallery */}
        <div className="md:hidden relative">
          {/* Header Overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between">
            <Link
              href="/tours"
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex gap-2">
              <ZaloShareButton 
                tour={{
                  id: parseInt(tourData.id) || 0,
                  title: tourData.title,
                  slug: tourData.slug,
                  shortDescription: tourData.shortDescription,
                  thumbnail: tourData.images?.[0]
                }}
                className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
              />
              <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => openLightbox(currentImage)}
            className="relative h-72 overflow-hidden w-full cursor-zoom-in"
          >
            <Image
              src={tourData.images[currentImage]}
              alt={`Tour ${tourData.title} - ${tourData.destination} ${tourData.duration} | Sơn Hằng Travel`}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Image counter & discount */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              {discountPercent > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  GIẢM {discountPercent}%
                </span>
              )}
              <div className="ml-auto bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {currentImage + 1}/{tourData.images.length}
              </div>
            </div>
          </button>

          {/* Thumbnail images */}
          <div className="flex gap-2 p-4 overflow-x-auto bg-white">
            {tourData.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                onDoubleClick={() => openLightbox(idx)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === idx ? 'border-[#00CBA9] scale-105' : 'border-gray-200'
                }`}
              >
                <Image src={img} alt={`Ảnh ${idx + 1} tour ${tourData.title}`} width={64} height={64} className="object-cover w-full h-full" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Gallery */}
        <div className="hidden md:block container mx-auto px-4 py-6 max-w-7xl">
          {tourData.images.length === 1 ? (
            <button 
              onClick={() => openLightbox(0)}
              className="relative h-[450px] rounded-2xl overflow-hidden w-full cursor-zoom-in"
            >
              <Image
                src={tourData.images[0]}
                alt={`Tour ${tourData.title} - ${tourData.destination} | Sơn Hằng Travel`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                priority
              />
            </button>
          ) : (
            <div className="grid grid-cols-4 gap-3 h-[450px] relative">
              <button 
                onClick={() => openLightbox(0)}
                className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-zoom-in"
              >
                <Image
                  src={tourData.images[0]}
                  alt={`Tour ${tourData.title} - Ảnh chính | Sơn Hằng Travel`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </button>
              {tourData.images.slice(1, 5).map((img: string, idx: number) => (
                <button 
                  key={idx} 
                  onClick={() => openLightbox(idx + 1)}
                  className="relative rounded-2xl overflow-hidden group cursor-zoom-in"
                >
                  <Image src={img} alt={`Tour ${tourData.title} - Ảnh ${idx + 2}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  {/* Show overlay on last visible image if more images exist */}
                  {idx === 3 && tourData.images.length > 5 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{tourData.images.length - 5}</span>
                    </div>
                  )}
                </button>
              ))}
              {/* View all button */}
              <button 
                onClick={() => openLightbox(0)}
                className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 px-5 py-2.5 rounded-xl shadow-lg font-medium text-gray-700 flex items-center gap-2 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Xem tất cả {tourData.images.length} ảnh
              </button>
            </div>
          )}
        </div>

        {/* Tour Info */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="md:grid md:grid-cols-3 md:gap-10">
              {/* Left Content */}
              <div className="md:col-span-2">
                {/* Title & Rating */}
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                    {tourData.title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                      <span className="font-bold text-gray-900">{tourData.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({formatPrice(displayReviewCount)} đánh giá)</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">{formatPrice(displayBookedCount)}+ người đã đặt</span>
                  </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-3 border border-blue-200/50">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs text-gray-600 font-medium">Thời gian</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{tourData.duration}</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-3 border border-green-200/50">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="text-xs text-gray-600 font-medium">Xuất phát</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{tourData.departure}</p>
                  </div>
                </div>

                {/* Mobile Download Tour File Button - Separate section */}
                {tourData.tourFileUrl && (
                  <div className="md:hidden mb-4">
                    <a
                      href={tourData.tourFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="flex items-center justify-center gap-2 w-full py-3 bg-blue-50 border-2 border-blue-200 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-100 hover:border-blue-300 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Tải lịch trình tour (PDF)
                    </a>
                  </div>
                )}

                {/* Mobile Price Card */}
                <div className="md:hidden bg-linear-to-r from-[#00CBA9]/10 to-[#00A88A]/10 rounded-2xl p-4 mb-6 border border-[#00CBA9]/20">
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
                    {tourData.originalPrice > tourData.price && (
                      <>
                        <span className="text-gray-400 line-through text-sm">{formatPrice(tourData.originalPrice)}đ</span>
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                          -{discountPercent}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-600">Giá/khách • Chưa bao gồm VAT</p>
                </div>

                {/* Tabs */}
                <div className="mb-6 sticky top-14 md:top-0 bg-white z-10 pt-2 pb-3">
                  <div className="grid grid-cols-4 gap-2 p-1.5 bg-gray-100 rounded-2xl">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-3 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-300 ${
                          activeTab === tab.id
                            ? 'bg-linear-to-r from-[#00CBA9] to-[#00A88A] text-white shadow-lg'
                            : 'text-gray-600 hover:text-[#00CBA9] hover:bg-white'
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
                    <div className="space-y-6">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed text-base">{tourData.shortDescription}</p>
                      </div>

                      {tourData.content && (
                        <div className="prose prose-sm max-w-none">
                          <h3 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#00CBA9] rounded-full"></span>
                            Giới thiệu chi tiết
                          </h3>
                          <div 
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                              __html: tourData.content
                                .replace(/!\[.*?\]\((.*?)\)/g, '<img src="$1" class="rounded-xl my-4 max-w-full shadow-md" />')
                                .replace(/\n/g, '<br/>') 
                            }}
                          />
                        </div>
                      )}

                      {tourData.highlights.length > 0 && (
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#00CBA9] rounded-full"></span>
                            Điểm đến nổi bật
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {tourData.highlights.map((highlight: string, idx: number) => (
                              <div key={idx} className="flex items-center gap-3 bg-gradient-to-r from-[#00CBA9]/5 to-transparent p-3 rounded-xl">
                                <svg className="w-5 h-5 text-[#00CBA9] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-gray-700 text-sm">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Itinerary Tab */}
                  {activeTab === 'itinerary' && tourData.itinerary.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-[#00CBA9] rounded-full"></span>
                        Lịch trình chi tiết
                      </h3>
                      <div className="space-y-6">
                        {(showAllItinerary ? tourData.itinerary : tourData.itinerary.slice(0, 4)).map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            {/* Timeline */}
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-gradient-to-br from-[#00CBA9] to-[#00A88A] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                {idx + 1}
                              </div>
                              {idx < tourData.itinerary.length - 1 && (
                                <div className="w-1 h-full bg-gradient-to-b from-[#00CBA9] to-[#00CBA9]/20 mt-2 rounded-full"></div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                              <div className="bg-white border-2 border-gray-100 hover:border-[#00CBA9]/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg">
                                {item.image && (
                                  <div className="relative h-48">
                                    <Image
                                      src={item.image}
                                      alt={item.title}
                                      fill
                                      className="object-cover"
                                    />
                                    {item.time && (
                                      <div className="absolute top-3 left-3 bg-[#00CBA9] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {item.time}
                                      </div>
                                    )}
                                  </div>
                                )}
                                <div className="p-4">
                                  <h4 className="font-bold text-gray-900 mb-2 text-base">{item.title}</h4>
                                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {tourData.itinerary.length > 4 && (
                        <button
                          onClick={() => setShowAllItinerary(!showAllItinerary)}
                          className="w-full py-4 text-[#00CBA9] font-semibold border-2 border-[#00CBA9] rounded-xl mt-6 hover:bg-[#00CBA9] hover:text-white transition-all duration-300"
                        >
                          {showAllItinerary ? 'Thu gọn' : `Xem thêm ${tourData.itinerary.length - 4} điểm đến →`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Includes Tab */}
                  {activeTab === 'includes' && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100/30 rounded-2xl p-6 border-2 border-green-200/50">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Giá tour bao gồm
                        </h3>
                        <ul className="space-y-3">
                          {tourData.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                              <svg className="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-gradient-to-br from-red-50 to-red-100/30 rounded-2xl p-6 border-2 border-red-200/50">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Không bao gồm
                        </h3>
                        <ul className="space-y-3">
                          {tourData.excludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700">
                              <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Policy Tab */}
                  {activeTab === 'policy' && (
                    <div className="space-y-6">
                      {tourData.policies.children.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl p-6 border-2 border-blue-200/50">
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-2xl">👶</span>
                            Chính sách trẻ em
                          </h3>
                          <ul className="space-y-2">
                            {tourData.policies.children.map((item, idx) => (
                              <li key={idx} className="text-gray-700 flex items-start gap-2">
                                <span className="text-blue-600 font-bold mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tourData.policies.surcharge && (
                        <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 rounded-2xl p-6 border-2 border-amber-200/50">
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-2xl">💰</span>
                            Phụ thu
                          </h3>
                          <p className="text-gray-700 flex items-start gap-2">
                            <span className="text-amber-600 font-bold mt-1">•</span>
                            <span>{tourData.policies.surcharge}</span>
                          </p>
                        </div>
                      )}

                      {tourData.policies.documents.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-2xl p-6 border-2 border-purple-200/50">
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-2xl">📄</span>
                            Giấy tờ cần thiết
                          </h3>
                          <ul className="space-y-2">
                            {tourData.policies.documents.map((item, idx) => (
                              <li key={idx} className="text-gray-700 flex items-start gap-2">
                                <span className="text-purple-600 font-bold mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tourData.policies.notes.length > 0 && (
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100/30 rounded-2xl p-6 border-2 border-gray-200/50">
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <span className="text-2xl">📌</span>
                            Lưu ý quan trọng
                          </h3>
                          <ul className="space-y-2">
                            {tourData.policies.notes.map((item, idx) => (
                              <li key={idx} className="text-gray-700 flex items-start gap-2">
                                <span className="text-gray-600 font-bold mt-1">•</span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Desktop Only */}
              <div className="hidden md:block">
                <div className="sticky top-24">
                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-xl">
                    {/* Download Tour File Button - Above price */}
                    {tourData.tourFileUrl && (
                      <a
                        href={tourData.tourFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center justify-center gap-2 w-full py-3 mb-4 bg-blue-50 border-2 border-blue-200 text-blue-600 rounded-xl font-semibold text-sm hover:bg-blue-100 hover:border-blue-300 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Tải lịch trình tour (PDF)
                      </a>
                    )}

                    {/* Price */}
                    <div className="mb-6 bg-linear-to-r from-[#00CBA9]/10 to-[#00A88A]/10 rounded-xl p-4">
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-4xl font-bold text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
                        {tourData.originalPrice > tourData.price && (
                          <span className="text-gray-400 line-through text-lg">{formatPrice(tourData.originalPrice)}đ</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Giá/khách • Chưa bao gồm VAT</p>
                      {discountPercent > 0 && (
                        <div className="mt-2 inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          TIẾT KIỆM {discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Book Button - Zalo Integration */}
                    <ZaloBookingButton 
                      tour={{
                        id: parseInt(tourData.id) || 0,
                        title: tourData.title,
                        slug: tourData.slug,
                        shortDescription: tourData.shortDescription,
                        thumbnail: tourData.images?.[0],
                        price: tourData.price
                      }}
                      className="w-full bg-linear-to-r from-[#00CBA9] to-[#00A88A] hover:from-[#00A88A] hover:to-[#00CBA9] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-3 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.07-.05-.16-.03-.23-.02-.1.02-1.62 1.03-4.58 3.03-.43.3-.82.44-1.17.43-.39-.01-1.13-.22-1.68-.4-.68-.22-1.22-.34-1.17-.72.02-.2.31-.4.87-.6 3.42-1.49 5.7-2.47 6.84-2.95 3.26-1.36 3.94-1.6 4.38-1.6.1 0 .31.02.45.13.12.09.15.21.17.3-.01.06.01.24 0 .37z"/>
                      </svg>
                      Đặt Tour Ngay
                    </ZaloBookingButton>

                    {/* Contact */}
                    <div className="flex gap-2 mb-4">
                      <a
                        href={`tel:${phoneNumber}`}
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-[#00CBA9] text-[#00CBA9] py-3 rounded-xl hover:bg-[#00CBA9]/10 transition-all font-medium"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm">Gọi ngay</span>
                      </a>
                      <a
                        href={`https://zalo.me/${zaloLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-500 py-3 rounded-xl hover:bg-blue-50 transition-all font-medium"
                      >
                        <span className="text-sm">Chat Zalo</span>
                      </a>
                    </div>

                    {/* Trust badges */}
                    <div className="pt-4 border-t-2 border-gray-100 space-y-3">
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="font-medium">Đảm bảo giá tốt nhất</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Hỗ trợ 24/7</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Xác nhận tức thì</span>
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
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 z-40 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-bold text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
              {tourData.originalPrice > tourData.price && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(tourData.originalPrice)}đ</span>
              )}
            </div>
            <p className="text-xs text-gray-500">Giá/khách</p>
          </div>
          <ZaloBookingButton 
            tour={{ id: parseInt(tourData.id), title: tourData.title, slug: tourData.slug, price: tourData.price }}
            className="bg-linear-to-r from-[#00CBA9] to-[#00A88A] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.07-.05-.16-.03-.23-.02-.1.02-1.62 1.03-4.58 3.03-.43.3-.82.44-1.17.43-.39-.01-1.13-.22-1.68-.4-.68-.22-1.22-.34-1.17-.72.02-.2.31-.4.87-.6 3.42-1.49 5.7-2.47 6.84-2.95 3.26-1.36 3.94-1.6 4.38-1.6.1 0 .31.02.45.13.12.09.15.21.17.3-.01.06.01.24 0 .37z"/>
            </svg>
            Đặt Tour
          </ZaloBookingButton>
        </div>
      </div>

      {/* Lightbox Gallery Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium">
            {lightboxIndex + 1} / {tourData.images.length}
          </div>

          {/* Main image container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-16">
            <div className="relative w-full h-full max-w-6xl max-h-[85vh]">
              <Image
                src={tourData.images[lightboxIndex]}
                alt={`Tour ${tourData.title} - Ảnh ${lightboxIndex + 1}/${tourData.images.length} | Sơn Hằng Travel`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Navigation arrows */}
          {tourData.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-14 h-14 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnail strip at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-4">
            <div className="flex justify-center gap-2 px-4 overflow-x-auto pb-2">
              {tourData.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxIndex(idx)}
                  className={`shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden transition-all ${
                    lightboxIndex === idx 
                      ? 'ring-2 ring-[#00CBA9] ring-offset-2 ring-offset-black scale-110' 
                      : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1} - ${tourData.title}`} width={80} height={80} className="object-cover w-full h-full" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Keyboard navigation hint */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/50 text-sm hidden md:block">
            Dùng phím ← → để chuyển ảnh • ESC để đóng
          </div>
        </div>
      )}
    </div>
  )
}
