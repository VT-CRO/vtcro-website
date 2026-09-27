/**
 * Initial content for the CMS.
 *
 * - Teams, awards, core principles: migrated from the previous vtcro.org.
 * - Everything else: clearly marked placeholders (isPlaceholder: true, or "[Placeholder]" text),
 *   to be replaced by the website manager in the CMS.
 *
 * Used in two ways:
 *   1. While Sanity isn't connected yet, the site renders directly from this file.
 *   2. `npm run seed:import` uploads it (with images) into Sanity as the starting content.
 */

type Doc = { _id: string; _type: string; [k: string]: any }

const ref = (id: string) => ({ _type: 'reference', _ref: id })
const img = (seed: string, alt = '') => ({ _type: 'image', _seed: seed.startsWith('/') ? seed : `/seed/${seed}.webp`, alt })
const rank = (i: number) => `0|${(i + 1).toString(36).padStart(2, '0')}0000:`
const pt = (...paragraphs: string[]) =>
  paragraphs.map((text) => ({
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', text, marks: [] }],
  }))

const PH = '[Placeholder]'
const EMAIL = 'vtcro23@gmail.com'

/* ───────────────────────── Site settings ───────────────────────── */

const settings: Doc[] = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    organizationName: 'Competitive Robotics Organization at Virginia Tech',
    shortName: 'VT CRO',
    // DRAFT copy: to be confirmed/replaced by VT CRO leadership.
    // *word* is shown in italics.
    description: '*The* place to do robotics at Virginia Tech.',
    footerTagline: 'while(true) { simplify(); }',
    copyrightName: 'Competitive Robotics Organization at Virginia Tech',
  },
  {
    _id: 'contactSettings',
    _type: 'contactSettings',
    generalEmail: EMAIL,
    sponsorshipEmail: EMAIL,
    outreachEmail: EMAIL,
    formTopics: [
      { label: 'General question', email: EMAIL },
      { label: 'Sponsorship', email: EMAIL },
      { label: 'Outreach & events', email: EMAIL },
    ],
    githubUrl: 'https://github.com/VT-CRO',
    instagramUrl: 'https://www.instagram.com/vt_cro/',
    linkedinUrl: 'https://www.linkedin.com/company/vtcro',
    youtubeUrl: 'https://www.youtube.com/@VT-CRO',
    discord: { label: 'CroLearning Discord', url: 'https://discord.com/invite/CNRdwzXdSr' },
  },
]

/* ───────────────────────── Homepage ───────────────────────── */

const home: Doc = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    eyebrow: 'Competitive Robotics Organization at Virginia Tech',
    image: img('photo-pcb-boards', 'VT CRO circuit boards with the bird logo'),
    showSponsors: true,
  },
  about: {
    // Mission from the VT CRO Constitution (Article II).
    mission: 'Improve the presence of robotics at Virginia Tech and surrounding communities.',
    whatWeAre: 'The premier design team at Virginia Tech, and its largest design team organization.',
    beliefs:
      'Small, dedicated teams. Even as the largest design team organization at Virginia Tech, every one of our teams stays tight-knit: a small group of motivated, passionate engineers who are dedicated to what they build.',
  },
  // Names/statements from the previous website; descriptions from the VT CRO Constitution.
  principles: [
    {
      name: 'Reliability',
      statement: 'Engineering you can count on.',
      icon: img('/icons/reliability.svg', ''),
    },
    {
      name: 'Simplicity',
      statement: 'Simplicity surpasses complexity.',
      icon: img('/icons/simplicity.svg', ''),
    },
    {
      name: 'Modularity',
      statement: 'The cornerstone of flexible design.',
      icon: img('/icons/modularity.svg', ''),
    },
  ],
  sections: [
    { section: 'about', enabled: true, heading: 'About', tone: 'light' },
    { section: 'designTeams', enabled: true, heading: 'Design Teams', tone: 'dark' },
    { section: 'awards', enabled: true, heading: 'Awards & Achievements', tone: 'light' },
    { section: 'project', enabled: true, tone: 'dark' },
    { section: 'principles', enabled: true, heading: 'Core Principles', tone: 'light' },
    { section: 'supportTeams', enabled: true, heading: 'Support Teams', tone: 'dark' },
    { section: 'events', enabled: true, heading: 'Upcoming Events', tone: 'light' },
    { section: 'members', enabled: true, label: 'View members', tone: 'dark', background: img('photo-lab-room', '') },
  ],
}

/* ───────────────────────── Teams (migrated) ───────────────────────── */

type TeamSeed = {
  slug: string
  name: string
  code?: string
  type: 'design' | 'support'
  short: string
  full?: string[]
  department?: string
  competition?: Record<string, any>
  cover?: boolean
  leadershipGroup?: boolean
}

const teamSeeds: TeamSeed[] = [
  {
    slug: 'canopy',
    name: 'Canopy',
    code: 'CAN',
    type: 'design',
    department: 'ECE Department',
    competition: { name: 'Farm Robotics Challenge' },
    short: 'Cable-suspended autonomous robot using AI and a 2-DOF arm to deliver plant-level greenhouse care.',
    full: [
      'Canopy is an autonomous, overhead robotics system designed to revolutionize precision agriculture in the greenhouse. Operating on a SpiderCam-style cable system, Canopy integrates custom AI, computer vision, and a 2-DOF robotic arm to deliver individualized, plant-by-plant care. From deploying localized soil probes to executing data-driven watering schedules managed via a full-stack web dashboard, the team is building a complete ag-tech ecosystem to compete in the collegiate Farm Robotics Challenge.',
    ],
  },
  {
    slug: 'vexu',
    name: 'VexU',
    code: 'VEX',
    type: 'design',
    department: 'Mechanical Engineering',
    competition: { name: 'VEX U', url: 'https://www.robotevents.com/robot-competitions/college-competition' },
    short: 'Collegiate robotics team building two custom robots to work together and win a World Title.',
    full: [
      'VexU is about high-speed, head-to-head collegiate competition on a global stage. This season, we are taking on the complex challenges of the Override game. To dominate the field, our team designs, builds, and programs two completely custom robots—a quick 15-inch model and a powerhouse 24-inch model—that must work together flawlessly. We combine custom 3D-printed parts, precision-cut plastics, and advanced programming to push our machines far beyond the limits of standard kits. Our goal is simple: out-engineer the competition, master Override, and bring a World Title home to Virginia Tech.',
    ],
  },
  {
    slug: 'autonav',
    name: 'AutoNav',
    code: 'NAV',
    type: 'design',
    department: 'Engineering Education',
    competition: {
      name: 'Intelligent Ground Vehicle Competition',
      url: 'http://www.igvc.org/',
      rulesUrl: 'http://www.igvc.org/rules.htm',
      location: 'Rochester, Michigan',
      logo: img('comp-igvc-logo', 'Intelligent Ground Vehicle Competition logo'),
    },
    short: 'Autonomous rover project built to tackle real outdoor obstacle courses in the IGVC competition.',
    full: [
      'AutoNav is all about pushing the limits of real-world autonomy. Competing in the Intelligent Ground Vehicle Competition (IGVC), we design, build, and program a completely autonomous rover capable of navigating complex outdoor obstacle courses.',
      'AutoNav is an MDE team and restricted to Juniors and Seniors only.',
    ],
  },
  {
    slug: 'crodart',
    name: 'CroDart',
    code: 'DRT',
    type: 'design',
    short: 'Combat robotics team building bots engineered to compete from local fights to NHRL’s global stage.',
    full: [
      'Welcome to CroDart, Virginia Tech’s combat robotics division. We design, build, and battle 1lb and 3lb robots that pack a massive punch, taking on rival colleges and seasoned pros everywhere from local rumbles to the global stage at NHRL. Our engineering philosophy centers on extreme durability and persistence - mastering everything from shock-resistant electronics to high-pressure, 20-minute rebuilds between fights.',
    ],
  },
  {
    slug: 'southeastcon',
    name: 'SoutheastCon',
    code: 'SEC',
    type: 'design',
    department: 'ECE Department',
    competition: { name: 'IEEE SoutheastCon Hardware Competition', url: 'https://ieeesoutheastcon.org/' },
    short: 'Building a fully autonomous vehicle for IEEE’s 2027 “Stock Car Race” challenge.',
    full: [
      'Focused on end-to-end robotics development, our SoutheastCon team is currently engineering a fully autonomous vehicle for the IEEE SoutheastCon 2027 Hardware Competition. Set in Daytona Beach, this year’s "Stock Car Race" challenge demands precise autonomous navigation and high-speed obstacle avoidance.',
    ],
  },
  {
    slug: 'croquest',
    name: 'CroQuest',
    code: 'QST',
    type: 'design',
    department: 'VT CEED',
    short: 'Creating custom STEM kits for VT CEED to help kids learn engineering through hands-on builds.',
    full: [
      'CroQuest partners with VT CEED to inspire the next generation of engineers through hands-on hardware. We design, prototype, and manufacture custom STEM kits - like a fully functional Game Boy and an AI-powered camera - that kids build over the summer.',
      'This is a paid position and runs from Spring through Summer.',
    ],
  },
  {
    slug: 'crolabs',
    name: 'CroLabs',
    code: 'LAB',
    type: 'design',
    department: 'ECE Department',
    short: 'Developing an AI that lets drones, rovers, and robotic arms act in unison that follows a command.',
    full: [
      'CroLabs is pioneering the future of heterogeneous swarm robotics with HIVE (Heterogeneous Intelligent Vehicle Ensemble). We build the intelligence layer that allows completely distinct hardware - from drones to rovers to robotic arms - to seamlessly execute a single spoken command together. By giving each robot an independent AI brain that understands its unique capabilities, our central intelligence model coordinates these diverse machines into a unified swarm capable of collaborating on complex tasks they were never explicitly programmed for.',
    ],
  },
  {
    slug: 'operations',
    name: 'Operations',
    type: 'support',
    short: 'Keeping the club running smoothly while we achieve our mission of creating winning robots!',
  },
  {
    slug: 'outreach',
    name: 'Outreach',
    type: 'support',
    short: 'Spread STEM education to K–12 students across Southwest Virginia through community events.',
  },
  {
    slug: 'learning',
    name: 'Learning',
    type: 'support',
    short: 'The Learning Team provides the opportunity for anyone at Virginia Tech to learn about robotics.',
  },
  {
    slug: 'business',
    name: 'Business',
    type: 'support',
    short: 'The Business team helps market and launch VT CRO and its innovations, laying the foundation for future startups.',
  },
  {
    slug: 'executive',
    name: 'Executive',
    type: 'support',
    leadershipGroup: true,
    short: 'The Executive team’s purpose is to execute the strategic vision of the organization.',
  },
]

/* ───────────────────────── Members (placeholders) ───────────────────────── */

const members: Doc[] = []
let memberCount = 0
function placeholderMember() {
  memberCount += 1
  const n = String(memberCount).padStart(2, '0')
  const doc: Doc = {
    _id: `member-placeholder-${n}`,
    _type: 'member',
    name: 'Member Name',
    slug: { _type: 'slug', current: `placeholder-${n}` },
    status: 'active',
    major: 'Major',
    gradYear: 2027 + (memberCount % 3),
    isPlaceholder: true,
  }
  members.push(doc)
  return doc._id
}

// Newer photos provided by VT CRO replace some of the old-site covers.
const COVERS: Record<string, string> = {
  vexu: 'photo-vexu-robot',
  outreach: 'photo-outreach-kids',
  operations: 'photo-operations-stage',
  business: 'photo-new-design-team',
}

const teams: Doc[] = teamSeeds.map((t, i) => {
  const leaders = t.leadershipGroup ? 4 : 1
  const roster = t.leadershipGroup ? 0 : t.type === 'design' ? 3 : 1
  return {
    _id: `team-${t.slug}`,
    _type: 'team',
    name: t.name,
    slug: { _type: 'slug', current: t.slug },
    teamType: t.type,
    code: t.code,
    active: true,
    leadershipGroup: Boolean(t.leadershipGroup),
    shortDescription: t.short,
    logo: img(`team-${t.slug}-logo`, `${t.name} logo`),
    coverImage: t.cover === false ? undefined : img(COVERS[t.slug] ?? `team-${t.slug}-cover`, `${t.name}`),
    fullDescription: t.full ? pt(...t.full) : undefined,
    department: t.department,
    competition: t.competition,
    leadership: Array.from({ length: leaders }, () => ({
      member: ref(placeholderMember()),
      title: t.type === 'design' ? 'Chief Engineer' : 'Leadership Role',
    })),
    roster: Array.from({ length: roster }, () => ({ member: ref(placeholderMember()) })),
    orderRank: rank(i),
  }
})

/* ───────────────────────── Project: WorkCell ───────────────────────── */

const projects: Doc[] = [
  {
    _id: 'project-workcell',
    _type: 'project',
    name: 'WorkCell',
    slug: { _type: 'slug', current: 'workcell' },
    label: 'Former design team',
    status: 'Open-source launch coming soon',
    summary:
      'WorkCell began as a VT CRO design team. It was exhibited at Open Sauce 2026, and its open-source launch is coming soon.',
    logo: img('project-workcell-logo', 'WorkCell logo'),
    image: img('photo-workcell', 'WorkCell automated manufacturing cell'),
    videoUrl: 'https://www.youtube.com/watch?v=6d8gg3khpiE',
    showOnHomepage: true,
    orderRank: rank(0),
  },
]

/* ───────────────────────── Awards (migrated) ───────────────────────── */

const awardSeeds = [
  { title: 'Manufacturing Workcell Competition', placement: '1st', rank: 1, competition: 'National Robotics Challenge', year: 2025, location: 'Marion, OH', project: 'project-workcell' },
  { title: 'Honda Innovation Award', competition: 'National Robotics Challenge', year: 2025, location: 'Marion, OH', project: 'project-workcell' },
  { title: 'Open Design Competition', placement: '1st', rank: 1, competition: 'IEEE SoutheastCon', year: 2024, location: 'Atlanta, GA', team: 'southeastcon' },
  { title: 'Open Competition', placement: '1st', rank: 1, competition: 'IEEE SoutheastCon', year: 2024, location: 'Atlanta, GA', team: 'southeastcon' },
  { title: 'Most Donors', placement: '1st', rank: 1, competition: 'Student Org Challenge, VT Giving Day', year: 2025, location: 'Blacksburg, VA', team: 'crodart' },
  { title: 'World Rank', placement: '16th', competition: 'VEX U World Championship', year: 2024, location: 'Dallas, TX', team: 'vexu' },
  { title: 'Tournament Champions (Worlds Qualifier)', placement: 'Champions', rank: 1, competition: 'VEX U Seagull Showdown', year: 2024, location: 'Salisbury, MD', team: 'vexu' },
  { title: 'Design Award', competition: 'VEX U Seagull Showdown', year: 2024, location: 'Salisbury, MD', team: 'vexu' },
  { title: 'Design Award', competition: 'VEX U VT Competition', year: 2024, location: 'Blacksburg, VA', team: 'vexu' },
  { title: 'College Antweight Division', placement: '3rd', rank: 3, competition: 'Mixxer Makerspace', year: 2026, team: 'crodart' },
  { title: 'Royal Rumble', placement: '3rd & 4th', rank: 3, competition: 'Charlotte Royal Rumble', year: 2025, location: 'Charlotte', team: 'crodart' },
  { title: 'Exhibitor', competition: 'Open Sauce', year: 2026, location: 'San Francisco, CA', project: 'project-workcell' },
]

const awards: Doc[] = awardSeeds.map((a, i) => ({
  _id: `award-${String(i + 1).padStart(2, '0')}`,
  _type: 'award',
  title: a.title,
  placement: a.placement,
  rank: a.rank,
  competition: a.competition,
  year: a.year,
  location: a.location,
  team: a.team ? ref(`team-${a.team}`) : undefined,
  project: a.project ? ref(a.project) : undefined,
  featured: a.rank === 1,
  orderRank: rank(i),
}))

/* ───────────────────────── Events (placeholders) ───────────────────────── */

const events: Doc[] = [
  { n: 1, start: '2026-11-07T14:00:00-05:00', end: '2026-11-07T18:00:00-05:00', featured: true },
  { n: 2, start: '2027-02-13T09:00:00-05:00', end: '2027-02-14T17:00:00-05:00', featured: false },
  { n: 3, start: '2026-04-18T13:00:00-04:00', end: '2026-04-18T16:00:00-04:00', featured: false },
].map((e) => ({
  _id: `event-placeholder-${e.n}`,
  _type: 'event',
  name: `Event Name ${PH}`,
  slug: { _type: 'slug', current: `placeholder-event-${e.n}` },
  start: e.start,
  end: e.end,
  allDay: false,
  location: { name: 'Location TBA', address: 'Blacksburg, VA' },
  shortDescription: `${PH} A one or two sentence description of the event.`,
  body: pt(`${PH} Full event details: agenda, who it is for, and how to take part.`),
  featured: e.featured,
  active: true,
  isPlaceholder: true,
}))

/* ───────────────────────── Photos (from previous site) ───────────────────────── */

const photoSeeds: [string, string, string[], boolean?][] = [
  ['photo-lab-build-night', 'VT CRO members building robots together in the lab', [], true],
  ['photo-vexu-robot', 'A VexU competition robot', ['vexu'], true],
  ['photo-southeastcon-team', 'The SoutheastCon team with their robot', ['southeastcon'], true],
  ['photo-outreach-kids', 'VT CRO members with students at an outreach event', ['outreach'], true],
  ['photo-lab-soldering', 'Members debugging electronics in the lab', [], true],
  ['photo-atrium-competition', 'Robotics competition in a multi-story campus atrium', [], true],
  ['photo-competition-team', 'A VT CRO team with their robot at a competition', [], true],
  ['photo-pcb-purple', 'A purple VT CRO circuit board on the workbench', [], true],
  ['photo-lab-work', 'Members working at lab tables', []],
  ['photo-lab-team', 'Members gathered around a lab table', []],
  ['photo-senior-team', 'VT CRO members at an awards ceremony', []],
  ['photo-whiteboard', 'A member presenting at the whiteboard', []],
  ['photo-operations-stage', 'Operations team members on stage', ['operations']],
  ['photo-workcell', 'WorkCell automated manufacturing cell', []],
  ['photo-lab-group', 'Members in the lab', []],
  ['team-crodart-cover', 'CroDart combat robots lined up in the arena', ['crodart']],
  ['team-autonav-cover', 'AutoNav autonomous rover in the lab', ['autonav']],
  ['photo-pcb-boards', 'VT CRO printed circuit boards', []],
  ['team-crolabs-cover', 'CroLabs small rovers', ['crolabs']],
  ['photo-workbench', 'Students working at a lab bench', []],
  ['team-learning-cover', 'A CroLearning workshop in a classroom', ['learning']],
  ['photo-competition-team-wide', 'A VT CRO team at a competition venue', []],
]

const albums: Doc[] = [
  {
    _id: 'album-previous-site',
    _type: 'album',
    title: 'Photo archive',
    slug: { _type: 'slug', current: 'archive' },
    description: `${PH} Temporary album of VT CRO photos. Split into real albums (by event or season) in the CMS.`,
    photos: photoSeeds.map(([file, alt, teamSlugs, featured]) => ({
      ...img(file, alt),
      featured: Boolean(featured),
      teams: teamSlugs.map((s) => ref(`team-${s}`)),
    })),
    showInGallery: true,
    isPlaceholder: true,
  },
]

/* ───────────────────────── Sponsors (placeholders) ───────────────────────── */

const sponsorCategories: Doc[] = [
  { _id: 'sponsorCategory-corporate', _type: 'sponsorCategory', name: 'Corporate Supporters', orderRank: rank(0) },
  { _id: 'sponsorCategory-department', _type: 'sponsorCategory', name: 'Department Supporters', orderRank: rank(1) },
]
const sponsors: Doc[] = [
  ...Array.from({ length: 3 }, (_, i) => ({
    _id: `sponsor-placeholder-${i + 1}`,
    _type: 'sponsor',
    name: `Sponsor Name ${i + 1}`,
    category: ref('sponsorCategory-corporate'),
    active: true,
    isPlaceholder: true,
    orderRank: rank(i),
  })),
  // Department supporters as listed on the previous website; logos provided by VT CRO.
  ...[
    ['ece', 'Bradley Department of Electrical and Computer Engineering', 'https://ece.vt.edu/'],
    ['me', 'Department of Mechanical Engineering', 'https://me.vt.edu/'],
    ['ise', 'Grado Department of Industrial and Systems Engineering', 'https://ise.vt.edu/'],
  ].map(([k, name, url], i) => ({
    _id: `sponsor-vt-${k}`,
    _type: 'sponsor',
    name,
    // Provided logos are white, so they go in the dark-background slot.
    logoOnDark: img(`sponsor-vt-${k}`, `${name} logo`),
    category: ref('sponsorCategory-department'),
    url,
    active: true,
    orderRank: rank(10 + i),
  })),
]

const sponsorsPage: Doc = {
  _id: 'sponsorsPage',
  _type: 'sponsorsPage',
  heading: 'Partner with VT CRO',
  intro: `${PH} An introduction for prospective sponsors: what VT CRO is and what sponsorship makes possible.`,
  reasons: [
    { icon: 'users', title: `Reason one ${PH}`, body: `${PH} Why sponsoring VT CRO is valuable.` },
    { icon: 'rocket', title: `Reason two ${PH}`, body: `${PH} Why sponsoring VT CRO is valuable.` },
    { icon: 'handshake', title: `Reason three ${PH}`, body: `${PH} Why sponsoring VT CRO is valuable.` },
  ],
  packetLabel: 'Download sponsorship packet',
  ctaHeading: 'Start a conversation',
  ctaBody: `${PH} A short note inviting companies and departments to reach out.`,
}

/* ───────────────────────── Recruitment (placeholders) ───────────────────────── */

const recruitment: Doc = {
  _id: 'recruitment',
  _type: 'recruitment',
  applicationsOpen: false,
  buttonLabel: 'Apply now',
  closedHeading: 'Applications are closed',
  closedMessage:
    'We recruit across all of VT CRO during September every year.\n\nLook out for additional opportunities to join VT CRO throughout the school year via in-major emails.',
  openHeading: 'Applications are open',
  openMessage: `${PH} Who should apply and when applications close.`,
  eligibility: pt(
    'VT CRO is open to all students at Virginia Tech, graduate and undergraduate, as long as they are passionate about and dedicated to robotics.',
  ),
  process: [
    { icon: 'clipboard', title: 'Apply', description: 'Fill out the application form.' },
    { icon: 'chat', title: 'Interview', description: 'If you’re selected, you’ll be invited to an interview.' },
    { icon: 'envelope', title: 'Offer letters', description: 'Offer letters go out to new members.' },
  ],
  alternatives: [
    {
      icon: 'book',
      title: 'CroLearning',
      description: 'Free Weekly Robotic Workshops\nNo experience needed.\nNo application required.',
      linkLabel: 'Join the CroLearning Discord',
      url: 'https://discord.com/invite/CNRdwzXdSr',
    },
  ],
}

export const seedDocuments: Doc[] = [
  ...settings,
  home,
  ...teams,
  ...members,
  ...projects,
  ...awards,
  ...events,
  ...albums,
  ...sponsorCategories,
  ...sponsors,
  sponsorsPage,
  recruitment,
]
