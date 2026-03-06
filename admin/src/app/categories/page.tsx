'use client';

import { useEffect, useState } from 'react';

interface Category { id: number; name: string; slug: string; description: string | null; icon: string | null; order: number; tourCount: number }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', slug: '', description: '', icon: '🌏', order: 0 });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

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

  async function handleSave() {
    if (!form.name.trim()) return alert('Nhập tên danh mục');
    setSaving(true);
    try {
      const url = editId ? `/api/categories/${editId}` : '/api/categories';
      const method = editId ? 'PUT' : 'POST';
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        setForm({ name: '', slug: '', description: '', icon: '🌏', order: 0 });
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
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '', icon: cat.icon || '🌏', order: cat.order });
  }

  function cancelEdit() {
    setEditId(null);
    setForm({ name: '', slug: '', description: '', icon: '🌏', order: 0 });
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
        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Đang lưu...' : editId ? '💾 Cập nhật' : '➕ Thêm'}
          </button>
          {editId && <button onClick={cancelEdit} className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50">Hủy</button>}
        </div>
      </div>

      {/* List */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-500">Icon</th>
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
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Chưa có danh mục nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
