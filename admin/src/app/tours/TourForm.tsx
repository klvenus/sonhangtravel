'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Category { id: number; name: string }
interface ItineraryItem { time?: string; title: string; description?: string; image?: string }
interface DepartureDate { date: string; price?: number; availableSlots: number; status: 'available' | 'almost_full' | 'full' }

interface TourData {
  title: string; slug: string; shortDescription: string; content: string;
  price: number; originalPrice: number | null; duration: string; departure: string;
  destination: string; transportation: string; groupSize: string;
  thumbnail: string; gallery: string[]; itinerary: ItineraryItem[];
  includes: string[]; excludes: string[]; notes: string[]; policy: string;
  categoryId: number | null; featured: boolean; published: boolean;
  rating: string; reviewCount: number; bookingCount: number; departureDates: DepartureDate[];
}

const defaultData: TourData = {
  title: '', slug: '', shortDescription: '', content: '',
  price: 0, originalPrice: null, duration: '', departure: 'Móng Cái',
  destination: '', transportation: '', groupSize: '',
  thumbnail: '', gallery: [], itinerary: [],
  includes: [], excludes: [], notes: [], policy: '',
  categoryId: null, featured: false, published: true,
  rating: '5.0', reviewCount: 0, bookingCount: 0, departureDates: [],
};

function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function TourForm({ tourId }: { tourId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<TourData>(defaultData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!!tourId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'basic' | 'detail' | 'media' | 'itinerary' | 'extra'>('basic');

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, []);

  useEffect(() => {
    if (!tourId) return;
    fetch(`/api/tours/${tourId}`).then(r => r.json()).then(d => {
      setData({
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
      });
    }).finally(() => setLoading(false));
  }, [tourId]);

  const set = useCallback((field: keyof TourData, value: unknown) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  function handleTitleChange(title: string) {
    setData(prev => ({ ...prev, title, slug: !tourId ? slugify(title) : prev.slug }));
  }

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) { alert('Upload thất bại'); return null; }
      const r = await res.json();
      return r.url;
    } catch { return null; }
    finally { setUploading(false); }
  }

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) set('thumbnail', url);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) setData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    }
  }

  async function handleSave() {
    if (!data.title.trim()) return alert('Nhập tiêu đề tour');
    if (!data.price) return alert('Nhập giá tour');
    setSaving(true);
    try {
      const url = tourId ? `/api/tours/${tourId}` : '/api/tours';
      const method = tourId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { router.push('/tours'); router.refresh(); }
      else { const err = await res.json().catch(() => ({})); alert(err.error || 'Lỗi khi lưu'); }
    } catch { alert('Lỗi kết nối'); }
    finally { setSaving(false); }
  }

  // List helpers
  function addItem(field: 'includes' | 'excludes' | 'notes') {
    setData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }));
  }
  function updateItem(field: 'includes' | 'excludes' | 'notes', idx: number, val: string) {
    setData(prev => { const arr = [...(prev[field] as string[])]; arr[idx] = val; return { ...prev, [field]: arr }; });
  }
  function removeItem(field: 'includes' | 'excludes' | 'notes', idx: number) {
    setData(prev => ({ ...prev, [field]: (prev[field] as string[]).filter((_, i) => i !== idx) }));
  }

  // Itinerary helpers
  function addItinerary() {
    setData(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', title: '', description: '' }] }));
  }
  function updateItinerary(idx: number, field: keyof ItineraryItem, val: string) {
    setData(prev => { const arr = [...prev.itinerary]; arr[idx] = { ...arr[idx], [field]: val }; return { ...prev, itinerary: arr }; });
  }
  function removeItinerary(idx: number) {
    setData(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== idx) }));
  }

  if (loading) return <div className="text-gray-500 p-8">Đang tải...</div>;

  const tabs = [
    { key: 'basic', label: '📝 Cơ bản' },
    { key: 'detail', label: '📋 Chi tiết' },
    { key: 'media', label: '🖼️ Ảnh' },
    { key: 'itinerary', label: '🗓️ Lịch trình' },
    { key: 'extra', label: '📦 Thêm' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{tourId ? 'Sửa tour' : 'Thêm tour mới'}</h2>
        <div className="flex gap-2">
          <button onClick={() => router.push('/tours')} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">← Quay lại</button>
          <button onClick={handleSave} disabled={saving || uploading}
            className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Đang lưu...' : uploading ? 'Đang upload...' : '💾 Lưu'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 text-sm py-2 rounded-md transition-colors ${tab === t.key ? 'bg-white shadow font-medium' : 'hover:bg-gray-200'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-6">
        {/* BASIC TAB */}
        {tab === 'basic' && (
          <div className="space-y-4">
            <Field label="Tiêu đề *" value={data.title} onChange={handleTitleChange} />
            <Field label="Slug" value={data.slug} onChange={v => set('slug', v)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
              <textarea rows={3} value={data.shortDescription} onChange={e => set('shortDescription', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Giá (VNĐ) *" type="number" value={String(data.price)} onChange={v => set('price', Number(v))} />
              <Field label="Giá gốc" type="number" value={data.originalPrice ? String(data.originalPrice) : ''} onChange={v => set('originalPrice', v ? Number(v) : null)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select value={data.categoryId || ''} onChange={e => set('categoryId', e.target.value ? Number(e.target.value) : null)}
                  className="w-full border rounded-lg px-3 py-2 text-sm">
                  <option value="">— Chọn danh mục —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={data.published} onChange={e => set('published', e.target.checked)} className="rounded" />
                  Công khai
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={data.featured} onChange={e => set('featured', e.target.checked)} className="rounded" />
                  ⭐ Nổi bật
                </label>
              </div>
            </div>
          </div>
        )}

        {/* DETAIL TAB */}
        {tab === 'detail' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Thời gian" value={data.duration} onChange={v => set('duration', v)} placeholder="VD: 2 ngày 1 đêm" />
              <Field label="Khởi hành" value={data.departure} onChange={v => set('departure', v)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Điểm đến" value={data.destination} onChange={v => set('destination', v)} />
              <Field label="Phương tiện" value={data.transportation} onChange={v => set('transportation', v)} />
            </div>
            <Field label="Số người" value={data.groupSize} onChange={v => set('groupSize', v)} placeholder="VD: 15-25 người" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung chi tiết (HTML)</label>
              <textarea rows={12} value={data.content || ''} onChange={e => set('content', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách</label>
              <textarea rows={4} value={data.policy || ''} onChange={e => set('policy', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        )}

        {/* MEDIA TAB */}
        {tab === 'media' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh thumbnail</label>
              <div className="flex items-start gap-4">
                {data.thumbnail && <img src={data.thumbnail} alt="" className="w-32 h-24 rounded-lg object-cover border" />}
                <div>
                  <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="text-sm" />
                  <Field label="" value={data.thumbnail} onChange={v => set('thumbnail', v)} placeholder="Hoặc dán URL..." />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery ({data.gallery.length} ảnh)</label>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="text-sm mb-2" />
              <div className="grid grid-cols-4 gap-2">
                {data.gallery.map((url, i) => (
                  <div key={i} className="relative group">
                    <img src={url} alt="" className="w-full h-20 rounded object-cover border" />
                    <button onClick={() => setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ITINERARY TAB */}
        {tab === 'itinerary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Lịch trình ({data.itinerary.length} mục)</label>
              <button onClick={addItinerary} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200">+ Thêm mục</button>
            </div>
            {data.itinerary.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Mục {i + 1}</span>
                  <button onClick={() => removeItinerary(i)} className="text-red-500 text-xs hover:underline">Xóa</button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <input value={item.time || ''} onChange={e => updateItinerary(i, 'time', e.target.value)}
                    placeholder="Thời gian" className="border rounded px-2 py-1 text-sm" />
                  <input value={item.title} onChange={e => updateItinerary(i, 'title', e.target.value)}
                    placeholder="Tiêu đề *" className="col-span-3 border rounded px-2 py-1 text-sm" />
                </div>
                <textarea rows={2} value={item.description || ''} onChange={e => updateItinerary(i, 'description', e.target.value)}
                  placeholder="Mô tả..." className="w-full border rounded px-2 py-1 text-sm" />
              </div>
            ))}
          </div>
        )}

        {/* EXTRA TAB */}
        {tab === 'extra' && (
          <div className="space-y-6">
            <ListEditor label="✅ Bao gồm" items={data.includes} onAdd={() => addItem('includes')} onUpdate={(i, v) => updateItem('includes', i, v)} onRemove={i => removeItem('includes', i)} />
            <ListEditor label="❌ Không bao gồm" items={data.excludes} onAdd={() => addItem('excludes')} onUpdate={(i, v) => updateItem('excludes', i, v)} onRemove={i => removeItem('excludes', i)} />
            <ListEditor label="📌 Lưu ý" items={data.notes} onAdd={() => addItem('notes')} onUpdate={(i, v) => updateItem('notes', i, v)} onRemove={i => removeItem('notes', i)} />
            <div className="grid grid-cols-3 gap-4">
              <Field label="Đánh giá" value={data.rating} onChange={v => set('rating', v)} />
              <Field label="Lượt đánh giá" type="number" value={String(data.reviewCount)} onChange={v => set('reviewCount', Number(v))} />
              <Field label="Lượt đặt" type="number" value={String(data.bookingCount)} onChange={v => set('bookingCount', Number(v))} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
    </div>
  );
}

function ListEditor({ label, items, onAdd, onUpdate, onRemove }: { label: string; items: string[]; onAdd: () => void; onUpdate: (i: number, v: string) => void; onRemove: (i: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label} ({items.length})</label>
        <button onClick={onAdd} className="text-sm text-green-600 hover:underline">+ Thêm</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <input value={item} onChange={e => onUpdate(i, e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
          <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 text-sm px-1">✕</button>
        </div>
      ))}
    </div>
  );
}
