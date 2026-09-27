import type { Metadata } from 'next'
import Link from 'next/link'
import { EventCard } from '@/components/events/EventCard'
import { ArrowRight, ArrowUpRight, CalendarIcon, InstagramIcon } from '@/components/icons'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getEvents, getSite } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './page.module.css'
import { ComingSoon } from '@/components/ui/ComingSoon'

// Events move from Upcoming to Past on their own; refresh at least hourly.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past VT CRO events, competitions, and outreach.',
  alternates: { canonical: '/events' },
}

export default async function EventsPage() {
  const [{ upcoming, past }, site] = await Promise.all([getEvents(), getSite()])
  const featured = upcoming.find((e) => e.featured) ?? upcoming[0]
  const rest = upcoming.filter((e) => e !== featured)
  const years = [...new Set(past.map((e) => formatDate(e.start, { year: 'numeric' })))]

  if (!upcoming.length && !past.length) {
    return (
      <Section first>
        <ComingSoon label="Events" as="h1" page />
      </Section>
    )
  }

  return (
    <>
      <Section first labelledBy="upcoming-heading">
        <SectionHeader as="h1" heading="Upcoming Events" id="upcoming-heading" />
        {featured ? (
          <div className={styles.upcoming}>
            <EventCard event={featured} feature headingLevel="h2" />
            {rest.length > 0 && (
              <div className="events-grid">
                {rest.map((e) => (
                  <EventCard key={e.id} event={e} headingLevel="h2" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={`card ${styles.empty}`} data-reveal>
            <span className="icon-badge">
              <CalendarIcon size={22} />
            </span>
            <p className="t-h3">No upcoming events right now.</p>
            <p className="t-body">New events are announced here and on our social channels.</p>
            {site.instagram && (
              <a href={site.instagram} target="_blank" rel="noreferrer" className="btn btn--secondary">
                <InstagramIcon size={16} className="icon-static" /> Follow on Instagram <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </Section>

      {past.length > 0 && (
        <Section tone="light" labelledBy="past-heading">
          <SectionHeader heading="Past Events" id="past-heading" />
          <div className={styles.archive}>
            {years.map((year) => (
              <div key={year} className={styles.year} data-reveal>
                <p className={styles.yearNum}>{year}</p>
                <ol className={styles.rows}>
                  {past
                    .filter((e) => formatDate(e.start, { year: 'numeric' }) === year)
                    .map((e) => (
                      <li key={e.id}>
                        <Link href={`/events/${e.slug}`} className={`card ${styles.row}`}>
                          <span className="icon-badge icon-badge--mono">
                            <CalendarIcon size={18} />
                          </span>
                          <span className={styles.rowDate}>{formatDate(e.start, { month: 'short', day: 'numeric' })}</span>
                          <span className={styles.rowName}>{e.name}</span>
                          <span className={styles.rowWhere}>{e.location.name || e.location.address}</span>
                          <ArrowRight size={16} className={styles.rowArrow} />
                        </Link>
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  )
}
