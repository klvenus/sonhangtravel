'use client';

import { useEffect, useState, useRef } from 'react';

interface Category { id: number; name: string; slug: string; description: string | null; icon: string | null; image: string | null; order: number; tourCount: number }
interface CloudImage { publicId: string; url: string; width: number; height: number; format: string; bytes: number; createdAt: string }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '🌏', image: '', order: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [cloudImages, setCloudImages] = useState<CloudImage[]>([]);
  const [cloudLoading, setCloudLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function slugify(text: string) {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function handleNameChange(name: string) {
    setForm(prev => ({ ...prev, name, slug: editId ? prev.slug : slugify(name) }));
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

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setForm(prev => ({ ...prev, image: url }));
  }

  async function loadCloudImages() {
    if (cloudImages.length > 0) return;
    setCloudLoading(true);
    try {
      const res = await fetch('/api/images?max=100');
      if (res.ok) {
        const data = await res.json();
        setCloudImages(data.images || []);
      }
    } catch { /* ignore */ }
    finally { setCloudLoading(false); }
  }

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  async function handleSave() {
    if (!form.name.trim()) return alert('Nhập tên danh mục');
    setSaving(true);
    try {
      const url = editId ? `/api/categories/${editId}` : '/api/categories';
      const method = editId ? 'PUT' : 'POST';
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setForm({ name: '', slug: '', description: '', icon: '🌏', image: '', order: 0 });
        setEditId(null);
        load();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Lỗi');
      }
    } catch { alert('Lỗi kết nối'); }
    finally { setSaving(false); }
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '🌏', image: cat.image || '', order: cat.order });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', icon: '🌏', image: '', order: 0 });
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Xóa danh mục "${name}"?`)) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    load();
  }

  if (loading) return <div className="text-gray-500 p-4">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📁 Danh mục ({categories.length})</h2>

      {/* Form */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-gray-700">{editId ? '✏️ Sửa danh mục' : '➕ Thêm danh mục'}</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Tên *</label>
            <input value={form.name} onChange={e => handleNameChange(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="VD: Tour Đông Hưng" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Icon</label>
            <input value={form.icon} onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Thứ tự</label>
            <input type="number" value={form.order} onChange={e => setForm(prev => ({ ...prev, order: Number(e.target.value) }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
          <input value={form.slug} onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả</label>
          <textarea rows={2} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full border rounded-lg px-3 py-2 text-sm" />
        </div>

        {/* Image upload section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-600">📷 Ảnh bìa</label>
            <button onClick={() => { setShowPicker(true); loadCloudImages(); }}
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">
              📂 Chọn từ thư viện
            </button>
          </div>
          {form.image ? (
            <div className="flex items-start gap-4">
              <div className="relative group">
                <img src={form.image} alt="" className="w-40 h-28 rounded-xl object-cover border-2 border-gray-200 shadow-sm" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium hover:bg-red-600 shadow">
                    🗑️ Xóa
                  </button>
                  <button onClick={() => imageInputRef.current?.click()}
                    className="bg-white text-gray-700 px-2 py-1 rounded-lg text-xs font-medium hover:bg-gray-100 shadow">
                    🔄 Đổi
                  </button>
                </div>
              </div>
              <input type="text" value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                className="flex-1 border rounded-lg px-3 py-2 text-xs text-gray-500" placeholder="URL ảnh" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl w-40 h-28 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors"
                onClick={() => imageInputRef.current?.click()}
              >
                <span className="text-2xl mb-1">📸</span>
                <span className="text-[10px] text-gray-400">Click để upload</span>
              </div>
              <input type="text" value={form.image} onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))}
                className="flex-1 border rounded-lg px-3 py-2 text-xs text-gray-500" placeholder="Hoặc dán URL ảnh..." />
            </div>
          )}
          <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          {uploading && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
              <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              Đang upload...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving || uploading} className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Đang lưu...' : editId ? '💾 Cập nhật' : '➕ Thêm'}
          </button>
          {editId && <button onClick={cancelEdit} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Hủy</button>}
        </div>
      </div>

      {/* Image Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h3 className="text-lg font-bold text-gray-800">📂 Thư viện ảnh</h3>
                <p className="text-xs text-gray-500 mt-0.5">Chọn ảnh bìa cho danh mục • {cloudImages.length} ảnh</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setCloudImages([]); loadCloudImages(); }}
                  className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium">
                  🔄 Tải lại
                </button>
                <button onClick={() => setShowPicker(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-2">×</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cloudLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
                  <span className="text-sm text-gray-500">Đang tải thư viện...</span>
                </div>
              ) : cloudImages.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-gray-500">Chưa có ảnh nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {cloudImages.map((img, i) => {
                    const isSelected = form.image === img.url;
                    return (
                      <div key={i}
                        className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:shadow-lg ${isSelected ? 'border-green-500 ring-2 ring-green-200 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
                        onClick={() => { setForm(prev => ({ ...prev, image: img.url })); setShowPicker(false); }}
                      >
                        <img src={img.url} alt="" className="w-full h-24 object-cover" loading="lazy" />
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow">✓</div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[10px] text-white/90 truncate">{img.publicId?.split('/').pop()}</p>
                          <p className="text-[9px] text-white/60">{img.width}×{img.height} • {formatBytes(img.bytes)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t bg-gray-50 rounded-b-2xl flex justify-end">
              <button onClick={() => setShowPicker(false)}
                className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                ✅ Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Icon</th>
              <th className="px-4 py-3 font-medium text-gray-500">Ảnh bìa</th>
              <th className="px-4 py-3 font-medium text-gray-500">Tên</th>
              <th className="px-4 py-3 font-medium text-gray-500">Slug</th>
              <th className="px-4 py-3 font-medium text-gray-500">Số tour</th>
              <th className="px-4 py-3 font-medium text-gray-500">Thứ tự</th>
              <th className="px-4 py-3 font-medium text-gray-500">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-xl">{cat.icon || '📁'}</td>
                <td className="px-4 py-3">
                  {cat.image ? (
                    <img src={cat.image} alt="" className="w-16 h-11 rounded-lg object-cover border" />
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">{cat.name}</td>
                <td className="px-4 py-3 text-gray-500">{cat.slug}</td>
                <td className="px-4 py-3 text-gray-500">{cat.tourCount}</td>
                <td className="px-4 py-3 text-gray-500">{cat.order}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(cat)} className="text-blue-600 hover:underline">Sửa</button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="text-red-500 hover:underline">Xóa</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Chưa có danh mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
