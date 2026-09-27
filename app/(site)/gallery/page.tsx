import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ImageIcon } from '@/components/icons'
import { PhotoBrowser } from '@/components/photos/PhotoBrowser'
import { Media } from '@/components/ui/Media'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAlbums, getEvents, getPhotos } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './page.module.css'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos of VT CRO robots, competitions, builds, and events.',
  alternates: { canonical: '/gallery' },
}

export default async function PhotosPage() {
  const [photos, albums, { all: events }] = await Promise.all([getPhotos(), getAlbums(), getEvents()])
  // Featured photos first, then everything else by album date.
  const ordered = [...photos.filter((p) => p.featured), ...photos.filter((p) => !p.featured)]
  const eventFilters = events.filter((e) => photos.some((p) => p.eventSlug === e.slug)).map((e) => ({ slug: e.slug, label: e.name }))

  return (
    <>
      <Section first>
        <h1 className="sr-only">Gallery</h1>
        {photos.length ? (
          <Suspense>
            <PhotoBrowser photos={ordered} events={eventFilters} albums={albums.map((a) => ({ slug: a.slug, label: a.title }))} />
          </Suspense>
        ) : (
          <p className="t-lead">Photos will appear here once albums are added in the CMS.</p>
        )}
      </Section>

      {albums.length > 1 && (
        <Section tone="light" labelledBy="albums-heading">
          <SectionHeader heading="Albums" id="albums-heading" />
          <ul className={styles.albums}>
            {albums.map((a) => (
              <li key={a.id} data-reveal>
                <Link href={`/gallery/${a.slug}`} className={styles.album}>
                  <div className={styles.cover}>
                    <Media img={a.cover} placeholder={`${a.title} · cover`} sizes="(min-width: 1000px) 33vw, (min-width: 640px) 50vw, 100vw" className={styles.coverImg} />
                  </div>
                  <div className={styles.albumText}>
                    <span className="icon-badge icon-badge--mono">
                      <ImageIcon size={20} />
                    </span>
                    <div>
                      <h3 className={styles.albumTitle}>{a.title}</h3>
                      <p className="t-meta">{[a.date ? formatDate(a.date, { month: 'short', year: 'numeric' }) : null, `${a.photos.length} photos`].filter(Boolean).join('  ·  ')}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
