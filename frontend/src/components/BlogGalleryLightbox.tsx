'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function BlogGalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const close = () => setActiveIndex(null)
  const next = () => setActiveIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
  const prev = () => setActiveIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
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
            key={`${image}-${index}`}
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
        <div className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm" role="dialog" aria-modal="true">
          <button
            type="button"
            onClick={close}
            className="absolute inset-0 h-full w-full cursor-default"
            aria-label="Đóng album"
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 md:p-6">
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-20 text-white/90 text-3xl leading-none h-10 w-10 rounded-full bg-white/10"
            >
              ×
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 md:h-12 md:w-12 rounded-full bg-white/10 text-white text-2xl"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 md:h-12 md:w-12 rounded-full bg-white/10 text-white text-2xl"
                >
                  ›
                </button>
              </>
            )}

            <div className="relative z-10 w-full max-w-6xl h-[72vh] md:h-[82vh]" onClick={(e) => e.stopPropagation()}>
              <Image
                key={`${images[activeIndex]}-${activeIndex}`}
                src={images[activeIndex]}
                alt={`${title} - ảnh ${activeIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/80 text-sm px-3 py-1 rounded-full bg-white/10">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
