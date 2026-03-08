'use client';

import { useEffect, useState } from 'react';

interface Settings {
  siteName: string; logo: string; logoDark: string; favicon: string;
  phoneNumber: string; zaloNumber: string; email: string; address: string;
  facebookUrl: string; youtubeUrl: string; tiktokUrl: string;
  bannerSlides: { image: string; title?: string; subtitle?: string; linkUrl?: string; linkText?: string }[];
}

const defaultSettings: Settings = {
  siteName: 'Sơn Hằng Travel', logo: '', logoDark: '', favicon: '',
  phoneNumber: '0338239888', zaloNumber: '0388091993', email: 'Lienhe@sonhangtravel.com',
  address: 'Khu 5 - Phường Móng Cái - Quảng Ninh',
  facebookUrl: '', youtubeUrl: '', tiktokUrl: '', bannerSlides: [],
};

export default function SettingsPage() {
  const [data, setData] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(d => {
      if (d) setData({ ...defaultSettings, ...d });
    }).finally(() => setLoading(false));
  }, []);

  function set(field: keyof Settings, value: unknown) {
    setData(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) alert('✅ Đã lưu cài đặt!');
      else alert('Lỗi khi lưu');
    } catch { alert('Lỗi kết nối'); }
    finally { setSaving(false); }
  }

  if (loading) return <div className="text-gray-500 p-4">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">⚙️ Cài đặt trang web</h2>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
          {saving ? 'Đang lưu...' : '💾 Lưu cài đặt'}
        </button>
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">🏢 Thông tin công ty</h3>
        <Field label="Tên trang web" value={data.siteName} onChange={v => set('siteName', v)} />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Logo URL" value={data.logo} onChange={v => set('logo', v)} />
          <Field label="Logo Dark URL" value={data.logoDark} onChange={v => set('logoDark', v)} />
        </div>
        <Field label="Favicon URL" value={data.favicon} onChange={v => set('favicon', v)} />
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">📞 Liên hệ</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Số điện thoại" value={data.phoneNumber} onChange={v => set('phoneNumber', v)} />
          <Field label="Zalo" value={data.zaloNumber} onChange={v => set('zaloNumber', v)} />
        </div>
        <Field label="Email" value={data.email} onChange={v => set('email', v)} />
        <Field label="Địa chỉ" value={data.address} onChange={v => set('address', v)} />
      </div>

      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700 border-b pb-2">🌐 Mạng xã hội</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Facebook" value={data.facebookUrl} onChange={v => set('facebookUrl', v)} />
          <Field label="YouTube" value={data.youtubeUrl} onChange={v => set('youtubeUrl', v)} />
          <Field label="TikTok" value={data.tiktokUrl} onChange={v => set('tiktokUrl', v)} />
        </div>
      </div>

      {/* Banner Slides */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-semibold text-gray-700">🖼️ Banner trang chủ ({data.bannerSlides.length} slide)</h3>
          <button onClick={() => set('bannerSlides', [...data.bannerSlides, { image: '', title: '', subtitle: '', linkUrl: '', linkText: '' }])}
            className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200">+ Thêm slide</button>
        </div>
        {data.bannerSlides.length === 0 && (
          <p className="text-sm text-gray-400 italic">Chưa có banner. Thêm slide để hiển thị banner trang chủ. Nếu không có, hệ thống dùng banner mặc định.</p>
        )}
        {data.bannerSlides.map((slide, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Slide {i + 1}</span>
              <button onClick={() => set('bannerSlides', data.bannerSlides.filter((_, idx) => idx !== i))}
                className="text-red-500 text-xs hover:underline">Xóa</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh banner *</label>
              <div className="flex items-start gap-3">
                {slide.image && <img src={slide.image} alt="" className="w-40 h-20 rounded object-cover border flex-shrink-0" />}
                <div className="flex-1 space-y-1">
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    const fd = new FormData(); fd.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: fd });
                    if (res.ok) { const r = await res.json(); const newSlides = [...data.bannerSlides]; newSlides[i] = { ...newSlides[i], image: r.url }; set('bannerSlides', newSlides); }
                    else alert('Upload thất bại');
                  }} className="text-sm" />
                  <input value={slide.image} onChange={e => { const newSlides = [...data.bannerSlides]; newSlides[i] = { ...newSlides[i], image: e.target.value }; set('bannerSlides', newSlides); }}
                    placeholder="Hoặc dán URL ảnh..." className="w-full border rounded px-2 py-1 text-sm" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input value={slide.title || ''} onChange={e => { const s = [...data.bannerSlides]; s[i] = { ...s[i], title: e.target.value }; set('bannerSlides', s); }}
                  placeholder="VD: Sơn Hằng Travel" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                <input value={slide.subtitle || ''} onChange={e => { const s = [...data.bannerSlides]; s[i] = { ...s[i], subtitle: e.target.value }; set('bannerSlides', s); }}
                  placeholder="VD: Tour Trung Quốc Uy Tín" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input value={slide.linkUrl || ''} onChange={e => { const s = [...data.bannerSlides]; s[i] = { ...s[i], linkUrl: e.target.value }; set('bannerSlides', s); }}
                  placeholder="VD: /tours" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nút bấm</label>
                <input value={slide.linkText || ''} onChange={e => { const s = [...data.bannerSlides]; s[i] = { ...s[i], linkText: e.target.value }; set('bannerSlides', s); }}
                  placeholder="VD: Xem tour" className="w-full border rounded px-2 py-1 text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input value={value} onChange={e => onChange(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
    </div>
  );
}
