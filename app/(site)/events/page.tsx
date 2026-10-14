import type { Metadata } from 'next'
import Link from 'next/link'
import { EventCard } from '@/components/events/EventCard'
import { EventGrid } from '@/components/events/EventGrid'
import { ArrowRight, ArrowUpRight, CalendarIcon, InstagramIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IconBadge } from '@/components/ui/icon-badge'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getEvents, getSite } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { ComingSoon } from '@/components/ui/ComingSoon'

// Events move from Upcoming to Past on their own; refresh at least hourly.
export const revalidate = false

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Upcoming and past VT CRO events at Virginia Tech, including the CRO-Down VEX robotics competition, the CRO Expo design team showcase, workshops and outreach.',
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
          <div className="grid gap-5">
            <EventCard event={featured} feature headingLevel="h2" />
            {rest.length > 0 && (
              <EventGrid>
                {rest.map((e) => (
                  <EventCard key={e.id} event={e} headingLevel="h2" />
                ))}
              </EventGrid>
            )}
          </div>
        ) : (
          <Card className="grid justify-items-start gap-3.5 p-[clamp(28px,5vw,56px)]" data-reveal>
            <IconBadge>
              <CalendarIcon size={22} />
            </IconBadge>
            <p className="t-h3">No upcoming events right now.</p>
            <p className="t-body">New events are announced here and on our social channels.</p>
            {site.instagram && (
              <Button asChild variant="secondary" className="mt-2">
                <a href={site.instagram} target="_blank" rel="noreferrer">
                  <InstagramIcon size={16} className="icon-static" /> Follow on Instagram <ArrowUpRight size={14} />
                </a>
              </Button>
            )}
          </Card>
        )}
      </Section>

      {past.length > 0 && (
        <Section tone="light" labelledBy="past-heading">
          <SectionHeader heading="Past Events" id="past-heading" />
          <div className="grid gap-10">
            {years.map((year) => (
              <div key={year} className="min-[900px]:grid min-[900px]:grid-cols-[minmax(0,3fr)_minmax(0,9fr)] min-[900px]:items-start min-[900px]:gap-8" data-reveal>
                <p className="mb-4 text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] leading-none font-medium tracking-[-0.05em] text-fg">{year}</p>
                <ol className="grid gap-2.5">
                  {past
                    .filter((e) => formatDate(e.start, { year: 'numeric' }) === year)
                    .map((e) => (
                      <li key={e.id}>
                        <Card
                          asChild
                          className={[
                            'group/row grid grid-cols-[40px_minmax(0,1fr)_20px] items-center gap-x-3.5 gap-y-0.5 py-3 pr-4 pl-3 min-[900px]:grid-cols-[40px_90px_minmax(0,1fr)_minmax(0,0.8fr)_20px]',
                            '[transition:transform_var(--dur-2)_var(--ease-spring),box-shadow_var(--dur-2)_var(--ease)] hoverable:hover:[transform:translateY(-2px)] hoverable:hover:[box-shadow:0_0_0_1px_rgb(255_255_255/0.09)_inset,0_20px_40px_-24px_rgb(0_0_0/0.45)]',
                          ].join(' ')}
                        >
                          <Link href={`/events/${e.slug}`}>
                            <IconBadge className="row-[span_2] [--size:40px] min-[900px]:row-auto">
                              <CalendarIcon size={18} />
                            </IconBadge>
                            <span className="col-2 font-mono text-[0.75rem] text-accent min-[900px]:col-auto">{formatDate(e.start, { month: 'short', day: 'numeric' })}</span>
                            <span className="col-2 font-semibold min-[900px]:col-auto">{e.name}</span>
                            <span className="hidden min-[900px]:block min-[900px]:text-[0.875rem] min-[900px]:text-fg-3">{e.location.name || e.location.address}</span>
                            <ArrowRight
                              size={16}
                              className="col-3 row-[1/span_2] text-fg-3 [transition:transform_var(--dur-2)_var(--ease)] min-[900px]:col-auto min-[900px]:row-auto hoverable:group-hover/row:[transform:translateX(4px)] hoverable:group-hover/row:text-fg"
                            />
                          </Link>
                        </Card>
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
