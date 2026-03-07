'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function BlogGalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null)
      if (e.key === 'ArrowRight') setActiveIndex((prev) => prev === null ? null : (prev + 1) % images.length)
      if (e.key === 'ArrowLeft') setActiveIndex((prev) => prev === null ? null : (prev - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeIndex, images.length])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm"
          >
            <Image
              src={image}
              alt={`${title} - ảnh ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-6" onClick={() => setActiveIndex(null)}>
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/90 text-3xl leading-none"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length) }}
                className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 rounded-full bg-white/10 text-white text-2xl"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length) }}
                className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 rounded-full bg-white/10 text-white text-2xl"
              >
                ›
              </button>
            </>
          )}

          <div className="relative w-full max-w-6xl aspect-[4/5] md:aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIndex]}
              alt={`${title} - ảnh ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm px-3 py-1 rounded-full bg-white/10">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}
