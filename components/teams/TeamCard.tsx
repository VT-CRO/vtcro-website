import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import type { TeamSummary } from '@/lib/content'
import styles from './TeamCard.module.css'

/** Team tile. Every tile in a grid is the same size; the whole tile is one link. */
export function TeamCard({ team, headingLevel: H = 'h3' }: { team: TeamSummary; index?: number; headingLevel?: 'h2' | 'h3' }) {
  return (
    <Link href={`/teams/${team.slug}`} className={styles.card} data-reveal>
      <div className={styles.media}>
        <Media img={team.cover} placeholder={`${team.name} · cover photo`} sizes="(min-width: 1000px) 30vw, (min-width: 600px) 46vw, 92vw" className={styles.img} />
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          {team.logo && <Image src={team.logo.src} alt="" width={96} height={96} sizes="36px" className={styles.logo} />}
          <H className={styles.name}>{team.name}</H>
          {team.code && <span className={styles.code}>{team.code}</span>}
        </div>
        {team.shortDescription && <p className={styles.desc}>{team.shortDescription}</p>}
        <span className={styles.more}>
          Learn more <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}
