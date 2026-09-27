import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CalendarIcon, ClockIcon, PinIcon } from '@/components/icons'
import { PhotoGrid } from '@/components/photos/PhotoGrid'
import { Media } from '@/components/ui/Media'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getEvent, getEvents } from '@/lib/content'
import { dateParts, eventWhen, DEFAULT_SHARE_IMAGE } from '@/lib/format'
import styles from './page.module.css'

export const revalidate = 3600

export async function generateStaticParams() {
  return (await getEvents()).all.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await getEvent((await params).slug)
  if (!data) return {}
  const { event } = data
  return {
    title: event.name,
    description: event.shortDescription || `${eventWhen(event)}. ${event.location.name}`,
    alternates: { canonical: `/events/${event.slug}` },
    robots: event.isPlaceholder ? { index: false } : undefined,
    openGraph: { images: event.image ? [{ url: event.image.src, alt: event.image.alt }] : [DEFAULT_SHARE_IMAGE] },
  }
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const data = await getEvent((await params).slug)
  if (!data) notFound()
  const { event, isUpcoming, photos } = data
  const d = dateParts(event.start)
  const where = [event.location.name, event.location.address].filter(Boolean).join(', ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    startDate: event.start,
    endDate: event.end ?? undefined,
    description: event.shortDescription || undefined,
    location: where ? { '@type': 'Place', name: event.location.name || where, address: event.location.address || undefined } : undefined,
    organizer: { '@type': 'Organization', name: 'VT CRO' },
    image: event.image?.src,
  }

  return (
    <article className={styles.page}>
      <div className="container">
        <Link href="/events" className={`link-arrow ${styles.back}`}>
          <ArrowLeft size={16} /> Events
        </Link>

        <header className={styles.header}>
          <div className={styles.dateBlock} aria-hidden="true">
            <span className={styles.month}>{d.month}</span>
            <span className={styles.day}>{d.day}</span>
            <span className={styles.year}>{d.year}</span>
          </div>
          <div className={styles.titleCol}>
            <p className="t-label">
              {isUpcoming ? 'Upcoming' : 'Past event'}
              {event.category ? ` · ${event.category}` : ''}
            </p>
            <h1 className="t-h1">{event.name}</h1>
            {event.shortDescription && <p className="t-lead">{event.shortDescription}</p>}
          </div>
        </header>

        <div className={styles.grid}>
          <aside className={styles.aside}>
            <dl className={styles.facts}>
              <div>
                <dt>
                  <ClockIcon size={16} /> <span className="t-label">When</span>
                </dt>
                <dd>{eventWhen(event)}</dd>
              </div>
              {where && (
                <div>
                  <dt>
                    <PinIcon size={16} /> <span className="t-label">Where</span>
                  </dt>
                  <dd>
                    {event.location.mapUrl ? (
                      <a href={event.location.mapUrl} target="_blank" rel="noreferrer" className={styles.inline}>
                        {where} <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      where
                    )}
                  </dd>
                </div>
              )}
              {event.teams.length > 0 && (
                <div>
                  <dt>
                    <span className="t-label">Teams</span>
                  </dt>
                  <dd className={styles.chips}>
                    {event.teams.map((t) => (
                      <Link key={t.id} href={`/teams/${t.slug}`} className="chip">
                        {t.code || t.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            <div className={styles.actions}>
              {isUpcoming && event.registrationUrl && (
                <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="btn btn--primary btn--block">
                  Register <ArrowUpRight size={16} />
                </a>
              )}
              {event.externalUrl && (
                <a href={event.externalUrl} target="_blank" rel="noreferrer" className="btn btn--secondary btn--block">
                  Event website <ArrowUpRight size={16} />
                </a>
              )}
              {isUpcoming && (
                <a href={`/events/${event.slug}/calendar.ics`} className="btn btn--secondary btn--block">
                  <CalendarIcon size={16} className="icon-static" /> Add to calendar
                </a>
              )}
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.image}>
              <Media img={event.image} placeholder={`${event.name} · event image`} sizes="(min-width: 1000px) 60vw, 100vw" preload />
            </div>
            <RichText value={event.body} />
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <Section labelledBy="event-photos">
          <SectionHeader heading="Photos from this event" id="event-photos" />
          <PhotoGrid photos={photos} />
        </Section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  )
}
