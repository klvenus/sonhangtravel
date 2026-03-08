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

  const prev = useCallback(() => {
    setCurrent(prev => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [slides.length, next])

  const slide = slides[current]

  const SlideImage = ({ height }: { height: string }) => (
    <div className={`relative ${height} overflow-hidden`}>
      {/* All slides for smooth transition */}
      {slides.map((s, i) => (
        <div key={s.id || i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {s.linkUrl ? (
            <a href={s.linkUrl} className="block w-full h-full">
              <Image
                src={s.image}
                alt={s.title || 'Banner tour du lịch Trung Quốc'}
                fill
                className="object-cover"
                quality={100}
                unoptimized
                priority={i === 0}
              />
            </a>
          ) : (
            <Image
              src={s.image}
              alt={s.title || 'Banner tour du lịch Trung Quốc'}
              fill
              className="object-cover"
              quality={100}
              unoptimized
              priority={i === 0}
            />
          )}
        </div>
      ))}

      {/* Nav arrows - only show if multiple slides */}
      {slides.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm z-10 transition-colors" aria-label="Slide trước">‹</button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm z-10 transition-colors" aria-label="Slide tiếp">›</button>
        </>
      )}

      {/* Dots indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'}`}
              aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <section>
      {/* Mobile Hero */}
      <div className="md:hidden">
        <SlideImage height="h-44" />
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block">
        <SlideImage height="h-[450px]" />
      </div>
    </section>
  )
}
