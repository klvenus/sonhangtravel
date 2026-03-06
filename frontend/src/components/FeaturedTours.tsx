'use client'

import TourCard from './TourCard'
import Link from 'next/link'

// Tour type for component
interface TourCardData {
  id: string
  title: string
  slug: string
  image: string
  gallery?: string[]
  location: string
  duration: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  isHot?: boolean
  isNew?: boolean
  category?: string
}

// No fallback - only show real data from database

interface Props {
  initialTours?: TourCardData[]
}

export default function FeaturedTours({ initialTours }: Props) {
  const displayTours = initialTours && initialTours.length > 0 
    ? initialTours 
    : []

  // Don't render section if no tours
  if (displayTours.length === 0) {
    return null
  }

  return (
    <section className="py-4 md:py-8">
      {/* Mobile Version */}
      <div className="md:hidden">
        {/* Section Header */}
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-lg font-bold text-gray-800">Tour Nổi Bật</h2>
          <Link href="/tours" className="text-[#059669] text-sm font-medium">
            Xem tất cả →
          </Link>
        </div>

        {/* Horizontal Scroll Cards */}
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
          {displayTours.slice(0, 6).map((tour) => (
            <div key={tour.id} className="shrink-0 w-40">
              <TourCard {...tour} />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="px-4 mt-4">
          <Link
            href="/tours"
            className="block w-full py-3 text-center text-gray-700 font-medium border border-gray-300 rounded-full active:bg-gray-100"
          >
            Xem tất cả
          </Link>
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block container-custom">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tour Nổi Bật</h2>
            <p className="text-gray-600 mt-1">Những tour được yêu thích nhất</p>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {displayTours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>

        {/* View More */}
        <div className="mt-8 text-center">
          <Link
            href="/tours"
            className="inline-block px-12 py-3 border border-gray-300 text-gray-700 font-medium rounded-full hover:border-[#059669] hover:text-[#059669] transition-colors"
          >
            Xem tất cả
          </Link>
        </div>
      </div>
    </section>
  )
}
