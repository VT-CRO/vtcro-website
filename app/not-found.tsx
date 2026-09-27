import type { Metadata } from 'next'
import SiteLayout from './(site)/layout'
import { NotFoundContent } from '@/components/NotFoundContent'

export const metadata: Metadata = { title: 'Page not found · VT CRO' }

/** Unknown URLs: same chrome as the rest of the site. */
export default function GlobalNotFound() {
  return (
    <SiteLayout>
      <NotFoundContent />
    </SiteLayout>
  )
}
