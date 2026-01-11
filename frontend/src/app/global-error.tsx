'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đã có lỗi nghiêm trọng xảy ra
            </h1>
            <p className="text-gray-600 mb-8">
              Xin lỗi, ứng dụng đang gặp sự cố. Vui lòng tải lại trang.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-4 justify-center">
              <button
                onClick={reset}
                className="px-6 py-3 bg-[#00CBA9] text-white rounded-lg font-medium hover:bg-[#00B399] transition-colors"
              >
                Tải lại trang
              </button>
              <a
                href="/"
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-block"
              >
                Về trang chủ
              </a>
            </div>

            {/* Support Contact */}
            <div className="mt-8 text-sm text-gray-500">
              <p>Nếu lỗi vẫn tiếp tục, vui lòng liên hệ:</p>
              <a
                href="tel:0123456789"
                className="text-[#00CBA9] hover:underline"
              >
                Hotline: 0123 456 789
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
