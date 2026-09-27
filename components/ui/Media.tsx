import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Img } from '@/lib/content'
import styles from './Media.module.css'

type Props = {
  img: Img | null
  /** Shown on the placeholder when no image has been uploaded yet, e.g. "AutoNav · cover photo". */
  placeholder: string
  sizes: string
  className?: string
  preload?: boolean
  /** Fit inside the frame instead of cropping (for logos). */
  contain?: boolean
  style?: CSSProperties
}

/**
 * Fills its (positioned) parent with a CMS image, cropped around the manager's hotspot.
 * If the image hasn't been provided yet, renders a clearly labeled placeholder instead,
 * so layouts never break while assets are missing.
 */
export function Media({ img, placeholder, sizes, className, preload, contain, style }: Props) {
  if (!img) return <Placeholder label={placeholder} className={className} style={style} />
  return (
    <Image
      src={img.src}
      alt={img.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={`${styles.img} ${className ?? ''}`}
      style={{ objectFit: contain ? 'contain' : 'cover', objectPosition: img.position, ...style }}
    />
  )
}

export function Placeholder({ label, className, style, compact }: { label: string; className?: string; style?: CSSProperties; compact?: boolean }) {
  return (
    <div className={`${styles.placeholder} ${compact ? styles.compact : ''} ${className ?? ''}`} style={style} role="img" aria-label={`Placeholder: ${label}`}>
      <span className={styles.mark} aria-hidden="true" />
      {!compact && (
        <span className={styles.label}>
          <span>Placeholder</span>
          {label}
        </span>
      )}
    </div>
  )
}
