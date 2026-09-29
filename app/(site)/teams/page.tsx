import type { Metadata } from 'next'
import { TeamGrid } from '@/components/teams/TeamGrid'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getTeams } from '@/lib/content'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const [design, support] = await Promise.all([getTeams('design'), getTeams('support')])
  const names = design.map((t) => t.name)
  const list = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names.join('')
  return {
    title: 'Robotics Design Teams',
    description: `VT CRO's robotics design teams at Virginia Tech: ${list}, supported by ${support.length} support teams.`,
    alternates: { canonical: '/teams' },
  }
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
