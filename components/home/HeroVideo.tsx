'use client'

import { useEffect, useState } from 'react'

/** Muted background loop. Skipped entirely for visitors who prefer reduced motion or save data. */
export function HeroVideo({ src, className }: { src: string; className?: string }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as any).connection?.saveData
    setEnabled(!reduce && !saveData)
  }, [])
  if (!enabled) return null
  return <video className={className} src={src} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
}
