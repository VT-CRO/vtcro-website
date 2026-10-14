import type { TeamPerson, TeamSummary } from '@/lib/content'
import { cn } from '@/lib/utils'
import { MemberCard } from './MemberCard'

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
    <ul
      className={cn(
        'flex flex-wrap justify-center gap-(--gap) [--cols:2] [--gap:16px] min-[700px]:[--cols:3] min-[700px]:[--gap:24px] min-[1100px]:[--gap:32px]',
        dense ? 'min-[1100px]:[--cols:5]' : 'min-[1100px]:[--cols:4]',
        '[&>li]:min-w-0 [&>li]:flex-[0_0_calc((100%-(var(--cols)-1)*var(--gap))/var(--cols))]',
      )}
    >
      {people.map((p, i) => (
        <li key={`${p.team.id}-${p.member.id}`}>
          <MemberCard member={p.member} role={p.role} teams={teamsOf?.[p.member.id]} large={large} index={i} />
        </li>
      ))}
    </ul>
  )
}
