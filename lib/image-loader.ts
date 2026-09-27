'use client'

/**
 * Global next/image loader.
 * - Sanity CDN images are resized on Sanity's image service (auto WebP/AVIF).
 * - Local sample images in /public/seed are already web-optimized and served as-is.
 */
export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith('https://cdn.sanity.io/')) {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality ?? 78))
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'max')
    return url.toString()
  }
  // Sample images are pre-sized; the query only satisfies next/image's width check.
  return `${src}?w=${width}`
}
