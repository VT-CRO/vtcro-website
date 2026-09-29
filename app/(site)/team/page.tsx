import type { Metadata } from 'next'
import { PeopleDirectory } from '@/components/people/PeopleDirectory'
import { Section } from '@/components/ui/Section'
import { getPeopleDirectory } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Team',
  description:
    'Meet the engineers of VT CRO, the Competitive Robotics Organization at Virginia Tech: the executive team, engineering team and support team behind our robots.',
  alternates: { canonical: '/team' },
}

export default async function TeamDirectoryPage() {
  const directory = await getPeopleDirectory()
  return (
    <Section first>
      <h1 className="sr-only">Team</h1>
      <PeopleDirectory directory={directory} />
    </Section>
  )
}
