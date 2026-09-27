import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Icon } from '@/components/icons'
import type { HomeSection, Recruitment } from '@/lib/content'
import Image from 'next/image'
import styles from './ApplyBanner.module.css'

/** Closing call to action. Its state follows the "Applications open?" switch in the CMS. */
export function ApplyBanner({ recruitment: r, section }: { recruitment: Recruitment; section: HomeSection }) {
  const alt = r.alternatives.find((a) => a.url)
  return (
    <section className={styles.banner} aria-labelledby="apply-heading">
      {section.background && (
        <div className={styles.bg} aria-hidden="true">
          <Image src={section.background.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: section.background.position }} />
        </div>
      )}
      <div className={styles.wash} aria-hidden="true" />
      <div className="container">
        <div className={styles.inner} data-reveal>
          <p className={styles.status}>
            <span className={`status-dot ${r.open ? 'status-dot--on' : ''}`} aria-hidden="true" />
            {r.open ? 'Applications open' : 'Applications closed'}
          </p>
          <h2 id="apply-heading" className="t-h1">
            {section.heading || (r.open ? r.openHeading : r.closedHeading)}
          </h2>
          {(section.intro || (r.open ? r.openMessage : r.closedMessage)) && (
            <p className={`t-lead ${styles.msg}`} style={{ whiteSpace: 'pre-line' }}>{section.intro || (r.open ? r.openMessage : r.closedMessage)}</p>
          )}
          <div className={styles.ctas}>
            {r.open && r.applicationUrl ? (
              <a href={r.applicationUrl} target="_blank" rel="noreferrer" className="btn btn--light">
                {r.buttonLabel} <ArrowUpRight size={16} />
              </a>
            ) : null}
            <Link href="/apply" className={`btn ${r.open && r.applicationUrl ? 'btn--secondary' : 'btn--light'}`}>
              How to join <ArrowRight size={16} />
            </Link>
            {!r.open && alt && (
              <a href={alt.url} target="_blank" rel="noreferrer" className="btn btn--secondary">
                <Icon name={alt.icon || 'book'} size={16} className="icon-static" /> {alt.linkLabel || alt.title} <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
