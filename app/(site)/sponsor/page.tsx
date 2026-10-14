import type { Metadata } from 'next'
import Image from 'next/image'
import { ArrowRight, CheckIcon, DownloadIcon, Icon, MailIcon } from '@/components/icons'
import { SponsorWall } from '@/components/sponsors/SponsorWall'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IconBadge } from '@/components/ui/icon-badge'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAwards, getPeopleDirectory, getSite, getSponsorGroups, getSponsorsPage, getTeams, type Stat } from '@/lib/content'
import { Inline } from '@/lib/text'
import { cn } from '@/lib/utils'

export const revalidate = false

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSponsorsPage()
  return {
    title: 'Sponsor',
    description:
      'Sponsor VT CRO, the largest robotics design team organization at Virginia Tech. Reach top engineering talent through resume access, info sessions and our events.',
    alternates: { canonical: '/sponsor' },
  }
}

const photoBg = 'absolute inset-0 -z-3 [filter:grayscale(1)]'
const wash = 'absolute inset-0 -z-2 bg-[linear-gradient(180deg,rgb(10_10_11/0.84),rgb(10_10_11/0.74)_50%,var(--bg))]'
const intro = 't-lead max-w-[58ch] text-[rgb(255_255_255/0.76)]'
// Figures sit above their labels.
const stat = 'flex flex-col-reverse justify-end'

/**
 * Each tier's metal colors: a faint wash across the top of the card and a small gem by the name.
 * `--m1` is the wash; the gem runs from `--m2` to `--m1`.
 */
const tierColors: Record<string, string> = {
  platinum: '[--m1:#a7b0bd] [--m2:#eef1f5] [--m3:#c3cad4]',
  diamond: '[--m1:#4f9fc6] [--m2:#bfe9fb] [--m3:#7cc3e3]',
  gold: '[--m1:#b8912f] [--m2:#ecd48a] [--m3:#cfa846]',
  silver: '[--m1:#8e959c] [--m2:#d9dde1] [--m3:#aab0b6]',
}

/** The page VT CRO shares with prospective sponsors. All copy and figures are edited in the CMS (Sponsors → Sponsor page). */
export default async function SponsorPage() {
  const [page, groups, site, design, support, awards, people] = await Promise.all([
    getSponsorsPage(),
    getSponsorGroups(),
    getSite(),
    getTeams('design'),
    getTeams('support'),
    getAwards(),
    getPeopleDirectory(),
  ])
  const email = site.contact.sponsorship
  const mailto = email ? `mailto:${email}?subject=${encodeURIComponent('Sponsoring VT CRO')}` : null

  // Member, team and award counts are counted from the CMS so they never go stale.
  const highlights: Stat[] = [
    ...(people.total ? [{ value: String(people.total), label: 'Members' }] : []),
    ...(design.length ? [{ value: String(design.length), label: 'Design teams' }] : []),
    ...(support.length ? [{ value: String(support.length), label: 'Support teams' }] : []),
    ...(awards.length ? [{ value: String(awards.length), label: 'Awards & honors' }] : []),
    ...page.highlights,
  ]

  // Only shown once a pitch deck PDF has been uploaded in the CMS.
  const Deck = () =>
    page.packetUrl ? (
      <Button asChild variant="secondary">
        <a href={page.packetUrl} target="_blank" rel="noreferrer">
          <DownloadIcon size={16} className="icon-static" /> {page.packetLabel}
        </a>
      </Button>
    ) : null

  return (
    <>
      {/* ───── Top ───── */}
      <section
        className="relative isolate overflow-hidden pt-[calc(var(--header-h)+clamp(72px,12vw,168px))] pb-[clamp(40px,6vw,72px)] text-center"
        aria-labelledby="sponsor-heading"
      >
        <div className={photoBg} aria-hidden="true">
          <Image src="/seed/photo-awards-group.webp" alt="" fill sizes="100vw" preload style={{ objectFit: 'cover', objectPosition: '50% 35%' }} />
        </div>
        <div className={wash} aria-hidden="true" />
        <div className="site-container">
          <div className="mx-auto grid max-w-[940px] justify-items-center gap-6">
            <h1 id="sponsor-heading" className="t-display [&_em]:font-normal [&_em]:italic">
              <Inline text={page.heading || 'Sponsor VT CRO'} />
            </h1>
            {page.intro && <p className={intro}>{page.intro}</p>}
            <div className="flex flex-wrap justify-center gap-3">
              {mailto && (
                <Button asChild variant="light">
                  <a href={mailto}>
                    <MailIcon size={16} className="icon-static" /> Become a sponsor
                  </a>
                </Button>
              )}
              <Deck />
            </div>
          </div>
          {highlights.length > 0 && (
            <dl
              className={[
                'mt-[clamp(64px,10vw,128px)] grid grid-cols-2 border-t border-line-2',
                'min-[900px]:data-[count=3]:grid-cols-3 min-[900px]:data-[count=4]:grid-cols-4 min-[900px]:data-[count=5]:grid-cols-5',
                'min-[900px]:[&>div+div]:border-l min-[900px]:[&>div+div]:border-l-line',
              ].join(' ')}
              data-count={highlights.length}
            >
              {highlights.map((h) => (
                <div key={h.label} className={`${stat} gap-2 px-3 pt-[26px] pb-1`}>
                  <dt className="t-label">{h.label}</dt>
                  <dd className="text-[clamp(2.2rem,1.5rem+3vw,3.8rem)] leading-none font-light tracking-[-0.04em] tabular-nums">{h.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </section>

      {/* ───── Talent ───── */}
      {(page.talent.body || page.talent.stats.length > 0) && (
        <Section
          background={page.talent.image ?? { src: '/seed/photo-lab-build-night.webp', width: 2400, height: 1800, alt: '', position: '50% 50%' }}
          labelledBy="talent-heading"
        >
          <div className="grid items-center gap-[clamp(40px,6vw,72px)] min-[960px]:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            <div className="grid justify-items-start gap-[22px]" data-reveal>
              <h2 id="talent-heading" className="t-h2">
                {page.talent.heading || 'Our talent'}
              </h2>
              {page.talent.body && <p className="t-lead max-w-[54ch]">{page.talent.body}</p>}
              {page.talent.disciplines.length > 0 && (
                <ul className="mt-1 flex flex-wrap gap-2" aria-label="Majors">
                  {page.talent.disciplines.map((d) => (
                    <Badge asChild key={d} className="h-8 bg-[rgb(10_10_11/0.35)] px-3.5">
                      <li>{d}</li>
                    </Badge>
                  ))}
                </ul>
              )}
            </div>
            {page.talent.stats.length > 0 && (
              <dl className="grid grid-cols-2 gap-4">
                {page.talent.stats.map((s, i) => (
                  <div
                    key={s.label}
                    className={`${stat} gap-3 rounded-(--radius-l) bg-[rgb(10_10_11/0.45)] p-[clamp(24px,3.4vw,40px)] [box-shadow:0_0_0_1px_var(--line-2)_inset] [-webkit-backdrop-filter:blur(10px)] [backdrop-filter:blur(10px)]`}
                    data-reveal
                    style={{ ['--reveal-i' as string]: i + 1 }}
                  >
                    <dt className="t-label">{s.label}</dt>
                    <dd className="text-[clamp(2.6rem,1.6rem+3.6vw,4.6rem)] leading-none font-light tracking-[-0.045em]">{s.value}</dd>
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
          <ul className="grid gap-4 min-[960px]:grid-cols-2 min-[960px]:gap-5">
            {page.hostedEvents.map((e, i) => (
              <Card asChild key={e.name} className="grid content-start gap-4 p-[clamp(24px,3.4vw,40px)]">
                <li data-reveal style={{ ['--reveal-i' as string]: i }}>
                  <div className="flex items-center gap-4">
                    <IconBadge>
                      <Icon name={e.icon || 'calendar'} size={22} />
                    </IconBadge>
                    <h3 className="t-h3">{e.name}</h3>
                  </div>
                  {e.description && <p className="t-body">{e.description}</p>}
                  {e.stats.length > 0 && (
                    <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-line pt-[22px] min-[1180px]:grid-cols-4">
                      {e.stats.map((s) => (
                        <div key={s.label} className={`${stat} gap-1.5`}>
                          <dt className="text-[0.8125rem] text-fg-3">{s.label}</dt>
                          <dd className="text-[clamp(1.9rem,1.5rem+1.4vw,2.6rem)] leading-none font-light tracking-[-0.04em]">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </li>
              </Card>
            ))}
          </ul>
        </Section>
      )}

      {/* ───── What sponsors get ───── */}
      {page.reasons.length > 0 && (
        <Section labelledBy="offer-heading">
          <SectionHeader heading={page.reasonsHeading || 'What sponsors get'} id="offer-heading" />
          <ul className="grid border-t border-line-2 min-[900px]:grid-cols-2 min-[900px]:gap-x-14">
            {page.reasons.map((r, i) => (
              <li key={r.title} className="flex items-start gap-5 border-b border-line py-7" data-reveal style={{ ['--reveal-i' as string]: i }}>
                <IconBadge>
                  <Icon name={r.icon || 'star'} size={22} />
                </IconBadge>
                <div className="grid gap-2">
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
          <ol
            className="grid gap-4 min-[700px]:grid-cols-2 min-[700px]:gap-5 min-[1180px]:data-[count=3]:grid-cols-3 min-[1180px]:data-[count=4]:grid-cols-4"
            data-count={page.tiers.length}
          >
            {page.tiers.map((t, i) => {
              const tier = t.name.trim().toLowerCase()
              const top = i === 0
              return (
                <li
                  key={t.name}
                  className={cn(
                    'relative isolate grid content-start gap-[22px] overflow-hidden rounded-(--radius-l) p-[clamp(24px,3vw,32px)] [box-shadow:0_0_0_1px_var(--line-2)_inset] [--m1:transparent] [--m2:transparent] [--m3:transparent]',
                    // a faint wash of the tier's color across the top of the card
                    "after:pointer-events-none after:absolute after:inset-0 after:-z-1 after:bg-[radial-gradient(120%_55%_at_0%_0%,color-mix(in_srgb,var(--m1)_var(--wash,14%),transparent),transparent_70%)] after:content-['']",
                    tierColors[tier],
                    // The top tier is a dark card.
                    top && 'bg-[#0a0a0b] text-[#f5f5f4] [box-shadow:0_30px_60px_-30px_rgb(0_0_0/0.5)] after:[--wash:22%]',
                  )}
                  data-tier={tier}
                  data-reveal
                  style={{ ['--reveal-i' as string]: i }}
                >
                  <div className={cn('grid gap-2.5 border-b border-line pb-5', top && 'border-b-[rgb(255_255_255/0.14)]')}>
                    <h3
                      className={cn(
                        'flex items-center gap-2.5 font-mono text-[0.75rem] font-normal tracking-[0.18em] text-fg-3 uppercase',
                        top && 'text-[rgb(255_255_255/0.6)]',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block size-2.5 flex-none rounded-[2px] bg-[linear-gradient(135deg,var(--m2),var(--m3)_50%,var(--m1))] [box-shadow:0_0_0_1px_rgb(0_0_0/0.08)] [transform:rotate(45deg)]',
                          (tier === 'platinum' || top) && '[box-shadow:0_0_0_1px_rgb(255_255_255/0.12),0_0_12px_rgb(244_245_247/0.25)]',
                        )}
                        aria-hidden="true"
                      />
                      {t.name}
                    </h3>
                    {t.amount && (
                      <p className="text-[clamp(1.5rem,1.3rem+0.8vw,1.9rem)] leading-[1.15] font-light tracking-[-0.03em] tabular-nums min-[700px]:min-h-[2.3em] [&_span]:block">
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
                    <ul className="grid gap-3">
                      {t.benefits.map((b) => (
                        <li key={b} className="grid grid-cols-[16px_minmax(0,1fr)] gap-3 text-[0.9375rem] leading-[1.45]">
                          <CheckIcon size={16} className={cn('mt-[3px] text-fg-3', top && 'text-[rgb(255_255_255/0.7)]')} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ol>
          {page.tiersNote && <p className="mt-7 text-center text-[0.875rem] text-fg-3">{page.tiersNote}</p>}
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
      <section className="relative isolate overflow-hidden py-[clamp(96px,13vw,180px)] text-center" aria-labelledby="cta">
        <div className={photoBg} aria-hidden="true">
          <Image src="/seed/photo-team-group.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: '50% 40%' }} />
        </div>
        <div className={wash} aria-hidden="true" />
        <div className="site-container">
          <div className="mx-auto grid max-w-[820px] justify-items-center gap-[22px]" data-reveal>
            <h2 id="cta" className="t-h1">
              {page.ctaHeading || 'Start a conversation'}
            </h2>
            {page.ctaBody && <p className={intro}>{page.ctaBody}</p>}
            <div className="flex flex-wrap justify-center gap-3">
              {mailto && (
                <Button asChild variant="light">
                  <a href={mailto}>
                    Email {email} <ArrowRight size={16} />
                  </a>
                </Button>
              )}
              <Deck />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
