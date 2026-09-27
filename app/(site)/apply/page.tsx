import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarIcon, GraduationIcon, Icon, UsersIcon } from '@/components/icons'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getRecruitment } from '@/lib/content'
import { formatDate } from '@/lib/format'
import styles from './page.module.css'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Apply',
  description: 'How to join VT CRO: application status, who can apply, and how recruitment works.',
  alternates: { canonical: '/apply' },
}

export default async function ApplyPage() {
  const r = await getRecruitment()
  const period =
    r.periodStart || r.periodEnd ? [r.periodStart && formatDate(r.periodStart), r.periodEnd && formatDate(r.periodEnd)].filter(Boolean).join(' – ') : null

  return (
    <>
      {/* ───── Status ───── */}
      <section className={styles.status} data-open={r.open || undefined}>
        <div className={styles.bg} aria-hidden="true">
          <Image src="/seed/photo-atrium-competition.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} preload />
        </div>
        <div className={styles.wash} aria-hidden="true" />
        <div className="container">
          <div className={styles.statusInner}>
            <p className={styles.badge}>
              <span className={`status-dot ${r.open ? 'status-dot--on' : ''}`} aria-hidden="true" />
              {r.open ? 'Applications open' : 'Applications closed'}
            </p>
            <h1 className="t-h1">{r.open ? r.openHeading : r.closedHeading}</h1>
            {(r.open ? r.openMessage : r.closedMessage) && (
              <p className={`t-lead ${styles.msg}`} style={{ whiteSpace: 'pre-line' }}>
                {r.open ? r.openMessage : r.closedMessage}
              </p>
            )}
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              {r.open && r.applicationUrl && (
                <a href={r.applicationUrl} target="_blank" rel="noreferrer" className="btn btn--light">
                  {r.buttonLabel} <ArrowUpRight size={16} />
                </a>
              )}
              {!r.open && r.alternatives[0]?.url && (
                <a href={r.alternatives[0].url} target="_blank" rel="noreferrer" className="btn btn--light">
                  <Icon name={r.alternatives[0].icon || 'book'} size={16} className="icon-static" /> {r.alternatives[0].linkLabel || r.alternatives[0].title}
                </a>
              )}
            </div>
            {r.open && (r.cycleLabel || period) && (
              <ul className={styles.meta}>
                {r.cycleLabel && (
                  <li>
                    <UsersIcon size={18} />
                    <span>{r.cycleLabel}</span>
                  </li>
                )}
                {period && (
                  <li>
                    <CalendarIcon size={18} />
                    <span>{period}</span>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ───── Who can apply ───── */}
      {r.eligibility.length > 0 && (
        <Section tone="light" labelledBy="eligibility">
          <div className={styles.split}>
            <SectionHeader heading="Who can apply" id="eligibility" />
            <div className={`card ${styles.eligCard}`} data-reveal>
              <span className="icon-badge">
                <GraduationIcon size={24} />
              </span>
              <RichText value={r.eligibility} className={styles.prose} />
            </div>
          </div>
        </Section>
      )}

      {/* ───── Process ───── */}
      {r.process.length > 0 && (
        <Section labelledBy="process">
          <SectionHeader heading="How recruitment works" id="process" center />
          <ol className={styles.steps}>
            {r.process.map((s, i) => (
              <li key={i} className={`card ${styles.step}`} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <span className={`icon-badge ${styles.stepIcon}`}>
                  <Icon name={s.icon} size={28} />
                </span>
                <h3 className="t-h3">{s.title}</h3>
                {s.description && <p className="t-body">{s.description}</p>}
                {i < r.process.length - 1 && <ArrowRight size={22} className={styles.stepArrow} aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {/* ───── Open positions (optional) ───── */}
      {r.opportunities.length > 0 && (
        <Section tone="light" labelledBy="opportunities">
          <SectionHeader heading="Open positions" id="opportunities" />
          <ul className={styles.opps}>
            {r.opportunities.map((o) => (
              <li key={o.team.id} className="card" data-reveal>
                <div className={styles.oppHead}>
                  {o.team.logo && <Image src={o.team.logo.src} alt="" width={80} height={80} sizes="44px" className={styles.oppLogo} />}
                  <p className={styles.oppName}>{o.team.name}</p>
                </div>
                {o.note && <p className="t-small">{o.note}</p>}
                <div className="btn-row">
                  {r.open && (o.url || r.applicationUrl) && (
                    <a href={(o.url || r.applicationUrl)!} target="_blank" rel="noreferrer" className="btn btn--primary btn--sm">
                      Apply <ArrowUpRight size={14} />
                    </a>
                  )}
                  <Link href={`/teams/${o.team.slug}`} className="btn btn--secondary btn--sm">
                    About the team
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ───── Other ways ───── */}
      {r.alternatives.length > 0 && (
        <Section tone="light" background={{ src: '/seed/photo-whiteboard-2.webp', width: 1799, height: 1349, alt: '', position: '50% 40%' }} labelledBy="other-ways">
          <SectionHeader heading="Other ways to get involved" id="other-ways" />
          <ul className={styles.alts}>
            {r.alternatives.map((a, i) => (
              <li key={i} className={`card ${styles.alt}`} data-reveal>
                <span className="icon-badge">
                  <Icon name={a.icon || 'book'} size={24} />
                </span>
                <div className={styles.altText}>
                  <h3 className="t-h3">{a.title}</h3>
                  {a.description && (
                    <p className="t-body" style={{ whiteSpace: 'pre-line' }}>
                      {a.description}
                    </p>
                  )}
                </div>
                {a.url && (
                  <a href={a.url} target={/^https?:/.test(a.url) ? '_blank' : undefined} rel="noreferrer" className="btn btn--primary">
                    {a.linkLabel || 'Learn more'} <ArrowUpRight size={16} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
