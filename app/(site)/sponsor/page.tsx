import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, CheckIcon, DownloadIcon, Icon, MailIcon } from '@/components/icons'
import { SponsorWall } from '@/components/sponsors/SponsorWall'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAwards, getSite, getSponsorGroups, getSponsorsPage, getTeams, type Stat } from '@/lib/content'
import { Inline } from '@/lib/text'
import styles from './page.module.css'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSponsorsPage()
  return {
    title: 'Sponsor',
    description: page.intro || 'Sponsor VT CRO, the Competitive Robotics Organization at Virginia Tech.',
    alternates: { canonical: '/sponsor' },
  }
}

/** The page VT CRO shares with prospective sponsors. All copy and figures are edited in the CMS (Sponsors → Sponsor page). */
export default async function SponsorPage() {
  const [page, groups, site, design, support, awards] = await Promise.all([
    getSponsorsPage(),
    getSponsorGroups(),
    getSite(),
    getTeams('design'),
    getTeams('support'),
    getAwards(),
  ])
  const email = site.contact.sponsorship
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent('Sponsoring VT CRO')}` : null

  // Team and award counts are counted from the CMS so they never go stale.
  const highlights: Stat[] = [
    ...(design.length ? [{ value: String(design.length), label: 'Design teams' }] : []),
    ...(support.length ? [{ value: String(support.length), label: 'Support teams' }] : []),
    ...(awards.length ? [{ value: String(awards.length), label: 'Awards & honors' }] : []),
    ...page.highlights,
  ]

  const Deck = ({ light }: { light?: boolean }) =>
    page.packetUrl ? (
      <a href={page.packetUrl} target="_blank" rel="noreferrer" className={`btn ${light ? 'btn--light' : 'btn--secondary'}`}>
        <DownloadIcon size={16} className="icon-static" /> {page.packetLabel}
      </a>
    ) : (
      <span className="btn btn--secondary" aria-disabled="true" title="Upload the pitch deck in the CMS: Sponsors → Sponsor page → Closing & pitch deck">
        <DownloadIcon size={16} className="icon-static" /> Pitch deck · Coming soon
      </span>
    )

  return (
    <>
      {/* ───── Top ───── */}
      <section className={styles.hero} aria-labelledby="sponsor-heading">
        <div className={styles.bg} aria-hidden="true">
          <Image src="/seed/photo-awards-group.webp" alt="" fill sizes="100vw" preload style={{ objectFit: 'cover', objectPosition: '50% 35%' }} />
        </div>
        <div className={styles.wash} aria-hidden="true" />
        <div className="container">
          <div className={styles.heroInner}>
            <h1 id="sponsor-heading" className="t-display">
              <Inline text={page.heading || 'Sponsor VT CRO'} />
            </h1>
            {page.intro && <p className={`t-lead ${styles.intro}`}>{page.intro}</p>}
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              {mailto && (
                <a href={mailto} className="btn btn--light">
                  <MailIcon size={16} className="icon-static" /> Become a sponsor
                </a>
              )}
              <Deck />
            </div>
          </div>
          {highlights.length > 0 && (
            <dl className={styles.highlights} data-count={highlights.length}>
              {highlights.map((h) => (
                <div key={h.label} className={styles.highlight}>
                  <dt className="t-label">{h.label}</dt>
                  <dd className={styles.figure}>{h.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* ───── Talent ───── */}
      {(page.talent.body || page.talent.stats.length > 0) && (
        <Section background={{ src: '/seed/photo-lab-build-night.webp', width: 2400, height: 1800, alt: '', position: '50% 50%' }} labelledBy="talent-heading">
          <div className={styles.talent}>
            <div className={styles.talentText} data-reveal>
              <h2 id="talent-heading" className="t-h2">
                {page.talent.heading || 'Our talent'}
              </h2>
              {page.talent.body && <p className="t-lead">{page.talent.body}</p>}
              {page.talent.disciplines.length > 0 && (
                <ul className={styles.disciplines} aria-label="Majors">
                  {page.talent.disciplines.map((d) => (
                    <li key={d} className="chip">
                      {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {page.talent.stats.length > 0 && (
              <dl className={styles.talentStats}>
                {page.talent.stats.map((s, i) => (
                  <div key={s.label} className={styles.statCard} data-reveal style={{ ['--reveal-i' as string]: i + 1 }}>
                    <dt className="t-label">{s.label}</dt>
                    <dd className={styles.statFigure}>{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Section>
      )}

      {/* ───── Events we host ───── */}
      {page.hostedEvents.length > 0 && (
        <Section tone="light" labelledBy="events-heading">
          <SectionHeader heading={page.eventsHeading || 'Events we host'} intro={page.eventsIntro} id="events-heading" />
          <ul className={styles.events}>
            {page.hostedEvents.map((e, i) => (
              <li key={e.name} className={`card ${styles.event}`} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <div className={styles.eventHead}>
                  <span className="icon-badge">
                    <Icon name={e.icon || 'calendar'} size={22} />
                  </span>
                  <h3 className="t-h3">{e.name}</h3>
                </div>
                {e.description && <p className="t-body">{e.description}</p>}
                {e.stats.length > 0 && (
                  <dl className={styles.eventStats}>
                    {e.stats.map((s) => (
                      <div key={s.label}>
                        <dt className={styles.eventLabel}>{s.label}</dt>
                        <dd className={styles.eventFigure}>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ───── What sponsors get ───── */}
      {page.reasons.length > 0 && (
        <Section labelledBy="offer-heading">
          <SectionHeader heading={page.reasonsHeading || 'What sponsors get'} id="offer-heading" />
          <ul className={styles.offer}>
            {page.reasons.map((r, i) => (
              <li key={r.title} className={styles.offerItem} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <span className="icon-badge">
                  <Icon name={r.icon || 'star'} size={22} />
                </span>
                <div>
                  <h3 className="t-h3">{r.title}</h3>
                  {r.body && <p className="t-body">{r.body}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* ───── Tiers ───── */}
      {page.tiers.length > 0 && (
        <Section tone="light" labelledBy="tiers-heading">
          <SectionHeader heading={page.tiersHeading || 'Sponsorship tiers'} id="tiers-heading" center />
          <ol className={styles.tiers} data-count={page.tiers.length}>
            {page.tiers.map((t, i) => (
              <li key={t.name} className={`${styles.tier} ${i === 0 ? styles.tierTop : ''}`} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <div className={styles.tierHead}>
                  <h3 className={styles.tierName}>{t.name}</h3>
                  {t.amount && (
                    <p className={styles.tierAmount}>
                      {/* A range like "$5,000 – $14,999" always breaks after the dash, so every card lines up. */}
                      {t.amount.split(/\s*[–-]\s*(?=\$)/).map((part, j) => (
                        <span key={j}>
                          {j > 0 && '– '}
                          {part}
                          {j === 0 && t.amount.match(/[–-]\s*\$/) ? ' ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
                {t.benefits.length > 0 && (
                  <ul className={styles.tierBenefits}>
                    {t.benefits.map((b) => (
                      <li key={b}>
                        <CheckIcon size={16} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
          {page.tiersNote && <p className={styles.tiersNote}>{page.tiersNote}</p>}
        </Section>
      )}

      {/* ───── Current sponsors ───── */}
      {groups.length > 0 && (
        <Section labelledBy="current">
          <SectionHeader heading={page.sponsorsHeading || 'Thank you to our sponsors'} id="current" />
          <SponsorWall groups={groups} />
        </Section>
      )}

      {/* ───── Closing ───── */}
      <section className={styles.cta} aria-labelledby="cta">
        <div className={styles.ctaBg} aria-hidden="true">
          <Image src="/seed/photo-team-group.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: '50% 40%' }} />
        </div>
        <div className={styles.wash} aria-hidden="true" />
        <div className="container">
          <div className={styles.ctaInner} data-reveal>
            <h2 id="cta" className="t-h1">
              {page.ctaHeading || 'Start a conversation'}
            </h2>
            {page.ctaBody && <p className={`t-lead ${styles.intro}`}>{page.ctaBody}</p>}
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              {mailto && (
                <a href={mailto} className="btn btn--light">
                  Email {email} <ArrowRight size={16} />
                </a>
              )}
              <Deck />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

