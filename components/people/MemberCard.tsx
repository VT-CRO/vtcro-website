import Link from 'next/link'
import { GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import type { MemberSummary, TeamSummary } from '@/lib/content'
import styles from './MemberCard.module.css'

type Props = {
  member: MemberSummary
  /** Title such as "President". Empty for regular members, who show their team instead. */
  role: string
  teams?: TeamSummary[]
  large?: boolean
  index?: number
}

/** Portrait card: name, title or team, graduation, and contact links. Shared by team pages and the Team page. */
export function MemberCard({ member, role, teams = [], large }: Props) {
  const line = role || teams.map((t) => t.name).join(' / ')
  const links = [
    member.email && { href: `mailto:${member.email}`, label: `Email ${member.name}`, icon: MailIcon, external: false },
    member.linkedin && { href: member.linkedin, label: `${member.name} on LinkedIn`, icon: LinkedInIcon, external: true },
    member.website && { href: member.website, label: `${member.name}’s website`, icon: GlobeIcon, external: true },
    member.github && { href: member.github, label: `${member.name} on GitHub`, icon: GitHubIcon, external: true },
  ].filter(Boolean) as { href: string; label: string; icon: typeof MailIcon; external: boolean }[]

  return (
    <div className={`${styles.card} ${large ? styles.large : ''}`}>
      <Link href={`/team/${member.slug}`} className={styles.photo} aria-label={`${member.name}’s page`} tabIndex={-1}>
        <Media img={member.photo} placeholder="Headshot" bare sizes={large ? '(min-width: 1100px) 22vw, 45vw' : '(min-width: 1100px) 18vw, (min-width: 700px) 30vw, 45vw'} className={styles.img} />
      </Link>
      <div className={styles.text}>
        <p className={styles.name}>
          <Link href={`/team/${member.slug}`}>{member.name}</Link>
        </p>
        {line && <p className={styles.role}>{line}</p>}
        {member.gradTerm && <p className={styles.meta}>{member.gradTerm}</p>}
        {links.length > 0 && (
          <ul className={styles.links}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} aria-label={l.label} {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                  <l.icon size={17} />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
