import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { isSanityConfigured } from '@/sanity/env'

export const dynamic = 'force-static'
export { metadata, viewport } from 'next-sanity/studio'

/** The website manager's dashboard, at /studio. */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '12vh auto', padding: 24, lineHeight: 1.6, color: '#e8e8e6' }}>
        <h1 style={{ fontSize: 28 }}>The CMS isn’t connected yet</h1>
        <p>
          Create the Sanity project with the VT CRO account, then add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> to the environment
          variables. Step-by-step instructions are in <code>docs/SETUP.md</code>.
        </p>
        <p>Until then, the website shows the built-in sample content.</p>
      </main>
    )
  }
  return <NextStudio config={config} />
}
