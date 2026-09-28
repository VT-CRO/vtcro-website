/**
 * The website's data API. Pages call these functions; they never talk to the CMS directly.
 *
 * All relationships are resolved here from raw documents, so a change made once in the CMS
 * (a headshot, a team logo, a leadership title) shows up everywhere it is used.
 */
import { cache } from 'react'
import { toFileUrl, toImg } from './images'
import { getDocuments, type RawDoc } from './source'
import type {
  Album,
  Award,
  Event,
  ExtraSection,
  Home,
  HomeSection,
  HomeSectionKey,
  Member,
  MemberSummary,
  Photo,
  Project,
  Recruitment,
  Site,
  SocialLink,
  Sponsor,
  SponsorGroup,
  SponsorsPage,
  Team,
  TeamPerson,
  TeamSummary,
  TeamType,
} from './types'

export type * from './types'

/* ───────────── indexing ───────────── */

type Index = {
  byId: Map<string, RawDoc>
  ofType: (t: string) => RawDoc[]
  one: (id: string) => RawDoc | undefined
}

const buildIndex = cache(async (): Promise<Index> => {
  const docs = await getDocuments()
  const byId = new Map(docs.map((d) => [d._id, d]))
  const groups = new Map<string, RawDoc[]>()
  for (const d of docs) {
    const list = groups.get(d._type) ?? []
    list.push(d)
    groups.set(d._type, list)
  }
  return {
    byId,
    ofType: (t) => groups.get(t) ?? [],
    one: (id) => byId.get(id),
  }
})

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const url = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
const byRank = (a: RawDoc, b: RawDoc) => str(a.orderRank).localeCompare(str(b.orderRank))
const slugOf = (d: RawDoc | undefined) => str(d?.slug?.current)
const list = <T,>(v: T[] | undefined | null): T[] => (Array.isArray(v) ? v : [])

/* ───────────── site-wide ───────────── */

export const getSite = cache(async (): Promise<Site> => {
  const ix = await buildIndex()
  const s = ix.one('siteSettings') ?? ({} as RawDoc)
  const c = ix.one('contactSettings') ?? ({} as RawDoc)
  const general = str(c.generalEmail)
  const socials: SocialLink[] = []
  if (url(c.githubUrl)) socials.push({ platform: 'github', label: 'GitHub', url: c.githubUrl })
  if (url(c.instagramUrl)) socials.push({ platform: 'instagram', label: 'Instagram', url: c.instagramUrl })
  if (url(c.linkedinUrl)) socials.push({ platform: 'linkedin', label: 'LinkedIn', url: c.linkedinUrl })
  if (url(c.youtubeUrl)) socials.push({ platform: 'youtube', label: 'YouTube', url: c.youtubeUrl })
  if (url(c.discord?.url)) socials.push({ platform: 'discord', label: str(c.discord?.label) || 'Discord', url: c.discord.url })
  return {
    name: str(s.organizationName) || 'Competitive Robotics Organization at Virginia Tech',
    shortName: str(s.shortName) || 'VT CRO',
    description: str(s.description),
    shareImage: toImg(s.shareImage),
    footerTagline: str(s.footerTagline),
    copyrightName: str(s.copyrightName) || str(s.organizationName),
    contact: {
      general,
      sponsorship: str(c.sponsorshipEmail) || general,
      outreach: str(c.outreachEmail) || general,
      topics: list<any>(c.formTopics)
        .filter((t) => str(t.label) && str(t.email))
        .map((t) => ({ label: str(t.label), email: str(t.email) })),
      location: str(c.location),
    },
    socials,
    github: url(c.githubUrl),
    instagram: url(c.instagramUrl),
  }
})

/* ───────────── teams ───────────── */

function teamSummary(d: RawDoc): TeamSummary {
  return {
    id: d._id,
    slug: slugOf(d),
    name: str(d.name),
    code: str(d.code),
    type: (d.teamType === 'support' ? 'support' : 'design') as TeamType,
    logo: toImg(d.logo, `${str(d.name)} logo`),
    cover: toImg(d.coverImage, str(d.name)),
    shortDescription: str(d.shortDescription),
    competitionName: str(d.competition?.name),
  }
}

const activeTeamDocs = cache(async () => {
  const ix = await buildIndex()
  return ix
    .ofType('team')
    .filter((t) => t.active !== false && slugOf(t))
    .sort(byRank)
})

/** Active teams in the manager's chosen order. */
export const getTeams = cache(async (type?: TeamType): Promise<TeamSummary[]> => {
  const docs = await activeTeamDocs()
  return docs.map(teamSummary).filter((t) => !type || t.type === type)
})

function memberSummary(d: RawDoc): MemberSummary {
  return {
    id: d._id,
    slug: slugOf(d),
    name: str(d.name),
    photo: toImg(d.photo, str(d.name)),
    major: str(d.major),
    gradYear: typeof d.gradYear === 'number' ? d.gradYear : null,
    linkedin: url(d.linkedin),
    website: url(d.website),
    github: url(d.github),
    isPlaceholder: Boolean(d.isPlaceholder),
  }
}

const isActiveMember = (d: RawDoc | undefined): d is RawDoc => Boolean(d && d._type === 'member' && (d.status ?? 'active') === 'active')

function defaultRole(team: TeamSummary) {
  return team.type === 'design' ? `${team.name} Engineer` : `${team.name} Member`
}

/** Leaders (ordered on the team) + members (who list the team on their own form), active only, no duplicates. */
function teamPeople(ix: Index, d: RawDoc): { leadership: TeamPerson[]; roster: TeamPerson[] } {
  const team = teamSummary(d)
  const seen = new Set<string>()
  const leadership: TeamPerson[] = []
  for (const l of list<any>(d.leadership)) {
    const m = ix.one(l.member?._ref)
    if (!isActiveMember(m) || seen.has(m._id)) continue
    seen.add(m._id)
    leadership.push({ member: memberSummary(m), role: str(l.title) || defaultRole(team), isLeader: true, team })
  }
  // Everyone else picks their teams on their own Member form.
  const roster: TeamPerson[] = []
  for (const m of ix.ofType('member')) {
    const entry = list<any>(m.teams).find((t) => t.team?._ref === d._id)
    if (!entry || !isActiveMember(m) || seen.has(m._id)) continue
    seen.add(m._id)
    roster.push({ member: memberSummary(m), role: str(entry.role) || defaultRole(team), isLeader: false, team })
  }
  roster.sort((a, b) => a.member.name.localeCompare(b.member.name))
  return { leadership, roster }
}

function galleryImages(v: any[] | undefined) {
  return list<any>(v)
    .map((i) => {
      const img = toImg(i)
      return img ? { ...img, caption: str(i.caption) } : null
    })
    .filter(Boolean) as (NonNullable<ReturnType<typeof toImg>> & { caption: string })[]
}

export const getTeam = cache(async (slug: string): Promise<Team | null> => {
  const ix = await buildIndex()
  const d = (await activeTeamDocs()).find((t) => slugOf(t) === slug)
  if (!d) return null
  const summary = teamSummary(d)
  const { leadership, roster } = teamPeople(ix, d)
  const comp = d.competition ?? {}
  const project = d.currentProject ?? {}
  const projectImages = galleryImages(project.images)
  const specs = list<any>(project.specs)
    .filter((s) => str(s.label) || str(s.value))
    .map((s) => ({ label: str(s.label), value: str(s.value) }))

  const extraSections: ExtraSection[] = list<any>(d.extraSections)
    .map((s): ExtraSection | null => {
      if (s._type === 'textSection' && list(s.body).length) return { kind: 'text', key: s._key, heading: str(s.heading), body: s.body }
      if (s._type === 'imageSection') {
        const images = galleryImages(s.images)
        return images.length ? { kind: 'images', key: s._key, heading: str(s.heading), images } : null
      }
      if (s._type === 'videoSection' && url(s.url)) return { kind: 'video', key: s._key, heading: str(s.heading), url: s.url }
      return null
    })
    .filter(Boolean) as ExtraSection[]

  const [awards, photos, events] = await Promise.all([getAwards(), getPhotos(), getEvents()])

  return {
    ...summary,
    fullDescription: list(d.fullDescription),
    mission: str(d.mission),
    objectives: list<string>(d.objectives).map(str).filter(Boolean),
    competition:
      str(comp.name) || url(comp.url)
        ? { name: str(comp.name), url: url(comp.url), rulesUrl: url(comp.rulesUrl), location: str(comp.location), logo: toImg(comp.logo, str(comp.name)) }
        : null,
    currentProject:
      str(project.name) || str(project.summary) || projectImages.length || specs.length
        ? { name: str(project.name), summary: str(project.summary), images: projectImages, specs }
        : null,
    leadership,
    roster,
    githubRepos: list<any>(d.githubRepos)
      .filter((r) => url(r.url))
      .map((r) => ({ label: str(r.label) || 'Repository', url: r.url })),
    applicationUrl: url(d.applicationUrl),
    websiteUrl: url(d.websiteUrl),
    docsUrl: url(d.docsUrl),
    videoUrl: url(d.videoUrl),
    extraSections,
    seo: { title: str(d.seo?.title), description: str(d.seo?.description) },
    awards: awards.filter((a) => a.team?.id === d._id),
    photos: photos.filter((p) => p.teamSlugs.includes(summary.slug)),
    upcomingEvents: events.upcoming.filter((e) => e.teams.some((t) => t.id === d._id)),
  }
})

/* ───────────── people ───────────── */

export type PeopleDirectory = {
  /** Executive team, in the order set in the CMS. */
  executive: TeamPerson[]
  /** Everyone on a design team (not already on the executive team), alphabetical. */
  engineering: TeamPerson[]
  /** Everyone on a support team (not already listed above), alphabetical. */
  support: TeamPerson[]
  /** Teams each person belongs to, for card labels. */
  teamsOf: Record<string, TeamSummary[]>
  total: number
}

/** The main Team page. Each person appears once: Executive, then Engineering, then Support. */
export const getPeopleDirectory = cache(async (): Promise<PeopleDirectory> => {
  const ix = await buildIndex()
  const docs = await activeTeamDocs()
  const placed = new Set<string>()
  const teamsOf: Record<string, TeamSummary[]> = {}
  const collect = (ds: RawDoc[]) => {
    const out: TeamPerson[] = []
    for (const d of ds) {
      const { leadership, roster } = teamPeople(ix, d)
      for (const p of [...leadership, ...roster]) {
        const arr = (teamsOf[p.member.id] ??= [])
        if (!arr.some((t) => t.id === p.team.id)) arr.push(p.team)
        if (placed.has(p.member.id)) continue
        placed.add(p.member.id)
        out.push(p)
      }
    }
    return out
  }
  const byName = (a: TeamPerson, b: TeamPerson) => a.member.name.localeCompare(b.member.name)
  const executive = collect(docs.filter((t) => t.leadershipGroup))
  const engineering = collect(docs.filter((t) => !t.leadershipGroup && t.teamType !== 'support')).sort(byName)
  const support = collect(docs.filter((t) => !t.leadershipGroup && t.teamType === 'support')).sort(byName)
  return { executive, engineering, support, teamsOf, total: placed.size }
})

export const getMembers = cache(async (): Promise<MemberSummary[]> => {
  const ix = await buildIndex()
  return ix.ofType('member').filter(isActiveMember).map(memberSummary).filter((m) => m.slug)
})

export const getMember = cache(async (slug: string): Promise<Member | null> => {
  const ix = await buildIndex()
  const d = ix.ofType('member').find((m) => slugOf(m) === slug)
  if (!isActiveMember(d)) return null
  const roles: TeamPerson[] = []
  for (const t of await activeTeamDocs()) {
    const { leadership, roster } = teamPeople(ix, t)
    const hit = [...leadership, ...roster].find((p) => p.member.id === d._id)
    if (hit) roles.push(hit)
  }
  // Leadership-group roles (e.g. President) first.
  const leaderTeamIds = new Set((await activeTeamDocs()).filter((t) => t.leadershipGroup).map((t) => t._id))
  roles.sort((a, b) => Number(leaderTeamIds.has(b.team.id)) - Number(leaderTeamIds.has(a.team.id)))
  return { ...memberSummary(d), bio: str(d.bio), roles }
})

/* ───────────── awards & projects ───────────── */

export const getAwards = cache(async (): Promise<Award[]> => {
  const ix = await buildIndex()
  const teams = new Map((await activeTeamDocs()).map((t) => [t._id, teamSummary(t)]))
  return ix
    .ofType('award')
    .sort(byRank)
    .map((a) => {
      const project = ix.one(a.project?._ref)
      const rank = [1, 2, 3].includes(a.rank) ? (a.rank as 1 | 2 | 3) : null
      return {
        id: a._id,
        title: str(a.title),
        placement: str(a.placement),
        rank,
        competition: str(a.competition),
        year: Number(a.year) || 0,
        location: str(a.location),
        description: str(a.description),
        image: toImg(a.image, str(a.title)),
        url: url(a.url),
        featured: Boolean(a.featured),
        team: teams.get(a.team?._ref) ?? null,
        projectName: project ? str(project.name) : null,
        projectCode: project ? str(project.code) : null,
      }
    })
    .sort((a, b) => b.year - a.year)
})

export const getProjects = cache(async (): Promise<Project[]> => {
  const ix = await buildIndex()
  const awards = await getAwards()
  return ix
    .ofType('project')
    .filter((p) => p.showOnHomepage !== false)
    .sort(byRank)
    .map((p) => ({
      id: p._id,
      slug: slugOf(p),
      name: str(p.name),
      label: str(p.label),
      status: str(p.status),
      summary: str(p.summary),
      highlights: list<string>(p.highlights).map(str).filter(Boolean),
      logo: toImg(p.logo, `${str(p.name)} logo`),
      image: toImg(p.image, str(p.name)),
      videoUrl: url(p.videoUrl),
      links: list<any>(p.links).filter((l) => str(l.label) && str(l.href)).map((l) => ({ label: str(l.label), href: str(l.href) })),
      awards: awards.filter((a) => {
        const raw = ix.one(a.id)
        return raw?.project?._ref === p._id
      }),
    }))
})

/* ───────────── events ───────────── */

function eventEndsAt(e: { start: string; end: string | null; allDay: boolean }) {
  const end = new Date(e.end ?? e.start)
  // All-day and single-timestamp events stay "upcoming" through the end of that day.
  if (e.allDay || !e.end) end.setHours(end.getHours() + 24)
  return end
}

export const getEvents = cache(async (): Promise<{ upcoming: Event[]; past: Event[]; all: Event[] }> => {
  const ix = await buildIndex()
  const teams = new Map((await activeTeamDocs()).map((t) => [t._id, teamSummary(t)]))
  const all: Event[] = ix
    .ofType('event')
    .filter((e) => e.active !== false && e.start && slugOf(e))
    .map((e) => ({
      id: e._id,
      slug: slugOf(e),
      name: str(e.name),
      image: toImg(e.image, str(e.name)),
      start: e.start,
      end: e.end ?? null,
      allDay: Boolean(e.allDay),
      location: { name: str(e.location?.name), address: str(e.location?.address), mapUrl: url(e.location?.mapUrl) },
      shortDescription: str(e.shortDescription),
      body: list(e.body),
      registrationUrl: url(e.registrationUrl),
      externalUrl: url(e.externalUrl),
      category: str(ix.one(e.category?._ref)?.name),
      teams: list<any>(e.teams)
        .map((r) => teams.get(r._ref))
        .filter(Boolean) as TeamSummary[],
      featured: Boolean(e.featured),
      isPlaceholder: Boolean(e.isPlaceholder),
    }))
  const now = Date.now()
  const upcoming = all
    .filter((e) => eventEndsAt(e).getTime() >= now)
    .sort((a, b) => +new Date(a.start) - +new Date(b.start))
  const past = all
    .filter((e) => eventEndsAt(e).getTime() < now)
    .sort((a, b) => +new Date(b.start) - +new Date(a.start))
  return { upcoming, past, all }
})

export const getEvent = cache(async (slug: string) => {
  const { all, upcoming } = await getEvents()
  const event = all.find((e) => e.slug === slug)
  if (!event) return null
  const photos = (await getPhotos()).filter((p) => p.eventSlug === slug)
  return { event, isUpcoming: upcoming.some((e) => e.id === event.id), photos }
})

/* ───────────── photos ───────────── */

export const getAlbums = cache(async (): Promise<Album[]> => {
  const ix = await buildIndex()
  const teams = new Map((await activeTeamDocs()).map((t) => [t._id, teamSummary(t)]))
  return ix
    .ofType('album')
    .filter((a) => a.showInGallery !== false && slugOf(a))
    .sort((a, b) => str(b.date).localeCompare(str(a.date)))
    .map((a) => {
      const albumTeams = list<any>(a.teams)
        .map((r) => teams.get(r._ref))
        .filter(Boolean) as TeamSummary[]
      const ev = ix.one(a.event?._ref)
      const photos: Photo[] = list<any>(a.photos)
        .map((p, i): Photo | null => {
          const image = toImg(p)
          if (!image) return null
          const own = list<any>(p.teams)
            .map((r) => teams.get(r._ref))
            .filter(Boolean) as TeamSummary[]
          return {
            key: `${a._id}-${p._key ?? i}`,
            image,
            caption: str(p.caption),
            credit: str(p.credit),
            featured: Boolean(p.featured),
            album: { slug: slugOf(a), title: str(a.title) },
            teamSlugs: (own.length ? own : albumTeams).map((t) => t.slug),
            eventSlug: ev && ev.active !== false ? slugOf(ev) : null,
            date: a.date ?? null,
          }
        })
        .filter(Boolean) as Photo[]
      return {
        id: a._id,
        slug: slugOf(a),
        title: str(a.title),
        date: a.date ?? null,
        description: str(a.description),
        cover: photos[0]?.image ?? null,
        teams: albumTeams,
        event: ev ? { slug: slugOf(ev), name: str(ev.name) } : null,
        photos,
        isPlaceholder: Boolean(a.isPlaceholder),
      }
    })
})

export const getAlbum = cache(async (slug: string) => (await getAlbums()).find((a) => a.slug === slug) ?? null)

export const getPhotos = cache(async (): Promise<Photo[]> => (await getAlbums()).flatMap((a) => a.photos))

/* ───────────── sponsors ───────────── */

export const getSponsorGroups = cache(async (): Promise<SponsorGroup[]> => {
  const ix = await buildIndex()
  const sponsors = ix.ofType('sponsor').filter((s) => s.active !== false).sort(byRank)
  return ix
    .ofType('sponsorCategory')
    .sort(byRank)
    .map((c) => ({
      id: c._id,
      name: str(c.name),
      description: str(c.description),
      sponsors: sponsors
        .filter((s) => s.category?._ref === c._id)
        .map(
          (s): Sponsor => ({
            id: s._id,
            name: str(s.name),
            logo: toImg(s.logo, str(s.name)),
            logoOnDark: toImg(s.logoOnDark, str(s.name)),
            url: url(s.url),
            description: str(s.description),
            size: (ix.one(s.tier?._ref)?.level as Sponsor['size']) || 'md',
            isPlaceholder: Boolean(s.isPlaceholder),
          }),
        ),
    }))
    .filter((g) => g.sponsors.length)
})

const stats = (v: any): { value: string; label: string }[] =>
  list<any>(v)
    .map((x) => ({ value: str(x.value), label: str(x.label) }))
    .filter((x) => x.value || x.label)

export const getSponsorsPage = cache(async (): Promise<SponsorsPage> => {
  const ix = await buildIndex()
  const d = ix.one('sponsorsPage') ?? ({} as RawDoc)
  const cards = (v: any) => list<any>(v).map((r) => ({ icon: str(r.icon), title: str(r.title), body: str(r.body) })).filter((r) => r.title)
  return {
    heading: str(d.heading),
    intro: str(d.intro),
    highlights: stats(d.highlights),
    talent: {
      heading: str(d.talent?.heading),
      body: str(d.talent?.body),
      disciplines: list<string>(d.talent?.disciplines).map(str).filter(Boolean),
      stats: stats(d.talent?.stats),
    },
    eventsHeading: str(d.eventsHeading),
    eventsIntro: str(d.eventsIntro),
    hostedEvents: list<any>(d.hostedEvents)
      .map((e) => ({ icon: str(e.icon), name: str(e.name), description: str(e.description), stats: stats(e.stats) }))
      .filter((e) => e.name),
    reasonsHeading: str(d.reasonsHeading),
    reasons: cards(d.reasons),
    tiersHeading: str(d.tiersHeading),
    tiers: list<any>(d.tiers)
      .map((t) => ({ name: str(t.name), amount: str(t.amount), benefits: list<string>(t.benefits).map(str).filter(Boolean) }))
      .filter((t) => t.name),
    tiersNote: str(d.tiersNote),
    sponsorsHeading: str(d.sponsorsHeading),
    packetUrl: toFileUrl(d.packet),
    packetLabel: str(d.packetLabel) || 'Pitch deck',
    ctaHeading: str(d.ctaHeading),
    ctaBody: str(d.ctaBody),
  }
})

/* ───────────── recruitment ───────────── */

export const getRecruitment = cache(async (): Promise<Recruitment> => {
  const ix = await buildIndex()
  const d = ix.one('recruitment') ?? ({} as RawDoc)
  const teams = new Map((await activeTeamDocs()).map((t) => [t._id, teamSummary(t)]))
  return {
    open: Boolean(d.applicationsOpen),
    applicationUrl: url(d.applicationUrl),
    buttonLabel: str(d.buttonLabel) || 'Apply now',
    cycleLabel: str(d.cycleLabel),
    periodStart: d.periodStart ?? null,
    periodEnd: d.periodEnd ?? null,
    openHeading: str(d.openHeading) || 'Applications are open',
    openMessage: str(d.openMessage),
    closedHeading: str(d.closedHeading) || 'Applications are closed',
    closedMessage: str(d.closedMessage),
    eligibility: list(d.eligibility),
    process: list<any>(d.process).map((p) => ({ icon: str(p.icon), title: str(p.title), description: str(p.description) })),
    opportunities: list<any>(d.opportunities)
      .map((o) => ({ team: teams.get(o.team?._ref), note: str(o.note), url: url(o.url) }))
      .filter((o) => o.team) as Recruitment['opportunities'],
    alternatives: list<any>(d.alternatives).map((a) => ({
      icon: str(a.icon),
      title: str(a.title),
      description: str(a.description),
      linkLabel: str(a.linkLabel),
      url: str(a.url),
    })),
  }
})

/* ───────────── homepage ───────────── */

const DEFAULT_SECTIONS: HomeSectionKey[] = ['about', 'designTeams', 'awards', 'project', 'principles', 'supportTeams', 'events', 'members']

export const getHome = cache(async (): Promise<Home> => {
  const ix = await buildIndex()
  const d = ix.one('homePage') ?? ({} as RawDoc)
  const h = d.hero ?? {}
  const configured = list<any>(d.sections).filter((s) => DEFAULT_SECTIONS.includes(s.section))
  const sections: HomeSection[] = (configured.length ? configured : DEFAULT_SECTIONS.map((section) => ({ section })))
    .filter((s) => s.enabled !== false)
    .map((s) => ({
      key: s.section,
      label: str(s.label),
      heading: str(s.heading),
      intro: str(s.intro),
      tone: s.tone === 'light' || s.tone === 'dark' ? s.tone : null,
      background: toImg(s.background, ''),
    }))
  return {
    hero: {
      eyebrow: str(h.eyebrow),
      image: toImg(h.image, ''),
      videoUrl: toFileUrl(h.video),
      showSponsors: h.showSponsors !== false,
    },
    about: {
      mission: str(d.about?.mission),
      whatWeAre: str(d.about?.whatWeAre),
      beliefs: str(d.about?.beliefs),
    },
    principles: list<any>(d.principles)
      .filter((p) => str(p.name))
      .map((p) => ({ name: str(p.name), statement: str(p.statement), icon: toImg(p.icon, '') })),
    sections,
  }
})

/** Live counts for the homepage. Never typed by hand, so they can't drift. */
export const getStats = cache(async () => {
  const [design, support, awards, people] = await Promise.all([getTeams('design'), getTeams('support'), getAwards(), getPeopleDirectory()])
  const ix = await buildIndex()
  const realMembers = ix.ofType('member').filter((m) => isActiveMember(m) && !m.isPlaceholder).length
  return {
    designTeams: design.length,
    supportTeams: support.length,
    awards: awards.length,
    members: realMembers ? people.total : 0,
  }
})
