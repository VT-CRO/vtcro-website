import type { MetadataRoute } from 'next'
import { getAlbums, getEvents, getMembers, getTeams } from '@/lib/content'
import { siteUrl } from '@/lib/format'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [teams, members, { all: events }, albums] = await Promise.all([getTeams(), getMembers(), getEvents(), getAlbums()])
  const page = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${siteUrl}${path}`, priority })
  return [
    page('/', 1),
    page('/teams', 0.9),
    page('/team', 0.8),
    page('/events', 0.8),
    page('/apply', 0.9),
    page('/gallery', 0.7),
    page('/sponsor', 0.8),
    page('/contact', 0.6),
    ...teams.map((t) => page(`/teams/${t.slug}`, 0.8)),
    ...members.filter((m) => !m.isPlaceholder).map((m) => page(`/team/${m.slug}`, 0.4)),
    ...events.filter((e) => !e.isPlaceholder).map((e) => page(`/events/${e.slug}`, 0.6)),
    ...albums.map((a) => page(`/gallery/${a.slug}`, 0.5)),
  ]
}
