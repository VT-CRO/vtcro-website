import Link from 'next/link'
import { ArrowUpRight, TrophyIcon } from '@/components/icons'
import type { Award } from '@/lib/content'
import { ShowMore } from './ShowMore'
import styles from './AwardLedger.module.css'

type Props = {
  awards: Award[]
  /** Off on team pages (the team is implied). */
  showTeam?: boolean
  /** Homepage: show only the most recent (4 on phones, 6 on larger screens); the rest open with "Show all awards". */
  collapse?: boolean
}

/** Awards as a compact grid of tiles, most recent first. */
export function AwardLedger({ awards, showTeam = true, collapse }: Props) {
  const list = (
    <ul className={styles.grid}>
      {awards.map((a) => {
        const tag = a.team ? a.team.code || a.team.name : a.projectCode || a.projectName
        return (
          <li key={a.id} className={styles.tile} data-reveal>
            <TrophyIcon size={18} className={styles.icon} aria-hidden="true" />
            <div className={styles.body}>
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
              <div className={styles.foot}>
                {showTeam && tag ? (
                  a.team ? (
                    <Link href={`/teams/${a.team.slug}`} className="chip">
                      {tag}
                    </Link>
                  ) : (
                    <span className="chip">{tag}</span>
                  )
                ) : (
                  <span />
                )}
                <span className={styles.year}>{a.year}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )

  if (!collapse || awards.length <= 4) return list
  return (
    <ShowMore more={`Show all ${awards.length} awards`} less="Show fewer" desktopNeeded={awards.length > 6}>
      {list}
    </ShowMore>
  )
}
