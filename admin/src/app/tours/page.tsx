'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Tour {
  id: number; title: string; slug: string; price: number;
  destination: string; duration: string; featured: boolean;
  published: boolean; thumbnail: string | null; categoryName: string | null;
  bookingCount: number; reviewCount: number;
}

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tours').then(r => r.json()).then(setTours).finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Xóa tour "${title}"?`)) return;
    const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
    if (res.ok) setTours(prev => prev.filter(t => t.id !== id));
    else alert('Lỗi khi xóa');
  }

  async function toggleField(id: number, field: 'published' | 'featured', current: boolean) {
    const res = await fetch(`/api/tours/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    });
    if (res.ok) setTours(prev => prev.map(t => t.id === id ? { ...t, [field]: !current } : t));
  }

  if (loading) return <div className="text-gray-500 p-8">Đang tải...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Tours ({tours.length})</h2>
        <Link href="/tours/new" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
          ➕ Thêm tour
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
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
            {tours.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">Chưa có tour nào. <Link href="/tours/new" className="text-green-600 hover:underline">Thêm tour mới →</Link></td></tr>
            )}
            {tours.map(tour => (
              <tr key={tour.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {tour.thumbnail && <img src={tour.thumbnail} alt="" className="w-12 h-9 rounded object-cover" />}
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">{tour.title}</p>
                      <p className="text-xs text-gray-500">{tour.duration} • {tour.destination}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{tour.categoryName || '—'}</td>
                <td className="px-4 py-3 text-sm text-right font-medium">
                  {tour.price.toLocaleString('vi-VN')}đ
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => toggleField(tour.id, 'published', tour.published)}
                      className={`text-xs px-2 py-0.5 rounded-full ${tour.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tour.published ? '✅ Công khai' : '📝 Nháp'}
                    </button>
                    <button onClick={() => toggleField(tour.id, 'featured', tour.featured)}
                      className={`text-xs px-2 py-0.5 rounded-full ${tour.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tour.featured ? '⭐ Nổi bật' : '☆'}
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/tours/${tour.id}`} className="text-blue-600 hover:underline text-sm">Sửa</Link>
                    <button onClick={() => handleDelete(tour.id, tour.title)} className="text-red-500 hover:text-red-700 text-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
