'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, CloseIcon } from '@/components/icons'
import type { Photo } from '@/lib/content'

type Props = { photos: Photo[]; index: number; onClose: () => void; onIndex: (i: number) => void }

/** Full-screen photo viewer: arrow keys, Esc, swipe, focus trapped, focus restored on close. */
export function Lightbox({ photos, index, onClose, onIndex }: Props) {
  const photo = photos[index]
  const dialog = useRef<HTMLDivElement>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const [dragX, setDragX] = useState(0)
  const [mounted, setMounted] = useState(false)

  const prev = useCallback(() => onIndex((index - 1 + photos.length) % photos.length), [index, photos.length, onIndex])
  const next = useCallback(() => onIndex((index + 1) % photos.length), [index, photos.length, onIndex])

  useEffect(() => setMounted(true), [])

  // Lock scroll and move focus into the viewer; restore both on close.
  useEffect(() => {
    if (!mounted) return
    const returnTo = document.activeElement as HTMLElement | null
    const root = document.documentElement
    root.style.overflow = 'hidden'
    dialog.current?.focus()
    return () => {
      root.style.overflow = ''
      returnTo?.focus?.()
    }
  }, [mounted])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Tab' && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>('button')
        if (!f.length) return
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [prev, next, onClose])

  // Preload neighbours so swiping feels instant.
  const neighbours = [photos[(index + 1) % photos.length], photos[(index - 1 + photos.length) % photos.length]]

  if (!mounted || !photo) return null

  return createPortal(
    <div
      ref={dialog}
      className="site fixed inset-0 z-100 grid animate-[fade_240ms_var(--ease)] touch-pan-y grid-rows-[auto_minmax(0,1fr)] bg-[rgb(6_7_8/0.97)] outline-none"
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      tabIndex={-1}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchMove={(e) => {
        if (!touch.current) return
        const dx = e.touches[0].clientX - touch.current.x
        const dy = e.touches[0].clientY - touch.current.y
        if (Math.abs(dx) > Math.abs(dy)) setDragX(dx)
      }}
      onTouchEnd={(e) => {
        if (!touch.current) return
        const dx = e.changedTouches[0].clientX - touch.current.x
        const dy = e.changedTouches[0].clientY - touch.current.y
        touch.current = null
        setDragX(0)
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) (dx > 0 ? prev : next)()
        else if (dy > 110 && Math.abs(dy) > Math.abs(dx)) onClose()
      }}
    >
      <div className="flex h-16 items-center justify-between px-(--gutter) py-2.5">
        <p className="t-meta" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </p>
        <button type="button" className="inline-flex h-11 items-center gap-2.5 pr-1 pl-3 text-[0.875rem] font-semibold text-fg" onClick={onClose}>
          <span>Close</span>
          <CloseIcon size={20} />
        </button>
      </div>

      <figure
        className="grid min-h-0 grid-rows-[minmax(0,1fr)_auto] gap-4 px-(--gutter) pt-0 pb-[max(20px,env(safe-area-inset-bottom))] md:hoverable:px-24"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="relative min-h-0 [transition:transform_200ms_var(--ease)]" style={{ transform: dragX ? `translateX(${dragX}px)` : undefined }}>
          <Image
            key={photo.key}
            src={photo.image.src}
            alt={photo.image.alt}
            width={photo.image.width}
            height={photo.image.height}
            sizes="100vw"
            className="absolute inset-0 size-full animate-[fade_360ms_var(--ease)] object-contain"
            preload
          />
        </div>
        {(photo.caption || photo.credit || photo.album.title) && (
          <figcaption className="mx-auto grid max-w-[70ch] justify-items-center gap-1 text-center">
            {photo.caption && <span className="text-[0.9375rem] text-fg">{photo.caption}</span>}
            <span className="t-meta">
              {[photo.album.title, photo.credit ? `Photo: ${photo.credit}` : null].filter(Boolean).join('  ·  ')}
            </span>
          </figcaption>
        )}
      </figure>

      {photos.length > 1 && (
        <>
          <button type="button" className="absolute top-1/2 -mt-[26px] hidden size-[52px] place-items-center rounded-[50%] border border-line-2 bg-[rgb(11_12_14/0.6)] text-fg [transition:background-color_var(--dur-2)_var(--ease),border-color_var(--dur-2)_var(--ease)] hover:border-line-3 hover:bg-surface-3 md:hoverable:grid left-5" onClick={prev} aria-label="Previous photo">
            <ArrowLeft size={22} />
          </button>
          <button type="button" className="absolute top-1/2 -mt-[26px] hidden size-[52px] place-items-center rounded-[50%] border border-line-2 bg-[rgb(11_12_14/0.6)] text-fg [transition:background-color_var(--dur-2)_var(--ease),border-color_var(--dur-2)_var(--ease)] hover:border-line-3 hover:bg-surface-3 md:hoverable:grid right-5" onClick={next} aria-label="Next photo">
            <ArrowRight size={22} />
          </button>
        </>
      )}

      <div className="pointer-events-none absolute size-px overflow-hidden opacity-0" aria-hidden="true">
        {neighbours.map((p) =>
          p ? <Image key={p.key} src={p.image.src} alt="" width={p.image.width} height={p.image.height} sizes="100vw" /> : null,
        )}
      </div>
    </div>,
    document.body,
  )
}
