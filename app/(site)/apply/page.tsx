import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, CalendarIcon, GraduationIcon, Icon, UsersIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { IconBadge } from '@/components/ui/icon-badge'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatusDot } from '@/components/ui/status-dot'
import { getRecruitment } from '@/lib/content'
import { formatDate } from '@/lib/format'

export const revalidate = false

export const metadata: Metadata = {
  title: 'Apply',
  description:
    'Join VT CRO, the Competitive Robotics Organization at Virginia Tech. See who can apply, how recruitment works, and when applications open each September.',
  alternates: { canonical: '/apply' },
}

export default async function ApplyPage() {
  const r = await getRecruitment()
  const period =
    r.periodStart || r.periodEnd ? [r.periodStart && formatDate(r.periodStart), r.periodEnd && formatDate(r.periodEnd)].filter(Boolean).join(' – ') : null

  return (
    <>
      {/* ───── Status ───── */}
      <section
        className="relative isolate overflow-hidden pt-[calc(var(--header-h)+clamp(64px,11vw,150px))] pb-[clamp(72px,10vw,140px)] text-center"
        data-open={r.open || undefined}
      >
        <div className="absolute inset-0 -z-3 [filter:grayscale(1)]" aria-hidden="true">
          <Image src="/seed/photo-atrium-competition.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} preload />
        </div>
        <div className="absolute inset-0 -z-2 bg-[linear-gradient(180deg,rgb(10_10_11/0.82),rgb(10_10_11/0.72)_55%,var(--bg))]" aria-hidden="true" />
        <div className="site-container">
          <div className="mx-auto grid max-w-[860px] justify-items-center gap-[22px]">
            <p className="inline-flex items-center gap-2.5 rounded-[999px] bg-[rgb(255_255_255/0.08)] py-2 pr-4 pl-[13px] font-mono text-[0.72rem] tracking-[0.14em] uppercase [box-shadow:0_0_0_1px_rgb(255_255_255/0.18)_inset] [-webkit-backdrop-filter:blur(8px)] [backdrop-filter:blur(8px)]">
              <StatusDot on={r.open} />
              {r.open ? 'Applications open' : 'Applications closed'}
            </p>
            <h1 className="t-h1">{r.open ? r.openHeading : r.closedHeading}</h1>
            {(r.open ? r.openMessage : r.closedMessage) && (
              <p className="t-lead max-w-[54ch] whitespace-pre-line text-[rgb(255_255_255/0.75)]">{r.open ? r.openMessage : r.closedMessage}</p>
            )}
            <div className="flex flex-wrap justify-center gap-3">
              {r.open && r.applicationUrl && (
                <Button asChild variant="light">
                  <a href={r.applicationUrl} target="_blank" rel="noreferrer">
                    {r.buttonLabel} <ArrowUpRight size={16} />
                  </a>
                </Button>
              )}
              {!r.open && r.alternatives[0]?.url && (
                <Button asChild variant="light">
                  <a href={r.alternatives[0].url} target="_blank" rel="noreferrer">
                    <Icon name={r.alternatives[0].icon || 'book'} size={16} className="icon-static" /> {r.alternatives[0].linkLabel || r.alternatives[0].title}
                  </a>
                </Button>
              )}
            </div>
            {r.open && (r.cycleLabel || period) && (
              <ul className="mt-2 flex flex-wrap justify-center gap-2.5 [&_svg]:text-fg">
                {r.cycleLabel && (
                  <li className={metaClass}>
                    <UsersIcon size={18} />
                    <span>{r.cycleLabel}</span>
                  </li>
                )}
                {period && (
                  <li className={metaClass}>
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
          <div className="grid items-center gap-2 min-[1000px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1000px]:gap-16 min-[1000px]:[&>header]:mb-0">
            <SectionHeader heading="Who can apply" id="eligibility" />
            <Card className="flex items-start gap-5 p-[clamp(24px,4vw,40px)]" data-reveal>
              <IconBadge className="rounded-[18px] [--size:56px]">
                <GraduationIcon size={24} />
              </IconBadge>
              <RichText value={r.eligibility} className="text-[clamp(1.1rem,1rem+0.5vw,1.4rem)] leading-[1.5] font-semibold tracking-[-0.01em] text-fg" />
            </Card>
          </div>
        </Section>
      )}

      {/* ───── Process ───── */}
      {r.process.length > 0 && (
        <Section labelledBy="process">
          <SectionHeader heading="How recruitment works" id="process" center />
          <ol className="mx-auto grid max-w-[1100px] gap-4 min-[860px]:grid-cols-[repeat(3,1fr)] min-[860px]:gap-10">
            {r.process.map((s, i) => (
              <Card
                asChild
                key={i}
                className="grid content-start justify-items-center gap-3.5 p-[clamp(28px,3vw,40px)] text-center [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transition:transform_500ms_var(--ease),box-shadow_var(--dur-2)_var(--ease)] hoverable:hover:[box-shadow:0_0_0_1px_rgb(255_255_255/0.135)_inset,0_30px_70px_-30px_rgb(0_0_0/0.45)]"
              >
                <li data-reveal style={{ ['--reveal-i' as string]: i }}>
                  <IconBadge className="mb-1.5 rounded-[22px] [--size:72px]">
                    <Icon name={s.icon} size={28} />
                  </IconBadge>
                  <h3 className="t-h3">{s.title}</h3>
                  {s.description && <p className="t-body">{s.description}</p>}
                  {i < r.process.length - 1 && (
                    <ArrowRight
                      size={22}
                      className="hidden min-[860px]:absolute min-[860px]:top-1/2 min-[860px]:-right-8 min-[860px]:-mt-[11px] min-[860px]:block min-[860px]:text-fg"
                      aria-hidden="true"
                    />
                  )}
                </li>
              </Card>
            ))}
          </ol>
        </Section>
      )}

      {/* ───── Open positions (optional) ───── */}
      {r.opportunities.length > 0 && (
        <Section tone="light" labelledBy="opportunities">
          <SectionHeader heading="Open positions" id="opportunities" />
          <ul className="grid gap-4 min-[760px]:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {r.opportunities.map((o) => (
              <Card asChild key={o.team.id} className="grid gap-3.5 p-[22px]">
                <li data-reveal>
                  <div className="flex items-center gap-3">
                    {o.team.logo && <Image src={o.team.logo.src} alt="" width={80} height={80} sizes="44px" className="size-11 rounded-[50%]" />}
                    <p className="text-[1.125rem] font-medium">{o.team.name}</p>
                  </div>
                  {o.note && <p className="t-small">{o.note}</p>}
                  <div className="flex flex-wrap gap-3">
                    {r.open && (o.url || r.applicationUrl) && (
                      <Button asChild size="sm">
                        <a href={(o.url || r.applicationUrl)!} target="_blank" rel="noreferrer">
                          Apply <ArrowUpRight size={14} />
                        </a>
                      </Button>
                    )}
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/teams/${o.team.slug}`}>About the team</Link>
                    </Button>
                  </div>
                </li>
              </Card>
            ))}
          </ul>
        </Section>
      )}

      {/* ───── Other ways ───── */}
      {r.alternatives.length > 0 && (
        <Section tone="light" background={{ src: '/seed/photo-whiteboard-2.webp', width: 1799, height: 1349, alt: '', position: '50% 40%' }} labelledBy="other-ways">
          <SectionHeader heading="Other ways to get involved" id="other-ways" />
          <ul className="grid gap-4">
            {r.alternatives.map((a, i) => (
              <Card
                asChild
                key={i}
                className="grid items-center gap-[18px] p-[clamp(24px,3.5vw,40px)] min-[900px]:grid-cols-[auto_minmax(0,1fr)_auto] min-[900px]:gap-7"
              >
                <li data-reveal>
                  <IconBadge className="rounded-[18px] [--size:60px]">
                    <Icon name={a.icon || 'book'} size={24} />
                  </IconBadge>
                  <div className="grid gap-2">
                    <h3 className="t-h3">{a.title}</h3>
                    {a.description && <p className="t-body whitespace-pre-line">{a.description}</p>}
                  </div>
                  {a.url && (
                    <Button asChild className="justify-self-start">
                      <a href={a.url} target={/^https?:/.test(a.url) ? '_blank' : undefined} rel="noreferrer">
                        {a.linkLabel || 'Learn more'} <ArrowUpRight size={16} />
                      </a>
                    </Button>
                  )}
                </li>
              </Card>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}

const metaClass =
  'inline-flex items-center gap-2 rounded-[999px] bg-[rgb(255_255_255/0.05)] px-3.5 py-2 text-[0.875rem] font-semibold text-fg-2 [box-shadow:0_0_0_1px_var(--line)_inset]'
