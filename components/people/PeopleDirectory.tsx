import type { PeopleDirectory as Directory } from '@/lib/content'
import { PeopleGrid } from './PeopleGrid'
import styles from './PeopleDirectory.module.css'

/** Team page: Executive Team, Engineering Team, Support Team. Everyone is always shown. */
export function PeopleDirectory({ directory }: { directory: Directory }) {
  const groups = [
    { id: 'executive', title: 'Executive Team', people: directory.executive, large: true },
    { id: 'engineering', title: 'Engineering Team', people: directory.engineering, large: false },
    { id: 'support', title: 'Support Team', people: directory.support, large: false },
  ].filter((g) => g.people.length)

  if (!groups.length) return <p className="t-lead">Member profiles will appear here once they are added in the CMS.</p>

  return (
    <div className={styles.groups}>
      {groups.map((g) => (
        <section key={g.id} className={styles.group} aria-labelledby={`group-${g.id}`}>
          {/* Centered with inline styles too, so it can't be affected by a stale stylesheet. */}
          <div className={styles.titleRow} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <h2 id={`group-${g.id}`} className={`t-h2 ${styles.title}`} style={{ textAlign: 'center', margin: 0 }}>
              {g.title}
            </h2>
          </div>
          <PeopleGrid people={g.people} teamsOf={directory.teamsOf} large={g.large} dense={!g.large} />
        </section>
      ))}
    </div>
  )
}
