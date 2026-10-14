'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PlayIcon } from '@/components/icons'
import type { Img } from '@/lib/content'
import { youTubeId } from '@/lib/format'

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
    <div className="relative aspect-video overflow-hidden rounded-(--radius-m) bg-surface-2 [box-shadow:inset_0_0_0_1px_var(--line)] [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:size-full [&_iframe]:border-0">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" className="group/facade absolute inset-0 w-full cursor-pointer" onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`}>
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(min-width: 1100px) 60vw, 100vw"
            className="[transition:transform_1100ms_var(--ease)] group-hover/facade:[transform:scale(1.03)]"
            style={{ objectFit: 'cover', objectPosition: poster?.position }}
            unoptimized={!poster}
          />
          <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(9_10_12/0.85),rgb(9_10_12/0.05)_55%)]" />
          <span className="absolute top-1/2 left-1/2 -mt-[34px] -ml-[34px] grid size-[68px] place-items-center rounded-[50%] bg-[rgb(241_241_238/0.95)] pl-[3px] text-background [box-shadow:0_10px_40px_rgb(0_0_0/0.35)] [transition:transform_var(--dur-2)_var(--ease)] group-hover/facade:[transform:scale(1.06)]">
            <PlayIcon size={22} />
          </span>
          <span className="absolute inset-x-5 bottom-4 grid gap-1 text-left text-[0.9375rem] font-semibold">
            <span className="t-label">Video</span>
            <span>{title}</span>
          </span>
        </button>
      )}
    </div>
  )
}
