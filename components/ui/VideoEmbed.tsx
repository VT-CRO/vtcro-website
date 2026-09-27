'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PlayIcon } from '@/components/icons'
import type { Img } from '@/lib/content'
import { youTubeId } from '@/lib/format'
import styles from './VideoEmbed.module.css'

/**
 * YouTube video that loads only when played (a "facade"), so pages stay fast and
 * no third-party code runs until the visitor asks for it.
 */
export function VideoEmbed({ url, poster, title }: { url: string; poster?: Img | null; title: string }) {
  const [playing, setPlaying] = useState(false)
  const id = youTubeId(url)
  if (!id) return null
  const thumb = poster?.src ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  return (
    <div className={styles.frame}>
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.facade} onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          <Image src={thumb} alt="" fill sizes="(min-width: 1100px) 60vw, 100vw" style={{ objectFit: 'cover', objectPosition: poster?.position }} unoptimized={!poster} />
          <span className={styles.scrim} />
          <span className={styles.play}>
            <PlayIcon size={22} />
          </span>
          <span className={styles.caption}>
            <span className="t-label">Video</span>
            <span>{title}</span>
          </span>
        </button>
      )}
    </div>
  )
}
