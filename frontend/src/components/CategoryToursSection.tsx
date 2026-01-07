'use client'

import TourCard from './TourCard'
import Link from 'next/link'

interface TourCardData {
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
  isNew?: boolean
  category?: string
  categorySlug?: string
}

interface Props {
  categoryName: string
  categorySlug: string
  tours: TourCardData[]
}

export default function CategoryToursSection({ categoryName, categorySlug, tours }: Props) {
  if (!tours || tours.length === 0) {
    return null
  }

  return (
    <section className="py-4 md:py-8">
      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Section Header */}
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-gray-800">Tour {categoryName}</h2>
          <Link href={`/tours?category=${categorySlug}`} className="text-[#FF5722] text-sm font-medium">
            Xem tất cả →
          </Link>
        </div>

        {/* Grid 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {tours.slice(0, 4).map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block container-custom">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tour {categoryName}</h2>
            <p className="text-gray-600 mt-1">Khám phá các tour du lịch {categoryName}</p>
          </div>
          <Link
            href={`/tours?category=${categorySlug}`}
            className="text-[#FF5722] font-medium hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.slice(0, 4).map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>
      </div>
    </section>
  )
}
