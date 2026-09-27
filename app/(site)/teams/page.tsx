import type { Metadata } from 'next'
import { TeamGrid } from '@/components/teams/TeamGrid'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getTeams } from '@/lib/content'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Teams',
  description: 'VT CRO design teams and support teams.',
  alternates: { canonical: '/teams' },
}

export default async function TeamsPage() {
  const [design, support] = await Promise.all([getTeams('design'), getTeams('support')])
  return (
    <>
      {design.length > 0 && (
        <Section first labelledBy="design-heading">
          <SectionHeader as="h1" heading="Design Teams" id="design-heading" />
          <TeamGrid teams={design} headingLevel="h2" />
        </Section>
      )}
      {support.length > 0 && (
        <Section id="support" tone="light" labelledBy="support-heading">
          <SectionHeader heading="Support Teams" id="support-heading" />
          <TeamGrid teams={support} variant="support" />
        </Section>
      )}
    </>
  )
}
