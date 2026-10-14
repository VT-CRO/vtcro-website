import Link from 'next/link'
import { ArrowRight, PinIcon } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import type { Event } from '@/lib/content'
import { dateParts, eventWhen } from '@/lib/format'
import { cn } from '@/lib/utils'

/** Upcoming event: a calendar-style date block with details. `feature` makes it large with an image. */
export function EventCard({ event, feature = false, headingLevel: H = 'h3' }: { event: Event; feature?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const d = dateParts(event.start)
  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        'group/event grid overflow-hidden rounded-(--radius-l) bg-[linear-gradient(160deg,rgb(255_255_255/0.06),rgb(255_255_255/0.015))] [box-shadow:inset_0_0_0_1px_var(--line),var(--shadow-1)] [transition:transform_var(--dur-2)_var(--ease-spring),box-shadow_var(--dur-2)_var(--ease)]',
        'hover:[transform:translateY(-4px)] hover:[box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.135),0_30px_60px_-30px_rgb(0_0_0/0.45)]',
        feature && 'min-[1000px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]',
      )}
      data-reveal
    >
      {feature && (
        <div className="relative aspect-video overflow-hidden min-[1000px]:aspect-auto min-[1000px]:min-h-[380px]">
          <Media
            img={event.image}
            placeholder={`${event.name} · event image`}
            sizes="(min-width: 1000px) 50vw, 100vw"
            className="hoverable:group-hover/event:[transform:scale(1.04)]"
          />
        </div>
      )}
      <div
        className={cn(
          'grid grid-cols-[64px_minmax(0,1fr)] gap-[18px] p-5',
          feature && 'min-[1000px]:grid-cols-[76px_minmax(0,1fr)] min-[1000px]:content-center min-[1000px]:gap-6 min-[1000px]:p-9',
        )}
      >
        <div className="grid content-start justify-items-center gap-0.5 rounded-[12px] pt-2.5 pb-3 tabular-nums [box-shadow:0_0_0_1px_var(--line-2)_inset]" aria-hidden="true">
          <span className="font-mono text-[0.66rem] tracking-[0.12em] text-fg uppercase">{d.month}</span>
          <span className={cn('text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.04em]', feature && 'min-[1000px]:text-[2.2rem]')}>{d.day}</span>
          <span className="font-mono text-[0.66rem] tracking-[0.12em] text-fg-3 uppercase">{d.weekday}</span>
        </div>
        <div className="grid min-w-0 content-start gap-2">
          {(event.featured || event.category) && (
            <p className="t-label">{[event.featured && feature ? 'Featured' : null, event.category].filter(Boolean).join(' · ')}</p>
          )}
          <H className={cn('text-[1.2rem] leading-[1.25] font-semibold tracking-[-0.02em]', feature && 'min-[1000px]:text-[1.75rem] min-[1000px]:tracking-[-0.03em]')}>
            {event.name}
          </H>
          <p className="font-mono text-[0.78rem] text-fg-2">{eventWhen(event)}</p>
          {(event.location.name || event.location.address) && (
            <p className="flex items-start gap-1.5 text-[0.875rem] text-fg-2 [&_svg]:mt-[3px] [&_svg]:flex-none [&_svg]:text-fg-3">
              <PinIcon size={14} />
              {[event.location.name, event.location.address].filter(Boolean).join(', ')}
            </p>
          )}
          {event.shortDescription && <p className="line-clamp-3 text-[0.875rem] leading-[1.55] text-fg-2">{event.shortDescription}</p>}
          <span className="mt-1 inline-flex items-center gap-2 text-[0.8125rem] font-semibold [&_svg]:[transition:transform_var(--dur-2)_var(--ease)] hoverable:group-hover/event:[&_svg]:[transform:translateX(4px)]">
            Details <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  )
}
