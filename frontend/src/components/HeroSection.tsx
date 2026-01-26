'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const quickFilters = [
  { label: '🔥 Hot', value: 'hot' },
  { label: '💰 Giá rẻ', value: 'cheap' },
  { label: '⭐ 5 sao', value: '5star' },
  { label: '🛍️ Mua sắm', value: 'shopping' },
]

// Default slides - fallback when no admin slides
const defaultSlides = [
  {
    id: 1,
    title: 'Tour Đông Hưng',
    subtitle: 'Chỉ từ 1.990.000đ',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80',
    linkText: 'Đặt ngay',
    linkUrl: '/tours/dong-hung',
  },
  {
    id: 2,
    title: 'Tour Nam Ninh',
    subtitle: 'Thiên đường mua sắm',
    image: 'https://images.unsplash.com/photo-1537531383496-f4749b8032cf?w=800&q=80',
    linkText: 'Khám phá',
    linkUrl: '/tours/nam-ninh',
  },
  {
    id: 3,
    title: 'Tour Thượng Hải',
    subtitle: 'Thành phố không ngủ',
    image: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=800&q=80',
    linkText: 'Xem tour',
    linkUrl: '/tours/thuong-hai',
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

  return (
    <section>
      {/* Mobile & Desktop: Hiển thị từng ảnh banner, nếu có linkUrl thì bọc bằng <a> */}
      <div className="w-full">
        <div className="flex overflow-x-auto gap-2 md:gap-4">
          {slides.map((slide) => (
            slide.linkUrl ? (
              <a
                key={slide.id}
                href={slide.linkUrl}
                className="block min-w-full md:min-w-[600px] h-44 md:h-[450px] relative rounded-2xl overflow-hidden group"
                target="_blank" rel="noopener noreferrer"
              >
                <Image
                  src={slide.image}
                  alt="Banner tour du lịch Trung Quốc"
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </a>
            ) : (
              <div
                key={slide.id}
                className="min-w-full md:min-w-[600px] h-44 md:h-[450px] relative rounded-2xl overflow-hidden"
              >
                <Image
                  src={slide.image}
                  alt="Banner tour du lịch Trung Quốc"
                  fill
                  className="object-cover w-full h-full"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                />
              </div>
            )
          ))}
        </div>
      </div>
    </section>
  )
}
