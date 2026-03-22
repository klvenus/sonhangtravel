import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedTours from '@/components/FeaturedTours'
import CategoryToursSection from '@/components/CategoryToursSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import { getCategories, getTours, getImageUrl, getSiteSettings, CategoryData, TourData, BannerSlide } from '@/lib/data'
import { Metadata } from 'next'

const SITE_URL = 'https://sonhangtravel.com'
const DEFAULT_OG_IMAGE = 'https://res.cloudinary.com/dzxntgoko/image/upload/v1772812681/sonhangtravel/pe1levewzcjvobldsvzr.jpg'

// ISR - Revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Tour Du Lịch Trung Quốc 2026 - Đông Hưng, Nam Ninh, Quế Lâm',
  description: 'Sơn Hằng Travel chuyên tour du lịch Trung Quốc từ Móng Cái: Đông Hưng 1-2 ngày, Nam Ninh, Quế Lâm, Trương Gia Giới. Lịch khởi hành đều, giá tốt, hỗ trợ nhanh.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Tour Du Lịch Trung Quốc 2026 | Sơn Hằng Travel',
    description: 'Danh mục tour Trung Quốc nổi bật từ Móng Cái: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới và nhiều hành trình bán chạy.',
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
    title: 'Tour Du Lịch Trung Quốc 2026 | Sơn Hằng Travel',
    description: 'Danh mục tour Trung Quốc nổi bật từ Móng Cái: Đông Hưng, Nam Ninh, Quế Lâm, Trương Gia Giới và nhiều hành trình bán chạy.',
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
    image: getImageUrl(slide.image, 'large') || DEFAULT_OG_IMAGE,
    imageMobile: slide.imageMobile ? getImageUrl(slide.imageMobile, 'large') : undefined,
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
      url: `${SITE_URL}/tour/${tour.slug}`,
      item: {
        '@type': 'TouristTrip',
        name: tour.title,
        url: `${SITE_URL}/tour/${tour.slug}`,
        image: tour.image || undefined,
        offers: {
          '@type': 'Offer',
          price: tour.price,
          priceCurrency: 'VND',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/tour/${tour.slug}`,
        },
      },
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
      getTours({ pageSize: 6, sort: 'bookingCount:desc', featured: true }),
      getTours({ pageSize: 50, sort: 'bookingCount:desc' }),
      getSiteSettings()
    ])
    
    if (categoriesData && categoriesData.length > 0) {
      categories = categoriesData.map(transformCategory)
    }
    
    const hasRealTourImage = (tour: TourData) => Boolean(tour.thumbnail || (tour.gallery && tour.gallery.length > 0))

    if (featuredToursData.data && featuredToursData.data.length > 0) {
      tours = featuredToursData.data
        .filter((tour) => tour.price > 0 && hasRealTourImage(tour))
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
