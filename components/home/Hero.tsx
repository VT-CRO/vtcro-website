import Image from 'next/image'
import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import type { Home, SponsorGroup } from '@/lib/content'
import { HeroVideo } from './HeroVideo'
import styles from './Hero.module.css'

type Props = { hero: Home['hero']; sponsors: SponsorGroup[] }

/** Opening screen: the VT CRO logo, large and centered, with sponsor logos beneath it. */
export function Hero({ hero, sponsors }: Props) {
  const groups = hero.showSponsors ? sponsors.slice(0, 2) : []
  return (
    <section className={styles.hero}>
      <div className={styles.media} aria-hidden="true">
        <Media img={hero.image} placeholder="Homepage background photo" sizes="100vw" preload className={styles.image} />
        {hero.videoUrl && <HeroVideo src={hero.videoUrl} className={styles.video} />}
        <div className={styles.scrim} />
      </div>

      <div className={`container ${styles.center}`}>
        <h1 className={styles.logoWrap}>
          <Image src="/brand/logo-full-white.png" alt="VT CRO" width={1833} height={444} sizes="(min-width: 1100px) 720px, 84vw" preload className={styles.logo} />
        </h1>
        {hero.eyebrow && <p className={styles.name}>{hero.eyebrow}</p>}
      </div>

      <div className={`container ${styles.ctasWrap}`}>
        <nav className={styles.ctas} aria-label="Get started">
          <Link href="/apply" className="btn btn--light">
            Apply
          </Link>
          <a href="#design-teams" className="btn btn--secondary">
            Teams
          </a>
          <Link href="/team" className="btn btn--secondary">
            Members
          </Link>
        </nav>
      </div>

      {groups.length > 0 && (
        <div className={`container ${styles.sponsors}`}>
          <div className={styles.columns} data-count={groups.length}>
            {groups.map((g) => (
              <div key={g.id} className={styles.column}>
                <p className={styles.columnLabel}>{g.name}</p>
                <ul className={styles.logos}>
                  {g.sponsors.map((s) => {
                    const logo = s.logoOnDark ?? s.logo
                    const inner = logo ? (
                      <Image
                        src={logo.src}
                        alt={s.name}
                        width={logo.width}
                        height={logo.height}
                        sizes="200px"
                        className={`${styles.logoImg} ${s.logoOnDark ? '' : styles.mono}`}
                      />
                    ) : (
                      <span className={styles.logoText}>{s.name}</span>
                    )
                    return (
                      <li key={s.id}>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noreferrer" className={styles.logoLink}>
                            {inner}
                          </a>
                        ) : (
                          <span className={styles.logoLink}>{inner}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
