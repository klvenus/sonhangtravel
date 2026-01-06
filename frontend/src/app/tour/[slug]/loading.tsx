export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Gallery Skeleton */}
      <div className="md:hidden">
        <div className="relative h-72 bg-gray-200 animate-pulse">
          <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <div className="w-10 h-10 bg-white/90 rounded-full"></div>
            <div className="w-10 h-10 bg-white/90 rounded-full"></div>
          </div>
        </div>
        <div className="flex gap-2 p-4 bg-white">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shrink-0 w-16 h-16 rounded-lg bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Desktop Gallery Skeleton */}
      <div className="hidden md:block container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-4 gap-3 h-[450px]">
          <div className="col-span-2 row-span-2 relative rounded-2xl bg-gray-200 animate-pulse"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative rounded-2xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="md:grid md:grid-cols-3 md:gap-10">
            {/* Left Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Title */}
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
              </div>

              {/* Mobile Price */}
              <div className="md:hidden h-24 bg-gray-100 rounded-2xl animate-pulse"></div>

              {/* Tabs */}
              <div className="h-14 bg-gray-100 rounded-2xl animate-pulse"></div>

              {/* Content Lines */}
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              </div>
            </div>

            {/* Right Sidebar - Desktop */}
            <div className="hidden md:block">
              <div className="sticky top-24">
                <div className="h-96 bg-gray-100 border-2 border-gray-200 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-white border-t-2 border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
          <div className="h-12 w-32 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
