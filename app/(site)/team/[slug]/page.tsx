import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, BookIcon, GitHubIcon, GlobeIcon, GraduationIcon, LinkedInIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { IconBadge } from '@/components/ui/icon-badge'
import { Media } from '@/components/ui/Media'
import { getMember, getMembers } from '@/lib/content'
import { DEFAULT_SHARE_IMAGE } from '@/lib/format'

export const revalidate = false

export async function generateStaticParams() {
  return (await getMembers()).map((m) => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const member = await getMember((await params).slug)
  if (!member) return {}
  const role = member.roles[0]
  const description = [role ? [role.role, role.team.name].filter(Boolean).join(', ') : null, member.major, member.gradYear ? `Class of ${member.gradYear}` : null]
    .filter(Boolean)
    .join(' · ')
  return {
    title: member.name,
    description: `${member.name}${description ? `, ${description}` : ''}. Member of VT CRO, the Competitive Robotics Organization at Virginia Tech.`,
    alternates: { canonical: `/team/${member.slug}` },
    // Sample profiles shouldn't be indexed.
    robots: member.isPlaceholder ? { index: false } : undefined,
    openGraph: { images: member.photo ? [{ url: member.photo.src, alt: member.photo.alt }] : [DEFAULT_SHARE_IMAGE] },
  }
}

export default async function MemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const member = await getMember((await params).slug)
  // Old profile links (e.g. former members from the previous website) go to the Team page
  // instead of a dead end, which keeps their search ranking pointing at the site.
  if (!member) permanentRedirect('/team')

  const primary = member.roles[0]

  const links = [
    member.linkedin && { href: member.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
    member.website && { href: member.website, label: 'Website', icon: GlobeIcon },
    member.github && { href: member.github, label: 'GitHub', icon: GitHubIcon },
  ].filter(Boolean) as { href: string; label: string; icon: typeof LinkedInIcon }[]

  const facts = [
    member.major && { label: 'Major', value: member.major, icon: BookIcon },
    member.gradYear && { label: 'Graduation', value: `Class of ${member.gradYear}`, icon: GraduationIcon },
  ].filter(Boolean) as { label: string; value: string; icon: typeof BookIcon }[]

  return (
    <article className="[background:radial-gradient(50%_40%_at_15%_0%,rgb(255_255_255/0.048),transparent_70%),var(--bg)] pt-[calc(var(--header-h)+clamp(28px,5vw,56px))]">
      <div className="site-container">
        <Link href="/team" className="link-arrow mb-[clamp(20px,3vw,36px)] text-fg-2">
          <ArrowLeft size={16} /> Team
        </Link>

        <div className="grid gap-8 pb-(--section-y) min-[1000px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1000px]:items-start min-[1000px]:gap-[72px]">
          <div className="relative aspect-[4/5] max-w-[520px] overflow-hidden rounded-(--radius-l) bg-surface-2 [box-shadow:var(--shadow-2),0_30px_80px_-40px_rgb(0_0_0/0.45)] min-[1000px]:sticky min-[1000px]:top-[calc(var(--header-h)+32px)] min-[1000px]:max-w-none">
            <Media img={member.photo} placeholder="Headshot" sizes="(min-width: 1000px) 34vw, 100vw" preload />
          </div>

          <div className="grid content-start gap-5 min-[1000px]:max-w-[620px] min-[1000px]:pt-3">
            <p className="t-label">{primary?.team.name ?? 'VT CRO'}</p>
            <h1 className="t-h1 -mt-1">{member.name}</h1>
            {primary?.role && <p className="text-[clamp(1.15rem,1rem+0.6vw,1.5rem)] font-semibold tracking-[-0.02em] text-accent">{primary.role}</p>}

            {facts.length > 0 && (
              <dl className="mt-2 grid grid-cols-[1fr_1fr] border-t border-line-2">
                {facts.map((f) => (
                  <div key={f.label} className="grid gap-1.5 border-b border-line py-4">
                    <dt className="flex items-center gap-2.5">
                      <IconBadge className="rounded-[10px] [--size:32px]">
                        <f.icon size={18} />
                      </IconBadge>
                      <span className="t-label">{f.label}</span>
                    </dt>
                    <dd className="font-medium">{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {member.roles.length > 0 && (
              <div>
                <p className="t-label">{member.roles.length > 1 ? 'Teams' : 'Team'}</p>
                <ul className="mt-3 grid border-t border-line">
                  {member.roles.map((r) => (
                    <li key={r.team.id}>
                      <Link href={`/teams/${r.team.slug}`} className="group/team flex justify-between gap-4 border-b border-line py-3.5">
                        <span className="inline-flex items-center gap-2.5 font-semibold group-hover/team:text-accent">
                          {r.team.logo && <Image src={r.team.logo.src} alt="" width={56} height={56} sizes="28px" className="size-7 rounded-[50%]" />}
                          {r.team.name}
                        </span>
                        <span className="text-right text-[0.875rem] text-fg-2">{r.role}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.bio && <p className="t-body max-w-[60ch]">{member.bio}</p>}

            {links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map((l) => (
                  <Button asChild variant="secondary" key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer">
                      <l.icon size={16} className="icon-static" /> {l.label} <ArrowUpRight size={14} />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
