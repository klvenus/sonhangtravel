'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TourCard from '@/components/TourCard'

interface TourData {
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
  categorySlug: string | null
  category?: string
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get('search') || ''
  const categoryFromUrl = searchParams.get('category') || null

  const [activeCategory, setActiveCategory] = useState<string | null>(categoryFromUrl)
  const [searchQuery, setSearchQuery] = useState(searchFromUrl)

  // Sync with URL params
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '')
    setActiveCategory(searchParams.get('category') || null)
  }, [searchParams])

  const updateUrl = (nextSearch: string, nextCategory: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextSearch.trim()) params.set('search', nextSearch.trim())
    else params.delete('search')

    if (nextCategory) params.set('category', nextCategory)
    else params.delete('category')

    const qs = params.toString()
    router.replace(qs ? `/tours?${qs}` : '/tours', { scroll: false })
  }

  const normalizedQuery = searchQuery.toLowerCase().trim()

  // Filter by category + search
  const filteredTours = useMemo(() => {
    return initialTours.filter(tour => {
      const matchCategory = !activeCategory || tour.categorySlug === activeCategory
      const matchSearch = !normalizedQuery ||
        tour.title.toLowerCase().includes(normalizedQuery) ||
        tour.location.toLowerCase().includes(normalizedQuery) ||
        (tour.category && tour.category.toLowerCase().includes(normalizedQuery))
      return matchCategory && matchSearch
    })
  }, [activeCategory, initialTours, normalizedQuery])

  const activeCateg = initialCategories.find(cat => cat.slug === activeCategory)
  const pageTitle = searchQuery
    ? `Kết quả tìm kiếm: "${searchQuery}"`
    : activeCateg ? `Tour ${activeCateg.name}` : 'Tất Cả Tour Du Lịch'
  const pageDescription = searchQuery
    ? `Tìm thấy ${filteredTours.length} tour phù hợp`
    : activeCateg
      ? `Khám phá những địa điểm du lịch hấp dẫn tại ${activeCateg.name}`
      : 'Khám phá các tour du lịch Trung Quốc hấp dẫn'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#059669] text-white py-8">
        <div className="container-custom">
          <h1 className="text-2xl md:text-3xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-white/80">{pageDescription}</p>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Search bar */}
        <div className="mb-5">
          <div className="flex items-center bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:border-[#059669] transition-colors max-w-lg">
            <svg className="w-5 h-5 text-gray-400 ml-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm tour, điểm đến..."
              className="flex-1 bg-transparent py-3 px-3 text-sm outline-none"
              value={searchQuery}
              onChange={(e) => {
                const nextValue = e.target.value
                setSearchQuery(nextValue)
                updateUrl(nextValue, activeCategory)
              }}
            />
            {searchQuery && (
              <button onClick={() => {
                setSearchQuery('')
                updateUrl('', activeCategory)
              }} className="px-3 text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Điểm đến</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => {
                setActiveCategory(null)
                updateUrl(searchQuery, null)
              }}
              className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !activeCategory
                  ? 'bg-[#059669] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#059669] hover:text-[#059669]'
              }`}
            >
              Tất cả
            </button>
            {initialCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.slug)
                  updateUrl(searchQuery, cat.slug)
                }}
                className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-[#059669] text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#059669] hover:text-[#059669]'
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
            <p className="text-gray-500">
              {searchQuery ? `Không tìm thấy tour nào cho "${searchQuery}"` : 'Không có tour nào trong danh mục này'}
            </p>
            <button onClick={() => { setSearchQuery(''); setActiveCategory(null); updateUrl('', null) }} className="text-[#059669] mt-2 inline-block hover:underline">
              Xem tất cả tour →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
