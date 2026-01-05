'use client'

import { useState, useEffect } from 'react'
import TourCard from './TourCard'
import Link from 'next/link'
import { getTours, getCategories, getImageUrl, Tour, Category } from '@/lib/strapi'

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
}

interface CategoryWithTours {
  id: number
  name: string
  slug: string
  tours: TourCardData[]
}

function transformTour(tour: Tour): TourCardData {
  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    image: getImageUrl(tour.thumbnail, 'medium'),
    location: tour.destination,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice,
    rating: tour.rating || 5,
    reviewCount: tour.reviewCount || 0,
    isHot: tour.featured,
    isNew: false,
  }
}

export default function CategoryTours() {
  const [categoryTours, setCategoryTours] = useState<CategoryWithTours[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Lấy danh sách categories
        const categories = await getCategories()
        if (!categories || categories.length === 0) {
          setLoading(false)
          return
        }

        // Lấy tours cho mỗi category
        const categoryToursData: CategoryWithTours[] = []
        
        for (const cat of categories.slice(0, 4)) { // Giới hạn 4 categories
          const toursRes = await getTours({
            pageSize: 4,
            category: cat.slug,
          })
          
          if (toursRes.data && toursRes.data.length > 0) {
            categoryToursData.push({
              id: cat.id,
              name: cat.ten || cat.name || 'Danh mục',
              slug: cat.slug,
              tours: toursRes.data.map(transformTour),
            })
          }
        }

        setCategoryTours(categoryToursData)
      } catch (error) {
        console.error('Error fetching category tours:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || categoryTours.length === 0) {
    return null
  }

  return (
    <>
      {categoryTours.map((category) => (
        <section key={category.id} className="py-4 md:py-8 bg-white">
          {/* Mobile Version */}
          <div className="md:hidden">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-base font-bold text-gray-800">Tour {category.name}</h2>
              <Link href={`/tours/${category.slug}`} className="text-[#00CBA9] text-sm font-medium">
                Xem thêm
              </Link>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2">
              {category.tours.map((tour) => (
                <div key={tour.id} className="shrink-0 w-40">
                  <TourCard {...tour} />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Version */}
          <div className="hidden md:block container-custom">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Tour {category.name}</h2>
              </div>
              <Link
                href={`/tours/${category.slug}`}
                className="text-[#00CBA9] font-medium hover:underline"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {category.tours.map((tour) => (
                <TourCard key={tour.id} {...tour} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
