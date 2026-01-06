import Image from 'next/image'
import Link from 'next/link'

interface TourCardProps {
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
  variant?: 'vertical' | 'horizontal'
}

export default function TourCard({
  id,
  title,
  slug,
  image,
  location,
  duration,
  price,
  originalPrice,
  rating,
  reviewCount,
  isHot,
  isNew,
  variant = 'vertical',
}: TourCardProps) {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN').format(p)
  }

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // Mobile Horizontal Card
  if (variant === 'horizontal') {
    return (
      <Link href={`/tour/${slug}`}>
        <div className="flex bg-white rounded-xl overflow-hidden shadow-sm active:shadow-md transition-shadow">
          {/* Image */}
          <div className="relative w-28 h-28 shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
            {discountPercent > 0 && (
              <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{duration}</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xs">★</span>
                  <span className="text-xs font-medium text-gray-700">{rating}</span>
                  <span className="text-xs text-gray-400">({reviewCount})</span>
                </div>
              </div>
              <div className="text-right">
                {originalPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    {formatPrice(originalPrice)}đ
                  </div>
                )}
                <div className="text-[#FF6B35] font-bold text-sm">
                  {formatPrice(price)}đ
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Mobile Vertical Card - Klook Style
  return (
    <Link href={`/tour/${slug}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm md:shadow-md md:hover:shadow-lg transition-shadow">
        {/* Image Container */}
        <div className="relative aspect-[4/3] md:h-44 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover md:group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Desktop Badges */}
          <div className="hidden md:flex absolute top-2 left-2 flex-col gap-1">
            {isHot && (
              <span className="bg-[#FF6B35] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                🔥 HOT
              </span>
            )}
            {isNew && (
              <span className="bg-[#00CBA9] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                MỚI
              </span>
            )}
          </div>

          {/* Desktop Wishlist */}
          <button className="hidden md:flex absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full items-center justify-center active:scale-95 transition-transform">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Desktop Duration Badge */}
          <div className="hidden md:block absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm">
            {duration}
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 md:p-3">
          {/* Category/Location Tag - Mobile */}
          <div className="text-[11px] text-gray-500 mb-1 truncate">
            {location} • {duration}
          </div>

          {/* Title */}
          <h3 className="font-medium text-gray-800 text-[13px] md:text-sm leading-snug line-clamp-2 mb-1.5 md:mb-2 min-h-[2.25rem] md:min-h-[2.5rem]">
            {title}
          </h3>

          {/* Rating - Klook style */}
          <div className="flex items-center gap-1 mb-1.5 md:mb-2">
            <span className="text-orange-500 text-xs">★</span>
            <span className="text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({formatPrice(reviewCount)})</span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-gray-500 text-[11px]">Từ đ</span>
            <span className="text-gray-900 font-bold text-sm md:text-base">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-gray-400 text-[11px] line-through">
                đ {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {/* Sale Badge - Bottom */}
          {discountPercent > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[#FF6B35] text-[10px] font-medium border border-[#FF6B35] px-1.5 py-0.5 rounded">
                Sale
              </span>
              <span className="text-[#FF6B35] text-[10px] bg-[#FFF5F2] px-1.5 py-0.5 rounded">
                Giảm {discountPercent}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
