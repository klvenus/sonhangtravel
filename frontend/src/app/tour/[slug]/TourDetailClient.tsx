'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TourDetailProps {
  tourData: {
    id: string
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
    departureDates?: Array<{
      date: string
      price?: number
      availableSlots: number
      status: string
    }>
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
  faqItems?: Array<{
    question: string
    answer: string
  }>
}

export default function TourDetailClient({ tourData, phoneNumber = '0123456789', zaloNumber, faqItems = [] }: TourDetailProps) {
  const zaloLink = zaloNumber || phoneNumber
  const zaloBookingUrl = `https://zalo.me/${zaloLink}`
  const [activeTab, setActiveTab] = useState('overview')
  const [currentImage, setCurrentImage] = useState(0)
  const [showAllItinerary, setShowAllItinerary] = useState(false)
  const [guestCount, setGuestCount] = useState(2)
  const isDailyShortBorderTour = (() => {
    const slug = tourData.slug || ''
    const title = tourData.title || ''
    const duration = tourData.duration || ''
    const isDongHungShort = /dong-hung/.test(slug) && /(1 ngày|2 ngày 1 đêm|3 ngày 2 đêm)/i.test(duration)
    const isHaKhauShort = /ha-khau/.test(slug) && /(1 ngày|2 ngày 1 đêm)/i.test(duration)
    const isNamedShort = ['dong-hung-1-ngay', 'dong-hung-2-ngay-1-dem', 'dong-hung-3-ngay-2-dem', 'ha-khau-1-ngay'].includes(slug)
    return isNamedShort || isDongHungShort || isHaKhauShort || /(Đông Hưng|Hà Khẩu)/i.test(title) && /(1 ngày|2 ngày 1 đêm|3 ngày 2 đêm)/i.test(duration)
  })()
  const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const generatedDailyDates = (() => {
    if (!isDailyShortBorderTour) return [] as Array<{ date: string; price?: number; availableSlots: number; status: string }>

    const items: Array<{ date: string; price?: number; availableSlots: number; status: string }> = []
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const end = new Date(today.getFullYear(), today.getMonth() + 2, 0)

    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      items.push({
        date: toLocalDateKey(cursor),
        price: tourData.price,
        availableSlots: 12,
        status: 'available',
      })
    }

    return items
  })()
  const departureDates = ((tourData.departureDates && tourData.departureDates.length > 0) ? tourData.departureDates : generatedDailyDates).filter((item) => item?.date)
  const isHoliday3041 = /30\/4|1\/5|30-4|1-5/i.test(`${tourData.title} ${tourData.shortDescription} ${(tourData.policies.notes || []).join(' ')}`)
  const basePrice = departureDates.length > 0
    ? Math.min(...departureDates.map((item) => item.price || tourData.price), tourData.price)
    : tourData.price
  const normalDepartureDates = departureDates.filter((item) => (item.price || basePrice) <= basePrice)
  const holidayDepartureDates = departureDates.filter((item) => (item.price || basePrice) > basePrice)
  const initialDepartureDate = (normalDepartureDates[0]?.date || departureDates[0]?.date || '')
  const [selectedDepartureDate, setSelectedDepartureDate] = useState(initialDepartureDate)
  const selectedDeparture = departureDates.find((item) => item.date === selectedDepartureDate)
  const displayPrice = selectedDeparture?.price || basePrice
  const isSelectedHolidayDeparture = !!selectedDeparture && (selectedDeparture.price || basePrice) > basePrice

  useEffect(() => {
    if (selectedDepartureDate) return
    setSelectedDepartureDate(normalDepartureDates[0]?.date || departureDates[0]?.date || '')
  }, [selectedDepartureDate, normalDepartureDates, departureDates])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price)
  }

  const discountPercent = tourData.originalPrice > basePrice 
    ? Math.round(((tourData.originalPrice - basePrice) / tourData.originalPrice) * 100)
    : 0

  const formatDepartureDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return dateStr
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    }).format(date)
  }

  const formatDepartureMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number)
    if (!year || !month) return monthKey
    return `Tháng ${month}/${year}`
  }

  const departureMonthGroups = departureDates.reduce<Record<string, typeof departureDates>>((acc, item) => {
    const monthKey = item.date.slice(0, 7)
    if (!acc[monthKey]) acc[monthKey] = []
    acc[monthKey].push(item)
    return acc
  }, {})
  const departureMonths = Object.keys(departureMonthGroups).sort()
  const initialDepartureMonth = selectedDepartureDate ? selectedDepartureDate.slice(0, 7) : departureMonths[0] || ''
  const [selectedDepartureMonth, setSelectedDepartureMonth] = useState(initialDepartureMonth)
  const visibleDepartureDates = selectedDepartureMonth ? (departureMonthGroups[selectedDepartureMonth] || []) : departureDates
  const monthCalendarDays = (() => {
    if (!isDailyShortBorderTour || !selectedDepartureMonth) return [] as Array<{ key: string; date?: string; day?: number; inMonth: boolean }>
    const [year, month] = selectedDepartureMonth.split('-').map(Number)
    if (!year || !month) return [] as Array<{ key: string; date?: string; day?: number; inMonth: boolean }>

    const firstDay = new Date(year, month - 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    const leadingEmpty = (firstDay.getDay() + 6) % 7
    const cells: Array<{ key: string; date?: string; day?: number; inMonth: boolean }> = []

    for (let i = 0; i < leadingEmpty; i += 1) cells.push({ key: `empty-${i}`, inMonth: false })
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month - 1, day)
      cells.push({ key: `${selectedDepartureMonth}-${day}`, date: toLocalDateKey(date), day, inMonth: true })
    }
    return cells
  })()

  useEffect(() => {
    if (!selectedDepartureDate) return
    const monthKey = selectedDepartureDate.slice(0, 7)
    if (monthKey !== selectedDepartureMonth) setSelectedDepartureMonth(monthKey)
  }, [selectedDepartureDate, selectedDepartureMonth])

  useEffect(() => {
    if (!selectedDepartureMonth || visibleDepartureDates.length > 0) return
    setSelectedDepartureMonth(departureMonths[0] || '')
  }, [selectedDepartureMonth, visibleDepartureDates, departureMonths])

  const getDepartureDateMeta = (item: { availableSlots: number; status: string }) => {
    if (item.status === 'limited' || item.availableSlots <= 9) {
      return { label: `Còn ${Math.max(item.availableSlots, 8)} chỗ`, className: 'border-amber-200 bg-amber-50 text-amber-700' }
    }
    return { label: `Còn ${Math.min(Math.max(item.availableSlots, 10), 15)} chỗ`, className: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan' },
    { id: 'itinerary', label: 'Lịch trình' },
    { id: 'includes', label: 'Bao gồm' },
    { id: 'policy', label: 'Chính sách' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
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
              <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="relative h-72 overflow-hidden">
            <Image
              src={tourData.images[currentImage]}
              alt={tourData.title}
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
              <div className="ml-auto bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                {currentImage + 1}/{tourData.images.length}
              </div>
            </div>
          </div>

          {/* Thumbnail images */}
          <div className="flex gap-2 p-4 overflow-x-auto bg-white">
            {tourData.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImage === idx ? 'border-[#00CBA9] scale-105' : 'border-gray-200'
                }`}
              >
                <Image src={img} alt="" width={64} height={64} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Gallery */}
        <div className="hidden md:block container mx-auto px-4 py-6 max-w-7xl">
          {tourData.images.length === 1 ? (
            <div className="relative h-[450px] rounded-2xl overflow-hidden">
              <Image
                src={tourData.images[0]}
                alt={tourData.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 h-[450px]">
              <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
                <Image
                  src={tourData.images[0]}
                  alt={tourData.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
              {tourData.images.slice(1, 5).map((img: string, idx: number) => (
                <div key={idx} className="relative rounded-2xl overflow-hidden group">
                  <Image src={img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
              {tourData.images.length > 5 && (
                <button className="absolute bottom-6 right-6 bg-white hover:bg-gray-50 px-6 py-3 rounded-xl shadow-lg font-medium text-gray-700 flex items-center gap-2 transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Xem tất cả {tourData.images.length} ảnh
                </button>
              )}
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
                      <span className="text-gray-500">({formatPrice(tourData.reviewCount)} đánh giá)</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-600">{formatPrice(tourData.bookedCount)}+ người đã đặt</span>
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

                {faqItems.length > 0 && (
                  <section className="mt-8">
                    <h2 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-[#00CBA9] rounded-full"></span>
                      Giải đáp nhanh về {tourData.title}
                    </h2>
                    <div className="space-y-3">
                      {faqItems.map((item, idx) => (
                        <div key={idx} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                          <h3 className="text-base font-semibold text-gray-900">{item.question}</h3>
                          <p className="mt-2 text-sm leading-7 text-gray-600">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
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
                    <div className={`mb-6 rounded-2xl p-5 border-2 shadow-sm ${isSelectedHolidayDeparture ? 'border-red-200 bg-linear-to-r from-red-50 via-amber-50 to-yellow-50' : 'border-[#00CBA9]/20 bg-linear-to-r from-[#00CBA9]/10 to-[#00A88A]/10'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-[0.2em] ${isSelectedHolidayDeparture ? 'text-red-500' : 'text-[#00A88A]'}`}>
                            {isSelectedHolidayDeparture ? 'Lễ 30/4 - 1/5' : 'Giá ưu đãi'}
                          </p>
                          <div className="mt-2 flex items-end gap-2 mb-2">
                            <span className={`text-4xl font-bold ${isSelectedHolidayDeparture ? 'text-red-600 animate-pulse' : 'text-[#FF6B35]'}`}>{formatPrice(displayPrice)}đ</span>
                            {tourData.originalPrice > displayPrice && (
                              <span className="text-gray-400 line-through text-lg">{formatPrice(tourData.originalPrice)}đ</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Giá/khách • Chưa bao gồm VAT</p>
                        </div>
                        {isSelectedHolidayDeparture && (
                          <div className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 ring-1 ring-red-200">Giá lễ</div>
                        )}
                      </div>
                      {discountPercent > 0 && (
                        <div className={`mt-3 inline-block text-white text-xs font-bold px-3 py-1 rounded-full ${isSelectedHolidayDeparture ? 'bg-red-600' : 'bg-red-600'}`}>
                          TIẾT KIỆM {discountPercent}%
                        </div>
                      )}
                    </div>

                    {/* Departure Dates */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Lịch khởi hành</label>
                      {departureDates.length > 0 ? (
                        <div className="space-y-4">
                          {isHoliday3041 && (
                            <>
                              <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 via-amber-50 to-yellow-50 p-4 shadow-sm">
                                <div className="absolute -right-3 -top-3 h-14 w-14 rounded-full bg-rose-200/40 blur-2xl" />
                                <div className="absolute -left-2 bottom-0 h-12 w-12 rounded-full bg-amber-200/40 blur-xl" />
                                <div className="relative mb-3 flex items-center gap-2">
                                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-base shadow-sm">🧧</span>
                                  <div>
                                    <p className="text-sm font-bold text-rose-600">Đợt khởi hành lễ 30/4 - 1/5</p>
                                    <p className="text-[11px] text-gray-500">Chọn đợt để giá nhảy theo đúng ngày khởi hành</p>
                                  </div>
                                </div>
                                <div className="relative">
                                  <select
                                    value={isSelectedHolidayDeparture ? selectedDepartureDate : ''}
                                    onChange={(e) => setSelectedDepartureDate(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-rose-200 bg-white/90 px-4 py-3 pr-10 text-sm font-semibold text-gray-700 shadow-sm transition-all focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-100"
                                  >
                                    <option value="">Chọn ngày lễ 30/4 - 1/5</option>
                                    {holidayDepartureDates.map((item) => (
                                      <option key={item.date} value={item.date}>
                                        Đợt {formatDepartureDateLabel(item.date)} • {getDepartureDateMeta(item).label} • {formatPrice(item.price || tourData.price)}đ
                                      </option>
                                    ))}
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-rose-500">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                  </div>
                                </div>
                                {isSelectedHolidayDeparture && selectedDepartureDate && (
                                  <div className="mt-3 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm shadow-sm ring-1 ring-rose-100">
                                    <div>
                                      <p className="text-[11px] uppercase tracking-[0.16em] text-rose-500">Đang chọn</p>
                                      <p className="font-bold text-rose-600">Lễ {formatDepartureDateLabel(selectedDepartureDate)}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-[11px] uppercase tracking-[0.16em] text-gray-400">Giá hiện tại</p>
                                      <p className="font-bold text-gray-900">{formatPrice(displayPrice)}đ</p>
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Ngày thường</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {normalDepartureDates.slice(0, 6).map((item) => {
                                    const isActive = selectedDepartureDate === item.date
                                    return (
                                      <button
                                        key={item.date}
                                        type="button"
                                        onClick={() => setSelectedDepartureDate(item.date)}
                                        className={`rounded-xl border px-3 py-3 text-left transition-all ${
                                          isActive
                                            ? 'border-[#00CBA9] bg-[#00CBA9]/10 shadow-sm'
                                            : 'border-gray-200 bg-white hover:border-[#00CBA9]/40'
                                        }`}
                                      >
                                        <div className="text-sm font-bold text-gray-900">{formatDepartureDateLabel(item.date)}</div>
                                        <div className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${getDepartureDateMeta(item).className}`}>
                                          {getDepartureDateMeta(item).label}
                                        </div>
                                      </button>
                                    )
                                  })}
                                </div>
                              </div>
                            </>
                          )}

                          {!isHoliday3041 && (
                            <>
                              {isDailyShortBorderTour ? (
                                <div className="space-y-3">
                                  <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Chọn tháng</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {departureMonths.map((monthKey) => {
                                        const isActive = selectedDepartureMonth === monthKey
                                        return (
                                          <button
                                            key={monthKey}
                                            type="button"
                                            onClick={() => {
                                              setSelectedDepartureMonth(monthKey)
                                              const firstDate = departureMonthGroups[monthKey]?.[0]?.date
                                              if (firstDate) setSelectedDepartureDate(firstDate)
                                            }}
                                            className={`rounded-xl border px-3 py-3 text-left transition-all ${
                                              isActive
                                                ? 'border-[#00CBA9] bg-[#00CBA9]/10 shadow-sm'
                                                : 'border-gray-200 bg-white hover:border-[#00CBA9]/40'
                                            }`}
                                          >
                                            <div className="text-sm font-bold text-gray-900">{formatDepartureMonthLabel(monthKey)}</div>
                                            <div className="mt-1 text-[11px] text-gray-500">Khởi hành hằng ngày</div>
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="mb-2 flex items-center justify-between">
                                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Chọn ngày</p>
                                      <span className="text-[11px] text-gray-500">T2 - CN</span>
                                    </div>
                                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                                      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50 text-center text-[11px] font-semibold text-gray-500">
                                        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((label) => (
                                          <div key={label} className="py-2">{label}</div>
                                        ))}
                                      </div>
                                      <div className="grid grid-cols-7 gap-px bg-gray-100">
                                        {monthCalendarDays.map((cell) => {
                                          if (!cell.inMonth || !cell.date) {
                                            return <div key={cell.key} className="aspect-square bg-white/60" />
                                          }

                                          const isActive = selectedDepartureDate === cell.date
                                          const isPast = cell.date < toLocalDateKey(new Date())
                                          return (
                                            <button
                                              key={cell.key}
                                              type="button"
                                              disabled={isPast}
                                              onClick={() => setSelectedDepartureDate(cell.date!)}
                                              className={`aspect-square bg-white text-sm font-semibold transition-all ${
                                                isActive
                                                  ? 'bg-[#00CBA9] text-white'
                                                  : isPast
                                                    ? 'text-gray-300'
                                                    : 'text-gray-700 hover:bg-[#00CBA9]/8'
                                              }`}
                                            >
                                              {cell.day}
                                            </button>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">Chọn ngày</p>
                                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {(normalDepartureDates.length > 0 ? normalDepartureDates : departureDates).slice(0, 6).map((item) => {
                                      const isActive = selectedDepartureDate === item.date
                                      return (
                                        <button
                                          key={item.date}
                                          type="button"
                                          onClick={() => setSelectedDepartureDate(item.date)}
                                          className={`rounded-xl border px-3 py-3 text-left transition-all ${
                                            isActive
                                              ? 'border-[#00CBA9] bg-[#00CBA9]/10 shadow-sm'
                                              : 'border-gray-200 bg-white hover:border-[#00CBA9]/40'
                                          }`}
                                        >
                                          <div className="text-sm font-bold text-gray-900">{formatDepartureDateLabel(item.date)}</div>
                                          <div className={`mt-1 inline-flex rounded-full border px-2 py-1 text-[11px] font-semibold ${getDepartureDateMeta(item).className}`}>
                                            {getDepartureDateMeta(item).label}
                                          </div>
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                              {selectedDepartureDate && (
                                <p className="text-xs text-gray-500">
                                  Đang chọn ngày khởi hành: <span className="font-semibold text-gray-700">{formatDepartureDateLabel(selectedDepartureDate)}</span>
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
                          Lịch khởi hành đang được cập nhật.
                        </div>
                      )}
                    </div>

                    {/* Quantity */}
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Số lượng khách</label>
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => setGuestCount((prev) => Math.max(2, prev - 1))}
                          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <div className="flex-1 border-x-2 border-gray-200 py-3 text-center text-sm font-semibold text-gray-900 select-none">
                          {guestCount}
                        </div>
                        <button
                          type="button"
                          onClick={() => setGuestCount((prev) => Math.min(20, prev + 1))}
                          className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Book Button */}
                    <a
                      href={zaloBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Đặt tour ${tourData.title} qua Zalo`}
                      className="flex w-full items-center justify-center bg-linear-to-r from-[#00CBA9] to-[#00A88A] hover:from-[#00A88A] hover:to-[#00CBA9] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-3 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Đặt Tour Ngay
                    </a>

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
                        href={zaloBookingUrl}
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
      <div className="md:hidden fixed bottom-[3.6rem] left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 z-40 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold leading-none text-[#FF6B35]">{formatPrice(tourData.price)}đ</span>
              {tourData.originalPrice > tourData.price && (
                <span className="text-[10px] leading-none text-gray-400 line-through">{formatPrice(tourData.originalPrice)}đ</span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] leading-none text-gray-500">Giá/khách</p>
          </div>
          <a
            href={zaloBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Đặt tour ${tourData.title} qua Zalo`}
            className="inline-flex items-center justify-center rounded-lg bg-linear-to-r from-[#00CBA9] to-[#00A88A] px-6 py-3 text-sm font-bold text-white shadow-md active:scale-95 transition-transform"
          >
            Đặt Tour
          </a>
        </div>
      </div>
    </div>
  )
}
