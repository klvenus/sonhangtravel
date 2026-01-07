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
  category?: string
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
  category,
  variant = 'vertical',
}: TourCardProps) {
  const formatPrice = (p: number) => {
    return new Intl.NumberFormat('vi-VN').format(p)
  }

  const discountPercent = originalPrice && originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0

  // Horizontal Card - Klook mobile style
  if (variant === 'horizontal') {
    return (
      <Link href={`/tour/${slug}`} className="block">
        <div className="flex bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-200">
          {/* Image */}
          <div className="relative w-32 h-32 shrink-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              sizes="128px"
            />
            {/* Hot/New badges */}
            {(isHot || discountPercent > 0) && (
              <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                {isHot && (
                  <span className="bg-linear-to-r from-[#FF6B35] to-[#FF8555] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    🔥 HOT
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    -{discountPercent}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            {/* Location tag */}
            <div>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span className="truncate">{location}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 text-[13px] line-clamp-2 leading-tight mb-1.5">
                {title}
              </h3>
              
              <div className="flex items-center gap-1 text-gray-500 text-[11px] mb-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{duration}</span>
              </div>
            </div>
            
            {/* Bottom section */}
            <div className="flex items-end justify-between gap-2">
              {/* Rating */}
              <div className="flex items-center gap-0.5">
                <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
                <span className="text-xs font-semibold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400">({reviewCount})</span>
              </div>
              
              {/* Price */}
              <div className="text-right">
                {originalPrice && originalPrice > price && (
                  <div className="text-[10px] text-gray-400 line-through leading-tight">
                    đ{formatPrice(originalPrice)}
                  </div>
                )}
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[10px] text-gray-500">đ</span>
                  <span className="text-[#FF6B35] font-bold text-sm leading-tight">
                    {formatPrice(price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Vertical Card - Klook style
  return (
    <Link href={`/tour/${slug}`} className="block h-full group">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* Wishlist button - top right */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-1">
          {/* Category & Location tag - Klook style */}
          <div className="text-xs text-gray-500 mb-1 truncate">
            {category && <span className="text-[#FF5722]">{category}</span>}
            {category && location && <span className="mx-1">•</span>}
            <span>{location}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1.5 min-h-10">
            {title}
          </h3>

          {/* Rating - Klook style */}
          <div className="flex items-center gap-1 mb-2">
            <svg className="w-3.5 h-3.5 text-[#FF5722] fill-current" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span className="text-sm font-medium text-[#FF5722]">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({formatPrice(reviewCount)})</span>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Price Section - Klook style */}
          <div className="mt-auto space-y-1.5">
            {/* Main price */}
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500">Từ</span>
              <span className="text-gray-900 font-bold text-lg">
                {formatPrice(price)}
              </span>
              <span className="text-gray-900 font-bold text-lg">đ</span>
            </div>
            
            {/* Sale tag - Klook style button */}
            {discountPercent > 0 && (
              <div className="inline-flex items-center border border-[#FF5722] rounded-sm overflow-hidden">
                <span className="text-[11px] text-[#FF5722] font-medium px-2 py-0.5">
                  Sale
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] text-white font-medium bg-[#FF5722] pl-3 pr-2 py-0.5 -ml-1" style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 8px 100%, 0 50%)' }}>
                  <span>◇</span>
                  Giảm {discountPercent}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
