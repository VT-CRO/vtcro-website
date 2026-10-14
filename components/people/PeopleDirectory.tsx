import type { PeopleDirectory as Directory } from '@/lib/content'
import { PeopleGrid } from './PeopleGrid'
import { ComingSoon } from '@/components/ui/ComingSoon'

/** Team page: Executive Team, Engineering Team, Support Team. Everyone is always shown. */
export function PeopleDirectory({ directory }: { directory: Directory }) {
  const groups = [
    { id: 'executive', title: 'Executive Team', people: directory.executive, large: true },
    { id: 'engineering', title: 'Engineering Team', people: directory.engineering, large: false },
    { id: 'support', title: 'Support Team', people: directory.support, large: false },
  ].filter((g) => g.people.length)

  if (!groups.length) return <ComingSoon label="Members" page />

  // Generous space between Executive, Engineering and Support.
  return (
    <div className="flex flex-col gap-[clamp(120px,15vw,208px)]">
      {groups.map((g) => (
        <section key={g.id} className="flex flex-col gap-[clamp(56px,7vw,88px)]" aria-labelledby={`group-${g.id}`}>
          {/* Centered with inline styles too, so it can't be affected by a stale stylesheet. */}
          <div className="flex w-full justify-center" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <h2 id={`group-${g.id}`} className="t-h2 text-center" style={{ textAlign: 'center', margin: 0 }}>
              {g.title}
            </h2>
          </div>
          <PeopleGrid people={g.people} teamsOf={directory.teamsOf} large={g.large} dense={!g.large} />
        </section>
      ))}
    </div>
  )
}
