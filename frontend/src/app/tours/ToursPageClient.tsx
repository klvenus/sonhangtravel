'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import TourCard from '@/components/TourCard'

const SEARCH_STOP_WORDS = ['tour', 'du', 'lịch', 'du lịch', 'combo', 'gia', 'giá', 're', 'rẻ', 'di', 'đi', 'den', 'đến']

function normalizeVietnamese(text: string) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
}

function tokenizeSearch(text: string) {
  return normalizeVietnamese(text)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean)
    .filter((token) => !SEARCH_STOP_WORDS.includes(token))
}

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
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || null
    setSearchQuery(search)
    setActiveCategory(category)
  }, [searchParams])

  const queryTokens = tokenizeSearch(searchQuery)
  const filteredTours = initialTours.filter((tour) => {
    const matchCategory = !activeCategory || tour.categorySlug === activeCategory
    if (!matchCategory) return false

    if (searchQuery.trim() === '') return true

    const searchable = normalizeVietnamese([tour.title, tour.location, tour.category || ''].join(' '))
    return queryTokens.length > 0 && queryTokens.every((token) => searchable.includes(token))
  })

  const activeCateg = initialCategories.find(cat => cat.slug === activeCategory)
  const pageTitle = searchQuery
    ? `Kết quả tìm kiếm: "${searchQuery}"`
    : activeCateg ? `Tour ${activeCateg.name}` : 'Tour Du Lịch Trung Quốc'
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{pageTitle}</h1>
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
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="px-3 text-gray-400 hover:text-gray-600">
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
              onClick={() => setActiveCategory(null)}
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
                onClick={() => setActiveCategory(cat.slug)}
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
            <button onClick={() => { setSearchQuery(''); setActiveCategory(null) }} className="text-[#059669] mt-2 inline-block hover:underline">
              Xem tất cả tour →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
