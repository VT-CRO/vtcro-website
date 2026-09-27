'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import type { Photo } from '@/lib/content'
import { PhotoGrid } from './PhotoGrid'
import styles from './PhotoBrowser.module.css'

type Filter = { id: string; label: string; kind: 'all' | 'event' | 'album' }

/** Gallery with team / event / album filters. Filters are reflected in the URL (?team=vexu). */
export function PhotoBrowser({
  photos,
  events,
  albums,
}: {
  photos: Photo[]
  events: { slug: string; label: string }[]
  albums: { slug: string; label: string }[]
}) {
  const params = useSearchParams()
  const [active, setActive] = useState<Filter>({ id: 'all', label: 'All', kind: 'all' })

  useEffect(() => {
    const e = params.get('event')
    const a = params.get('album')
    if (e) setActive({ id: e, label: e, kind: 'event' })
    else if (a) setActive({ id: a, label: a, kind: 'album' })
  }, [params])

  const choose = (f: Filter) => {
    setActive(f)
    const url = f.kind === 'all' ? location.pathname : `${location.pathname}?${f.kind}=${encodeURIComponent(f.id)}`
    history.replaceState(null, '', url)
  }

  const shown = useMemo(() => {
    if (active.kind === 'event') return photos.filter((p) => p.eventSlug === active.id)
    if (active.kind === 'album') return photos.filter((p) => p.album.slug === active.id)
    return photos
  }, [photos, active])

  const groups: { title: string; kind: Filter['kind']; items: { slug: string; label: string }[] }[] = [
    { title: 'Events', kind: 'event', items: events },
    { title: 'Albums', kind: 'album', items: albums.length > 1 ? albums : [] },
  ]

  const isActive = (kind: Filter['kind'], id: string) => active.kind === kind && active.id === id
  const hasFilters = groups.some((g) => g.items.length)

  return (
    <div>
      {hasFilters && (
      <div className={styles.filters} role="toolbar" aria-label="Filter photos">
        <div className={styles.scroller}>
          <button type="button" className={styles.chip} aria-pressed={active.kind === 'all'} onClick={() => choose({ id: 'all', label: 'All', kind: 'all' })}>
            All <span className={styles.count}>{photos.length}</span>
          </button>
          {groups
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.title} className={styles.group}>
                <span className={styles.groupLabel}>{g.title}</span>
                {g.items.map((it) => (
                  <button
                    key={it.slug}
                    type="button"
                    className={styles.chip}
                    aria-pressed={isActive(g.kind, it.slug)}
                    onClick={() => choose({ id: it.slug, label: it.label, kind: g.kind })}
                  >
                    {it.label}
                  </button>
                ))}
              </div>
            ))}
        </div>
      </div>
      )}

      <div className={styles.results}>
        {shown.length ? (
          <PhotoGrid photos={shown} openKey={params.get('photo')} />
        ) : (
          <p className={`t-body ${styles.empty}`}>No photos here yet.</p>
        )}
      </div>
    </div>
  )
}
