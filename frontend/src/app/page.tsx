import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedTours from '@/components/FeaturedTours'
import CategoryToursSection from '@/components/CategoryToursSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import { getCategories, getTours, getImageUrl, getSiteSettings, CategoryData, TourData, BannerSlide } from '@/lib/data'
import { Metadata } from 'next'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'
const HOME_CATEGORY_PRIORITY = ['dong hung', 'nam ninh', 'con minh', 'ha khau']

// ISR - Revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Tour du lịch Trung Quốc | Đông Hưng, Hà Khẩu, Nam Ninh, Vân Nam',
  description: 'Sơn Hằng Travel chuyên tour Trung Quốc từ Móng Cái và Lào Cai: Đông Hưng, Hà Khẩu, Nam Ninh, Côn Minh, Đại Lý và nhiều tuyến Vân Nam đang bán.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Tour du lịch Trung Quốc | Sơn Hằng Travel',
    description: 'Danh mục tour Trung Quốc đang bán tại Sơn Hằng Travel: Đông Hưng, Hà Khẩu, Nam Ninh, Côn Minh, Đại Lý, Thành Đô và nhiều hành trình nổi bật khác.',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Tour du lịch Trung Quốc | Sơn Hằng Travel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tour du lịch Trung Quốc | Sơn Hằng Travel',
    description: 'Danh mục tour Trung Quốc đang bán tại Sơn Hằng Travel: Đông Hưng, Hà Khẩu, Nam Ninh, Côn Minh, Đại Lý, Thành Đô và nhiều hành trình nổi bật khác.',
    images: [DEFAULT_OG_IMAGE],
  },
}

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

function normalizeCategoryKey(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[-_]+/g, ' ')
    .toLowerCase()
}

function getHomeCategoryPriority(category: { name?: string | null; slug?: string | null }) {
  const key = normalizeCategoryKey(`${category.slug || ''} ${category.name || ''}`)
  const priority = HOME_CATEGORY_PRIORITY.findIndex((item) => key.includes(item))
  return priority === -1 ? HOME_CATEGORY_PRIORITY.length : priority
}

function sortHomeCategories(categoryList: CategoryData[]) {
  return categoryList
    .map((category, index) => ({
      category,
      index,
      priority: getHomeCategoryPriority(category),
    }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)
    .map((item) => item.category)
}

function sortHomeFeaturedTours(tourList: TourData[]) {
  return tourList
    .map((tour, index) => ({
      tour,
      index,
      priority: getHomeCategoryPriority({ name: tour.categoryName, slug: tour.categorySlug }),
    }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)
    .map((item) => item.tour)
}

function transformTour(tour: TourData) {
  const galleryImages = (tour.gallery || []).map(img => getImageUrl(img, 'medium')).filter(Boolean)
  const primaryImage = getImageUrl(tour.thumbnail || tour.gallery?.[0], 'medium') || DEFAULT_OG_IMAGE

  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    image: primaryImage,
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
    image: getImageUrl(slide.image, 'hero') || DEFAULT_OG_IMAGE,
    imageMobile: slide.imageMobile ? getImageUrl(slide.imageMobile, 'hero') : undefined,
    title: slide.title,
    subtitle: slide.subtitle,
    linkUrl: slide.linkUrl,
    linkText: slide.linkText,
  }
}

function buildTourItemListSchema(
  tours: Array<ReturnType<typeof transformTour>>,
  name: string,
  id: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': id,
    name,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tour.title,
      url: `${SITE_URL}/tour/${tour.slug}`,
      image: tour.image || undefined,
    })),
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
      getTours({ pageSize: 200, sort: 'bookingCount:desc', featured: true }),
      getTours({ pageSize: 50, sort: 'bookingCount:desc' }),
      getSiteSettings()
    ])
    
    if (categoriesData && categoriesData.length > 0) {
      categories = sortHomeCategories(categoriesData).map(transformCategory)
    }
    
    const hasRealTourImage = (tour: TourData) => Boolean(tour.thumbnail || (tour.gallery && tour.gallery.length > 0))

    if (featuredToursData.data && featuredToursData.data.length > 0) {
      tours = sortHomeFeaturedTours(
        featuredToursData.data.filter((tour) => tour.price > 0 && hasRealTourImage(tour))
      )
        .map(transformTour)
    }
    
    if (allToursData.data && allToursData.data.length > 0) {
      allTours = allToursData.data
        .filter((tour) => tour.price > 0 && hasRealTourImage(tour))
        .map(transformTour)
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

  const featuredToursSchema = tours.length > 0
    ? buildTourItemListSchema(
        tours,
        'Danh sách tour nổi bật Sơn Hằng Travel',
        `${SITE_URL}/#featured-tours`
      )
    : null

  return (
    <main>
      {featuredToursSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredToursSchema) }}
        />
      )}
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
