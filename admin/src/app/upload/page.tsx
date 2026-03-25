'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    setUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const fd = new FormData();
        fd.append('file', selectedFiles[i]);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        if (res.ok) {
          const data = await res.json();
          setFiles(prev => [...prev, { name: selectedFiles[i].name, url: data.url }]);
        } else {
          alert(`Upload thất bại: ${selectedFiles[i].name}`);
        }
      }
    } catch { alert('Lỗi kết nối'); }
    finally { setUploading(false); }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    alert('Đã copy URL!');
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">🖼️ Upload ảnh lên Cloudinary</h2>

      <div className="bg-white border rounded-xl p-8 text-center">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 hover:border-green-400 transition-colors">
          <p className="text-4xl mb-4">📸</p>
          <p className="text-gray-600 mb-2">Chọn ảnh để upload lên Cloudinary</p>
          <p className="text-xs text-gray-400 mb-2">Hỗ trợ: JPG, PNG, WebP, GIF</p>
          <p className="text-xs text-emerald-600 mb-4">Ảnh mới từ admin sẽ tự động chuẩn hoá sang WebP (trừ GIF/SVG/WebP sẵn có) để nhẹ hơn cho tour, blog và banner.</p>
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="text-sm" disabled={uploading} />
          {uploading && <p className="text-green-600 mt-4 animate-pulse">⏳ Đang upload...</p>}
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-white border rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-4">✅ Đã upload ({files.length} ảnh)</h3>
          <div className="grid grid-cols-2 gap-4">
            {files.map((f, i) => (
              <div key={i} className="border rounded-lg p-3 space-y-2">
                <img src={f.url} alt={f.name} className="w-full h-40 object-cover rounded" />
                <p className="text-xs text-gray-500 truncate">{f.name}</p>
                <div className="flex gap-2">
                  <input value={f.url} readOnly className="flex-1 text-xs border rounded px-2 py-1 bg-gray-50" />
                  <button onClick={() => copyUrl(f.url)} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">Copy</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
