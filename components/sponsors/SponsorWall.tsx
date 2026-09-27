import Image from 'next/image'
import type { SponsorGroup } from '@/lib/content'
import styles from './SponsorWall.module.css'

/** Sponsor logos, one column per category, in their own colors. The white "dark background" version is used when one is uploaded. */
export function SponsorWall({ groups }: { groups: SponsorGroup[] }) {
  return (
    <div className={styles.wall} data-count={groups.length}>
      {groups.map((g) => (
        <section key={g.id} className={styles.group} aria-label={g.name} data-reveal>
          <h3 className="t-label">{g.name}</h3>
          <ul className={styles.logos}>
            {g.sponsors.map((s) => {
              const logo = s.logoOnDark ?? s.logo
              const inner = logo ? (
                <Image src={logo.src} alt={s.name} width={logo.width} height={logo.height} sizes="220px" className={`${styles.logo} ${s.logoOnDark ? styles.white : ''}`} />
              ) : (
                <span className={styles.text}>{s.name}</span>
              )
              return (
                <li key={s.id}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className={styles.link} title={s.description || s.name}>
                      {inner}
                    </a>
                  ) : (
                    <span className={styles.link}>{inner}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
