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
                unoptimized
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
              unoptimized
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
                unoptimized
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
              unoptimized
              priority
            />
          )}
        </div>
      </div>
    </section>
  )
}
