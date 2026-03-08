'use client';

import { useRef, useState } from 'react';

interface CloudImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
}

interface ImagePickerModalProps {
  mode: 'thumbnail' | 'gallery';
  images: CloudImage[];
  loading: boolean;
  selectedThumbnail: string;
  selectedGallery: string[];
  onSelect: (url: string) => void;
  onReload: () => void;
  onClose: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ImagePickerModal({ mode, images, loading, selectedThumbnail, selectedGallery, onSelect, onReload, onClose }: ImagePickerModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-bold text-gray-800">📂 Thư viện ảnh Cloudinary</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'thumbnail' ? 'Chọn 1 ảnh làm thumbnail' : 'Click để thêm vào gallery (có thể chọn nhiều)'}
              {' • '}{images.length} ảnh
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onReload} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 font-medium">🔄 Tải lại</button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none px-2">×</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-3 border-green-600 border-t-transparent rounded-full animate-spin mb-3" />
              <span className="text-sm text-gray-500">Đang tải thư viện...</span>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500">Chưa có ảnh nào trong thư viện</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img, i) => {
                const isSelected = mode === 'thumbnail'
                  ? selectedThumbnail === img.url
                  : selectedGallery.includes(img.url);
                return (
                  <div key={i}
                    className={`relative group rounded-xl overflow-hidden cursor-pointer border-2 transition-all hover:shadow-lg ${isSelected ? 'border-green-500 ring-2 ring-green-200 shadow-md' : 'border-gray-200 hover:border-green-300'}`}
                    onClick={() => onSelect(img.url)}
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

        <div className="px-6 py-3 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {mode === 'gallery' && `Đã chọn: ${selectedGallery.length} ảnh`}
          </span>
          <button onClick={onClose} className="px-5 py-2 text-sm bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">✅ Xong</button>
        </div>
      </div>
    </div>
  );
}
