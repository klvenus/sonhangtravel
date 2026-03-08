'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TourData, CloudImage, defaultTourData, slugify } from './tourTypes';
import BasicTab from './tabs/BasicTab';
import DetailTab from './tabs/DetailTab';
import MediaTab from './tabs/MediaTab';
import ItineraryTab from './tabs/ItineraryTab';
import ExtraTab from './tabs/ExtraTab';

export default function TourForm({ tourId }: { tourId?: string }) {
  const router = useRouter();
  const [data, setData] = useState<TourData>(defaultTourData);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(!!tourId);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'basic' | 'detail' | 'media' | 'itinerary' | 'extra'>('basic');
  const [cloudImages, setCloudImages] = useState<CloudImage[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);

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
      if (r.url) {
        setCloudImages(prev => [{ publicId: r.publicId || '', url: r.url, width: r.width || 0, height: r.height || 0, format: '', bytes: 0, createdAt: new Date().toISOString() }, ...prev]);
      }
      return r.url;
    } catch { return null; }
    finally { setUploading(false); }
  }

  async function loadCloudImages() {
    if (cloudImages.length > 0) return;
    setCloudLoading(true);
    try {
      const res = await fetch('/api/images?max=100');
      if (res.ok) {
        const imgData = await res.json();
        setCloudImages(imgData.images || []);
      }
    } catch { /* ignore */ }
    finally { setCloudLoading(false); }
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
        {tab === 'basic' && <BasicTab data={data} categories={categories} onTitleChange={handleTitleChange} set={set} />}
        {tab === 'detail' && <DetailTab data={data} set={set} />}
        {tab === 'media' && <MediaTab data={data} set={set} setData={setData} uploading={uploading} uploadImage={uploadImage} cloudImages={cloudImages} cloudLoading={cloudLoading} loadCloudImages={loadCloudImages} setCloudImages={setCloudImages} />}
        {tab === 'itinerary' && <ItineraryTab data={data} setData={setData} />}
        {tab === 'extra' && <ExtraTab data={data} set={set} setData={setData} />}
      </div>
    </div>
  );
}
