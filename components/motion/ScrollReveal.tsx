'use client'

import { animate, inView } from 'motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const EASE = [0.22, 0.61, 0.36, 1] as const // the site's --ease
const STAGGER = 0.07 // seconds between items that come into view together
const MAX_DELAY = 0.35

/**
 * Fades and lifts every `[data-reveal]` element the first time it scrolls into view.
 * Anything already on screen when the page appears is left alone, so content never
 * flashes hidden (and the page reads fine without JavaScript). Off for reduced motion.
 */
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const seen = new WeakSet<Element>()
    const waiting = new Set<HTMLElement>()
    const stops: VoidFunction[] = []
    let batch = 0
    let frame = 0

    const reset = (el: HTMLElement) => {
      el.style.opacity = ''
      el.style.transform = ''
    }

    const prepare = (el: HTMLElement) => {
      if (seen.has(el)) return
      seen.add(el)
      if (el.getBoundingClientRect().top < window.innerHeight) return
      el.style.opacity = '0'
      el.style.transform = 'translateY(16px)'
      waiting.add(el)
      stops.push(
        inView(
          el,
          () => {
            waiting.delete(el)
            const delay = Math.min(batch++ * STAGGER, MAX_DELAY)
            cancelAnimationFrame(frame)
            frame = requestAnimationFrame(() => (batch = 0))
            // Clear the inline styles afterwards so hover transforms in the CSS keep working.
            animate(el, { opacity: 1, transform: 'translateY(0px)' }, { duration: 0.6, ease: EASE, delay }).finished.then(() =>
              requestAnimationFrame(() => reset(el)),
            )
          },
          { amount: 0.1 },
        ),
      )
    }

    const scan = () => document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(prepare)
    scan()
    // Pick up content that streams in or appears later.
    const observer = new MutationObserver(scan)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      stops.forEach((stop) => stop())
      cancelAnimationFrame(frame)
      waiting.forEach(reset)
    }
  }, [pathname])

  return null
}
