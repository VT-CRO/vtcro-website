import dims from '@/seed/image-dims.json'
import { dataset, projectId } from '@/sanity/env'
import type { Img } from './types'

const seedDims = dims as Record<string, { w: number; h: number }>

/**
 * Turns a CMS image field into a plain { src, width, height, alt, position } object.
 * Handles Sanity assets (with crop + hotspot) and the local sample images.
 */
export function toImg(raw: any, fallbackAlt = ''): Img | null {
  if (!raw) return null
  const alt = (raw.alt ?? fallbackAlt ?? '').trim()

  if (typeof raw._seed === 'string') {
    const d = seedDims[raw._seed]
    if (!d) return null
    return { src: raw._seed, width: d.w, height: d.h, alt, position: hotspotPosition(raw.hotspot) }
  }

  const ref: string | undefined = raw.asset?._ref
  if (!ref) return null
  // Asset ids look like: image-<hash>-<width>x<height>-<format>
  const match = /^image-([a-f0-9]+)-(\d+)x(\d+)-(\w+)$/.exec(ref)
  if (!match) return null
  const [, hash, w, h, format] = match
  let width = Number(w)
  let height = Number(h)
  let src = `https://cdn.sanity.io/images/${projectId}/${dataset}/${hash}-${w}x${h}.${format}`

  const crop = raw.crop
  let position = hotspotPosition(raw.hotspot)
  if (crop && (crop.left || crop.right || crop.top || crop.bottom)) {
    const left = Math.round(crop.left * width)
    const top = Math.round(crop.top * height)
    const cw = Math.round((1 - crop.left - crop.right) * width)
    const ch = Math.round((1 - crop.top - crop.bottom) * height)
    src += `?rect=${left},${top},${cw},${ch}`
    if (raw.hotspot) {
      const x = (raw.hotspot.x - crop.left) / (1 - crop.left - crop.right)
      const y = (raw.hotspot.y - crop.top) / (1 - crop.top - crop.bottom)
      position = `${pct(x)} ${pct(y)}`
    }
    width = cw
    height = ch
  }
  return { src, width, height, alt, position }
}

/** URL of an uploaded file (PDF, video). */
export function toFileUrl(raw: any): string | null {
  if (!raw) return null
  if (typeof raw._seed === 'string') return raw._seed
  const ref: string | undefined = raw.asset?._ref
  const match = ref && /^file-([a-f0-9]+)-(\w+)$/.exec(ref)
  if (!match) return null
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${match[1]}.${match[2]}`
}

function hotspotPosition(h: any) {
  if (!h || typeof h.x !== 'number') return '50% 50%'
  return `${pct(h.x)} ${pct(h.y)}`
}

const pct = (n: number) => `${Math.round(Math.min(1, Math.max(0, n)) * 1000) / 10}%`
