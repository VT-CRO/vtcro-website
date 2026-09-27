import Link from 'next/link'
import { Media } from '@/components/ui/Media'
import type { MemberSummary, TeamSummary } from '@/lib/content'
import styles from './MemberCard.module.css'

type Props = {
  member: MemberSummary
  role: string
  teams?: TeamSummary[]
  large?: boolean
  index?: number
}

/** Portrait card linking to the member's profile. Shared by team pages and the Team page. */
export function MemberCard({ member, role, teams = [], large, index = 0 }: Props) {
  const meta = [teams.map((t) => t.code || t.name).join(' / '), member.gradYear ? `’${String(member.gradYear).slice(-2)}` : null].filter(Boolean)
  return (
    <Link href={`/team/${member.slug}`} className={`${styles.card} ${large ? styles.large : ''}`}>
      <div className={styles.photo}>
        <Media img={member.photo} placeholder="Headshot" sizes={large ? '(min-width: 1100px) 22vw, 45vw' : '(min-width: 1100px) 18vw, (min-width: 700px) 30vw, 45vw'} className={styles.img} />
      </div>
      <div className={styles.text}>
        <p className={styles.name}>{member.name}</p>
        <p className={styles.role}>{role}</p>
        {meta.length > 0 && <p className={styles.meta}>{meta.join('  ·  ')}</p>}
      </div>
    </Link>
  )
}
