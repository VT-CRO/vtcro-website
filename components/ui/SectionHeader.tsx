import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  heading: string
  intro?: string
  action?: ReactNode
  id?: string
  as?: 'h1' | 'h2'
  center?: boolean
}

/** Section title with an optional intro and action link. */
export function SectionHeader({ heading, intro, action, id, as: Tag = 'h2', center }: Props) {
  return (
    <header
      className={cn(
        'mb-[clamp(40px,6vw,72px)] grid gap-5',
        center ? 'justify-items-center text-center' : 'min-[900px]:grid-cols-[minmax(0,1fr)_auto] min-[900px]:items-end min-[900px]:gap-12',
      )}
      data-reveal
    >
      <div className="grid gap-4">
        <Tag id={id} className="t-h2">
          {heading}
        </Tag>
        {intro && <p className={cn('t-lead max-w-[56ch]', center && 'mx-auto')}>{intro}</p>}
      </div>
      {action && <div>{action}</div>}
    </header>
  )
}
