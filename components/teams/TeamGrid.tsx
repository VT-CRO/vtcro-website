import type { TeamSummary } from '@/lib/content'
import { TeamCard } from './TeamCard'

/** Uniform tiles with identical gutters. A partial last row is centered. */
export function TeamGrid({ teams, headingLevel }: { teams: TeamSummary[]; variant?: 'design' | 'support'; headingLevel?: 'h2' | 'h3' }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-(--gap) gap-y-[calc(var(--gap)*1.4)] [--cols:1] [--gap:20px] min-[600px]:[--cols:2] min-[600px]:[--gap:24px] min-[1000px]:[--cols:3] min-[1000px]:[--gap:32px] [&>li]:min-w-0 [&>li]:flex-[0_0_calc((100%-(var(--cols)-1)*var(--gap))/var(--cols))]">
      {teams.map((team) => (
        <li key={team.id}>
          <TeamCard team={team} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  )
}
