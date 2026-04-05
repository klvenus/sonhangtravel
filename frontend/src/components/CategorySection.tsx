'use client'

import Link from 'next/link'
import Image from 'next/image'

// Category type for component
interface CategoryData {
  id: number
  name: string
  slug: string
  image: string
  tourCount: number
  icon: string
}

// No fallback - only show real data from database

interface Props {
  initialCategories?: CategoryData[]
}

export default function CategorySection({ initialCategories }: Props) {
  const displayCategories = initialCategories && initialCategories.length > 0 
    ? initialCategories 
    : []

  // Don't render section if no categories
  if (displayCategories.length === 0) {
    return null
  }

  return (
    <section className="py-4 md:py-8 bg-white md:bg-gray-50">
      {/* Mobile Version - Klook style */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-base font-bold text-gray-800">Bạn muốn đi đâu chơi?</h2>
          <Link href="/tours" className="text-[#059669] text-sm font-medium">
            Xem thêm
          </Link>
        </div>

        {/* Horizontal scroll with pill style */}
        <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/tours/${category.slug}`}
              className="shrink-0 flex items-center gap-2 pl-1 pr-4 py-1 bg-gray-100 rounded-full active:bg-gray-200 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Bạn muốn đi đâu chơi?</h2>
          <p className="text-gray-600 mt-2">Khám phá những địa điểm du lịch hấp dẫn tại Trung Quốc</p>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              href={`/tours/${category.slug}`}
              className="group"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg mb-1">{category.name}</h3>
                  <p className="text-white/80 text-sm">{category.tourCount} tours</p>
                </div>

                <div className="absolute inset-0 bg-[#059669]/0 group-hover:bg-[#059669]/20 transition-colors"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center mt-8">
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
