import type { NextConfig } from 'next'

/** Old Webflow URLs → new URLs, so existing links and search results keep working. */
const legacyTeamSlugs: Record<string, string> = {
  can: 'canopy',
  vex: 'vexu',
  nav: 'autonav',
  dart: 'crodart',
  sec: 'southeastcon',
  qst: 'croquest',
  dog: 'crolabs',
}

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
  },
  async redirects() {
    return [
      ...Object.entries(legacyTeamSlugs).map(([from, to]) => ({
        source: `/design-teams/${from}`,
        destination: `/teams/${to}`,
        permanent: true,
      })),
      { source: '/support-teams/:slug', destination: '/teams/:slug', permanent: true },
      { source: '/photos', destination: '/gallery', permanent: true },
      { source: '/photos/:album', destination: '/gallery/:album', permanent: true },
      { source: '/sponsor-us', destination: '/sponsor', permanent: true },
      // Other pages from the Webflow site.
      { source: '/book-interview', destination: '/apply', permanent: true },
      { source: '/stories/southeastcon-2023-seniors', destination: '/teams/southeastcon', permanent: true },
      { source: '/stories/:slug', destination: '/', permanent: true },
      ...['/log-in', '/sign-up', '/reset-password', '/update-password', '/access-denied', '/user-account'].map((source) => ({
        source,
        destination: '/',
        permanent: true,
      })),
      // Not permanent until we know where these should go.
      { source: '/ceed', destination: '/', permanent: false },
      { source: '/lab-waiver', destination: '/', permanent: false },
      { source: '/sponsors', destination: '/sponsor', permanent: true },
      { source: '/vex-competition', destination: '/events', permanent: true },
    ]
  },
}

export default nextConfig
