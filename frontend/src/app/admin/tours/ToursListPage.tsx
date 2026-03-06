'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Tour { id: number; title: string; slug: string; price: number; destination: string; duration: string; featured: boolean; published: boolean; thumbnail: string | null; categoryName: string | null; bookingCount: number; reviewCount: number }

export default function ToursListPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/tours')
      .then(r => { if (r.status === 401) { router.push('/admin'); return [] }; return r.ok ? r.json() : [] })
      .then(setTours).finally(() => setLoading(false))
  }, [router])

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Xóa tour "${title}"?`)) return
    const res = await fetch(`/api/admin/tours/${id}`, { method: 'DELETE' })
    if (res.ok) setTours(prev => prev.filter(t => t.id !== id))
  }

  async function toggleField(id: number, field: 'published' | 'featured', current: boolean) {
    const res = await fetch(`/api/admin/tours/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: !current }) })
    if (res.ok) setTours(prev => prev.map(t => t.id === id ? { ...t, [field]: !current } : t))
  }

  if (loading) return <div className="flex justify-center p-8"><span className="text-gray-500">Đang tải...</span></div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">{tours.length} tour</p>
        <Link href="/admin/tours/new" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">➕ Thêm tour</Link>
      </div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Tour</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tours.map(tour => (
                <tr key={tour.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {tour.thumbnail && <img src={tour.thumbnail} alt="" className="w-12 h-9 rounded object-cover bg-gray-100" />}
                      <div className="min-w-0"><p className="font-medium text-gray-900 truncate max-w-xs">{tour.title}</p><p className="text-xs text-gray-500">{tour.duration} • {tour.destination}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{tour.categoryName || '—'}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleField(tour.id, 'published', tour.published)} className={`text-xs px-2 py-1 rounded font-medium ${tour.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{tour.published ? '✅ Live' : '📝 Nháp'}</button>
                      <button onClick={() => toggleField(tour.id, 'featured', tour.featured)} className={`text-xs px-2 py-1 rounded font-medium ${tour.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{tour.featured ? '⭐ Hot' : '☆'}</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/tours/${tour.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">✏️ Sửa</Link>
                      <button onClick={() => handleDelete(tour.id, tour.title)} className="text-red-500 hover:text-red-700 text-sm font-medium">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="md:hidden divide-y">
          {tours.map(tour => (
            <div key={tour.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{tour.title}</p>
                  <p className="text-sm text-gray-500">{tour.duration} • {tour.destination}</p>
                  <p className="text-sm font-semibold text-green-600 mt-1">{new Intl.NumberFormat('vi-VN').format(tour.price)}đ</p>
                </div>
                <div className="flex gap-1">
                  {tour.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">⭐</span>}
                  <span className={`text-xs px-1.5 py-0.5 rounded ${tour.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{tour.published ? '✅' : '📝'}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <Link href={`/admin/tours/${tour.id}`} className="text-blue-600 text-sm font-medium">✏️ Sửa</Link>
                <button onClick={() => toggleField(tour.id, 'published', tour.published)} className="text-gray-600 text-sm">{tour.published ? '📝 Ẩn' : '✅ Đăng'}</button>
                <button onClick={() => handleDelete(tour.id, tour.title)} className="text-red-500 text-sm">🗑️ Xóa</button>
              </div>
            </div>
          ))}
        </div>
        {tours.length === 0 && <div className="p-8 text-center text-gray-500">Chưa có tour nào</div>}
      </div>
    </div>
  )
}
