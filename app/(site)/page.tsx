import Link from 'next/link'
import { AwardLedger } from '@/components/awards/AwardLedger'
import { EventCard } from '@/components/events/EventCard'
import { About } from '@/components/home/About'
import { ApplyBanner } from '@/components/home/ApplyBanner'
import { Hero } from '@/components/home/Hero'
import { MembersBanner } from '@/components/home/MembersBanner'
import { Principles } from '@/components/home/Principles'
import { ProjectFeature } from '@/components/home/ProjectFeature'
import { ArrowRight } from '@/components/icons'
import { TeamGrid } from '@/components/teams/TeamGrid'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAwards, getEvents, getHome, getProjects, getRecruitment, getSite, getSponsorGroups, getTeams, type HomeSection } from '@/lib/content'
import { siteUrl } from '@/lib/format'
import { ComingSoon } from '@/components/ui/ComingSoon'

export const revalidate = 3600

export default async function HomePage() {
  const [home, site, design, support, awards, projects, events, sponsors, recruitment] = await Promise.all([
    getHome(),
    getSite(),
    getTeams('design'),
    getTeams('support'),
    getAwards(),
    getProjects(),
    getEvents(),
    getSponsorGroups(),
    getRecruitment(),
  ])

  // Sections render in the order set in the CMS; empty sections are skipped.
  const render = (s: HomeSection) => {
    switch (s.key) {
      case 'about':
        return <About key={s.key} about={home.about} section={s} />

      case 'designTeams':
        if (!design.length) return null
        return (
          <Section key={s.key} id="design-teams" tone={s.tone} background={s.background} labelledBy="design-heading">
            <SectionHeader
              heading={s.heading || 'Design Teams'}
              intro={s.intro}
              id="design-heading"
              action={
                <Link href="/teams" className="link-arrow">
                  All teams <ArrowRight size={16} />
                </Link>
              }
            />
            <TeamGrid teams={design} />
          </Section>
        )

      case 'awards':
        if (!awards.length) return null
        return (
          <Section key={s.key} id="awards" tone={s.tone} background={s.background} labelledBy="awards-heading">
            <SectionHeader heading={s.heading || 'Awards & Achievements'} intro={s.intro} id="awards-heading" />
            <AwardLedger awards={awards} collapse />
          </Section>
        )

      case 'project':
        if (!projects.length) return null
        return projects.map((p) => <ProjectFeature key={p.id} project={p} section={s} />)

      case 'principles':
        if (!home.principles.length) return null
        return <Principles key={s.key} principles={home.principles} section={s} />

      case 'supportTeams':
        if (!support.length) return null
        return (
          <Section key={s.key} id="support-teams" tone={s.tone} background={s.background} labelledBy="support-heading">
            <SectionHeader heading={s.heading || 'Support Teams'} intro={s.intro} id="support-heading" />
            <TeamGrid teams={support} />
          </Section>
        )

      case 'events': {
        const next = events.upcoming.slice(0, 3)
        // Nothing in the CMS yet: "Coming soon". Past events only: hide the section until the next one.
        if (!next.length && events.all.length) return null
        if (!next.length) {
          return (
            <Section key={s.key} id="events" tone={s.tone} background={s.background} labelledBy="events-heading">
              <ComingSoon label={s.heading || 'Upcoming Events'} as="h2" id="events-heading" />
            </Section>
          )
        }
        return (
          <Section key={s.key} id="events" tone={s.tone} background={s.background} labelledBy="events-heading">
            <SectionHeader
              heading={s.heading || 'Upcoming Events'}
              intro={s.intro}
              id="events-heading"
              action={
                <Link href="/events" className="link-arrow">
                  All events <ArrowRight size={16} />
                </Link>
              }
            />
            <div className="events-grid">
              {next.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </Section>
        )
      }

      case 'members':
        return <MembersBanner key={s.key} section={s} />

      case 'apply':
        return <ApplyBanner key={s.key} recruitment={recruitment} section={s} />
    }
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: site.shortName,
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-full-white.png`,
    email: site.contact.general || undefined,
    sameAs: site.socials.map((s) => s.url),
    parentOrganization: { '@type': 'CollegeOrUniversity', name: 'Virginia Tech' },
  }

  return (
    <>
      <Hero hero={home.hero} sponsors={sponsors} applicationsOpen={recruitment.open} />
      {home.sections.map(render)}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  )
}
