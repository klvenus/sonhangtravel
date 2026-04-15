'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

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

interface HeroSectionProps {
  bannerSlides?: BannerSlide[]
}

export default function HeroSection({ bannerSlides }: HeroSectionProps) {
  const slides = bannerSlides && bannerSlides.length > 0 ? bannerSlides : defaultSlides
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % slides.length)
  }, [slides.length])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  // Navigation dots only
  const NavOverlay = () => (
    <>
      {slides.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'}`}
              aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}
    </>
  )

  // Render a single slide image with link wrapper
  const SlideImg = ({ src, alt, priority, sizes, fit = 'cover' }: { src: string; alt: string; priority: boolean; sizes: string; fit?: 'cover' | 'contain' }) => (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={fit === 'contain' ? 'object-contain' : 'object-cover'}
      quality={100}
      unoptimized
      priority={priority}
      fetchPriority={priority ? 'high' : undefined}
      loading={priority ? 'eager' : 'lazy'}
    />
  )

  return (
    <section>
      {/* ========== MOBILE: ưu tiên ảnh mobile full chiều rộng, hạn chế crop ========== */}
      {/* Kích thước đề xuất: 1080×600, 1080×1350 hoặc ảnh ngang tối ưu cho mobile */}
      <div className="md:hidden relative aspect-[9/5] w-full min-h-[220px] overflow-hidden bg-white">
        {(() => {
          const activeSlide = slides[current]
          const mobileSrc = ('imageMobile' in activeSlide && activeSlide.imageMobile) ? activeSlide.imageMobile : activeSlide.image
          return (
            <div key={`${activeSlide.id || current}-${current}`} className="absolute inset-0 transition-opacity duration-700 opacity-100">
              {activeSlide.linkUrl ? (
                <a href={activeSlide.linkUrl} className="block w-full h-full">
                  <SlideImg src={mobileSrc} alt={activeSlide.title || 'Banner'} priority={current === 0} sizes="100vw" fit="contain" />
                </a>
              ) : (
                <SlideImg src={mobileSrc} alt={activeSlide.title || 'Banner'} priority={current === 0} sizes="100vw" fit="contain" />
              )}
            </div>
          )
        })()}
        <NavOverlay />
      </div>

      {/* ========== DESKTOP: hiển thị ảnh PC ========== */}
      {/* Kích thước đề xuất: 1920×500 (tỷ lệ ~3.84:1) hoặc 2560×680 */}
      <div className="hidden md:block relative h-[28vw] min-h-[350px] max-h-[550px] overflow-hidden">
        {(() => {
          const activeSlide = slides[current]
          return (
            <div key={`${activeSlide.id || current}-${current}`} className="absolute inset-0 transition-opacity duration-700 opacity-100">
              {activeSlide.linkUrl ? (
                <a href={activeSlide.linkUrl} className="block w-full h-full">
                  <SlideImg src={activeSlide.image} alt={activeSlide.title || 'Banner'} priority={current === 0} sizes="100vw" />
                </a>
              ) : (
                <SlideImg src={activeSlide.image} alt={activeSlide.title || 'Banner'} priority={current === 0} sizes="100vw" />
              )}
            </div>
          )
        })()}
        <NavOverlay />
      </div>
    </section>
  )
}
