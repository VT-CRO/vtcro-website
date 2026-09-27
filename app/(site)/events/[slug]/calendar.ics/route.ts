import { getEvent } from '@/lib/content'
import { siteUrl } from '@/lib/format'

export const revalidate = 3600

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\;')

/** "Add to calendar": a standard .ics file generated from the event record. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const data = await getEvent((await params).slug)
  if (!data) return new Response('Not found', { status: 404 })
  const e = data.event
  const end = e.end ?? new Date(new Date(e.start).getTime() + 2 * 3600_000).toISOString()
  const where = [e.location.name, e.location.address].filter(Boolean).join(', ')
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VT CRO//Website//EN',
    'BEGIN:VEVENT',
    `UID:${e.id}@vtcro.org`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(e.name)}`,
    where && `LOCATION:${esc(where)}`,
    e.shortDescription && `DESCRIPTION:${esc(e.shortDescription)}`,
    `URL:${siteUrl}/events/${e.slug}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${e.slug}.ics"`,
    },
  })
}
