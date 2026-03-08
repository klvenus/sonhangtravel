'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function BlogGalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  const close = () => setActiveIndex(null)
  const next = () => setActiveIndex((prev) => (prev === null ? null : (prev + 1) % images.length))
  const prev = () => setActiveIndex((prev) => (prev === null ? null : (prev - 1 + images.length) % images.length))
  const nextPreview = () => setPreviewIndex((prev) => (prev + 1) % images.length)
  const prevPreview = () => setPreviewIndex((prev) => (prev - 1 + images.length) % images.length)

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
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[28px] bg-gray-100 shadow-sm ring-1 ring-gray-200 aspect-[4/5] md:aspect-[16/10]">
          <button
            type="button"
            onClick={() => setActiveIndex(previewIndex)}
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={images[previewIndex]}
              alt={`${title} - ảnh ${previewIndex + 1}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevPreview}
                className="absolute left-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-black/35 text-white text-2xl backdrop-blur-sm"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextPreview}
                className="absolute right-3 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full bg-black/35 text-white text-2xl backdrop-blur-sm"
              >
                ›
              </button>
            </>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent p-4 md:p-6">
            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
              Ảnh {previewIndex + 1} / {images.length}
            </div>
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setPreviewIndex(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition-all ${previewIndex === index ? 'ring-emerald-500' : 'ring-transparent'}`}
              >
                <Image
                  src={image}
                  alt={`${title} - thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
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
