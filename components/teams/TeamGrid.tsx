import type { TeamSummary } from '@/lib/content'
import { TeamCard } from './TeamCard'
import styles from './TeamGrid.module.css'

/** Uniform tiles with identical gutters. A partial last row is centered. */
export function TeamGrid({ teams, headingLevel }: { teams: TeamSummary[]; variant?: 'design' | 'support'; headingLevel?: 'h2' | 'h3' }) {
  return (
    <ul className={styles.grid}>
      {teams.map((team) => (
        <li key={team.id}>
          <TeamCard team={team} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  )
}
