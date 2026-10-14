import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Img } from '@/lib/content'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  id?: string
  tone?: 'dark' | 'light' | null
  /** Optional photo covering the whole section under a soft overlay. */
  background?: Img | null
  labelledBy?: string
  className?: string
  /** First section of a page without a hero (adds room for the fixed header). */
  first?: boolean
}

/** Every page section goes through this, so spacing and the light/dark rhythm stay consistent. */
export function Section({ children, id, tone, background, labelledBy, className, first }: Props) {
  const light = tone === 'light'
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-slot="section"
      className={cn(
        'relative isolate bg-background py-(--section-y)',
        light && 'theme-light',
        // A hairline between two plain dark sections in a row.
        !light && !background && '[[data-slot=section]+&]:border-t [[data-slot=section]+&]:border-t-line',
        first && 'pt-[calc(var(--header-h)+clamp(48px,7vw,96px))]',
        // The photo covers the entire section under a soft overlay (no gaps).
        background && "overflow-hidden before:absolute before:inset-0 before:-z-1 before:bg-[rgb(10_10_11/0.82)] before:content-['']",
        background && light && 'before:bg-[rgb(244_244_242/0.9)]',
        className,
      )}
    >
      {background && (
        <div className="absolute inset-0 -z-2 [&_img]:[filter:grayscale(1)]" aria-hidden="true">
          <Image src={background.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: background.position }} />
        </div>
      )}
      <div className="site-container">{children}</div>
    </section>
  )
}
