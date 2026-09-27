import Link from 'next/link'
import { ArrowUpRight, MedalIcon, RibbonIcon, TrophyIcon } from '@/components/icons'
import type { Award } from '@/lib/content'
import styles from './AwardLedger.module.css'

/** Awards as one list, most recent first. `showTeam` is off on team pages (the team is implied). */
export function AwardLedger({ awards, showTeam = true }: { awards: Award[]; showTeam?: boolean }) {
  return (
    <ol className={styles.list}>
      {awards.map((a) => {
        const Icon = a.rank === 1 ? TrophyIcon : a.rank ? MedalIcon : RibbonIcon
        return (
          <li key={a.id} className={styles.row} data-reveal>
            <span className={styles.icon} aria-hidden="true">
              <Icon size={20} />
            </span>
            <div className={styles.what}>
              <h3 className={styles.title}>
                {a.placement && <span className={styles.place}>{a.placement}</span>}
                {a.url ? (
                  <a href={a.url} target="_blank" rel="noreferrer">
                    {a.title} <ArrowUpRight size={13} />
                  </a>
                ) : (
                  a.title
                )}
              </h3>
              <p className={styles.comp}>
                {a.competition}
                {a.location && <span> · {a.location}</span>}
              </p>
            </div>
            <div className={styles.side}>
              {showTeam && (a.team || a.projectName) &&
                (a.team ? (
                  <Link href={`/teams/${a.team.slug}`} className="chip">
                    {a.team.code || a.team.name}
                  </Link>
                ) : (
                  <span className="chip">{a.projectName}</span>
                ))}
              <span className={styles.year}>{a.year}</span>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
