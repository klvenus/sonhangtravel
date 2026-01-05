'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import TourCard from '@/components/TourCard'
import { getTours, getCategoryBySlug, getImageUrl, Tour, Category } from '@/lib/strapi'

export default function CategoryToursPage() {
  const params = useParams()
  const slug = params.slug as string

  const [tours, setTours] = useState<Tour[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (!slug) return

      try {
        console.log('Fetching category with slug:', slug)
        const [toursRes, categoryData] = await Promise.all([
          getTours({ category: slug, pageSize: 20 }),
          getCategoryBySlug(slug)
        ])
        console.log('Category data:', categoryData)
        console.log('Tours data:', toursRes.data)
        setTours(toursRes.data || [])
        setCategory(categoryData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CBA9]"></div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy danh mục</h1>
        <Link href="/tours" className="text-[#00CBA9] hover:underline">
          ← Quay lại danh sách tour
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 bg-[#00CBA9]">
        {category.image ? (
          <>
            <Image
              src={getImageUrl(category.image)}
              alt={category.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        ) : null}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom text-white">
            <Link href="/tours" className="text-white/80 hover:text-white text-sm mb-2 inline-block">
              ← Tất cả tour
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold">Tour {category.name}</h1>
            {category.description && (
              <p className="mt-2 text-white/80 max-w-2xl">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Results count */}
        <p className="text-gray-600 mb-4">
          Tìm thấy <span className="font-semibold text-[#00CBA9]">{tours.length}</span> tour
        </p>

        {/* Tours Grid */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {tours.map((tour) => (
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
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có tour nào</h3>
            <p className="text-gray-500 mb-4">Danh mục này đang được cập nhật</p>
            <Link 
              href="/tours" 
              className="inline-block bg-[#00CBA9] text-white px-6 py-2 rounded-full hover:bg-[#00A88A] transition-colors"
            >
              Xem tour khác
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
