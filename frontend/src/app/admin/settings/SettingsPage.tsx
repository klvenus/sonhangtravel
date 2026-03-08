'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface BannerSlide {
  image: string; title?: string; subtitle?: string; linkUrl?: string; linkText?: string
}

interface Settings {
  id?: number; siteName: string; logo: string; logoDark: string; favicon: string
  bannerSlides: BannerSlide[]; phoneNumber: string; zaloNumber: string
  email: string; address: string; facebookUrl: string; youtubeUrl: string; tiktokUrl: string
}

const defaultSettings: Settings = {
  siteName: 'Son Hang Travel', logo: '', logoDark: '', favicon: '',
  bannerSlides: [], phoneNumber: '0338239888', zaloNumber: '0388091993',
  email: 'Lienhe@sonhangtravel.com', address: '', facebookUrl: '', youtubeUrl: '', tiktokUrl: '',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => { if (r.status === 401) { router.push('/admin'); return null }; return r.ok ? r.json() : null })
      .then(d => { if (d) setSettings({ ...defaultSettings, ...d }) })
      .finally(() => setLoading(false))
  }, [router])

  const set = (field: keyof Settings, value: unknown) => {
    setSettings(prev => ({ ...prev, [field]: value }))
    setSaved(false)
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

  async function handleImageField(e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'logoDark' | 'favicon') {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) set(field, url)
  }

  // Banner slide helpers
  function addSlide() {
    setSettings(prev => ({
      ...prev,
      bannerSlides: [...prev.bannerSlides, { image: '', title: '', subtitle: '', linkUrl: '', linkText: '' }],
    }))
    setSaved(false)
  }

  function updateSlide(index: number, field: keyof BannerSlide, value: string) {
    setSettings(prev => {
      const slides = [...prev.bannerSlides]
      slides[index] = { ...slides[index], [field]: value }
      return { ...prev, bannerSlides: slides }
    })
    setSaved(false)
  }

  function removeSlide(index: number) {
    setSettings(prev => ({
      ...prev,
      bannerSlides: prev.bannerSlides.filter((_, i) => i !== index),
    }))
    setSaved(false)
  }

  async function handleSlideImageUpload(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadImage(file)
    if (url) updateSlide(index, 'image', url)
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        alert('Lỗi khi lưu cài đặt')
      }
    } catch {
      alert('Lỗi kết nối')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-8"><span className="text-gray-500">Đang tải...</span></div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Cài đặt website</h1>
        <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
          {saving ? '⏳ Đang lưu...' : saved ? '✅ Đã lưu!' : '💾 Lưu thay đổi'}
        </button>
      </div>

      {/* General */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-lg">Thông tin chung</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên website</label>
          <input type="text" value={settings.siteName} onChange={e => set('siteName', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['logo', 'logoDark', 'favicon'] as const).map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === 'logo' ? 'Logo' : field === 'logoDark' ? 'Logo (dark)' : 'Favicon'}
              </label>
              <div className="space-y-2">
                {settings[field] && (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={settings[field]} alt={field} fill className="object-contain" />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                  {uploading ? '...' : 'Upload'}
                  <input type="file" accept="image/*" onChange={e => handleImageField(e, field)} className="hidden" disabled={uploading} />
                </label>
                <input type="text" value={settings[field]} onChange={e => set(field, e.target.value)}
                  className="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="URL" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-lg">Thông tin liên hệ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input type="text" value={settings.phoneNumber} onChange={e => set('phoneNumber', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zalo</label>
            <input type="text" value={settings.zaloNumber} onChange={e => set('zaloNumber', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={settings.email} onChange={e => set('email', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input type="text" value={settings.address} onChange={e => set('address', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 text-lg">Mạng xã hội</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
            <input type="url" value={settings.facebookUrl} onChange={e => set('facebookUrl', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
            <input type="url" value={settings.youtubeUrl} onChange={e => set('youtubeUrl', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://youtube.com/..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
            <input type="url" value={settings.tiktokUrl} onChange={e => set('tiktokUrl', e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="https://tiktok.com/..." />
          </div>
        </div>
      </div>

      {/* Banner Slides */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-lg">Banner slides ({settings.bannerSlides.length})</h2>
          <button onClick={addSlide} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
            ➕ Thêm slide
          </button>
        </div>
        {settings.bannerSlides.map((slide, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-600">Slide {i + 1}</span>
              <button onClick={() => removeSlide(i)} className="text-red-500 hover:text-red-700 text-sm">🗑️ Xóa</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hình ảnh *</label>
                <div className="flex items-center gap-2">
                  {slide.image && (
                    <div className="relative w-24 h-14 rounded overflow-hidden bg-gray-100">
                      <Image src={slide.image} alt="" fill className="object-cover" />
                    </div>
                  )}
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded text-xs font-medium transition-colors">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={e => handleSlideImageUpload(e, i)} className="hidden" disabled={uploading} />
                  </label>
                </div>
                <input type="text" value={slide.image} onChange={e => updateSlide(i, 'image', e.target.value)}
                  className="w-full mt-1 border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="URL hình ảnh" />
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                  <input type="text" value={slide.title || ''} onChange={e => updateSlide(i, 'title', e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Phụ đề</label>
                  <input type="text" value={slide.subtitle || ''} onChange={e => updateSlide(i, 'subtitle', e.target.value)}
                    className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Link URL</label>
                <input type="text" value={slide.linkUrl || ''} onChange={e => updateSlide(i, 'linkUrl', e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Text nút</label>
                <input type="text" value={slide.linkText || ''} onChange={e => updateSlide(i, 'linkText', e.target.value)}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Xem ngay" />
              </div>
            </div>
          </div>
        ))}
        {settings.bannerSlides.length === 0 && <p className="text-center text-gray-400 py-4 text-sm">Chưa có banner slide nào</p>}
      </div>

      {/* Save button bottom */}
      <div className="flex justify-end pb-8">
        <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors">
          {saving ? '⏳ Đang lưu...' : saved ? '✅ Đã lưu!' : '💾 Lưu tất cả thay đổi'}
        </button>
      </div>
    </div>
  )
}
