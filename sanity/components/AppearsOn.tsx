import { useEffect, useState } from 'react'
import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { useClient } from 'sanity'
import type { UserViewComponent } from 'sanity/structure'

type Row = { _id: string; name: string; leaderTitles: string[] | null; roles: (string | null)[] | null }

/** Member document tab: lists every team that references this person, so managers never edit it twice. */
export const AppearsOn: UserViewComponent = (props) => {
  const client = useClient({ apiVersion: '2025-09-01' })
  const id = String(props.documentId).replace(/^drafts\./, '')
  const [rows, setRows] = useState<Row[] | null>(null)

  useEffect(() => {
    client
      .fetch<Row[]>(
        `*[_type == "team" && !(_id in path("drafts.**")) && references($id)] | order(name asc){
          _id, name,
          "leaderTitles": leadership[member._ref == $id].title,
          "roles": roster[member._ref == $id].role
        }`,
        { id },
      )
      .then(setRows)
  }, [client, id])

  return (
    <Box padding={4}>
      <Stack gap={4}>
        <Text size={1} muted>
          Teams and roles are set on each team’s page (Teams → People). This list updates automatically.
        </Text>
        {rows === null && <Text size={1}>Loading…</Text>}
        {rows?.length === 0 && <Text size={1}>Not on any team yet.</Text>}
        {rows?.map((r) => (
          <Card key={r._id} padding={3} radius={2} border>
            <Flex justify="space-between" gap={3}>
              <Text weight="semibold">{r.name}</Text>
              <Text size={1} muted>
                {[...(r.leaderTitles ?? []), ...(r.roles ?? []).map((x) => x || 'Member')].join(' · ')}
              </Text>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
