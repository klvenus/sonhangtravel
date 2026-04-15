'use client';

// ─── Shared types for TourForm ───

export interface Category {
  id: number;
  name: string;
}

export interface ItineraryItem {
  time?: string;
  title: string;
  description?: string;
  image?: string;
}

export interface DepartureDate {
  date: string;
  price?: number;
  availableSlots: number;
  status: 'available' | 'almost_full' | 'full';
}

export interface CloudImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

export interface TourData {
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  price: number;
  originalPrice: number | null;
  duration: string;
  departure: string;
  destination: string;
  transportation: string;
  groupSize: string;
  thumbnail: string;
  gallery: string[];
  itinerary: ItineraryItem[];
  includes: string[];
  excludes: string[];
  notes: string[];
  policy: string;
  categoryId: number | null;
  featured: boolean;
  published: boolean;
  rating: string;
  reviewCount: number;
  bookingCount: number;
  departureDates: DepartureDate[];
}

export const defaultTourData: TourData = {
  title: '', slug: '', shortDescription: '', content: '',
  price: 0, originalPrice: null, duration: '', departure: 'Móng Cái',
  destination: '', transportation: '', groupSize: '',
  thumbnail: '', gallery: [], itinerary: [],
  includes: [], excludes: [], notes: [], policy: '',
  categoryId: null, featured: false, published: true,
  rating: '5.0', reviewCount: 0, bookingCount: 0, departureDates: [],
};

export function slugify(text: string): string {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Reusable form components ───

export function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
    </div>
  );
}

export function ListEditor({ label, items, onAdd, onUpdate, onRemove }: {
  label: string; items: string[]; onAdd: () => void; onUpdate: (i: number, v: string) => void; onRemove: (i: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label} ({items.length})</label>
        <button onClick={onAdd} className="text-sm text-green-600 hover:underline">+ Thêm</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 mb-1">
          <input value={item} onChange={e => onUpdate(i, e.target.value)} className="flex-1 border rounded px-2 py-1 text-sm" />
          <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 text-sm px-1">✕</button>
        </div>
      ))}
    </div>
  );
}
