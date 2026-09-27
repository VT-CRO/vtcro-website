import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { getSite, getTeams } from '@/lib/content'
import { DEFAULT_SHARE_IMAGE } from '@/lib/format'
import { NAV } from '@/lib/nav'
import { plain } from '@/lib/text'

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    title: { default: `${site.shortName} · ${site.name}`, template: `%s · ${site.shortName}` },
    description: plain(site.description),
    openGraph: {
      type: 'website',
      siteName: site.shortName,
      images: site.shareImage ? [{ url: site.shareImage.src, width: site.shareImage.width, height: site.shareImage.height }] : [DEFAULT_SHARE_IMAGE],
    },
    twitter: { card: 'summary_large_image' },
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [site, design, support] = await Promise.all([getSite(), getTeams('design'), getTeams('support')])
  const navTeams = [...design, ...support].map((t) => ({
    slug: t.slug,
    name: t.name,
    code: t.code,
    logo: t.logo ? { src: t.logo.src, alt: t.logo.alt } : null,
  }))

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SiteHeader
        nav={NAV}
        github={site.github}
        instagram={site.instagram}
        teams={navTeams}
      />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter site={site} nav={NAV} designTeams={design} supportTeams={support} />
      <Analytics />
    </div>
  )
}
