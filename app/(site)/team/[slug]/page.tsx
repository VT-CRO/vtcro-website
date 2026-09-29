import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { permanentRedirect } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, BookIcon, GitHubIcon, GlobeIcon, GraduationIcon, LinkedInIcon } from '@/components/icons'
import { PeopleGrid } from '@/components/people/PeopleGrid'
import { Media } from '@/components/ui/Media'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getMember, getMembers, getTeam } from '@/lib/content'
import styles from './page.module.css'
import { DEFAULT_SHARE_IMAGE } from '@/lib/format'

export const revalidate = 3600

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
  // Teammates come from the person's first design team (or their only team).
  const home = member.roles.find((r) => r.team.type === 'design') ?? member.roles[0]
  const team = home ? await getTeam(home.team.slug) : null
  const teammates = team ? [...team.leadership, ...team.roster].filter((p) => p.member.id !== member.id).slice(0, 5) : []

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
    <article className={styles.page}>
      <div className="container">
        <Link href="/team" className={`link-arrow ${styles.back}`}>
          <ArrowLeft size={16} /> Team
        </Link>

        <div className={styles.grid}>
          <div className={styles.photo}>
            <Media img={member.photo} placeholder="Headshot" sizes="(min-width: 1000px) 34vw, 100vw" preload />
          </div>

          <div className={styles.info}>
            <p className="t-label">{primary?.team.name ?? 'VT CRO'}</p>
            <h1 className={`t-h1 ${styles.name}`}>{member.name}</h1>
            {primary?.role && <p className={styles.role}>{primary.role}</p>}

            {facts.length > 0 && (
              <dl className={styles.facts}>
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>
                      <span className="icon-badge icon-badge--mono">
                        <f.icon size={18} />
                      </span>
                      <span className="t-label">{f.label}</span>
                    </dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {member.roles.length > 0 && (
              <div className={styles.teams}>
                <p className="t-label">{member.roles.length > 1 ? 'Teams' : 'Team'}</p>
                <ul>
                  {member.roles.map((r) => (
                    <li key={r.team.id}>
                      <Link href={`/teams/${r.team.slug}`}>
                        <span className={styles.teamName}>
                          {r.team.logo && <Image src={r.team.logo.src} alt="" width={56} height={56} sizes="28px" className={styles.teamLogo} />}
                          {r.team.name}
                        </span>
                        <span className={styles.teamRole}>{r.role}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {member.bio && <p className={`t-body ${styles.bio}`}>{member.bio}</p>}

            {links.length > 0 && (
              <div className="btn-row">
                {links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn btn--secondary">
                    <l.icon size={16} className="icon-static" /> {l.label} <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {teammates.length > 0 && team && (
        <Section tone="light" labelledBy="teammates">
          <SectionHeader heading={`${team.name} teammates`} id="teammates" />
          <PeopleGrid people={teammates} dense />
        </Section>
      )}
    </article>
  )
}
