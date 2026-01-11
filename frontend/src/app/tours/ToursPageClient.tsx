'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import TourCard from '@/components/TourCard'
import { searchTours, Tour, getImageUrl } from '@/lib/strapi'

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TourData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Check URL params on mount
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setSearchQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setHasSearched(false)
      setSearchResults([])
      return
    }

    setIsSearching(true)
    setHasSearched(true)

    try {
      const response = await searchTours(query)
      const transformed = response.data.map((tour: Tour) => ({
        id: String(tour.id),
        title: tour.title,
        slug: tour.slug,
        image: getImageUrl(tour.thumbnail, 'medium'),
        gallery: tour.gallery?.map(img => getImageUrl(img, 'medium')).filter(Boolean) || [],
        location: tour.destination,
        duration: tour.duration,
        price: tour.price,
        originalPrice: tour.originalPrice,
        rating: tour.rating || 5,
        reviewCount: tour.reviewCount || 0,
        isHot: tour.featured,
        categorySlug: tour.category?.slug || null,
        category: tour.category?.ten || tour.category?.name,
      }))
      setSearchResults(transformed)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/tours?q=${encodeURIComponent(searchQuery)}`)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setHasSearched(false)
    setSearchResults([])
    router.push('/tours')
  }

  // Use search results if searching, otherwise use filtered tours
  const displayTours = hasSearched
    ? searchResults
    : (activeCategory
        ? initialTours.filter(tour => tour.categorySlug === activeCategory)
        : initialTours)

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
        {/* Search Box */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tour: Đông Hưng, Nam Ninh, Quế Lâm..."
              className="w-full px-4 py-3 pl-12 pr-24 rounded-lg border border-gray-300 focus:border-[#00CBA9] focus:ring-2 focus:ring-[#00CBA9]/20 outline-none transition-all text-base"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {hasSearched && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Xóa tìm kiếm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#00CBA9] text-white rounded-lg hover:bg-[#00B399] transition-colors"
            >
              Tìm
            </button>
          </form>
        </div>

        {/* Search Results Info */}
        {hasSearched && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold text-gray-900">{displayTours.length}</span> tour cho &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={clearSearch}
                className="text-[#00CBA9] hover:text-[#00B399] text-sm font-medium"
              >
                ← Quay lại tất cả tour
              </button>
            </div>
          </div>
        )}

        {/* Category Filter - HIDDEN: Category section is on homepage only */}
        {/* Uncomment below if you want to show category filter on tours page */}
        {/* {!hasSearched && (
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
        )} */}

        {/* Loading State */}
        {isSearching && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#00CBA9]"></div>
            <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Tours Grid */}
        {!isSearching && displayTours.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {displayTours.map((tour) => (
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
        ) : !isSearching ? (
          <div className="text-center py-12">
            {hasSearched ? (
              <>
                <svg
                  className="mx-auto w-16 h-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-600 text-lg mb-4">
                  Không tìm thấy tour phù hợp với &quot;{searchQuery}&quot;
                </p>
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 bg-[#00CBA9] text-white rounded-lg hover:bg-[#00B399] transition-colors"
                >
                  Xem tất cả tour
                </button>
              </>
            ) : (
              <>
                <p className="text-gray-500">Không có tour nào trong danh mục này</p>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-[#00CBA9] mt-2 inline-block hover:underline"
                >
                  Xem tất cả tour →
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
