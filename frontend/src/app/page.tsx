import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedTours from '@/components/FeaturedTours'
import CategoryTours from '@/components/CategoryTours'
import WhyChooseUs from '@/components/WhyChooseUs'
import { getCategories, getTours, getImageUrl, Category, Tour } from '@/lib/strapi'

// ISR - Revalidate every hour
export const revalidate = 3600

// Transform functions
function transformCategory(cat: Category) {
  const tourCount = Array.isArray(cat.tours) ? cat.tours.length : 0
  const categoryName = cat.ten || cat.name || 'Danh mục'
  return {
    id: cat.id,
    name: categoryName,
    slug: cat.slug,
    image: getImageUrl(cat.image, 'medium') || `https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=80`,
    tourCount: tourCount,
    icon: cat.icon || '🏯',
  }
}

function transformTour(tour: Tour) {
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

export default async function Home() {
  // Fetch data on server
  let categories: ReturnType<typeof transformCategory>[] = []
  let tours: ReturnType<typeof transformTour>[] = []

  try {
    const [categoriesData, toursData] = await Promise.all([
      getCategories(),
      getTours({ pageSize: 6, sort: 'bookingCount:desc' })
    ])
    
    if (categoriesData && categoriesData.length > 0) {
      categories = categoriesData.map(transformCategory)
    }
    
    if (toursData.data && toursData.data.length > 0) {
      tours = toursData.data.map(transformTour)
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
  }

  return (
    <main>
      <HeroSection />
      <CategorySection initialCategories={categories} />
      <FeaturedTours initialTours={tours} />
      <CategoryTours initialCategories={categories} />
      <WhyChooseUs />
    </main>
  )
}
