'use client';

import { TourData, Category, Field } from '../tourTypes';

interface BasicTabProps {
  data: TourData;
  categories: Category[];
  onTitleChange: (title: string) => void;
  set: (field: keyof TourData, value: unknown) => void;
}

export default function BasicTab({ data, categories, onTitleChange, set }: BasicTabProps) {
  return (
    <div className="space-y-4">
      <Field label="Tiêu đề *" value={data.title} onChange={onTitleChange} />
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
  );
}
