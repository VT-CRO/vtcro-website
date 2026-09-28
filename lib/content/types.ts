/**
 * View models used by the UI. Every page reads these shapes. They are produced by
 * `lib/content/resolve.ts` from the raw CMS documents (Sanity or the sample seed).
 */

export type PortableTextBlocks = any[]

export type Img = {
  src: string
  width: number
  height: number
  alt: string
  /** CSS object-position derived from the CMS hotspot, e.g. "50% 30%". */
  position: string
}

export type Cta = { label: string; href: string }

export type SocialLink = {
  platform: 'github' | 'instagram' | 'linkedin' | 'youtube' | 'discord'
  label: string
  url: string
}

export type Site = {
  name: string
  shortName: string
  description: string
  shareImage: Img | null
  footerTagline: string
  copyrightName: string
  contact: {
    general: string
    sponsorship: string
    outreach: string
    topics: { label: string; email: string }[]
    location: string
  }
  socials: SocialLink[]
  github: string | null
  instagram: string | null
}

export type HomeSectionKey =
  | 'about'
  | 'designTeams'
  | 'awards'
  | 'project'
  | 'principles'
  | 'supportTeams'
  | 'events'
  | 'members'
  | 'apply'

export type HomeSection = { key: HomeSectionKey; label: string; heading: string; intro: string; tone: 'dark' | 'light' | null; background: Img | null }

export type Principle = { name: string; statement: string; icon: Img | null }

export type Home = {
  hero: {
    eyebrow: string
    image: Img | null
    videoUrl: string | null
    showSponsors: boolean
  }
  about: { mission: string; whatWeAre: string; beliefs: string }
  principles: Principle[]
  sections: HomeSection[]
}

export type TeamType = 'design' | 'support'

export type TeamSummary = {
  id: string
  slug: string
  name: string
  code: string
  type: TeamType
  logo: Img | null
  cover: Img | null
  shortDescription: string
  competitionName: string
}

export type MemberSummary = {
  id: string
  slug: string
  name: string
  photo: Img | null
  major: string
  gradYear: number | null
  linkedin: string | null
  website: string | null
  github: string | null
  isPlaceholder: boolean
}

/** A person as they appear on one team: with their title/role there. */
export type TeamPerson = { member: MemberSummary; role: string; isLeader: boolean; team: TeamSummary }

export type Award = {
  id: string
  title: string
  placement: string
  rank: 1 | 2 | 3 | null
  competition: string
  year: number
  location: string
  description: string
  image: Img | null
  url: string | null
  featured: boolean
  team: TeamSummary | null
  projectName: string | null
  projectCode: string | null
}

export type Photo = {
  key: string
  image: Img
  caption: string
  credit: string
  featured: boolean
  album: { slug: string; title: string }
  teamSlugs: string[]
  eventSlug: string | null
  date: string | null
}

export type Album = {
  id: string
  slug: string
  title: string
  date: string | null
  description: string
  cover: Img | null
  teams: TeamSummary[]
  event: { slug: string; name: string } | null
  photos: Photo[]
  isPlaceholder: boolean
}

export type Event = {
  id: string
  slug: string
  name: string
  image: Img | null
  start: string
  end: string | null
  allDay: boolean
  location: { name: string; address: string; mapUrl: string | null }
  shortDescription: string
  body: PortableTextBlocks
  registrationUrl: string | null
  externalUrl: string | null
  category: string
  teams: TeamSummary[]
  featured: boolean
  isPlaceholder: boolean
}

export type ExtraSection =
  | { kind: 'text'; key: string; heading: string; body: PortableTextBlocks }
  | { kind: 'images'; key: string; heading: string; images: (Img & { caption: string })[] }
  | { kind: 'video'; key: string; heading: string; url: string }

export type Team = TeamSummary & {
  fullDescription: PortableTextBlocks
  mission: string
  objectives: string[]
  competition: { name: string; url: string | null; rulesUrl: string | null; location: string; logo: Img | null } | null
  currentProject: { name: string; summary: string; images: (Img & { caption: string })[]; specs: { label: string; value: string }[] } | null
  leadership: TeamPerson[]
  roster: TeamPerson[]
  githubRepos: { label: string; url: string }[]
  applicationUrl: string | null
  websiteUrl: string | null
  docsUrl: string | null
  videoUrl: string | null
  extraSections: ExtraSection[]
  seo: { title: string; description: string }
  awards: Award[]
  photos: Photo[]
  upcomingEvents: Event[]
}

export type Member = MemberSummary & {
  bio: string
  roles: TeamPerson[]
}

export type Project = {
  id: string
  slug: string
  name: string
  label: string
  status: string
  summary: string
  highlights: string[]
  logo: Img | null
  image: Img | null
  videoUrl: string | null
  links: Cta[]
  awards: Award[]
}

export type Sponsor = {
  id: string
  name: string
  logo: Img | null
  logoOnDark: Img | null
  url: string | null
  description: string
  size: 'lg' | 'md' | 'sm'
  isPlaceholder: boolean
}

export type SponsorGroup = { id: string; name: string; description: string; sponsors: Sponsor[] }

export type Recruitment = {
  open: boolean
  applicationUrl: string | null
  buttonLabel: string
  cycleLabel: string
  periodStart: string | null
  periodEnd: string | null
  openHeading: string
  openMessage: string
  closedHeading: string
  closedMessage: string
  eligibility: PortableTextBlocks
  process: { icon: string; title: string; description: string }[]
  opportunities: { team: TeamSummary; note: string; url: string | null }[]
  alternatives: { icon: string; title: string; description: string; linkLabel: string; url: string }[]
}

export type Stat = { value: string; label: string }
export type SponsorsPage = {
  heading: string
  intro: string
  highlights: Stat[]
  talent: { heading: string; body: string; image: Img | null; disciplines: string[]; stats: Stat[] }
  eventsHeading: string
  eventsIntro: string
  hostedEvents: { icon: string; name: string; description: string; stats: Stat[] }[]
  reasonsHeading: string
  reasons: { icon: string; title: string; body: string }[]
  tiersHeading: string
  tiers: { name: string; amount: string; benefits: string[] }[]
  tiersNote: string
  sponsorsHeading: string
  packetUrl: string | null
  packetLabel: string
  ctaHeading: string
  ctaBody: string
}
