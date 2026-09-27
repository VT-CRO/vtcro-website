import type { TeamPerson, TeamSummary } from '@/lib/content'
import { MemberCard } from './MemberCard'
import styles from './PeopleGrid.module.css'

export function PeopleGrid({
  people,
  teamsOf,
  large,
  dense,
}: {
  people: TeamPerson[]
  teamsOf?: Record<string, TeamSummary[]>
  large?: boolean
  dense?: boolean
}) {
  return (
    <ul className={`${styles.grid} ${dense ? styles.dense : ''}`}>
      {people.map((p, i) => (
        <li key={`${p.team.id}-${p.member.id}`}>
          <MemberCard member={p.member} role={p.role} teams={teamsOf?.[p.member.id]} large={large} index={i} />
        </li>
      ))}
    </ul>
  )
}
