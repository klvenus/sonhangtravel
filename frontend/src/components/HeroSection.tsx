'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// Default banner when no admin slides configured
const defaultSlides = [
  {
    id: 1,
    title: 'Sơn Hằng Travel',
    subtitle: 'Tour Trung Quốc Uy Tín',
    image: 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772779153/Web_2250c7f598.png',
    linkText: 'Xem tour',
    linkUrl: '/tours',
  },
]

interface BannerSlide {
  id: number
  image: string
  imageMobile?: string
  title?: string
  subtitle?: string
  linkUrl?: string
  linkText?: string
}

interface SearchTour {
  id: string
  title: string
  slug: string
  image: string
  location: string
  duration: string
  price: number
}

interface HeroSectionProps {
  bannerSlides?: BannerSlide[]
  searchTours?: SearchTour[]
}

export default function HeroSection({ bannerSlides, searchTours = [] }: HeroSectionProps) {
  const slides = bannerSlides && bannerSlides.length > 0 ? bannerSlides : defaultSlides
  const [current, setCurrent] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  // Navigation arrows + dots (shared)
  const NavOverlay = () => (
    <>
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-lg z-10 transition-colors" aria-label="Slide trước">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-sm md:text-lg z-10 transition-colors" aria-label="Slide tiếp">›</button>
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'}`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </>
  )

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const liveResults = normalizedQuery
    ? searchTours.filter((tour) => {
        const haystack = [tour.title, tour.location, tour.duration].join(' ').toLowerCase()
        return haystack.includes(normalizedQuery)
      }).slice(0, 6)
    : []

  // Render a single slide image with link wrapper
  const SlideImg = ({ src, alt, priority, sizes }: { src: string; alt: string; priority: boolean; sizes: string }) => (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      quality={100}
      unoptimized
      priority={priority}
    />
  )

  return (
    <section>
      <div className="container-custom pt-4 pb-2">
        <div className="relative max-w-2xl">
          <div className="flex items-center bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm focus-within:border-[#059669] transition-colors">
            <svg className="w-5 h-5 text-gray-400 ml-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm tour, điểm đến..."
              className="flex-1 bg-transparent py-3 px-3 text-sm outline-none"
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Link href={searchQuery.trim() ? `/tours?search=${encodeURIComponent(searchQuery.trim())}` : '/tours'} className="bg-[#00CBA9] hover:bg-[#00A88A] text-white px-4 md:px-6 py-3 text-sm font-medium transition-colors">
              Tìm kiếm
            </Link>
          </div>

          {normalizedQuery && (
            <div className="absolute z-30 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
              {liveResults.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {liveResults.map((tour) => (
                    <Link key={tour.id} href={`/tour/${tour.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        <Image src={tour.image} alt={tour.title} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-semibold text-gray-900">{tour.title}</p>
                        <p className="line-clamp-1 text-xs text-gray-500">{tour.location} • {tour.duration}</p>
                        <p className="mt-1 text-sm font-bold text-[#FF6B35]">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</p>
                      </div>
                    </Link>
                  ))}
                  <Link href={`/tours?search=${encodeURIComponent(searchQuery.trim())}`} className="block px-4 py-3 text-sm font-medium text-[#059669] hover:bg-emerald-50">
                    Xem tất cả kết quả cho “{searchQuery.trim()}” →
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500">
                  Không tìm thấy tour nào cho “{searchQuery.trim()}”
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========== MOBILE: 9:16 → hiển thị ảnh mobile (hoặc fallback ảnh PC) ========== */}
      {/* Kích thước đề xuất: 1080×1920 (tỷ lệ 9:16) hoặc 1080×1350 (4:5) */}
      <div className="md:hidden relative h-[55vw] min-h-[200px] max-h-[280px] overflow-hidden">
        {slides.map((s, i) => {
          const mobileSrc = ('imageMobile' in s && s.imageMobile) ? s.imageMobile : s.image
          return (
            <div key={s.id || i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {s.linkUrl ? (
                <a href={s.linkUrl} className="block w-full h-full">
                  <SlideImg src={mobileSrc} alt={s.title || 'Banner'} priority={i === 0} sizes="100vw" />
                </a>
              ) : (
                <SlideImg src={mobileSrc} alt={s.title || 'Banner'} priority={i === 0} sizes="100vw" />
              )}
            </div>
          )
        })}
        <NavOverlay />
      </div>

      {/* ========== DESKTOP: hiển thị ảnh PC ========== */}
      {/* Kích thước đề xuất: 1920×500 (tỷ lệ ~3.84:1) hoặc 2560×680 */}
      <div className="hidden md:block relative h-[28vw] min-h-[350px] max-h-[550px] overflow-hidden">
        {slides.map((s, i) => (
          <div key={s.id || i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {s.linkUrl ? (
              <a href={s.linkUrl} className="block w-full h-full">
                <SlideImg src={s.image} alt={s.title || 'Banner'} priority={i === 0} sizes="100vw" />
              </a>
            ) : (
              <SlideImg src={s.image} alt={s.title || 'Banner'} priority={i === 0} sizes="100vw" />
            )}
          </div>
        ))}
        <NavOverlay />
      </div>
    </section>
  )
}
