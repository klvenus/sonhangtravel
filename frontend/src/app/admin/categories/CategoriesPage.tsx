'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category {
  id: number; name: string; slug: string; description: string
  icon: string; image: string; order: number; tourCount: number
}

const defaultCategory = { name: '', slug: '', description: '', icon: '🏯', image: '', order: 0 }

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<number | 'new' | null>(null)
  const [form, setForm] = useState(defaultCategory)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => { if (r.status === 401) { router.push('/admin'); return [] }; return r.ok ? r.json() : [] })
      .then(setCategories).finally(() => setLoading(false))
  }, [router])

  function startEdit(cat: Category) {
    setEditing(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '🏯', image: cat.image || '', order: cat.order || 0 })
  }

  function startNew() {
    setEditing('new')
    setForm(defaultCategory)
  }

  function cancel() {
    setEditing(null)
    setForm(defaultCategory)
  }

  function handleNameChange(name: string) {
    setForm(prev => ({ ...prev, name, slug: editing === 'new' ? slugify(name) : prev.slug }))
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) setForm(prev => ({ ...prev, image: url }))
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('Vui lòng nhập tên danh mục')
    setSaving(true)
    try {
      if (editing === 'new') {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const newCat = await res.json()
          setCategories(prev => [...prev, { ...newCat, tourCount: 0 }])
          cancel()
        } else {
          alert('Lỗi khi tạo danh mục')
        }
      } else if (typeof editing === 'number') {
        const res = await fetch(`/api/admin/categories/${editing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (res.ok) {
          const updated = await res.json()
          setCategories(prev => prev.map(c => c.id === editing ? { ...c, ...updated } : c))
          cancel()
        } else {
          alert('Lỗi khi cập nhật danh mục')
        }
      }
    } catch {
      alert('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, name: string, tourCount: number) {
    if (tourCount > 0) return alert(`Không thể xóa "${name}" vì đang có ${tourCount} tour liên kết`)
    if (!confirm(`Xóa danh mục "${name}"?`)) return
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id))
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error || 'Lỗi khi xóa')
    }
  }

  if (loading) return <div className="flex justify-center p-8"><span className="text-gray-500">Đang tải...</span></div>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-500">{categories.length} danh mục</p>
        {editing === null && (
          <button onClick={startNew} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
            ➕ Thêm danh mục
          </button>
        )}
      </div>

      {editing !== null && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">{editing === 'new' ? 'Tạo danh mục mới' : 'Chỉnh sửa danh mục'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
              <input type="text" value={form.name} onChange={e => handleNameChange(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Tour Đông Hưng" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Mô tả ngắn về danh mục..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
              <input type="text" value={form.icon} onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm text-center text-2xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
              <input type="number" value={form.order} onChange={e => setForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
              <div className="flex items-center gap-2">
                <label className="cursor-pointer inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                  {uploading ? '⏳...' : '📤 Upload'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
                {form.image && (
                  <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
                    <Image src={form.image} alt="" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {form.image && (
            <input type="text" value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
              className="w-full border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="URL ảnh" />
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={cancel} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">Hủy</button>
            <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
              {saving ? '⏳ Đang lưu...' : editing === 'new' ? '✅ Tạo' : '�� Lưu'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="divide-y">
          {categories.map(cat => (
            <div key={cat.id} className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${editing === cat.id ? 'bg-green-50' : ''}`}>
              <span className="text-3xl">{cat.icon}</span>
              {cat.image ? (
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-sm">—</div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{cat.description || 'Không có mô tả'}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                  <span>Slug: {cat.slug}</span>
                  <span>•</span>
                  <span>Thứ tự: {cat.order}</span>
                  <span>•</span>
                  <span className="font-medium text-gray-600">{cat.tourCount} tour</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => startEdit(cat)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">✏️ Sửa</button>
                <button onClick={() => handleDelete(cat.id, cat.name, cat.tourCount)} className="text-red-500 hover:text-red-700 text-sm font-medium">🗑️</button>
              </div>
            </div>
          ))}
        </div>
        {categories.length === 0 && <div className="p-8 text-center text-gray-500">Chưa có danh mục nào</div>}
      </div>
    </div>
  )
}
