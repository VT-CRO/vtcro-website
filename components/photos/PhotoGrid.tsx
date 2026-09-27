'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { Photo } from '@/lib/content'
import { Lightbox } from './Lightbox'
import styles from './PhotoGrid.module.css'

const PAGE = 48

/**
 * Justified photo grid: every row fills the width while each photo keeps its own aspect
 * ratio. Works for any mix of portrait/landscape images and paginates large albums.
 */
export function PhotoGrid({ photos, openKey }: { photos: Photo[]; openKey?: string | null }) {
  const [open, setOpen] = useState<number | null>(null)
  const [limit, setLimit] = useState(PAGE)

  useEffect(() => {
    if (!openKey) return
    const i = photos.findIndex((p) => p.key === openKey)
    if (i >= 0) {
      setLimit((l) => Math.max(l, i + 1))
      setOpen(i)
    }
  }, [openKey, photos])

  useEffect(() => setLimit(PAGE), [photos])

  const visible = photos.slice(0, limit)

  return (
    <>
      <ul className={styles.grid}>
        {visible.map((p, i) => {
          const ar = p.image.width / p.image.height
          return (
            <li key={p.key} className={styles.item} style={{ ['--ar' as string]: ar }}>
              <button type="button" className={styles.button} onClick={() => setOpen(i)} aria-label={`Open photo${p.image.alt ? `: ${p.image.alt}` : ''}`}>
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes={`(min-width: 1200px) ${Math.round(Math.min(60, ar * 22))}vw, (min-width: 700px) ${Math.round(Math.min(90, ar * 34))}vw, ${Math.round(Math.min(100, ar * 55))}vw`}
                  style={{ objectFit: 'cover', objectPosition: p.image.position }}
                />
              </button>
            </li>
          )
        })}
        <li className={styles.filler} aria-hidden="true" />
      </ul>

      {photos.length > limit && (
        <div className={styles.more}>
          <button type="button" className="btn btn--secondary" onClick={() => setLimit((l) => l + PAGE)}>
            Show more photos
            <span className="t-meta">
              {limit} / {photos.length}
            </span>
          </button>
        </div>
      )}

      {open !== null && <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  )
}
