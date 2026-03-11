import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedTours from '@/components/FeaturedTours'
import CategoryToursSection from '@/components/CategoryToursSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import { getCategories, getTours, getImageUrl, getSiteSettings, CategoryData, TourData, BannerSlide } from '@/lib/data'

// ISR - Revalidate every hour
export const revalidate = 3600

// Transform functions
function transformCategory(cat: CategoryData) {
  return {
    id: cat.id,
    name: cat.name || 'Danh mục',
    slug: cat.slug,
    image: getImageUrl(cat.image, 'medium') || `https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&q=80`,
    tourCount: cat.tourCount || 0,
    icon: cat.icon || '🏯',
  }
}

function transformTour(tour: TourData) {
  const galleryImages = (tour.gallery || []).map(img => getImageUrl(img, 'medium')).filter(Boolean)

  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    image: getImageUrl(tour.thumbnail, 'medium'),
    gallery: galleryImages,
    location: tour.destination,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice || undefined,
    rating: Number(tour.rating || 5),
    reviewCount: tour.reviewCount || 0,
    isHot: Boolean(tour.featured),
    isNew: false,
    category: tour.categoryName || undefined,
    categorySlug: tour.categorySlug || undefined,
  }
}

function transformBannerSlide(slide: BannerSlide, index: number) {
  return {
    id: index + 1,
    image: getImageUrl(slide.image, 'large'),
    imageMobile: slide.imageMobile ? getImageUrl(slide.imageMobile, 'large') : undefined,
    title: slide.title,
    subtitle: slide.subtitle,
    linkUrl: slide.linkUrl,
    linkText: slide.linkText,
  }
}

export default async function Home() {
  // Fetch data on server
  let categories: ReturnType<typeof transformCategory>[] = []
  let tours: ReturnType<typeof transformTour>[] = []
  let allTours: ReturnType<typeof transformTour>[] = []
  let bannerSlides: ReturnType<typeof transformBannerSlide>[] = []

  try {
    const [categoriesData, featuredToursData, allToursData, siteSettings] = await Promise.all([
      getCategories(),
      getTours({ pageSize: 6, sort: 'bookingCount:desc', featured: true }),
      getTours({ pageSize: 50, sort: 'bookingCount:desc' }),
      getSiteSettings()
    ])
    
    if (categoriesData && categoriesData.length > 0) {
      categories = categoriesData.map(transformCategory)
    }
    
    if (featuredToursData.data && featuredToursData.data.length > 0) {
      tours = featuredToursData.data.map(transformTour)
    }
    
    if (allToursData.data && allToursData.data.length > 0) {
      allTours = allToursData.data.map(transformTour)
    }

    // Extract banner slides from site settings
    if (siteSettings?.bannerSlides && siteSettings.bannerSlides.length > 0) {
      bannerSlides = siteSettings.bannerSlides.map((slide, index) => transformBannerSlide(slide, index))
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
  }

  // Group tours by category
  const toursByCategory = categories.map(cat => ({
    category: cat,
    tours: allTours.filter(tour => tour.categorySlug === cat.slug)
  })).filter(group => group.tours.length > 0)

  return (
    <main>
      <HeroSection bannerSlides={bannerSlides.length > 0 ? bannerSlides : undefined} searchTours={allTours} />
      <CategorySection initialCategories={categories} />
      <FeaturedTours initialTours={tours} />
      {toursByCategory.map(group => (
        <CategoryToursSection 
          key={group.category.slug}
          categoryName={group.category.name}
          categorySlug={group.category.slug}
          tours={group.tours}
        />
      ))}
      <WhyChooseUs />
    </main>
  )
}
