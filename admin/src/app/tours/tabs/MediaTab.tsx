'use client';

import { useRef, useState } from 'react';
import { TourData, CloudImage } from '../tourTypes';
import ImagePickerModal from '../ImagePickerModal';

interface MediaTabProps {
  data: TourData;
  set: (field: keyof TourData, value: unknown) => void;
  setData: React.Dispatch<React.SetStateAction<TourData>>;
  uploading: boolean;
  uploadImage: (file: File) => Promise<string | null>;
  cloudImages: CloudImage[];
  cloudLoading: boolean;
  loadCloudImages: () => void;
  setCloudImages: React.Dispatch<React.SetStateAction<CloudImage[]>>;
}

export default function MediaTab({ data, set, setData, uploading, uploadImage, cloudImages, cloudLoading, loadCloudImages, setCloudImages }: MediaTabProps) {
  const [showPicker, setShowPicker] = useState<'thumbnail' | 'gallery' | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) set('thumbnail', url);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const url = await uploadImage(files[i]);
      if (url) setData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
    }
  }

  async function handleDrop(e: React.DragEvent, target: 'thumbnail' | 'gallery') {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (!files.length) return;
    if (target === 'thumbnail') {
      const url = await uploadImage(files[0]);
      if (url) set('thumbnail', url);
    } else {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadImage(files[i]);
        if (url) setData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
      }
    }
  }

  function selectFromCloud(url: string) {
    if (showPicker === 'thumbnail') {
      set('thumbnail', url);
      setShowPicker(null);
    } else if (showPicker === 'gallery') {
      if (!data.gallery.includes(url)) {
        setData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Thumbnail */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-800">📷 Ảnh thumbnail</label>
          <button onClick={() => { setShowPicker('thumbnail'); loadCloudImages(); }}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">
            📂 Chọn từ thư viện
          </button>
        </div>
        {data.thumbnail ? (
          <div className="relative inline-block group">
            <img src={data.thumbnail} alt="" className="w-64 h-44 rounded-xl object-cover border-2 border-gray-200 shadow-sm" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => set('thumbnail', '')} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600 shadow">🗑️ Xóa</button>
              <button onClick={() => thumbnailInputRef.current?.click()} className="bg-white text-gray-700 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 shadow">🔄 Đổi ảnh</button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}
            onClick={() => thumbnailInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => handleDrop(e, 'thumbnail')}
          >
            <p className="text-3xl mb-2">📸</p>
            <p className="text-sm text-gray-600 font-medium">Kéo thả ảnh vào đây hoặc click để chọn</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Nên dùng 800×600 trở lên</p>
          </div>
        )}
        <input ref={thumbnailInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
        <div className="mt-2">
          <input type="text" value={data.thumbnail} onChange={e => set('thumbnail', e.target.value)}
            placeholder="Hoặc dán URL ảnh..." className="w-full max-w-md border rounded-lg px-3 py-2 text-xs text-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
        </div>
      </div>

      {/* Gallery */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-800">🖼️ Gallery ({data.gallery.length} ảnh)</label>
          <div className="flex gap-2">
            <button onClick={() => { setShowPicker('gallery'); loadCloudImages(); }}
              className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">📂 Chọn từ thư viện</button>
            <button onClick={() => galleryInputRef.current?.click()}
              className="text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium transition-colors">⬆️ Upload mới</button>
          </div>
        </div>
        <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />

        {data.gallery.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.gallery.map((url, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img src={url} alt="" className="w-full h-28 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => setData(prev => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }))}
                    className="bg-red-500 text-white rounded-full w-8 h-8 text-sm font-bold hover:bg-red-600 shadow">✕</button>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">{i + 1}</div>
              </div>
            ))}
            <div className="border-2 border-dashed border-gray-300 rounded-xl h-28 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-colors"
              onClick={() => galleryInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => handleDrop(e, 'gallery')}
            >
              <span className="text-2xl text-gray-400">+</span>
              <span className="text-[10px] text-gray-400 mt-0.5">Thêm ảnh</span>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50/50'}`}
            onClick={() => galleryInputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => handleDrop(e, 'gallery')}
          >
            <p className="text-3xl mb-2">🖼️</p>
            <p className="text-sm text-gray-600 font-medium">Kéo thả nhiều ảnh hoặc click để chọn</p>
            <p className="text-xs text-gray-400 mt-1">Có thể chọn nhiều ảnh cùng lúc</p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-green-700 font-medium">Đang upload ảnh...</span>
        </div>
      )}

      {/* Image Picker Modal */}
      {showPicker && (
        <ImagePickerModal
          mode={showPicker}
          images={cloudImages}
          loading={cloudLoading}
          selectedThumbnail={data.thumbnail}
          selectedGallery={data.gallery}
          onSelect={selectFromCloud}
          onReload={() => { setCloudImages([]); loadCloudImages(); }}
          onClose={() => setShowPicker(null)}
        />
      )}
    </div>
  );
}
