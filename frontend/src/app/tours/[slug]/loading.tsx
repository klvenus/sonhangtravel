export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner skeleton */}
      <div className="relative h-48 md:h-64 bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom">
            <div className="h-6 bg-white/30 rounded w-32 mb-4"></div>
            <div className="h-10 bg-white/40 rounded w-64"></div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Loading text */}
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00CBA9] mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải tour...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
