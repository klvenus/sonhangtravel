'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TourCard from '@/components/TourCard'
import { searchTours, Tour } from '@/lib/strapi'

interface SearchResultsProps {
  initialQuery?: string
}

export default function SearchResults({ initialQuery = '' }: SearchResultsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery || searchParams.get('q') || '')
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setSearched(true)

    try {
      const response = await searchTours(searchQuery)
      const transformedTours = response.data.map((tour: Tour) => ({
        id: String(tour.id),
        title: tour.title,
        slug: tour.slug,
        image: tour.thumbnail?.url?.startsWith('http')
          ? tour.thumbnail.url
          : `${process.env.NEXT_PUBLIC_STRAPI_URL}${tour.thumbnail?.url}`,
        location: tour.destination,
        duration: tour.duration,
        price: tour.price,
        originalPrice: tour.originalPrice,
        rating: tour.rating || 5,
        reviewCount: tour.reviewCount || 0,
        isHot: tour.featured,
      }))
      setTours(transformedTours)
    } catch (error) {
      console.error('Search error:', error)
      setTours([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      performSearch(q)
    }
  }, [searchParams, performSearch])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    router.push(`/tours?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tour: Đông Hưng, Nam Ninh, Quế Lâm..."
            className="w-full px-4 py-3 pl-12 pr-4 rounded-lg border border-gray-300 focus:border-[#00CBA9] focus:ring-2 focus:ring-[#00CBA9]/20 outline-none transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#00CBA9] text-white rounded-lg hover:bg-[#00B399] transition-colors"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Results */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#00CBA9]"></div>
          <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
        </div>
      )}

      {!loading && searched && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Kết quả tìm kiếm: &quot;{query}&quot;
            </h2>
            <p className="text-gray-600 mt-1">
              Tìm thấy {tours.length} tour
            </p>
          </div>

          {tours.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tours.map((tour) => (
                <TourCard key={tour.id} {...tour} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-600 mb-6">
                Không tìm thấy tour phù hợp với từ khóa &quot;{query}&quot;
              </p>
              <button
                onClick={() => router.push('/tours')}
                className="px-6 py-3 bg-[#00CBA9] text-white rounded-lg hover:bg-[#00B399] transition-colors"
              >
                Xem tất cả tour
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !searched && (
        <div className="text-center py-12">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tìm kiếm tour du lịch
          </h3>
          <p className="text-gray-600">
            Nhập từ khóa để tìm kiếm tour mong muốn
          </p>
        </div>
      )}
    </div>
  )
}
