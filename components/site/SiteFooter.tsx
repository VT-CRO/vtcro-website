import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, DiscordIcon, GitHubIcon, Icon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '@/components/icons'
import type { Site, SocialLink, TeamSummary } from '@/lib/content'
import { Inline } from '@/lib/text'
import styles from './SiteFooter.module.css'

export const SOCIAL_ICONS: Record<SocialLink['platform'], typeof GitHubIcon> = {
  github: GitHubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  discord: DiscordIcon,
}

type Link_ = { href: string; label: string; icon?: string; logo?: string | null }
type Props = { site: Site; nav: { href: string; label: string; icon?: string }[]; designTeams: TeamSummary[]; supportTeams: TeamSummary[] }

export function SiteFooter({ site, nav, designTeams, supportTeams }: Props) {
  const year = new Date().getFullYear()
  const explore: Link_[] = [...nav.filter((n) => n.href !== '/'), { href: '/teams', label: 'All teams', icon: 'layers' }]

  return (
    <footer id="site-footer" className={styles.footer}>
      <div className={styles.bg} aria-hidden="true">
        <Image src="/seed/bg-footer-bird.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" aria-label="VT CRO home" className={styles.logo}>
              <Image src="/brand/logo-full-white-sm.png" alt="VT CRO" width={520} height={126} />
            </Link>
            {site.description && (
              <p className={styles.tagline}>
                <Inline text={site.description} />
              </p>
            )}
          </div>

          <nav className={styles.cols} aria-label="Footer">
            <FooterCol title="Explore" links={explore} />
            <FooterCol title="Design Teams" links={designTeams.map((t) => ({ href: `/teams/${t.slug}`, label: t.name }))} collapsible />
            <FooterCol title="Support Teams" links={supportTeams.map((t) => ({ href: `/teams/${t.slug}`, label: t.name }))} collapsible />
            <div className={`${styles.col} ${styles.connect}`}>
              <p className="t-label">Connect</p>
              <ul className={styles.social}>
                {site.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform]
                  return (
                    <li key={s.platform}>
                      <a href={s.url} target="_blank" rel="noreferrer">
                        <Icon size={16} />
                        <span>{s.label}</span>
                        <ArrowUpRight size={14} className={styles.ext} />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className="t-meta">
            © {year} {site.copyrightName}
          </p>
          {site.footerTagline && (
            <p className={`t-meta ${styles.code}`}>
              <code>{site.footerTagline}</code>
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links, collapsible }: { title: string; links: Link_[]; collapsible?: boolean }) {
  if (!links.length) return null
  const list = (
    <ul className={styles.list}>
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href}>
            {l.logo ? (
              <Image src={l.logo} alt="" width={40} height={40} sizes="20px" className={styles.teamLogo} />
            ) : l.icon ? (
              <Icon name={l.icon} size={16} />
            ) : null}
            {l.label}
          </Link>
        </li>
      ))}
    </ul>
  )
  if (!collapsible) {
    return (
      <div className={styles.col}>
        <p className="t-label">{title}</p>
        {list}
      </div>
    )
  }
  // Phones get a collapsed accordion; larger screens show the plain list.
  return (
    <>
      <details className={`${styles.col} ${styles.details}`}>
        <summary className="t-label">{title}</summary>
        {list}
      </details>
      <div className={`${styles.col} ${styles.expanded}`}>
        <p className="t-label">{title}</p>
        {list}
      </div>
    </>
  )
}
