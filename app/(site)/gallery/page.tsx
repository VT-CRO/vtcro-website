import type { Metadata } from 'next'
import { PhotoGrid } from '@/components/photos/PhotoGrid'
import { Section } from '@/components/ui/Section'
import { getPhotos } from '@/lib/content'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Photos of VT CRO robots, competitions, lab builds and events at Virginia Tech, from the CRO-Down VEX competition and CRO Expo to outreach and team life.',
  alternates: { canonical: '/gallery' },
}

/** Fisher–Yates shuffle (returns a new array). */
function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default async function PhotosPage() {
  const photos = await getPhotos()
  // Every photo from every album in one grid, no filters. Featured photos first, then everything else
  // shuffled. The page is cached, so the order changes whenever it is rebuilt (after a Publish in the
  // CMS, or at most hourly), not on every visit.
  const ordered = [...shuffle(photos.filter((p) => p.featured)), ...shuffle(photos.filter((p) => !p.featured))]

  return (
    <Section first>
      <h1 className="sr-only">Gallery</h1>
      {photos.length ? <PhotoGrid photos={ordered} /> : <ComingSoon label="Gallery" page />}
    </Section>
  )
}
