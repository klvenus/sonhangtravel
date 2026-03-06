import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">🗺️</div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Không tìm thấy danh mục</h1>
      <p className="text-gray-600 mb-6">Danh mục bạn tìm kiếm không tồn tại</p>
      <Link 
        href="/tours" 
        className="bg-[#059669] text-white px-6 py-3 rounded-full hover:bg-[#047857] transition-colors"
      >
        ← Quay lại danh sách tour
      </Link>
    </div>
  )
}
