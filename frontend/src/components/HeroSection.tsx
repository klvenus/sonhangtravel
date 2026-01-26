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
  // Use admin slides if provided, otherwise use defaults
  const slides = bannerSlides && bannerSlides.length > 0 ? bannerSlides : defaultSlides
  
  // Chỉ lấy slide đầu tiên để hiển thị
  const mainSlide = slides[0]

  return (
    <section>
      {/* Mobile Hero */}
      <div className="md:hidden">
        <div className="relative h-44 overflow-hidden">
          {mainSlide.linkUrl ? (
            <a href={mainSlide.linkUrl} className="block w-full h-full">
              <Image
                src={mainSlide.image}
                alt="Banner tour du lịch Trung Quốc"
                fill
                className="object-cover"
                quality={100}
                priority
              />
            </a>
          ) : (
            <Image
              src={mainSlide.image}
              alt="Banner tour du lịch Trung Quốc"
              fill
              className="object-cover"
              quality={100}
              priority
            />
          )}
        </div>
      </div>

      {/* Desktop Hero */}
      <div className="hidden md:block">
        <div className="relative h-[450px] overflow-hidden">
          {mainSlide.linkUrl ? (
            <a href={mainSlide.linkUrl} className="block w-full h-full">
              <Image
                src={mainSlide.image}
                alt="Banner tour du lịch Trung Quốc"
                fill
                className="object-cover"
                quality={100}
                priority
              />
            </a>
          ) : (
            <Image
              src={mainSlide.image}
              alt="Banner tour du lịch Trung Quốc"
              fill
              className="object-cover"
              quality={100}
              priority
            />
          )}
        </div>
      </div>
    </section>
  )
}
