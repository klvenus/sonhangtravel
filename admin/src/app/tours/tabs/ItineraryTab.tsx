'use client';

import { TourData, ItineraryItem } from '../tourTypes';

interface ItineraryTabProps {
  data: TourData;
  setData: React.Dispatch<React.SetStateAction<TourData>>;
}

export default function ItineraryTab({ data, setData }: ItineraryTabProps) {
  function addItinerary() {
    setData(prev => ({ ...prev, itinerary: [...prev.itinerary, { time: '', title: '', description: '' }] }));
  }

  function updateItinerary(idx: number, field: keyof ItineraryItem, val: string) {
    setData(prev => { const arr = [...prev.itinerary]; arr[idx] = { ...arr[idx], [field]: val }; return { ...prev, itinerary: arr }; });
  }

  function removeItinerary(idx: number) {
    setData(prev => ({ ...prev, itinerary: prev.itinerary.filter((_, i) => i !== idx) }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Lịch trình ({data.itinerary.length} mục)</label>
        <button onClick={addItinerary} className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200">+ Thêm mục</button>
      </div>
      {data.itinerary.map((item, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400">Mục {i + 1}</span>
            <button onClick={() => removeItinerary(i)} className="text-red-500 text-xs hover:underline">Xóa</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <input value={item.time || ''} onChange={e => updateItinerary(i, 'time', e.target.value)}
              placeholder="Thời gian" className="border rounded px-2 py-1 text-sm" />
            <input value={item.title} onChange={e => updateItinerary(i, 'title', e.target.value)}
              placeholder="Tiêu đề *" className="col-span-3 border rounded px-2 py-1 text-sm" />
          </div>
          <textarea rows={2} value={item.description || ''} onChange={e => updateItinerary(i, 'description', e.target.value)}
            placeholder="Mô tả..." className="w-full border rounded px-2 py-1 text-sm" />
        </div>
      ))}
    </div>
  );
}
