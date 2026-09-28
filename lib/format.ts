const TZ = 'America/New_York'

export const pad2 = (n: number) => String(n).padStart(2, '0')

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...opts }).format(new Date(iso))
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}

/** Parts for a calendar-style date block. */
export function dateParts(iso: string) {
  const d = new Date(iso)
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...o }).format(d)
  return { day: f({ day: '2-digit' }), month: f({ month: 'short' }), year: f({ year: 'numeric' }), weekday: f({ weekday: 'short' }) }
}

/** "Sat, Nov 7 · 2:00 – 6:00 PM" style summary. */
export function eventWhen(e: { start: string; end: string | null; allDay: boolean }) {
  const sameDay = !e.end || formatDate(e.start) === formatDate(e.end)
  const startDate = formatDate(e.start, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  if (e.allDay) {
    return sameDay ? startDate : `${formatDate(e.start, { month: 'short', day: 'numeric' })} – ${formatDate(e.end!, { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  if (sameDay) return `${startDate} · ${formatTime(e.start)}${e.end ? ` – ${formatTime(e.end)}` : ''}`
  return `${formatDate(e.start, { month: 'short', day: 'numeric' })}, ${formatTime(e.start)} – ${formatDate(e.end!, { month: 'short', day: 'numeric', year: 'numeric' })}, ${formatTime(e.end!)}`
}

export function youTubeId(url: string | null | undefined) {
  if (!url) return null
  const m = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/.exec(url)
  return m ? m[1] : null
}

export const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith('mailto:')

const configuredUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vtcro.org').replace(/\/$/, '')

/**
 * The address the live site is actually served from, used for link previews, canonical links and the sitemap.
 * Vercel reports the project's production domain: the vercel.app address until vtcro.org is connected, then
 * vtcro.org. While vtcro.org still points elsewhere (the old Webflow site), links must use the vercel.app
 * address or previews break. Once the domain is connected, the configured www address is used.
 */
function resolveSiteUrl() {
  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (process.env.VERCEL_ENV !== 'production' || !production) return configuredUrl
  const bare = (host: string) => host.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  return bare(production) === bare(configuredUrl) ? configuredUrl : `https://${production}`
}

export const siteUrl = resolveSiteUrl()

/** Link-preview image (the VT CRO logo) used when a page has no photo of its own. */
export const DEFAULT_SHARE_IMAGE = { url: '/og-default.jpg', width: 1200, height: 630, alt: 'VT CRO' }
