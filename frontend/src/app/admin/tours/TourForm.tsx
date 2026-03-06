'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category { id: number; name: string }
interface ItineraryItem { time?: string; title: string; description?: string; image?: string }
interface DepartureDate { date: string; price?: number; availableSlots: number; status: 'available' | 'almost_full' | 'full' }

interface TourData {
  title: string; slug: string; shortDescription: string; content: string
  price: number; originalPrice: number | null; duration: string; departure: string
  destination: string; transportation: string; groupSize: string
  thumbnail: string; gallery: string[]; itinerary: ItineraryItem[]
  includes: string[]; excludes: string[]; notes: string[]; policy: string
  categoryId: number | null; featured: boolean; published: boolean
  rating: string; reviewCount: number; bookingCount: number; departureDates: DepartureDate[]
}

const defaultData: TourData = {
  title: '', slug: '', shortDescription: '', content: '',
  price: 0, originalPrice: null, duration: '', departure: 'Móng Cái',
  destination: '', transportation: '', groupSize: '',
  thumbnail: '', gallery: [], itinerary: [],
  includes: [], excludes: [], notes: [], policy: '',
  categoryId: null, featured: false, published: true,
  rating: '5.0', reviewCount: 0, bookingCount: 0, departureDates: [],
}

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function TourForm({ tourId }: { tourId?: string }) {
  const router = useRouter()
  const [data, setData] = useState<TourData>(defaultData)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(!!tourId)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'detail' | 'media' | 'itinerary' | 'extra'>('basic')

  useEffect(() => {
    fetch('/api/admin/categories').then(r => r.ok ? r.json() : []).then(setCategories)
  }, [])

  useEffect(() => {
    if (!tourId) return
    fetch(`/api/admin/tours/${tourId}`)
      .then(r => { if (r.status === 401) { router.push('/admin'); return null }; return r.ok ? r.json() : null })
      .then(d => {
        if (d) setData({
          title: d.title || '', slug: d.slug || '', shortDescription: d.shortDescription || '',
          content: d.content || '', price: d.price || 0, originalPrice: d.originalPrice || null,
          duration: d.duration || '', departure: d.departure || 'Móng Cái', destination: d.destination || '',
          transportation: d.transportation || '', groupSize: d.groupSize || '',
          thumbnail: d.thumbnail || '', gallery: d.gallery || [], itinerary: d.itinerary || [],
          includes: d.includes || [], excludes: d.excludes || [], notes: d.notes || [],
          policy: d.policy || '', categoryId: d.categoryId || null,
          featured: d.featured || false, published: d.published !== false,
          rating: d.rating || '5.0', reviewCount: d.reviewCount || 0,
          bookingCount: d.bookingCount || 0, departureDates: d.departureDates || [],
        })
      }).finally(() => setLoading(false))
  }, [tourId, router])

  const set = useCallback((field: keyof TourData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleTitleChange = (title: string) => {
    setData(prev => ({
      ...prev,
      title,
      slug: !tourId ? slugify(title) : prev.slug,
    }))
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (!res.ok) return null
      const result = await res.json()
      return result.url
    } catch {
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) set('thumbnail', url)
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i])
      if (url) setData(prev => ({ ...prev, gallery: [...prev.gallery, url] }))
    }
  }

  async function handleSave() {
    if (!data.title.trim()) return alert('Vui lòng nhập tiêu đề tour')
    if (!data.price) return alert('Vui lòng nhập giá tour')
    if (!data.destination.trim()) return alert('Vui lòng nhập điểm đến')
    if (!data.duration.trim()) return alert('Vui lòng nhập thời gian')

    setSaving(true)
    try {
      const url = tourId ? `/api/admin/tours/${tourId}` : '/api/admin/tours'
      const method = tourId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push('/admin/tours')
        router.refresh()
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Lỗi khi lưu tour')
      }
    } catch {
      alert('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  // --- List helpers ---
  function addListItem(field: 'includes' | 'excludes' | 'notes') {
    setData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }))
  }
  function updateListItem(field: 'includes' | 'excludes' | 'notes', index: number, value: string) {
    setData(prev => {
      const arr = [...(prev[field] as string[])]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }
  function removeListItem(field: 'includes' | 'excludes' | 'notes', index: number) {
    setData(prev => ({ ...prev, [field]: (prev[field] as string[]).filter((_, i) => i !== index) }))
  }

  // --- Itinerary helpers ---
  function addItinerary() {
    setData(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', title: '', description: '' }] }))
  }
  function updateItinerary(index: number, field: keyof ItineraryItem, value: string) {
    setData(prev => {
      const arr = [...prev.itinerary]
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, itinerary: arr }
    })
  }
  function removeItinerary(index: number) {
    setData(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== index) }))
  }

  // --- Departure dates helpers ---
  function addDepartureDate() {
    setData(prev => ({ ...prev, departureDates: [...prev.departureDates, { date: '', availableSlots: 20, status: 'available' as const }] }))
  }
  function updateDepartureDate(index: number, field: keyof DepartureDate, value: unknown) {
    setData(prev => {
      const arr = [...prev.departureDates]
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, departureDates: arr }
    })
  }
  function removeDepartureDate(index: number) {
    setData(prev => ({ ...prev, departureDates: prev.departureDates.filter((_, i) => i !== index) }))
  }

  if (loading) return <div className="flex justify-center p-8"><span className="text-gray-500">Đang tải...</span></div>

  const tabs = [
    { id: 'basic' as const, label: '📝 Thông tin cơ bản' },
    { id: 'detail' as const, label: '📋 Chi tiết' },
    { id: 'media' as const, label: '🖼️ Hình ảnh' },
    { id: 'itinerary' as const, label: '🗓️ Lịch trình' },
    { id: 'extra' as const, label: '📦 Bổ sung' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.push('/admin/tours')} className="text-sm text-gray-500 hover:text-gray-700 mb-1">← Quay lại danh sách</button>
          <h1 className="text-xl font-bold text-gray-900">{tourId ? 'Chỉnh sửa tour' : 'Tạo tour mới'}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => set('published', !data.published)} className={`px-3 py-2 rounded-lg text-sm font-medium ${data.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {data.published ? '✅ Đã đăng' : '📝 Nháp'}
          </button>
          <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
            {saving ? '⏳ Đang lưu...' : tourId ? '💾 Cập nhật' : '✅ Tạo tour'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Basic */}
      {activeTab === 'basic' && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề tour *</label>
            <input type="text" value={data.title} onChange={e => handleTitleChange(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="VD: Tour Đông Hưng 1 Ngày" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" value={data.slug} onChange={e => set('slug', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="tour-dong-hung-1-ngay" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn *</label>
            <textarea value={data.shortDescription} onChange={e => set('shortDescription', e.target.value)} rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Mô tả ngắn gọn về tour..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
              <input type="number" value={data.price || ''} onChange={e => set('price', Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="500000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (nếu giảm giá)</label>
              <input type="number" value={data.originalPrice || ''} onChange={e => set('originalPrice', e.target.value ? Number(e.target.value) : null)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="700000" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select value={data.categoryId || ''} onChange={e => set('categoryId', e.target.value ? Number(e.target.value) : null)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                <option value="">— Chọn danh mục —</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-4 pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 rounded text-green-600 focus:ring-green-500" />
                <span className="text-sm font-medium text-gray-700">⭐ Tour nổi bật</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Detail */}
      {activeTab === 'detail' && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian *</label>
              <input type="text" value={data.duration} onChange={e => set('duration', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="1 ngày" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm khởi hành</label>
              <input type="text" value={data.departure} onChange={e => set('departure', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Móng Cái" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Điểm đến *</label>
              <input type="text" value={data.destination} onChange={e => set('destination', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Đông Hưng, Trung Quốc" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phương tiện</label>
              <input type="text" value={data.transportation} onChange={e => set('transportation', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Xe du lịch" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô nhóm</label>
              <input type="text" value={data.groupSize} onChange={e => set('groupSize', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="15-45 người" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đánh giá</label>
              <input type="number" step="0.1" min="0" max="5" value={data.rating} onChange={e => set('rating', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lượt đánh giá</label>
              <input type="number" value={data.reviewCount} onChange={e => set('reviewCount', Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lượt đặt</label>
              <input type="number" value={data.bookingCount} onChange={e => set('bookingCount', Number(e.target.value))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết (HTML)</label>
            <textarea value={data.content} onChange={e => set('content', e.target.value)} rows={10}
              className="w-full border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="<h2>Giới thiệu...</h2>" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách tour</label>
            <textarea value={data.policy} onChange={e => set('policy', e.target.value)} rows={5}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Chính sách hủy tour, đổi lịch..." />
          </div>
        </div>
      )}

      {/* Tab: Media */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
            <div className="flex items-start gap-4">
              {data.thumbnail ? (
                <div className="relative w-40 h-28 rounded-lg overflow-hidden bg-gray-100 group">
                  <Image src={data.thumbnail} alt="Thumbnail" fill className="object-cover" />
                  <button onClick={() => set('thumbnail', '')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ) : (
                <div className="w-40 h-28 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Chưa có ảnh
                </div>
              )}
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  {uploading ? '⏳ Đang upload...' : '📤 Upload ảnh'}
                  <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" disabled={uploading} />
                </label>
                <p className="text-xs text-gray-400 mt-1">Hoặc nhập URL bên dưới</p>
                <input type="text" value={data.thumbnail} onChange={e => set('thumbnail', e.target.value)}
                  className="mt-1 w-64 border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bộ sưu tập ({data.gallery.length} ảnh)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              {data.gallery.map((url, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 group">
                  <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                  <button onClick={() => setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, j) => j !== i) }))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              ))}
              <label className="aspect-[4/3] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 cursor-pointer transition-colors">
                <span className="text-2xl">+</span>
                <span className="text-xs mt-1">{uploading ? 'Đang upload...' : 'Thêm ảnh'}</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Itinerary */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Lịch trình ({data.itinerary.length} mục)</label>
              <button onClick={addItinerary} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">➕ Thêm mục</button>
            </div>
            {data.itinerary.map((item, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Mục {i + 1}</span>
                  <button onClick={() => removeItinerary(i)} className="text-red-500 hover:text-red-700 text-sm">🗑️ Xóa</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Thời gian</label>
                    <input type="text" value={item.time || ''} onChange={e => updateItinerary(i, 'time', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="08:00" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs text-gray-500 mb-1">Tiêu đề *</label>
                    <input type="text" value={item.title} onChange={e => updateItinerary(i, 'title', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Khởi hành từ Móng Cái" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                  <textarea value={item.description || ''} onChange={e => updateItinerary(i, 'description', e.target.value)} rows={2}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Chi tiết hoạt động..." />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL hình ảnh</label>
                  <input type="text" value={item.image || ''} onChange={e => updateItinerary(i, 'image', e.target.value)}
                    className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://..." />
                </div>
              </div>
            ))}
            {data.itinerary.length === 0 && <p className="text-center text-gray-400 py-4">Chưa có mục lịch trình nào</p>}
          </div>

          {/* Departure dates */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Ngày khởi hành ({data.departureDates.length})</label>
              <button onClick={addDepartureDate} className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">➕ Thêm ngày</button>
            </div>
            {data.departureDates.map((dd, i) => (
              <div key={i} className="border rounded-lg p-3 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Ngày</label>
                    <input type="date" value={dd.date} onChange={e => updateDepartureDate(i, 'date', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Giá (tuỳ chọn)</label>
                    <input type="number" value={dd.price || ''} onChange={e => updateDepartureDate(i, 'price', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Chỗ trống</label>
                    <input type="number" value={dd.availableSlots} onChange={e => updateDepartureDate(i, 'availableSlots', Number(e.target.value))}
                      className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Trạng thái</label>
                    <select value={dd.status} onChange={e => updateDepartureDate(i, 'status', e.target.value)}
                      className="w-full border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                      <option value="available">Còn chỗ</option>
                      <option value="almost_full">Sắp hết</option>
                      <option value="full">Hết chỗ</option>
                    </select>
                  </div>
                  <div>
                    <button onClick={() => removeDepartureDate(i)} className="text-red-500 hover:text-red-700 text-sm w-full py-1.5">🗑️ Xóa</button>
                  </div>
                </div>
              </div>
            ))}
            {data.departureDates.length === 0 && <p className="text-center text-gray-400 py-2 text-sm">Chưa có ngày khởi hành</p>}
          </div>
        </div>
      )}

      {/* Tab: Extra (includes/excludes/notes) */}
      {activeTab === 'extra' && (
        <div className="space-y-4">
          {/* Includes */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">✅ Bao gồm ({data.includes.length})</label>
              <button onClick={() => addListItem('includes')} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-200">➕ Thêm</button>
            </div>
            {data.includes.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-green-500 text-sm">✅</span>
                <input type="text" value={item} onChange={e => updateListItem('includes', i, e.target.value)}
                  className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="VD: Xe đưa đón" />
                <button onClick={() => removeListItem('includes', i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ))}
          </div>

          {/* Excludes */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">❌ Không bao gồm ({data.excludes.length})</label>
              <button onClick={() => addListItem('excludes')} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-200">➕ Thêm</button>
            </div>
            {data.excludes.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-red-500 text-sm">❌</span>
                <input type="text" value={item} onChange={e => updateListItem('excludes', i, e.target.value)}
                  className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="VD: Chi phí cá nhân" />
                <button onClick={() => removeListItem('excludes', i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">📌 Lưu ý ({data.notes.length})</label>
              <button onClick={() => addListItem('notes')} className="bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-200">➕ Thêm</button>
            </div>
            {data.notes.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-yellow-500 text-sm">📌</span>
                <input type="text" value={item} onChange={e => updateListItem('notes', i, e.target.value)}
                  className="flex-1 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="VD: Mang theo hộ chiếu còn hạn" />
                <button onClick={() => removeListItem('notes', i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
