import { cn } from '@/lib/utils'

type Props = {
  /** What is coming, e.g. "Members" or "Events". Shown as a small label above "Coming soon". */
  label: string
  /** Heading level for the label (the label names the section). */
  as?: 'h1' | 'h2' | 'p'
  id?: string
  /** Fill most of the screen (for a page whose only content is empty). */
  page?: boolean
}

/** The one "Coming soon" design, used wherever the CMS has nothing to list yet. Disappears once content is published. */
export function ComingSoon({ label, as: Label = 'p', id, page }: Props) {
  return (
    <div
      className={cn('grid content-center justify-items-center gap-3.5 py-[clamp(40px,8vw,96px)] text-center', page && 'min-h-[calc(62svh-var(--header-h))]')}
      data-reveal
    >
      <Label id={id} className="t-label m-0">
        {label}
      </Label>
      <p className="text-[clamp(2rem,1.4rem+3vw,3.4rem)] leading-[1.05] font-light tracking-[-0.035em] text-fg-2">Coming soon</p>
    </div>
  )
}
