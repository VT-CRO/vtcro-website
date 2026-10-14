import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, CalendarIcon, ClockIcon, PinIcon } from '@/components/icons'
import { PhotoGrid } from '@/components/photos/PhotoGrid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/ui/Media'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getEvent, getEvents } from '@/lib/content'
import { dateParts, eventWhen, DEFAULT_SHARE_IMAGE } from '@/lib/format'

export const revalidate = false

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

const factClass = 'grid gap-2 border-b border-line py-4'
const factTitle = 'flex items-center gap-2 text-fg-3'
const dateLabel = 'font-mono text-[0.7rem] tracking-[0.12em] uppercase'

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
    <article className="relative [background:radial-gradient(50%_40%_at_15%_0%,rgb(255_255_255/0.048),transparent_70%),var(--bg)] pt-[calc(var(--header-h)+clamp(28px,5vw,56px))] pb-(--section-y)">
      <div className="site-container">
        <Link href="/events" className="link-arrow text-fg-2">
          <ArrowLeft size={16} /> Events
        </Link>

        <header className="mt-[clamp(24px,4vw,48px)] grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 border-b border-line pb-[clamp(32px,5vw,56px)] sm:gap-8">
          <div className="grid w-[72px] justify-items-center rounded-[14px] pt-3 pb-3.5 tabular-nums [box-shadow:0_0_0_1px_var(--line-2)_inset]" aria-hidden="true">
            <span className={`${dateLabel} text-fg`}>{d.month}</span>
            <span className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.04em] sm:text-[2.8rem]">{d.day}</span>
            <span className={`${dateLabel} text-fg-3`}>{d.year}</span>
          </div>
          <div className="grid min-w-0 gap-3.5 [&>*]:min-w-0">
            <p className="t-label">
              {isUpcoming ? 'Upcoming' : 'Past event'}
              {event.category ? ` · ${event.category}` : ''}
            </p>
            <h1 className="t-h1">{event.name}</h1>
            {event.shortDescription && <p className="t-lead">{event.shortDescription}</p>}
          </div>
        </header>

        <div className="mt-[clamp(32px,5vw,56px)] grid gap-9 min-[1000px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] min-[1000px]:items-start min-[1000px]:gap-[72px]">
          <aside className="min-[1000px]:sticky min-[1000px]:top-[calc(var(--header-h)+32px)]">
            <dl className="grid border-t border-line-2 [&_dd]:font-medium">
              <div className={factClass}>
                <dt className={factTitle}>
                  <ClockIcon size={16} /> <span className="t-label">When</span>
                </dt>
                <dd>{eventWhen(event)}</dd>
              </div>
              {where && (
                <div className={factClass}>
                  <dt className={factTitle}>
                    <PinIcon size={16} /> <span className="t-label">Where</span>
                  </dt>
                  <dd>
                    {event.location.mapUrl ? (
                      <a href={event.location.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 border-b border-line-3">
                        {where} <ArrowUpRight size={13} />
                      </a>
                    ) : (
                      where
                    )}
                  </dd>
                </div>
              )}
              {event.teams.length > 0 && (
                <div className={factClass}>
                  <dt className={factTitle}>
                    <span className="t-label">Teams</span>
                  </dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {event.teams.map((t) => (
                      <Badge asChild key={t.id}>
                        <Link href={`/teams/${t.slug}`}>{t.code || t.name}</Link>
                      </Badge>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-6 grid gap-2.5">
              {isUpcoming && event.registrationUrl && (
                <Button asChild className="w-full">
                  <a href={event.registrationUrl} target="_blank" rel="noreferrer">
                    Register <ArrowUpRight size={16} />
                  </a>
                </Button>
              )}
              {event.externalUrl && (
                <Button asChild variant="secondary" className="w-full">
                  <a href={event.externalUrl} target="_blank" rel="noreferrer">
                    Event website <ArrowUpRight size={16} />
                  </a>
                </Button>
              )}
              {isUpcoming && (
                <Button asChild variant="secondary" className="w-full">
                  <a href={`/events/${event.slug}/calendar.ics`}>
                    <CalendarIcon size={16} className="icon-static" /> Add to calendar
                  </a>
                </Button>
              )}
            </div>
          </aside>

          <div className="grid min-w-0 gap-8">
            <div className="relative aspect-video overflow-hidden rounded-(--radius-m)">
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
