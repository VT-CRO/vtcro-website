'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, CloseIcon, GitHubIcon, InstagramIcon } from '@/components/icons'
import styles from './SiteHeader.module.css'

export type NavTeam = { slug: string; name: string; code: string; logo: { src: string; alt: string } | null }

type Props = {
  nav: { href: string; label: string; icon?: string }[]
  github: string | null
  instagram: string | null
  applyOpen: boolean
  applyLabel: string
  teams: NavTeam[]
}

export function SiteHeader({ nav, github, instagram, applyOpen, applyLabel, teams }: Props) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 8)
        // Hide while scrolling down (mobile only via CSS), reveal on any upward scroll.
        if (Math.abs(y - lastY.current) > 6) {
          setHidden(y > lastY.current && y > 240)
          lastY.current = y
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Let sticky elements (e.g. filter bars) sit below the header only while it is visible.
  useEffect(() => {
    const root = document.documentElement
    if (hidden && !open) root.setAttribute('data-header-hidden', '')
    else root.removeAttribute('data-header-hidden')
  }, [hidden, open])

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={scrolled || undefined}
        data-hidden={(hidden && !open) || undefined}
      >
        <div className={`container ${styles.inner}`}>
          <Link href="/" className={styles.logo} aria-label="VT CRO home">
            <Image src="/brand/logo-full-white-sm.png" alt="VT CRO" width={520} height={126} preload loading="eager" />
          </Link>

          <nav className={styles.desktopNav} aria-label="Main">
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.navLink} aria-current={isActive(item.href) ? 'page' : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            {github && (
              <a href={github} className={styles.iconLink} target="_blank" rel="noreferrer" aria-label="VT CRO on GitHub">
                <GitHubIcon size={18} />
              </a>
            )}
            {instagram && (
              <a href={instagram} className={styles.iconLink} target="_blank" rel="noreferrer" aria-label="VT CRO on Instagram">
                <InstagramIcon size={17} />
              </a>
            )}
            <Link href="/apply" className={`btn btn--sm ${applyOpen ? 'btn--primary' : 'btn--secondary'} ${styles.apply}`}>
              <span className={`status-dot ${applyOpen ? 'status-dot--on' : ''}`} aria-hidden="true" />
              {applyLabel}
              <span className="sr-only">{applyOpen ? '(applications open)' : '(applications closed)'}</span>
            </Link>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span className={styles.menuGlyph} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        nav={nav}
        isActive={isActive}
        github={github}
        instagram={instagram}
        applyOpen={applyOpen}
        applyLabel={applyLabel}
        teams={teams}
      />
    </>
  )
}

function MobileMenu({
  open,
  onClose,
  nav,
  isActive,
  github,
  instagram,
  applyOpen,
  applyLabel,
  teams,
}: Omit<Props, never> & { open: boolean; onClose: () => void; isActive: (href: string) => boolean }) {
  const panel = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    const root = document.documentElement
    const main = document.getElementById('main')
    const footer = document.getElementById('site-footer')
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement
      root.style.overflow = 'hidden'
      main?.setAttribute('inert', '')
      footer?.setAttribute('inert', '')
      document.addEventListener('keydown', onKeyDown)
      requestAnimationFrame(() => closeBtn.current?.focus())
    }
    return () => {
      root.style.overflow = ''
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      document.removeEventListener('keydown', onKeyDown)
      if (open) returnFocus.current?.focus?.()
    }
  }, [open, onKeyDown])

  return (
    <div
      id="mobile-menu"
      ref={panel}
      className={styles.sheet}
      data-open={open || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className={`container ${styles.sheetTop}`}>
        <Link href="/" className={styles.logo} aria-label="VT CRO home" onClick={onClose}>
          <Image src="/brand/logo-full-white-sm.png" alt="VT CRO" width={520} height={126} />
        </Link>
        <button ref={closeBtn} type="button" className={styles.closeButton} onClick={onClose} aria-label="Close menu">
          <CloseIcon size={22} />
        </button>
      </div>

      <div className={`container ${styles.sheetBody}`}>
        <nav aria-label="Main">
          <ol className={styles.sheetNav}>
            {nav.map((item, i) => (
              <li key={item.href} style={{ ['--i' as string]: i }}>
                <Link href={item.href} onClick={onClose} aria-current={isActive(item.href) ? 'page' : undefined}>
                  <span className={styles.sheetLabel}>{item.label}</span>
                  <ArrowRight size={20} className={styles.sheetArrow} />
                </Link>
              </li>
            ))}
          </ol>
        </nav>

      </div>
    </div>
  )
}
