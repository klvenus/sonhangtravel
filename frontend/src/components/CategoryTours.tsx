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
}

interface CategoryData {
  id: number
  name: string
  slug: string
  image: string
  tourCount: number
  icon: string
}

interface Props {
  initialCategories?: CategoryData[]
}

export default function CategoryTours({ initialCategories }: Props) {
  // Component này cần fetch tours riêng - giữ đơn giản, không hiển thị nếu không có data
  if (!initialCategories || initialCategories.length === 0) {
    return null
  }

  // Tạm thời không hiện section này vì cần fetch thêm tours per category
  // Sẽ được cải thiện sau
  return null
}
