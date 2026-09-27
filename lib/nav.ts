/** Main navigation. Order and labels were specified by VT CRO. */
export const NAV = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/team', label: 'Team', icon: 'users' },
  { href: '/events', label: 'Events', icon: 'calendar' },
  { href: '/apply', label: 'Apply', icon: 'clipboard' },
  { href: '/gallery', label: 'Gallery', icon: 'image' },
  { href: '/contact', label: 'Contact', icon: 'mail' },
]

/**
 * The Sponsors page (/sponsors) is hidden until its design is finished.
 * Set to true to publish it: it then appears in the footer and sitemap, and /sponsor-us points to it again.
 * Sponsor logos on the homepage are not affected.
 */
export const SPONSORS_PAGE_LIVE = false
