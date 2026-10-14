import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ComponentType, ReactNode } from 'react'
import { AwardLedger } from '@/components/awards/AwardLedger'
import { EventCard } from '@/components/events/EventCard'
import { EventGrid } from '@/components/events/EventGrid'
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckIcon, CpuIcon, DocIcon, GitHubIcon, GlobeIcon, PinIcon, TrophyIcon, WrenchIcon } from '@/components/icons'
import { PeopleGrid } from '@/components/people/PeopleGrid'
import { Button } from '@/components/ui/button'
import { IconBadge } from '@/components/ui/icon-badge'
import { Media } from '@/components/ui/Media'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatusDot } from '@/components/ui/status-dot'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { getRecruitment, getTeam, getTeams } from '@/lib/content'
import { DEFAULT_SHARE_IMAGE } from '@/lib/format'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const revalidate = false

export async function generateStaticParams() {
  return (await getTeams()).map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const team = await getTeam((await params).slug)
  if (!team) return {}
  const description =
    team.seo.description ||
    `${team.name} is a VT CRO ${team.type === 'design' ? 'robotics design' : 'support'} team at Virginia Tech. ${team.shortDescription}`.trim()
  const title = team.seo.title || (team.type === 'design' ? `${team.name} · Robotics Design Team` : `${team.name} Team`)
  return {
    title,
    description,
    alternates: { canonical: `/teams/${team.slug}` },
    openGraph: {
      title: `${team.name} · VT CRO`,
      description,
      images: team.cover ? [{ url: team.cover.src, width: team.cover.width, height: team.cover.height, alt: team.cover.alt }] : [DEFAULT_SHARE_IMAGE],
    },
  }
}

const blockClass = 'mt-2 grid gap-3.5'
const imagesClass = 'mt-2 grid gap-3 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] [&_figure]:grid [&_figure]:gap-2'
const imageFrame = 'relative aspect-[4/3] overflow-hidden rounded-(--radius-s)'
const peopleGroup = '[&+&]:mt-[clamp(48px,6vw,80px)] [&>h3]:mb-5'

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [team, allTeams, recruitment] = await Promise.all([getTeam(slug), getTeams(), getRecruitment()])
  if (!team) notFound()

  const typeLabel = team.type === 'design' ? 'Design Team' : 'Support Team'
  const sameType = allTeams.filter((t) => t.type === team.type)
  const pos = sameType.findIndex((t) => t.id === team.id)
  const nextTeam = sameType[(pos + 1) % sameType.length]
  const applyHref = team.applicationUrl ?? '/apply'
  const applyExternal = Boolean(team.applicationUrl)
  const facts: { label: string; value: ReactNode; icon: ComponentType<{ size?: number }> }[] = [
    { label: 'Type', value: typeLabel, icon: WrenchIcon },
    ...(team.code ? [{ label: 'Code', value: <span className="font-mono tracking-[0.12em]">{team.code}</span>, icon: CpuIcon }] : []),
    ...(team.competition?.name
      ? [
          {
            label: 'Competition',
            icon: TrophyIcon,
            value: team.competition.url ? (
              <a
                href={team.competition.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border-b border-line-3 hover:border-accent hover:text-accent"
              >
                {team.competition.name} <ArrowUpRight size={13} />
              </a>
            ) : (
              team.competition.name
            ),
          },
        ]
      : []),
    ...(team.competition?.location ? [{ label: 'Location', value: team.competition.location, icon: PinIcon }] : []),
  ]

  const links = [
    ...team.githubRepos.map((r) => ({ href: r.url, label: r.label, icon: GitHubIcon })),
    ...(team.competition?.rulesUrl ? [{ href: team.competition.rulesUrl, label: 'Competition rules', icon: DocIcon }] : []),
    ...(team.docsUrl ? [{ href: team.docsUrl, label: 'Technical documentation', icon: DocIcon }] : []),
    ...(team.websiteUrl ? [{ href: team.websiteUrl, label: 'Team website', icon: GlobeIcon }] : []),
  ]

  const hasOverview = team.fullDescription.length > 0 || team.mission || team.objectives.length > 0
  const missionClass = 'max-w-[34ch] text-[clamp(1.3rem,1.1rem+0.8vw,1.75rem)] leading-[1.4] font-medium tracking-[-0.02em] text-fg'

  return (
    <article>
      {/* ───── Cover ───── */}
      <header className="relative isolate flex min-h-[88svh] items-end overflow-hidden lg:min-h-[min(84svh,860px)]">
        <div className="absolute inset-0 -z-1">
          <Media img={team.cover} placeholder={`${team.name} · cover photo`} sizes="100vw" preload />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--bg)_0%,rgb(8_9_12/0.86)_28%,rgb(8_9_12/0.3)_62%,rgb(8_9_12/0.6)_100%),radial-gradient(60%_60%_at_0%_100%,rgb(255_255_255/0.105),transparent_70%)]" />
        </div>
        <div className="site-container pt-[calc(var(--header-h)+64px)] pb-[clamp(40px,6vw,72px)]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2.5">
            <Link href="/teams" className="t-label hover:text-fg">
              Teams
            </Link>
            <span className="t-label" aria-hidden="true">
              /
            </span>
            <span className="t-label" aria-current="page">
              {typeLabel}
            </span>
          </nav>
          <div className="mt-6 flex flex-wrap items-end gap-[18px] lg:gap-7 [&>div]:max-w-full [&>div]:min-w-0">
            {team.logo && (
              <span className="mb-[0.4em] size-[72px] flex-none overflow-hidden rounded-[50%] [box-shadow:0_14px_40px_-8px_rgb(0_0_0/0.45)] lg:size-24 [&_img]:size-full [&_img]:object-cover">
                <Image src={team.logo.src} alt={team.logo.alt} width={192} height={192} sizes="(min-width: 1024px) 96px, 72px" preload />
              </span>
            )}
            <div>
              {team.code && (
                <p className="mb-3.5 inline-flex h-7 items-center rounded-[999px] bg-[rgb(255_255_255/0.255)] px-2.5 font-mono text-[0.72rem] font-semibold tracking-[0.16em] text-[#fff] [box-shadow:0_6px_18px_-6px_rgb(0_0_0/0.45)]">
                  {team.code}
                </p>
              )}
              <h1 className="t-display text-[clamp(2.1rem,10.5vw,6.4rem)] wrap-anywhere">{team.name}</h1>
            </div>
          </div>
          {team.shortDescription && <p className="t-lead mt-[22px] max-w-[52ch] text-fg-2">{team.shortDescription}</p>}
          <div className="mt-[30px] grid gap-2.5 min-[480px]:flex min-[480px]:flex-wrap min-[480px]:gap-3">
            {applyExternal ? (
              <Button asChild>
                <a href={applyHref} target="_blank" rel="noreferrer">
                  Apply to {team.name} <ArrowUpRight size={16} />
                </a>
              </Button>
            ) : (
              <Button asChild variant={recruitment.open ? 'primary' : 'secondary'}>
                <Link href={applyHref}>
                  <StatusDot on={recruitment.open} />
                  {recruitment.open ? `Apply to ${team.name}` : 'How to join'}
                </Link>
              </Button>
            )}
            {team.githubRepos[0] && (
              <Button asChild variant="secondary">
                <a href={team.githubRepos[0].url} target="_blank" rel="noreferrer">
                  <GitHubIcon size={17} className="icon-static" /> View on GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ───── Overview + facts ───── */}
      <Section>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-[72px]">
            {/* Phones: story first, facts after */}
            <aside className="order-2 grid content-start gap-7 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:order-0" aria-label="Team facts">
              <dl className="grid grid-cols-[1fr_1fr] border-t border-line-2 lg:grid-cols-[1fr]">
                {facts.map((f) => (
                  <div key={f.label} className="grid gap-2 border-b border-line py-3.5 pr-3 pl-0 lg:grid-cols-[150px_1fr] lg:items-center lg:px-0">
                    <dt className="flex items-center gap-2.5">
                      <IconBadge className="rounded-[10px] [--size:32px]">
                        <f.icon size={18} />
                      </IconBadge>
                      <span className="t-label">{f.label}</span>
                    </dt>
                    <dd className="text-[0.9375rem] font-medium text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
              {team.competition?.logo && (
                <div className="w-[72px] opacity-90 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-[50%]">
                  <Image src={team.competition.logo.src} alt={team.competition.logo.alt} width={team.competition.logo.width} height={team.competition.logo.height} sizes="96px" />
                </div>
              )}
              {links.length > 0 && (
                <ul className="grid border-t border-line">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-12 items-center gap-3 border-b border-line text-[0.9375rem] font-medium text-fg-2 [transition:color_var(--dur-2)_var(--ease)] hover:text-fg [&_span]:flex-1"
                      >
                        <l.icon size={16} />
                        <span>{l.label}</span>
                        <ArrowUpRight size={14} className="text-fg-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <div className="min-w-0 lg:order-1">
              <SectionHeader heading={`About ${team.name}`} />
              {hasOverview ? (
                <div className="grid gap-10" data-reveal>
                  {team.fullDescription.length > 0 ? (
                    <RichText
                      value={team.fullDescription}
                      className="text-[clamp(1.05rem,1rem+0.25vw,1.2rem)] text-fg-2 [&>p:first-child]:text-[1.12em] [&>p:first-child]:leading-[1.6] [&>p:first-child]:tracking-[-0.01em] [&>p:first-child]:text-fg"
                    />
                  ) : null}
                  {team.mission && (
                    <div className={blockClass}>
                      <h2 className="t-label">Mission</h2>
                      <p className={missionClass}>{team.mission}</p>
                    </div>
                  )}
                  {team.objectives.length > 0 && (
                    <div className={blockClass}>
                      <h2 className="t-label">Objectives</h2>
                      <ol className="grid border-t border-line">
                        {team.objectives.map((o, i) => (
                          <li key={i} className="grid grid-cols-[32px_1fr] items-center gap-3.5 border-b border-line py-3 text-fg-2">
                            <IconBadge className="rounded-[50%] [--size:32px]">
                              <CheckIcon size={16} />
                            </IconBadge>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ) : (
                <p className={`t-lead ${missionClass}`} data-reveal>
                  {team.shortDescription}
                </p>
              )}

              {team.currentProject && (
                <div
                  className="mt-14 grid gap-4 rounded-(--radius-l) bg-[linear-gradient(160deg,rgb(255_255_255/0.036),rgb(255_255_255/0.02))] p-[clamp(22px,3vw,36px)] [box-shadow:0_0_0_1px_rgb(255_255_255/0.075)_inset,var(--shadow-2)]"
                  data-reveal
                >
                  <p className="t-label">Current project</p>
                  {team.currentProject.name && <h2 className="t-h3">{team.currentProject.name}</h2>}
                  {team.currentProject.summary && <p className="t-body">{team.currentProject.summary}</p>}
                  {team.currentProject.specs.length > 0 && (
                    <dl className="mt-2 grid border-t border-line text-[0.9375rem]">
                      {team.currentProject.specs.map((s, i) => (
                        <div key={i} className="grid grid-cols-[minmax(110px,1fr)_2fr] gap-4 border-b border-line py-3">
                          <dt className="pt-0.5 font-mono text-[0.75rem] tracking-[0.06em] text-fg-3 uppercase">{s.label}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {team.currentProject.images.length > 0 && (
                    <div className={imagesClass}>
                      {team.currentProject.images.map((im, i) => (
                        <figure key={i}>
                          <div className={imageFrame}>
                            <Media img={im} placeholder="Project image" sizes="(min-width: 1100px) 30vw, 100vw" />
                          </div>
                          {im.caption && <figcaption className="t-meta">{im.caption}</figcaption>}
                        </figure>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {team.videoUrl && (
                <div className={blockClass} data-reveal>
                  <VideoEmbed url={team.videoUrl} title={`${team.name} video`} />
                </div>
              )}
            </div>
          </div>
      </Section>

      {/* ───── People ───── */}
      <Section tone="light" labelledBy="people-heading">
          {team.leadership.length + team.roster.length === 0 ? (
            <ComingSoon label="Members" as="h2" id="people-heading" />
          ) : (
            <>
            <SectionHeader heading={`The ${team.name} team`} id="people-heading" />
            {team.leadership.length > 0 && (
              <div className={peopleGroup}>
                <h3 className="t-label">Leadership</h3>
                <PeopleGrid people={team.leadership} large />
              </div>
            )}
            {team.roster.length > 0 && (
              <div className={peopleGroup}>
                <h3 className="t-label">Members</h3>
                <PeopleGrid people={team.roster} dense />
              </div>
            )}
            </>
          )}
      </Section>

      {/* ───── Awards ───── */}
      {team.awards.length > 0 && (
        <Section background={team.cover} labelledBy="awards-heading">
          <SectionHeader heading="Awards & achievements" id="awards-heading" />
          <AwardLedger awards={team.awards} showTeam={false} />
        </Section>
      )}

      {/* ───── Upcoming events ───── */}
      {team.upcomingEvents.length > 0 && (
        <Section labelledBy="events-heading">
          <SectionHeader heading="Upcoming events" id="events-heading" />
          <EventGrid>
            {team.upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </EventGrid>
        </Section>
      )}

      {/* ───── Extra sections from the CMS ───── */}
      {team.extraSections.map((s) => (
        <Section key={s.key}>
            {s.heading && <SectionHeader heading={s.heading} />}
            {s.kind === 'text' && <RichText value={s.body} />}
            {s.kind === 'video' && <VideoEmbed url={s.url} title={s.heading || `${team.name} video`} />}
            {s.kind === 'images' && (
              <div className={imagesClass}>
                {s.images.map((im, i) => (
                  <figure key={i}>
                    <div className={imageFrame}>
                      <Media img={im} placeholder="Image" sizes="(min-width: 1100px) 30vw, 100vw" />
                    </div>
                    {im.caption && <figcaption className="t-meta">{im.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}
        </Section>
      ))}

      {/* ───── Next team ───── */}
      {nextTeam && nextTeam.id !== team.id && (
        <nav
          className="relative border-t border-line [background:radial-gradient(50%_120%_at_100%_50%,rgb(255_255_255/0.06),transparent_70%),var(--surface-1)]"
          aria-label="More teams"
        >
          <div className="site-container">
            <div className="grid gap-8 py-[clamp(48px,7vw,96px)] min-[900px]:grid-cols-[auto_1fr] min-[900px]:items-end">
              <Link href="/teams" className="link-arrow">
                <ArrowLeft size={16} /> All teams
              </Link>
              <Link href={`/teams/${nextTeam.slug}`} className="group/next grid gap-2.5 min-[900px]:justify-items-end min-[900px]:text-right">
                <span className="t-label">Next {typeLabel.toLowerCase()}</span>
                <span className="inline-flex items-center gap-4 text-[clamp(2.2rem,1.4rem+3.4vw,4.5rem)] leading-none font-medium tracking-[-0.045em] [transition:color_var(--dur-2)_var(--ease)] group-hover/next:text-accent [&_svg]:[transition:transform_var(--dur-2)_var(--ease)] group-hover/next:[&_svg]:[transform:translateX(8px)]">
                  {nextTeam.name} <ArrowRight size={28} />
                </span>
              </Link>
            </div>
          </div>
        </nav>
      )}
    </article>
  )
}
