import HeroSection from '@/components/HeroSection'
import CategorySection from '@/components/CategorySection'
import FeaturedTours from '@/components/FeaturedTours'
import CategoryToursSection from '@/components/CategoryToursSection'
import WhyChooseUs from '@/components/WhyChooseUs'
import { getCategories, getTours, getImageUrl, getSiteSettings, Category, Tour, BannerSlide } from '@/lib/strapi'

// Disable cache temporarily - fetch fresh data every request
export const dynamic = 'force-dynamic'
export const revalidate = 0

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
  // Get gallery images
  const galleryImages = tour.gallery?.map(img => getImageUrl(img, 'medium')).filter(Boolean) || []
  
  return {
    id: String(tour.id),
    title: tour.title,
    slug: tour.slug,
    image: getImageUrl(tour.thumbnail, 'medium'),
    gallery: galleryImages,
    location: tour.destination,
    duration: tour.duration,
    price: tour.price,
    originalPrice: tour.originalPrice,
    rating: tour.rating || 5,
    reviewCount: tour.reviewCount || 0,
    isHot: tour.featured,
    isNew: false,
    category: tour.category?.ten || tour.category?.name || undefined,
    categorySlug: tour.category?.slug || undefined,
  }
}

function transformBannerSlide(slide: BannerSlide) {
  return {
    id: slide.id,
    image: getImageUrl(slide.image, 'large'),
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
      bannerSlides = siteSettings.bannerSlides.map(transformBannerSlide)
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
  }

  // Group tours by category
  const toursByCategory = categories.map(cat => ({
    category: cat,
    tours: allTours.filter(tour => tour.categorySlug === cat.slug)
  })).filter(group => group.tours.length > 0)

  // FAQ Schema for Google AI - General travel questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Tour du lịch Trung Quốc giá bao nhiêu?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tour du lịch Trung Quốc từ Móng Cái giá từ 1.199.000đ/người (tour 1 ngày) đến 5.499.000đ/người (tour 4-5 ngày). Giá đã bao gồm xe, visa, hướng dẫn viên, bữa ăn và vé tham quan."
        }
      },
      {
        "@type": "Question",
        "name": "Đi tour Trung Quốc cần giấy tờ gì?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cần: CCCD còn hạn + 2 ảnh 4x6 nền trắng (người lớn), Giấy khai sinh + ảnh 4x6 (trẻ em). Gửi trước 3 ngày để làm visa cửa khẩu. Không cần hộ chiếu nếu đi tour qua Móng Cái."
        }
      },
      {
        "@type": "Question",
        "name": "Tour Đông Hưng 1 ngày có gì?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tour Đông Hưng 1 ngày từ Móng Cái: Thăm chợ Đông Hưng, mua sắm hàng Trung Quốc, ẩm thực địa phương. Giá 1.199.000đ gồm xe + visa + ăn trưa + HDV."
        }
      },
      {
        "@type": "Question",
        "name": "Sơn Hằng Travel là công ty gì?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sơn Hằng Travel là đơn vị chuyên tour du lịch Trung Quốc từ Móng Cái. Với 10+ năm kinh nghiệm, 5000+ khách hàng hài lòng. Hotline: 0918.638.068."
        }
      },
      {
        "@type": "Question",
        "name": "Cách đặt tour du lịch Trung Quốc?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Đặt tour dễ dàng qua: 1. Zalo 0918.638.068 (nhanh nhất), 2. Gọi hotline 0918.638.068, 3. Website sonhangtravel.com. Cọc 50% để giữ chỗ, thanh toán nốt trước ngày đi."
        }
      }
    ]
  }

  // Organization Schema với rating
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Sơn Hằng Travel",
    "alternateName": "Sơn Hằng Travel - Tour Trung Quốc Móng Cái",
    "url": "https://sonhangtravel.com",
    "logo": "https://sonhangtravel.com/logo.png",
    "description": "Công ty du lịch chuyên tour Trung Quốc từ Móng Cái. Tour Đông Hưng, Nam Ninh, Quế Lâm, Bắc Kinh chất lượng, giá tốt.",
    "telephone": "+84918638068",
    "email": "sonhangtravel@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Móng Cái",
      "addressRegion": "Quảng Ninh",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 21.5295,
      "longitude": 107.9678
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "07:00",
      "closes": "22:00"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "reviewCount": 500,
      "bestRating": 5,
      "worstRating": 1
    },
    "priceRange": "₫₫"
  }

  return (
    <main>
      {/* FAQ Schema for Google AI */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <HeroSection bannerSlides={bannerSlides.length > 0 ? bannerSlides : undefined} />
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
