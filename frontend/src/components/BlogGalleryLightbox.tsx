'use client'

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from 'react'
import { warmDirectImages, warmGalleryWindow } from '@/lib/client-image-warmup'

export default function BlogGalleryLightbox({ images, thumbImages, title }: { images: string[]; thumbImages?: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [previousPreviewIndex, setPreviousPreviewIndex] = useState<number | null>(null)
  const [isPreviewSliding, setIsPreviewSliding] = useState(false)
  const [isPreviewPaused, setIsPreviewPaused] = useState(false)
  const previewSlideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const thumbs = thumbImages?.length === images.length ? thumbImages : images

  const close = () => setActiveIndex(null)
  const open = (index: number) => {
    warmGalleryWindow(images, index, 'high')
    setActiveIndex(index)
  }

  const next = () => setActiveIndex((prev) => {
    if (prev === null) return null
    const nextIndex = (prev + 1) % images.length
    warmGalleryWindow(images, nextIndex, 'high')
    return nextIndex
  })
  const prev = () => setActiveIndex((prev) => {
    if (prev === null) return null
    const nextIndex = (prev - 1 + images.length) % images.length
    warmGalleryWindow(images, nextIndex, 'high')
    return nextIndex
  })

  const goToPreview = (nextIndex: number) => {
    if (nextIndex === previewIndex) return
    warmGalleryWindow(images, nextIndex, 'high')
    setPreviousPreviewIndex(previewIndex)
    setPreviewIndex(nextIndex)
    setIsPreviewSliding(true)
    if (previewSlideTimeoutRef.current) {
      clearTimeout(previewSlideTimeoutRef.current)
    }
    previewSlideTimeoutRef.current = setTimeout(() => {
      setPreviousPreviewIndex(null)
      setIsPreviewSliding(false)
    }, 420)
  }

  const nextPreview = () => goToPreview((previewIndex + 1) % images.length)
  const prevPreview = () => goToPreview((previewIndex - 1 + images.length) % images.length)

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

  useEffect(() => {
    if (typeof window === 'undefined' || images.length <= 1) return

    warmGalleryWindow(images, previewIndex, 'low')
    const timer = window.setTimeout(() => {
      warmDirectImages([images[1], images[2]], 'low')
    }, 500)

    return () => {
      window.clearTimeout(timer)
      if (previewSlideTimeoutRef.current) {
        clearTimeout(previewSlideTimeoutRef.current)
      }
    }
  }, [images])

  useEffect(() => {
    if (images.length <= 1 || isPreviewPaused || activeIndex !== null || isPreviewSliding) return

    const timer = setTimeout(() => {
      goToPreview((previewIndex + 1) % images.length)
    }, previewIndex === 0 ? 5000 : 3200)

    return () => clearTimeout(timer)
  }, [activeIndex, images.length, isPreviewPaused, isPreviewSliding, previewIndex])

  return (
    <>
      <div className="space-y-4">
        <div
          className="relative overflow-hidden rounded-[28px] bg-white ring-1 ring-gray-200 p-2 md:p-3 min-h-[520px] max-h-[80vh] md:min-h-[860px] md:max-h-[88vh] md:shadow-sm"
          onMouseEnter={() => setIsPreviewPaused(true)}
          onMouseLeave={() => setIsPreviewPaused(false)}
          onTouchStart={() => setIsPreviewPaused(true)}
          onTouchEnd={() => setIsPreviewPaused(false)}
        >
          <button
            type="button"
            onClick={() => open(previewIndex)}
            className="absolute inset-0 h-full w-full"
          >
            {previousPreviewIndex !== null && previousPreviewIndex !== previewIndex && (
              <div className="absolute inset-0" style={{ animation: 'blogPreviewSlideOut 420ms ease-out forwards' }}>
                <img
                  src={images[previousPreviewIndex]}
                  alt={`${title} - ảnh ${previousPreviewIndex + 1}`}
                  className="h-full w-full object-contain"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </div>
            )}
            <div
              className="absolute inset-0"
              style={isPreviewSliding && previousPreviewIndex !== null ? { animation: 'blogPreviewSlideIn 420ms ease-out forwards' } : undefined}
            >
              <img
                src={images[previewIndex]}
                alt={`${title} - ảnh ${previewIndex + 1}`}
                className="h-full w-full object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>
          </button>

          {images.length > 1 && (
            <div className="absolute right-4 bottom-4 z-10 hidden items-center gap-2 rounded-full bg-black/38 px-2 py-2 text-white backdrop-blur-sm md:flex">
              <button
                type="button"
                onClick={prevPreview}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-2xl leading-none"
                aria-label="Ảnh trước"
              >
                ‹
              </button>
              <div className="min-w-[64px] text-center text-sm font-medium text-white/95">
                {previewIndex + 1}/{images.length}
              </div>
              <button
                type="button"
                onClick={nextPreview}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-2xl leading-none"
                aria-label="Ảnh sau"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={prevPreview}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl leading-none text-gray-700"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <div className="text-sm font-semibold text-gray-700">
              {previewIndex + 1}/{images.length}
            </div>
            <button
              type="button"
              onClick={nextPreview}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl leading-none text-gray-700"
              aria-label="Ảnh sau"
            >
              ›
            </button>
          </div>
        )}

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => goToPreview(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-2 transition-all ${previewIndex === index ? 'ring-emerald-500' : 'ring-transparent'}`}
              >
                <img
                  src={thumbs[index] || image}
                  alt={`${title} - thumbnail ${index + 1}`}
                  className="h-full w-full bg-white object-contain"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  decoding="async"
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
              <img
                key={`${images[activeIndex]}-${activeIndex}`}
                src={images[activeIndex]}
                alt={`${title} - ảnh ${activeIndex + 1}`}
                className="h-full w-full object-contain"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 text-white/80 text-sm px-3 py-1 rounded-full bg-white/10">
              {activeIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blogPreviewSlideOut {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        @keyframes blogPreviewSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
