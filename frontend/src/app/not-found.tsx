import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#00CBA9]/5 to-white">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-[#00CBA9] mb-4">404</div>
          <div className="mx-auto w-32 h-32 bg-[#00CBA9]/10 rounded-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[#00CBA9]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Không tìm thấy trang
        </h1>
        <p className="text-gray-600 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#00CBA9] text-white rounded-lg font-medium hover:bg-[#00B399] transition-colors"
          >
            Về trang chủ
          </Link>
          <Link
            href="/tours"
            className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Xem tour du lịch
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12">
          <p className="text-sm text-gray-500 mb-4">Có thể bạn đang tìm:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/tours" className="text-sm text-[#00CBA9] hover:underline">
              Tất cả tour
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/#featured" className="text-sm text-[#00CBA9] hover:underline">
              Tour nổi bật
            </Link>
            <span className="text-gray-300">•</span>
            <a href="tel:0123456789" className="text-sm text-[#00CBA9] hover:underline">
              Liên hệ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
