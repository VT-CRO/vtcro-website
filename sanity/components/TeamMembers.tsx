import { useEffect, useState } from 'react'
import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { useClient } from 'sanity'
import type { UserViewComponent } from 'sanity/structure'

type Person = { _id: string; name: string; status: string | null; role: string | null }

/** Team document tab: everyone who lists this team on their Member form. */
export const TeamMembers: UserViewComponent = (props) => {
  const client = useClient({ apiVersion: '2025-09-01' })
  const id = String(props.documentId).replace(/^drafts\./, '')
  const [people, setPeople] = useState<Person[] | null>(null)

  useEffect(() => {
    client
      .fetch<Person[]>(
        `*[_type == "member" && !(_id in path("drafts.**")) && $id in teams[].team._ref] | order(name asc){
          _id, name, status, "role": teams[team._ref == $id][0].role
        }`,
        { id },
      )
      .then(setPeople)
  }, [client, id])

  const active = people?.filter((p) => (p.status ?? 'active') === 'active') ?? []
  const hidden = people?.filter((p) => (p.status ?? 'active') !== 'active') ?? []

  return (
    <Box padding={4}>
      <Stack gap={4}>
        <Text size={1} muted>
          People join a team from their own form (Members → the person → Teams). Leaders are set in this team’s People tab. Shows published members only.
        </Text>
        {people === null && <Text size={1}>Loading…</Text>}
        {people?.length === 0 && <Text size={1}>Nobody has picked this team yet.</Text>}
        {active.length > 0 && (
          <Text size={1} weight="semibold">
            {active.length} active {active.length === 1 ? 'member' : 'members'}
          </Text>
        )}
        {[...active, ...hidden].map((p) => (
          <Card key={p._id} padding={3} radius={2} border tone={(p.status ?? 'active') === 'active' ? 'default' : 'transparent'}>
            <Flex justify="space-between" gap={3}>
              <Text weight="semibold">{p.name}</Text>
              <Text size={1} muted>
                {[p.role || 'Member', (p.status ?? 'active') !== 'active' ? (p.status === 'alumni' ? 'Alumni (hidden)' : 'Inactive (hidden)') : null]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
