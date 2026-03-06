'use client';

import { useEffect, useState } from 'react';

interface Settings {
  siteName: string; logo: string; logoDark: string; favicon: string;
  phoneNumber: string; zaloNumber: string; email: string; address: string;
  facebookUrl: string; youtubeUrl: string; tiktokUrl: string;
  bannerSlides: { image: string; title?: string; subtitle?: string }[];
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
