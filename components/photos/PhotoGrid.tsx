'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { Photo } from '@/lib/content'
import { Lightbox } from './Lightbox'
import styles from './PhotoGrid.module.css'

const PAGE = 48
const MAX_PER_ROW = 8
const TRIM = 0.06

type Box = { x: number; y: number; w: number; h: number }

/**
 * Break photos into rows whose heights stay as close as possible to a target (minimum-cost line
 * breaking, like text justification). A row may be up to TRIM shorter or taller than its photos'
 * exact fit, so at most that much is trimmed from one edge of a photo; a row that would have to
 * grow too tall (e.g. a lone portrait) is capped and centred instead of being cropped.
 */
function justify(ars: number[], width: number, gap: number): { boxes: Box[]; height: number } {
  const target = Math.min(320, Math.max(200, width * 0.26))
  const minH = target * 0.65
  const maxH = target * 1.5
  const n = ars.length
  const fitHeight = (i: number, j: number, sum: number) => (width - gap * (j - i - 1)) / sum
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))
  // Nudge a row's exact-fit height toward the target, within the allowed trim.
  const rowHeight = (fit: number) => clamp(target, fit * (1 - TRIM), fit * (1 + TRIM))

  const cost = new Array<number>(n + 1).fill(Infinity)
  const from = new Array<number>(n + 1).fill(0)
  cost[0] = 0
  for (let j = 1; j <= n; j++) {
    let sum = 0
    for (let i = j - 1; i >= 0 && j - i <= MAX_PER_ROW; i--) {
      sum += ars[i]
      const fit = fitHeight(i, j, sum)
      const h = rowHeight(fit)
      let c = 0
      // The last row is never stretched above the target, so a short last row costs nothing.
      if (j < n || fit < target) {
        const d = Math.log(h / target)
        c = d * d + (h < minH || h > maxH ? 10 : 0)
      }
      if (cost[i] + c < cost[j]) {
        cost[j] = cost[i] + c
        from[j] = i
      }
      if (fit < minH) break
    }
  }

  const rows: [number, number][] = []
  for (let j = n; j > 0; j = from[j]) rows.unshift([from[j], j])

  const boxes: Box[] = []
  let y = 0
  rows.forEach(([i, j], r) => {
    const sum = ars.slice(i, j).reduce((a, b) => a + b, 0)
    const last = r === rows.length - 1
    const fit = fitHeight(i, j, sum)
    // Photos are sized from the exact fit (capped for a last or overly tall row); the row height may differ by up to TRIM.
    const scale = Math.min(fit, last ? target : maxH)
    const h = scale < fit ? scale : rowHeight(fit)
    const rowW = sum * scale + gap * (j - i - 1)
    let x = last ? 0 : (width - rowW) / 2
    const top = Math.round(y)
    const bottom = Math.round(y + h)
    for (let k = i; k < j; k++) {
      const w = ars[k] * scale
      const left = Math.round(x)
      boxes.push({ x: left, y: top, w: Math.round(x + w) - left, h: bottom - top })
      x += w + gap
    }
    y += h + gap
  })
  return { boxes, height: Math.round(y - gap) }
}

/**
 * Justified photo grid: rows fill the width at a consistent height while each photo keeps its own
 * aspect ratio. Works for any mix of portrait/landscape images and paginates large albums.
 */
export function PhotoGrid({ photos, openKey }: { photos: Photo[]; openKey?: string | null }) {
  const [open, setOpen] = useState<number | null>(null)
  const [limit, setLimit] = useState(PAGE)
  const grid = useRef<HTMLUListElement>(null)
  const [frame, setFrame] = useState<{ width: number; gap: number } | null>(null)

  useEffect(() => {
    if (!openKey) return
    const i = photos.findIndex((p) => p.key === openKey)
    if (i >= 0) {
      setLimit((l) => Math.max(l, i + 1))
      setOpen(i)
    }
  }, [openKey, photos])

  useEffect(() => setLimit(PAGE), [photos])

  // Measure the grid before paint and on every resize; until then the CSS flex layout is shown.
  useLayoutEffect(() => {
    const el = grid.current
    if (!el) return
    const measure = () => {
      const width = el.clientWidth
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0
      setFrame((f) => (width && (f?.width !== width || f.gap !== gap) ? { width, gap } : f))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const visible = useMemo(() => photos.slice(0, limit), [photos, limit])
  const ars = useMemo(() => visible.map((p) => p.image.width / p.image.height), [visible])
  const layout = useMemo(() => (frame ? justify(ars, frame.width, frame.gap) : null), [ars, frame])

  return (
    <>
      <ul
        ref={grid}
        className={`${styles.grid} ${layout ? styles.justified : ''}`}
        style={layout ? { height: layout.height } : undefined}
      >
        {visible.map((p, i) => {
          const ar = ars[i]
          const box = layout?.boxes[i]
          return (
            <li
              key={p.key}
              className={styles.item}
              style={box ? { left: box.x, top: box.y, width: box.w, height: box.h } : { ['--ar' as string]: ar }}
            >
              <button type="button" className={styles.button} onClick={() => setOpen(i)} aria-label={`Open photo${p.image.alt ? `: ${p.image.alt}` : ''}`}>
                <Image
                  src={p.image.src}
                  alt={p.image.alt}
                  fill
                  sizes={
                    box
                      ? `${box.w}px`
                      : `(min-width: 1200px) ${Math.round(Math.min(60, ar * 22))}vw, (min-width: 700px) ${Math.round(Math.min(90, ar * 34))}vw, ${Math.round(Math.min(100, ar * 55))}vw`
                  }
                  style={{ objectFit: 'cover', objectPosition: p.image.position }}
                />
              </button>
            </li>
          )
        })}
        {!layout && <li className={styles.filler} aria-hidden="true" />}
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
