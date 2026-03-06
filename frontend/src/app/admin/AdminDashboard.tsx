'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface TourSummary { id: number; title: string; slug: string; price: number; featured: boolean; published: boolean; bookingCount: number; categoryName: string | null }
interface CategorySummary { id: number; name: string; tourCount: number }

export default function AdminDashboard() {
  const [tours, setTours] = useState<TourSummary[]>([])
  const [categories, setCategories] = useState<CategorySummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/tours').then(r => r.ok ? r.json() : []),
      fetch('/api/admin/categories').then(r => r.ok ? r.json() : []),
    ]).then(([t, c]) => { setTours(t); setCategories(c) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Đang tải...</div></div>

  const totalTours = tours.length
  const publishedTours = tours.filter(t => t.published).length
  const featuredTours = tours.filter(t => t.featured).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🗺️" label="Tổng tour" value={totalTours} color="blue" />
        <StatCard icon="✅" label="Đã đăng" value={publishedTours} color="green" />
        <StatCard icon="⭐" label="Nổi bật" value={featuredTours} color="yellow" />
        <StatCard icon="📁" label="Danh mục" value={categories.length} color="purple" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/tours/new" className="bg-green-600 text-white rounded-xl p-4 flex items-center gap-3 hover:bg-green-700 transition-colors">
          <span className="text-2xl">➕</span>
          <div><p className="font-semibold">Thêm tour mới</p><p className="text-sm text-green-100">Tạo tour du lịch mới</p></div>
        </Link>
        <Link href="/admin/categories" className="bg-purple-600 text-white rounded-xl p-4 flex items-center gap-3 hover:bg-purple-700 transition-colors">
          <span className="text-2xl">📁</span>
          <div><p className="font-semibold">Quản lý danh mục</p><p className="text-sm text-purple-100">Thêm, sửa, xóa danh mục</p></div>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Tour gần đây</h3>
          <Link href="/admin/tours" className="text-sm text-green-600 hover:underline">Xem tất cả →</Link>
        </div>
        <div className="divide-y">
          {tours.slice(0, 5).map(tour => (
            <Link key={tour.id} href={`/admin/tours/${tour.id}`} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 truncate">{tour.title}</p>
                <p className="text-sm text-gray-500">{tour.categoryName || 'Chưa phân loại'}</p>
              </div>
              <div className="text-right ml-4">
                <p className="font-semibold text-green-600">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</p>
                <div className="flex gap-1 justify-end mt-1">
                  {tour.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">⭐ Hot</span>}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${tour.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {tour.published ? '✅ Live' : '📝 Nháp'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {tours.length === 0 && <div className="p-8 text-center text-gray-500">Chưa có tour nào. <Link href="/admin/tours/new" className="text-green-600 hover:underline">Tạo tour đầu tiên →</Link></div>}
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  const colors: Record<string, string> = { blue: 'bg-blue-50 text-blue-600', green: 'bg-green-50 text-green-600', yellow: 'bg-yellow-50 text-yellow-600', purple: 'bg-purple-50 text-purple-600' }
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colors[color]} text-xl mb-2`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
