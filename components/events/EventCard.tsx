import Link from 'next/link'
import { ArrowRight, PinIcon } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import type { Event } from '@/lib/content'
import { dateParts, eventWhen } from '@/lib/format'
import styles from './EventCard.module.css'

/** Upcoming event: a calendar-style date block with details. `feature` makes it large with an image. */
export function EventCard({ event, feature = false, headingLevel: H = 'h3' }: { event: Event; feature?: boolean; headingLevel?: 'h2' | 'h3' }) {
  const d = dateParts(event.start)
  return (
    <Link href={`/events/${event.slug}`} className={`${styles.card} ${feature ? styles.feature : ''}`} data-reveal>
      {feature && (
        <div className={styles.media}>
          <Media img={event.image} placeholder={`${event.name} · event image`} sizes="(min-width: 1000px) 50vw, 100vw" className={styles.img} />
        </div>
      )}
      <div className={styles.body}>
        <div className={styles.date} aria-hidden="true">
          <span className={styles.month}>{d.month}</span>
          <span className={styles.day}>{d.day}</span>
          <span className={styles.weekday}>{d.weekday}</span>
        </div>
        <div className={styles.info}>
          {(event.featured || event.category) && (
            <p className="t-label">{[event.featured && feature ? 'Featured' : null, event.category].filter(Boolean).join(' · ')}</p>
          )}
          <H className={styles.name}>{event.name}</H>
          <p className={styles.when}>{eventWhen(event)}</p>
          {(event.location.name || event.location.address) && (
            <p className={styles.where}>
              <PinIcon size={14} />
              {[event.location.name, event.location.address].filter(Boolean).join(', ')}
            </p>
          )}
          {event.shortDescription && <p className={styles.desc}>{event.shortDescription}</p>}
          <span className={styles.more}>
            Details <ArrowRight size={15} />
          </span>
        </div>
      </div>
    </Link>
  )
}
