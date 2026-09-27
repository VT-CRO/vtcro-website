'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowRight, CloseIcon } from '@/components/icons'
import type { Photo } from '@/lib/content'
import styles from './Lightbox.module.css'

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
      className={`site ${styles.overlay}`}
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
      <div className={styles.bar}>
        <p className="t-meta" aria-live="polite">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </p>
        <button type="button" className={styles.close} onClick={onClose}>
          <span>Close</span>
          <CloseIcon size={20} />
        </button>
      </div>

      <figure className={styles.figure} onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className={styles.stage} style={{ transform: dragX ? `translateX(${dragX}px)` : undefined }}>
          <Image
            key={photo.key}
            src={photo.image.src}
            alt={photo.image.alt}
            width={photo.image.width}
            height={photo.image.height}
            sizes="100vw"
            className={styles.image}
            preload
          />
        </div>
        {(photo.caption || photo.credit || photo.album.title) && (
          <figcaption className={styles.caption}>
            {photo.caption && <span className={styles.captionText}>{photo.caption}</span>}
            <span className="t-meta">
              {[photo.album.title, photo.credit ? `Photo: ${photo.credit}` : null].filter(Boolean).join('  ·  ')}
            </span>
          </figcaption>
        )}
      </figure>

      {photos.length > 1 && (
        <>
          <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={prev} aria-label="Previous photo">
            <ArrowLeft size={22} />
          </button>
          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="Next photo">
            <ArrowRight size={22} />
          </button>
        </>
      )}

      <div className={styles.preload} aria-hidden="true">
        {neighbours.map((p) =>
          p ? <Image key={p.key} src={p.image.src} alt="" width={p.image.width} height={p.image.height} sizes="100vw" /> : null,
        )}
      </div>
    </div>,
    document.body,
  )
}
