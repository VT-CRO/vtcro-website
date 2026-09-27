import Image from 'next/image'
import type { ReactNode } from 'react'
import type { Img } from '@/lib/content'

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
export function Section({ children, id, tone, background, labelledBy, className = '', first }: Props) {
  const cls = ['sec', tone === 'light' && 'theme-light', background && 'sec--image', first && 'page-top', className].filter(Boolean).join(' ')
  return (
    <section id={id} aria-labelledby={labelledBy} className={cls}>
      {background && (
        <div className="sec__bg" aria-hidden="true">
          <Image src={background.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: background.position }} />
        </div>
      )}
      <div className="container">{children}</div>
    </section>
  )
}
