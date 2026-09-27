import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import type { HomeSection } from '@/lib/content'
import styles from './MembersBanner.module.css'

/** Full-width photo with the VT CRO logo and a link to the Team page. */
export function MembersBanner({ section }: { section: HomeSection }) {
  return (
    <section className={styles.banner} aria-label="Our members">
      {section.background && (
        <div className={styles.bg} aria-hidden="true">
          <Image src={section.background.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: section.background.position }} />
        </div>
      )}
      <div className={styles.inner} data-reveal>
        <Image src="/brand/logo-full-white.png" alt="VT CRO" width={1833} height={444} sizes="(min-width: 900px) 520px, 72vw" className={styles.logo} />
        <Link href="/team" className="btn btn--light">
          {section.label || 'View members'} <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
