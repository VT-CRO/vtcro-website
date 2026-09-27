import type { NextConfig } from 'next'
import { SPONSORS_PAGE_LIVE } from './lib/nav'

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
      // While the Sponsors page is hidden, the old Webflow sponsor URL goes to the homepage (temporary, so browsers don't remember it).
      SPONSORS_PAGE_LIVE
        ? { source: '/sponsor-us', destination: '/sponsors', permanent: true }
        : { source: '/sponsor-us', destination: '/', permanent: false },
      { source: '/vex-competition', destination: '/events', permanent: true },
    ]
  },
}

export default nextConfig
