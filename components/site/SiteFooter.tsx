import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, DiscordIcon, GitHubIcon, Icon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '@/components/icons'
import type { Site, SocialLink, TeamSummary } from '@/lib/content'
import { Inline } from '@/lib/text'

export const SOCIAL_ICONS: Record<SocialLink['platform'], typeof GitHubIcon> = {
  github: GitHubIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  youtube: YouTubeIcon,
  discord: DiscordIcon,
}

type Link_ = { href: string; label: string; icon?: string; logo?: string | null }
type Props = { site: Site; nav: { href: string; label: string; icon?: string }[]; designTeams: TeamSummary[]; supportTeams: TeamSummary[] }

const colClass = '[&>:first-child]:mb-4'
const linkClass = 'inline-flex min-h-[34px] items-center gap-2.5 text-[0.9375rem] text-fg-2 [transition:color_var(--dur-2)_var(--ease)] hover:text-fg'

export function SiteFooter({ site, nav, designTeams, supportTeams }: Props) {
  const year = new Date().getFullYear()
  const explore: Link_[] = [...nav.filter((n) => n.href !== '/'), { href: '/teams', label: 'All teams', icon: 'layers' }]

  return (
    <footer
      id="site-footer"
      className="relative isolate overflow-hidden border-t border-line bg-[#070708] pt-[clamp(56px,8vw,104px)] pb-[max(28px,env(safe-area-inset-bottom))]"
    >
      <div className="absolute inset-0 -z-1 opacity-55 [filter:grayscale(1)]" aria-hidden="true">
        <Image src="/seed/bg-footer-bird.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="site-container">
        <div className="grid gap-12 min-[1100px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] min-[1100px]:gap-16">
          <div className="grid max-w-[38ch] content-start gap-[18px]">
            <Link href="/" aria-label="VT CRO home" className="[&_img]:h-[30px] [&_img]:w-auto">
              <Image src="/brand/logo-full-white-sm.png" alt="VT CRO" width={520} height={126} />
            </Link>
            {site.description && (
              <p className="text-[clamp(1.15rem,1rem+0.5vw,1.4rem)] leading-[1.35] font-normal tracking-[-0.015em] text-fg">
                <Inline text={site.description} />
              </p>
            )}
          </div>

          <nav className="grid grid-cols-[1fr_1fr] gap-x-6 gap-y-9 sm:grid-cols-[repeat(4,minmax(0,1fr))]" aria-label="Footer">
            <FooterCol title="Explore" links={explore} />
            <FooterCol title="Design Teams" links={designTeams.map((t) => ({ href: `/teams/${t.slug}`, label: t.name }))} collapsible />
            <FooterCol title="Support Teams" links={supportTeams.map((t) => ({ href: `/teams/${t.slug}`, label: t.name }))} collapsible />
            <div className={`${colClass} max-sm:col-2 max-sm:row-1 max-sm:-order-1`}>
              <p className="t-label">Connect</p>
              <ul className="grid gap-0.5">
                {site.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform]
                  return (
                    <li key={s.platform}>
                      <a href={s.url} target="_blank" rel="noreferrer" className={`group/social ${linkClass}`}>
                        <Icon size={16} />
                        <span>{s.label}</span>
                        <ArrowUpRight
                          size={14}
                          className="[transform:translate(-4px,4px)] opacity-0 [transition:opacity_var(--dur-2)_var(--ease),transform_var(--dur-2)_var(--ease)] group-hover/social:[transform:none] group-hover/social:opacity-100"
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-[clamp(56px,7vw,96px)] flex flex-wrap justify-between gap-x-8 gap-y-3 border-t border-line pt-5">
          <p className="t-meta">
            © {year} {site.copyrightName}
          </p>
          {site.footerTagline && (
            <p className="t-meta [&_code]:font-mono [&_code]:text-fg-3">
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
    <ul className="grid gap-0.5">
      {links.map((l) => (
        <li key={l.href}>
          <Link href={l.href} className={`${linkClass} [&_svg]:text-fg-3`}>
            {l.logo ? (
              <Image src={l.logo} alt="" width={40} height={40} sizes="20px" className="size-5 rounded-[50%]" />
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
      <div className={colClass}>
        <p className="t-label">{title}</p>
        {list}
      </div>
    )
  }
  // Phones get a collapsed accordion; larger screens show the plain list.
  return (
    <>
      <details className={`group/details ${colClass} max-sm:col-[span_2] max-sm:border-t max-sm:border-t-line max-sm:pt-4 sm:hidden`}>
        <summary
          className={[
            't-label cursor-default [list-style:none] [&::-webkit-details-marker]:hidden',
            'max-sm:mb-0! max-sm:flex max-sm:min-h-8 max-sm:cursor-pointer max-sm:items-center max-sm:justify-between max-sm:group-open/details:mb-2!',
            "max-sm:after:text-[1rem] max-sm:after:text-fg-2 max-sm:after:content-['+'] max-sm:group-open/details:after:content-['–']",
          ].join(' ')}
        >
          {title}
        </summary>
        {list}
      </details>
      <div className={`${colClass} hidden sm:block`}>
        <p className="t-label">{title}</p>
        {list}
      </div>
    </>
  )
}
