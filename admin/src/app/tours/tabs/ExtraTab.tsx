'use client';

import { TourData, Field, ListEditor } from '../tourTypes';

interface ExtraTabProps {
  data: TourData;
  set: (field: keyof TourData, value: unknown) => void;
  setData: React.Dispatch<React.SetStateAction<TourData>>;
}

export default function ExtraTab({ data, set, setData }: ExtraTabProps) {
  function addItem(field: 'includes' | 'excludes' | 'notes') {
    setData(prev => ({ ...prev, [field]: [...(prev[field] as string[]), ''] }));
  }
  function updateItem(field: 'includes' | 'excludes' | 'notes', idx: number, val: string) {
    setData(prev => { const arr = [...(prev[field] as string[])]; arr[idx] = val; return { ...prev, [field]: arr }; });
  }
  function removeItem(field: 'includes' | 'excludes' | 'notes', idx: number) {
    setData(prev => ({ ...prev, [field]: (prev[field] as string[]).filter((_, i) => i !== idx) }));
  }

  return (
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
  );
}
