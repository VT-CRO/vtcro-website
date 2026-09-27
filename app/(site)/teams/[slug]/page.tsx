import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ComponentType, ReactNode } from 'react'
import { AwardLedger } from '@/components/awards/AwardLedger'
import { EventCard } from '@/components/events/EventCard'
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckIcon, CpuIcon, DocIcon, GitHubIcon, GlobeIcon, PinIcon, TrophyIcon, WrenchIcon } from '@/components/icons'
import { PeopleGrid } from '@/components/people/PeopleGrid'
import { Media } from '@/components/ui/Media'
import { RichText } from '@/components/ui/RichText'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { getRecruitment, getTeam, getTeams } from '@/lib/content'
import styles from './page.module.css'
import { DEFAULT_SHARE_IMAGE } from '@/lib/format'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const revalidate = 3600

export async function generateStaticParams() {
  return (await getTeams()).map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const team = await getTeam((await params).slug)
  if (!team) return {}
  const description = team.seo.description || team.shortDescription
  return {
    title: team.seo.title || team.name,
    description,
    alternates: { canonical: `/teams/${team.slug}` },
    openGraph: {
      title: `${team.name} · VT CRO`,
      description,
      images: team.cover ? [{ url: team.cover.src, width: team.cover.width, height: team.cover.height, alt: team.cover.alt }] : [DEFAULT_SHARE_IMAGE],
    },
  }
}

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
    ...(team.code ? [{ label: 'Code', value: <span className={styles.code}>{team.code}</span>, icon: CpuIcon }] : []),
    ...(team.competition?.name
      ? [
          {
            label: 'Competition',
            icon: TrophyIcon,
            value: team.competition.url ? (
              <a href={team.competition.url} target="_blank" rel="noreferrer" className={styles.factLink}>
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

  return (
    <article>
      {/* ───── Cover ───── */}
      <header className={styles.hero}>
        <div className={styles.heroMedia}>
          <Media img={team.cover} placeholder={`${team.name} · cover photo`} sizes="100vw" preload />
          <div className={styles.heroScrim} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <nav aria-label="Breadcrumb" className={styles.crumbs}>
            <Link href="/teams" className="t-label">
              Teams
            </Link>
            <span className="t-label" aria-hidden="true">
              /
            </span>
            <span className="t-label" aria-current="page">
              {typeLabel}
            </span>
          </nav>
          <div className={styles.identity}>
            {team.logo && (
              <span className={styles.logo}>
                <Image src={team.logo.src} alt={team.logo.alt} width={192} height={192} sizes="(min-width: 1024px) 96px, 72px" preload />
              </span>
            )}
            <div>
              {team.code && <p className={styles.heroCode}>{team.code}</p>}
              <h1 className="t-display">{team.name}</h1>
            </div>
          </div>
          {team.shortDescription && <p className={`t-lead ${styles.heroLead}`}>{team.shortDescription}</p>}
          <div className={styles.heroActions}>
            {applyExternal ? (
              <a href={applyHref} target="_blank" rel="noreferrer" className="btn btn--primary">
                Apply to {team.name} <ArrowUpRight size={16} />
              </a>
            ) : (
              <Link href={applyHref} className={`btn ${recruitment.open ? 'btn--primary' : 'btn--secondary'}`}>
                <span className={`status-dot ${recruitment.open ? 'status-dot--on' : ''}`} aria-hidden="true" />
                {recruitment.open ? `Apply to ${team.name}` : 'How to join'}
              </Link>
            )}
            {team.githubRepos[0] && (
              <a href={team.githubRepos[0].url} target="_blank" rel="noreferrer" className="btn btn--secondary">
                <GitHubIcon size={17} className="icon-static" /> View on GitHub
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ───── Overview + facts ───── */}
      <Section className={styles.overview}>
          <div className={styles.overviewGrid}>
            <aside className={styles.rail} aria-label="Team facts">
              <dl className={styles.facts}>
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt>
                      <span className="icon-badge icon-badge--mono">
                        <f.icon size={18} />
                      </span>
                      <span className="t-label">{f.label}</span>
                    </dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              {team.competition?.logo && (
                <div className={styles.compLogo}>
                  <Image src={team.competition.logo.src} alt={team.competition.logo.alt} width={team.competition.logo.width} height={team.competition.logo.height} sizes="96px" />
                </div>
              )}
              {links.length > 0 && (
                <ul className={styles.links}>
                  {links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer">
                        <l.icon size={16} />
                        <span>{l.label}</span>
                        <ArrowUpRight size={14} className={styles.linkArrow} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </aside>

            <div className={styles.main}>
              <SectionHeader heading={`About ${team.name}`} />
              {hasOverview ? (
                <div className={styles.overviewBody} data-reveal>
                  {team.fullDescription.length > 0 ? <RichText value={team.fullDescription} className={styles.prose} /> : null}
                  {team.mission && (
                    <div className={styles.block}>
                      <h2 className="t-label">Mission</h2>
                      <p className={styles.mission}>{team.mission}</p>
                    </div>
                  )}
                  {team.objectives.length > 0 && (
                    <div className={styles.block}>
                      <h2 className="t-label">Objectives</h2>
                      <ol className={styles.objectives}>
                        {team.objectives.map((o, i) => (
                          <li key={i}>
                            <span className="icon-badge">
                              <CheckIcon size={16} />
                            </span>
                            <span>{o}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ) : (
                <p className={`t-lead ${styles.mission}`} data-reveal>
                  {team.shortDescription}
                </p>
              )}

              {team.currentProject && (
                <div className={styles.project} data-reveal>
                  <p className="t-label">Current project</p>
                  {team.currentProject.name && <h2 className="t-h3">{team.currentProject.name}</h2>}
                  {team.currentProject.summary && <p className="t-body">{team.currentProject.summary}</p>}
                  {team.currentProject.specs.length > 0 && (
                    <dl className={styles.specs}>
                      {team.currentProject.specs.map((s, i) => (
                        <div key={i}>
                          <dt>{s.label}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {team.currentProject.images.length > 0 && (
                    <div className={styles.projectImages}>
                      {team.currentProject.images.map((im, i) => (
                        <figure key={i}>
                          <div className={styles.projectImage}>
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
                <div className={styles.block} data-reveal>
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
              <div className={styles.peopleGroup}>
                <h3 className="t-label">Leadership</h3>
                <PeopleGrid people={team.leadership} large />
              </div>
            )}
            {team.roster.length > 0 && (
              <div className={styles.peopleGroup}>
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
          <div className="events-grid">
            {team.upcomingEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </Section>
      )}

      {/* ───── Extra sections from the CMS ───── */}
      {team.extraSections.map((s) => (
        <Section key={s.key}>
            {s.heading && <SectionHeader heading={s.heading} />}
            {s.kind === 'text' && <RichText value={s.body} />}
            {s.kind === 'video' && <VideoEmbed url={s.url} title={s.heading || `${team.name} video`} />}
            {s.kind === 'images' && (
              <div className={styles.projectImages}>
                {s.images.map((im, i) => (
                  <figure key={i}>
                    <div className={styles.projectImage}>
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
        <nav className={styles.next} aria-label="More teams">
          <div className="container">
            <div className={styles.nextInner}>
              <Link href="/teams" className="link-arrow">
                <ArrowLeft size={16} /> All teams
              </Link>
              <Link href={`/teams/${nextTeam.slug}`} className={styles.nextLink}>
                <span className="t-label">Next {typeLabel.toLowerCase()}</span>
                <span className={styles.nextName}>
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
