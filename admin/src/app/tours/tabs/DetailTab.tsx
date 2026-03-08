'use client';

import { TourData, Field } from '../tourTypes';

interface DetailTabProps {
  data: TourData;
  set: (field: keyof TourData, value: unknown) => void;
}

export default function DetailTab({ data, set }: DetailTabProps) {
  return (
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
  );
}
