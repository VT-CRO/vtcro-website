import Link from 'next/link'
import { GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import type { MemberSummary, TeamSummary } from '@/lib/content'
import { cn } from '@/lib/utils'

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
    <div className="group/member grid h-full content-start gap-3.5">
      <Link
        href={`/team/${member.slug}`}
        className={[
          'relative block aspect-[4/5] overflow-hidden rounded-(--radius-m) bg-surface-2 [box-shadow:var(--shadow-1)] [transition:transform_var(--dur-2)_var(--ease-spring),box-shadow_var(--dur-2)_var(--ease)]',
          "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:[box-shadow:inset_0_0_0_1px_var(--line)] after:content-['']",
          'group-hover/member:[transform:translateY(-3px)] group-hover/member:[box-shadow:var(--shadow-2)]',
        ].join(' ')}
        aria-label={`${member.name}’s page`}
        tabIndex={-1}
      >
        <Media img={member.photo} placeholder="Headshot" bare sizes={large ? '(min-width: 1100px) 22vw, 45vw' : '(min-width: 1100px) 18vw, (min-width: 700px) 30vw, 45vw'} />
      </Link>
      <div className="grid gap-[3px]">
        <p className={cn(large ? 'text-[1.125rem]' : 'text-[1rem]', 'leading-[1.3] font-semibold tracking-[-0.015em] [transition:color_var(--dur-2)_var(--ease)]')}>
          <Link
            href={`/team/${member.slug}`}
            className="group-hover/member:underline group-hover/member:underline-offset-3 focus-visible:underline focus-visible:underline-offset-3"
          >
            {member.name}
          </Link>
        </p>
        {line && <p className="text-[0.8125rem] leading-[1.45] text-fg-2">{line}</p>}
        {member.gradTerm && <p className="mt-1 font-mono text-[0.66rem] tracking-[0.1em] text-fg-3 uppercase">{member.gradTerm}</p>}
        {links.length > 0 && (
          <ul className="mt-1.5 -ml-1.5 flex list-none gap-1 p-0">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-label={l.label}
                  className="grid size-8 place-items-center rounded-[50%] text-fg-3 [transition:color_var(--dur-2)_var(--ease)] hover:text-fg focus-visible:text-fg"
                  {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
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
