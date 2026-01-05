'use client'

import { useState, useEffect } from 'react'

const quickFilters = [
  { label: '🔥 Hot', value: 'hot' },
  { label: '💰 Giá rẻ', value: 'cheap' },
  { label: '⭐ 5 sao', value: '5star' },
  { label: '🛍️ Mua sắm', value: 'shopping' },
]

const bannerSlides = [
  {
    id: 1,
    title: 'Tour Đông Hưng',
    subtitle: 'Chỉ từ 1.990.000đ',
    tag: 'HOT',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    buttonText: 'Đặt ngay',
    buttonLink: '/tours/dong-hung',
    gradient: 'from-orange-500/80 to-red-500/80',
  },
  {
    id: 2,
    title: 'Tour Nam Ninh',
    subtitle: 'Thiên đường mua sắm',
    tag: 'SALE 30%',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80',
    buttonText: 'Khám phá',
    buttonLink: '/tours/nam-ninh',
    gradient: 'from-blue-500/80 to-purple-500/80',
  },
  {
    id: 3,
    title: 'Tour Thượng Hải',
    subtitle: 'Thành phố không ngủ',
    tag: 'MỚI',
    image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    buttonText: 'Xem tour',
    buttonLink: '/tours/thuong-hai',
    gradient: 'from-emerald-500/80 to-teal-500/80',
  },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section>
      {/* Mobile Hero - Klook Style */}
      <div className="md:hidden">
        {/* Banner Carousel */}
        <div className="relative h-44 overflow-hidden">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-500 ${
                index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
              </div>
              
              <div className="relative h-full flex flex-col justify-center px-4 text-white">
                <span className="inline-block bg-white/20 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded mb-2 w-fit">
                  {slide.tag}
                </span>
                <h2 className="text-2xl font-bold mb-1">{slide.title}</h2>
                <p className="text-white/90 text-sm mb-3">{slide.subtitle}</p>
                <a
                  href={slide.buttonLink}
                  className="inline-flex items-center gap-1 bg-white text-gray-800 text-sm font-semibold px-4 py-2 rounded-full w-fit active:scale-95 transition-transform"
                >
                  {slide.buttonText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block">
        {/* Banner Slider */}
        <div className="relative h-[450px] overflow-hidden">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
                <span className="bg-[#00CBA9] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                  {slide.tag}
                </span>
                <h1 className="text-5xl font-bold mb-3">{slide.title}</h1>
                <p className="text-xl text-white/90 mb-6">{slide.subtitle}</p>
                <a
                  href={slide.buttonLink}
                  className="bg-white text-gray-800 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {slide.buttonText}
                </a>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
