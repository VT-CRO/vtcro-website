import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { Img } from '@/lib/content'
import { cn } from '@/lib/utils'

type Props = {
  img: Img | null
  /** Shown on the placeholder when no image has been uploaded yet, e.g. "AutoNav · cover photo". */
  placeholder: string
  sizes: string
  className?: string
  preload?: boolean
  /** Fit inside the frame instead of cropping (for logos). */
  contain?: boolean
  /** Placeholder shows only the bird mark, with no "Placeholder" caption. */
  bare?: boolean
  style?: CSSProperties
}

/**
 * Fills its (positioned) parent with a CMS image, cropped around the manager's hotspot.
 * If the image hasn't been provided yet, renders a clearly labeled placeholder instead,
 * so layouts never break while assets are missing.
 */
export function Media({ img, placeholder, sizes, className, preload, contain, bare, style }: Props) {
  if (!img) return <Placeholder label={placeholder} className={className} style={style} compact={bare} />
  return (
    <Image
      src={img.src}
      alt={img.alt}
      fill
      sizes={sizes}
      preload={preload}
      className={cn('[transition:transform_1100ms_var(--ease)]', className)}
      style={{ objectFit: contain ? 'contain' : 'cover', objectPosition: img.position, ...style }}
    />
  )
}

export function Placeholder({ label, className, style, compact }: { label: string; className?: string; style?: CSSProperties; compact?: boolean }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex flex-col items-center justify-center gap-3.5 overflow-hidden p-4 text-center text-fg-3 [box-shadow:inset_0_0_0_1px_var(--line)]',
        compact
          ? '[background:radial-gradient(farthest-corner_at_50%_50%,rgb(255_255_255/0.085),transparent_100%),var(--surface-2)]'
          : '[background:repeating-linear-gradient(135deg,rgb(255_255_255/0.028)_0_1px,transparent_1px_11px),var(--surface-2)]',
        className,
      )}
      style={style}
      role="img"
      aria-label={`Placeholder: ${label}`}
    >
      {compact ? (
        // On light sections (e.g. the people on team pages) the bird is shown in black.
        <span
          className="aspect-[589/438] w-[56%] [background:url('/brand/mark-white.png')_center/contain_no-repeat] [filter:drop-shadow(0_0_14px_rgb(255_255_255/0.16))_drop-shadow(0_10px_12px_rgb(0_0_0/0.9))] in-[.theme-light]:[background-image:url('/brand/mark-black.png')] in-[.theme-light]:[filter:drop-shadow(0_8px_10px_rgb(0_0_0/0.12))]"
          aria-hidden="true"
        />
      ) : (
        <span
          className="aspect-[589/438] w-[clamp(40px,22%,88px)] bg-current opacity-35 [-webkit-mask:url('/brand/mark-white-sm.png')_center/contain_no-repeat] [mask:url('/brand/mark-white-sm.png')_center/contain_no-repeat]"
          aria-hidden="true"
        />
      )}
      {!compact && (
        <span className="grid max-w-[28ch] gap-0.5 font-mono text-[0.66rem] leading-[1.5] tracking-[0.1em] uppercase [&_span]:text-accent [&_span]:opacity-85">
          <span>Placeholder</span>
          {label}
        </span>
      )}
    </div>
  )
}
