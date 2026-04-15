type ImageFetchPriority = 'high' | 'low' | 'auto'

const warmedUrls = new Set<string>()
const warmers: HTMLImageElement[] = []

export function warmDirectImages(sources: Array<string | null | undefined>, priority: ImageFetchPriority = 'high') {
  if (typeof window === 'undefined') return

  sources
    .filter((source): source is string => Boolean(source))
    .forEach((source) => {
      if (warmedUrls.has(source)) return

      const image = new window.Image()
      const prioritizedImage = image as HTMLImageElement & { fetchPriority?: ImageFetchPriority }

      image.decoding = 'async'
      image.loading = 'eager'
      prioritizedImage.fetchPriority = priority
      image.src = source

      warmedUrls.add(source)
      warmers.push(image)

      if (warmers.length > 64) {
        warmers.splice(0, warmers.length - 64)
      }
    })
}

export function getGalleryWarmupSources(images: string[], index: number) {
  if (images.length === 0) return []

  const safeIndex = Math.max(0, Math.min(index, images.length - 1))
  const previousIndex = safeIndex === 0 ? images.length - 1 : safeIndex - 1
  const nextIndex = safeIndex === images.length - 1 ? 0 : safeIndex + 1

  return [images[safeIndex], images[nextIndex], images[previousIndex]]
}

export function warmGalleryWindow(images: string[], index: number, priority: ImageFetchPriority = 'high') {
  warmDirectImages(getGalleryWarmupSources(images, index), priority)
}
