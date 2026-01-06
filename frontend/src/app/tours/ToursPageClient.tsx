'use client'

import { useState } from 'react'
import Link from 'next/link'
import TourCard from '@/components/TourCard'

interface TourData {
  id: string
  title: string
  slug: string
  image: string
  location: string
  duration: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  isHot?: boolean
  categorySlug: string | null
}

interface CategoryData {
  id: number
  name: string
  slug: string
}

interface Props {
  initialTours: TourData[]
  initialCategories: CategoryData[]
}

export default function ToursPageClient({ initialTours, initialCategories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredTours = activeCategory
    ? initialTours.filter(tour => tour.categorySlug === activeCategory)
    : initialTours

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#00CBA9] text-white py-8">
        <div className="container-custom">
          <h1 className="text-2xl md:text-3xl font-bold">Tất Cả Tour Du Lịch</h1>
          <p className="mt-2 text-white/80">Khám phá các tour du lịch Trung Quốc hấp dẫn</p>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Điểm đến</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-[#00CBA9] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00CBA9] hover:text-[#00CBA9]'
              }`}
            >
              Tất cả
            </button>
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-[#00CBA9] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00CBA9] hover:text-[#00CBA9]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                id={tour.id}
                title={tour.title}
                slug={tour.slug}
                image={tour.image}
                location={tour.location}
                duration={tour.duration}
                price={tour.price}
                originalPrice={tour.originalPrice}
                rating={tour.rating}
                reviewCount={tour.reviewCount}
                isHot={tour.isHot}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có tour nào trong danh mục này</p>
            <Link href="/tours" className="text-[#00CBA9] mt-2 inline-block">
              Xem tất cả tour →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
