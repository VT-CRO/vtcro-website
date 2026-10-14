'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, CloseIcon, GitHubIcon, InstagramIcon, LinkedInIcon } from '@/components/icons'

export type NavTeam = { slug: string; name: string; code: string; logo: { src: string; alt: string } | null }

type Props = {
  nav: { href: string; label: string; icon?: string }[]
  github: string | null
  instagram: string | null
  linkedin: string | null
  teams: NavTeam[]
}

const logoClass = 'inline-flex flex-none items-center py-2 lg:justify-self-start [&_img]:h-6 [&_img]:w-auto lg:[&_img]:h-[27px]'
const iconLinkClass =
  'inline-flex h-10 w-10 items-center justify-center gap-2 rounded-(--radius-s) p-0 text-[0.875rem] font-medium text-fg-2 [transition:color_var(--dur-2)_var(--ease),background-color_var(--dur-2)_var(--ease)] hover:bg-[rgb(255_255_255/0.06)] hover:text-fg'

export function SiteHeader({ nav, github, instagram, linkedin, teams }: Props) {
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
        className={[
          'fixed inset-x-0 top-0 z-50 h-(--header-h) border-b border-transparent [transition:background-color_var(--dur-2)_var(--ease),border-color_var(--dur-2)_var(--ease),transform_420ms_var(--ease)]',
          // soft top shade so the transparent header stays legible over photos
          "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-bottom-10 before:bg-[linear-gradient(to_bottom,rgb(11_12_14/0.55),rgb(11_12_14/0))] before:[transition:opacity_var(--dur-2)_var(--ease)] before:content-['']",
          'data-scrolled:border-b-line data-scrolled:bg-[rgb(8_9_12/0.72)] data-scrolled:[box-shadow:0_10px_40px_-20px_rgb(0_0_0/0.8)] data-scrolled:[-webkit-backdrop-filter:blur(16px)_saturate(140%)] data-scrolled:[backdrop-filter:blur(16px)_saturate(140%)] data-scrolled:before:opacity-0',
          'max-lg:data-hidden:[transform:translateY(-100%)]',
        ].join(' ')}
        data-scrolled={scrolled || undefined}
        data-hidden={(hidden && !open) || undefined}
      >
        {/* Desktop: three columns with equal outer tracks, so the links sit exactly in the middle of the page at every window width. */}
        <div className="site-container relative flex h-full items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <Link href="/" className={logoClass} aria-label="VT CRO home">
            <Image src="/brand/logo-full-white-sm.png" alt="VT CRO" width={520} height={126} preload loading="eager" />
          </Link>

          <nav className="hidden lg:block" aria-label="Main">
            <ul className="flex gap-[clamp(18px,2vw,34px)]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      'relative inline-block py-2 text-[0.875rem] font-medium text-fg-2 [transition:color_var(--dur-2)_var(--ease)] hover:text-fg',
                      "after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:bg-current after:[transform:scaleX(0)] after:[transition:transform_var(--dur-2)_var(--ease)] after:content-[''] hover:after:[transform:scaleX(1)]",
                      'aria-[current=page]:text-fg aria-[current=page]:after:h-0.5 aria-[current=page]:after:rounded-[2px] aria-[current=page]:after:bg-fg aria-[current=page]:after:[transform:scaleX(1)] aria-[current=page]:after:[box-shadow:0_0_10px_rgb(0_0_0/0.45)]',
                    ].join(' ')}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 lg:justify-self-end">
            {github && (
              <a href={github} className={iconLinkClass} target="_blank" rel="noreferrer" aria-label="VT CRO on GitHub">
                <GitHubIcon size={18} />
              </a>
            )}
            {instagram && (
              <a href={instagram} className={iconLinkClass} target="_blank" rel="noreferrer" aria-label="VT CRO on Instagram">
                <InstagramIcon size={17} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} className={iconLinkClass} target="_blank" rel="noreferrer" aria-label="VT CRO on LinkedIn">
                <LinkedInIcon size={17} />
              </a>
            )}
            <button
              type="button"
              className="-mr-2.5 inline-grid size-11 place-items-center text-[0.875rem] font-semibold tracking-[0.01em] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <span
                className="grid w-5 gap-[5px] [&_i]:block [&_i]:h-[1.5px] [&_i]:rounded-[2px] [&_i]:bg-current [&_i:last-child]:w-[65%] [&_i:last-child]:justify-self-end"
                aria-hidden="true"
              >
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
        linkedin={linkedin}
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
      className={[
        'group/sheet invisible fixed inset-0 z-60 flex flex-col overflow-y-auto overscroll-contain opacity-0 lg:hidden',
        '[background:radial-gradient(90%_50%_at_100%_0%,rgb(255_255_255/0.066),transparent_60%),radial-gradient(70%_40%_at_0%_100%,rgb(255_255_255/0.042),transparent_60%),var(--bg)]',
        '[transition:opacity_280ms_var(--ease),visibility_0s_linear_280ms] data-open:visible data-open:opacity-100 data-open:[transition:opacity_280ms_var(--ease)]',
      ].join(' ')}
      data-open={open || undefined}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div className="site-container flex h-(--header-h) flex-none items-center justify-between border-b border-line">
        <Link href="/" className={logoClass} aria-label="VT CRO home" onClick={onClose}>
          <Image src="/brand/logo-full-white-sm.png" alt="VT CRO" width={520} height={126} />
        </Link>
        <button ref={closeBtn} type="button" className="-mr-2.5 inline-grid size-11 place-items-center text-[0.875rem] font-semibold" onClick={onClose} aria-label="Close menu">
          <CloseIcon size={22} />
        </button>
      </div>

      {/* Content sits low in the screen so it's reachable with a thumb. */}
      <div className="site-container flex flex-1 flex-col justify-end gap-7 pt-8 pb-[max(24px,env(safe-area-inset-bottom))]">
        <nav aria-label="Main">
          <ol>
            {nav.map((item, i) => (
              <li
                key={item.href}
                style={{ ['--i' as string]: i }}
                className="border-b border-line opacity-0 [transform:translate3d(0,14px,0)] [transition:opacity_420ms_var(--ease)_calc(var(--i)*35ms+60ms),transform_520ms_var(--ease)_calc(var(--i)*35ms+60ms)] group-data-open/sheet:opacity-100 group-data-open/sheet:[transform:none]"
              >
                <Link href={item.href} onClick={onClose} aria-current={isActive(item.href) ? 'page' : undefined} className="flex items-center gap-4 py-3.5">
                  <span className="flex-1 text-[clamp(1.9rem,9vw,2.6rem)] leading-[1.1] font-normal tracking-[-0.035em]">{item.label}</span>
                  <ArrowRight size={20} className="self-center text-fg-3" />
                </Link>
              </li>
            ))}
          </ol>
        </nav>

      </div>
    </div>
  )
}
