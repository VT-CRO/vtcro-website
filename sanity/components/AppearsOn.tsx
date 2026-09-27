import { useEffect, useState } from 'react'
import { Box, Card, Flex, Stack, Text } from '@sanity/ui'
import { useClient } from 'sanity'
import type { UserViewComponent } from 'sanity/structure'

type Row = { _id: string; name: string; label: string }

/** Member document tab: every team this person is on, including leadership titles set on team pages. */
export const AppearsOn: UserViewComponent = (props) => {
  const client = useClient({ apiVersion: '2025-09-01' })
  const id = String(props.documentId).replace(/^drafts\./, '')
  const [rows, setRows] = useState<Row[] | null>(null)

  useEffect(() => {
    client
      .fetch<{ leads: { _id: string; name: string; titles: string[] }[]; teams: { _id: string; name: string; role: string | null }[] }>(
        `{
          "leads": *[_type == "team" && !(_id in path("drafts.**")) && $id in leadership[].member._ref]{ _id, name, "titles": leadership[member._ref == $id].title },
          "teams": *[_id == $id][0].teams[]{ "_id": team._ref, "name": team->name, role }
        }`,
        { id },
      )
      .then(({ leads, teams }) => {
        const out = new Map<string, Row>()
        for (const t of leads ?? []) out.set(t._id, { _id: t._id, name: t.name, label: (t.titles ?? []).filter(Boolean).join(', ') || 'Leadership' })
        for (const t of teams ?? []) if (t?._id && !out.has(t._id)) out.set(t._id, { _id: t._id, name: t.name, label: t.role || 'Member' })
        setRows([...out.values()].sort((a, b) => a.name.localeCompare(b.name)))
      })
  }, [client, id])

  return (
    <Box padding={4}>
      <Stack gap={4}>
        <Text size={1} muted>
          Teams picked on this form, plus leadership titles set on team pages (Teams → the team → People). Shows the published version.
        </Text>
        {rows === null && <Text size={1}>Loading…</Text>}
        {rows?.length === 0 && <Text size={1}>Not on any team yet.</Text>}
        {rows?.map((r) => (
          <Card key={r._id} padding={3} radius={2} border>
            <Flex justify="space-between" gap={3}>
              <Text weight="semibold">{r.name}</Text>
              <Text size={1} muted>
                {r.label}
              </Text>
            </Flex>
          </Card>
        ))}
      </Stack>
    </Box>
  )
}
