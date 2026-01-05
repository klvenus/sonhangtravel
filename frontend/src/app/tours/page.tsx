'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import TourCard from '@/components/TourCard'
import { getTours, getCategories, getImageUrl, Tour, Category } from '@/lib/strapi'

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [toursRes, categoriesData] = await Promise.all([
          getTours({ pageSize: 20 }),
          getCategories()
        ])
        setTours(toursRes.data || [])
        setCategories(categoriesData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredTours = activeCategory
    ? tours.filter(tour => tour.category?.slug === activeCategory)
    : tours

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CBA9]"></div>
      </div>
    )
  }

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
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-[#00CBA9] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#00CBA9] hover:text-[#00CBA9]'
                }`}
              >
                {cat.ten || cat.name}
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
                id={String(tour.id)}
                title={tour.title}
                slug={tour.slug}
                image={getImageUrl(tour.thumbnail, 'medium')}
                location={tour.destination}
                duration={tour.duration}
                price={tour.price}
                originalPrice={tour.originalPrice}
                rating={tour.rating || 5}
                reviewCount={tour.reviewCount || 0}
                isHot={tour.featured}
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
