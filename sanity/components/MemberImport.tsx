import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge, Box, Button, Card, Flex, Heading, Stack, Text, TextArea } from '@sanity/ui'
import { useClient } from 'sanity'
import { DownloadIcon, UploadIcon } from '../icons'

/**
 * Members → Import from a spreadsheet.
 * Adds or updates many members at once from a Google Sheet / Excel / Google Form export,
 * with optional headshots matched to people by file name.
 */

type TeamRow = { _id: string; name: string; code?: string; slug?: string }
type ExistingMember = { _id: string; name: string; slug?: string; teams?: { _key: string; team?: { _ref: string }; role?: string }[] }
type Field = 'name' | 'teams' | 'role' | 'major' | 'gradYear' | 'linkedin' | 'website' | 'github' | 'email' | 'status'

type Parsed = {
  line: number
  name: string
  slug: string
  teamIds: string[]
  role: string
  major: string
  gradYear: number | null
  linkedin: string
  website: string
  github: string
  email: string
  status: 'active' | 'alumni' | 'inactive' | null
  existing: ExistingMember | null
  photo: File | null
  errors: string[]
}

const TEMPLATE_HEADERS = ['Name', 'Teams', 'Role', 'Major', 'Graduation year', 'LinkedIn', 'Website', 'GitHub', 'Email', 'Status']
const FIELD_LABELS: Record<Field, string> = {
  name: 'Name',
  teams: 'Teams',
  role: 'Role',
  major: 'Major',
  gradYear: 'Graduation year',
  linkedin: 'LinkedIn',
  website: 'Website',
  github: 'GitHub',
  email: 'Email',
  status: 'Status',
}

const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const slugify = (s: string) => norm(s).replace(/ /g, '-').slice(0, 64)

/** Works out which column holds what from the header text (Google Form questions included). */
export function fieldFor(header: string): Field | null {
  const h = norm(header)
  if (!h || h.includes('timestamp')) return null
  if (h.includes('linkedin')) return 'linkedin'
  if (h.includes('github')) return 'github'
  if (h.includes('email') || h.includes('e mail')) return 'email'
  if (h.includes('website') || h.includes('portfolio') || h.includes('personal site')) return 'website'
  if (h.includes('headshot') || h.includes('photo') || h.includes('picture')) return null
  if (h.includes('major')) return 'major'
  if (h.includes('grad') || h.includes('class of') || h === 'year') return 'gradYear'
  if (h.includes('role') || h.includes('position') || h === 'title') return 'role'
  if (h.includes('team')) return 'teams'
  if (h.includes('status')) return 'status'
  if (h.includes('name')) return 'name'
  return null
}

/** CSV (from a download) or tab-separated (pasted straight from Google Sheets / Excel). */
export function parseTable(text: string): string[][] {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? ''
  const sep = firstLine.includes('\t') ? '\t' : ','
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (c === '"') quoted = false
      else cell += c
    } else if (c === '"' && cell === '') quoted = true
    else if (c === sep) {
      row.push(cell)
      cell = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += c
  }
  if (cell !== '' || row.length) {
    row.push(cell)
    rows.push(row)
  }
  return rows.filter((r) => r.some((c) => c.trim()))
}

export function cleanUrl(v: string): { url: string; ok: boolean } {
  const t = v.trim()
  if (!t) return { url: '', ok: true }
  const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`
  try {
    const u = new URL(withScheme)
    return { url: u.toString(), ok: u.hostname.includes('.') }
  } catch {
    return { url: t, ok: false }
  }
}

function parseStatus(v: string): Parsed['status'] {
  const t = norm(v)
  if (!t) return null
  if (t.startsWith('alum') || t.includes('graduat')) return 'alumni'
  if (t.startsWith('inactive')) return 'inactive'
  if (t.startsWith('active') || t === 'yes') return 'active'
  return null
}

const key = () => Math.random().toString(36).slice(2, 12)

export function MemberImport() {
  const client = useClient({ apiVersion: '2025-09-01' })
  const [teams, setTeams] = useState<TeamRow[] | null>(null)
  const [members, setMembers] = useState<ExistingMember[]>([])
  const [text, setText] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [result, setResult] = useState<{ created: number; updated: number; failed: string[] } | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const photoInput = useRef<HTMLInputElement>(null)

  const load = () =>
    client
      .fetch<{ teams: TeamRow[]; members: ExistingMember[] }>(
        `{
          "teams": *[_type == "team" && !(_id in path("drafts.**"))] | order(orderRank){ _id, name, code, "slug": slug.current },
          "members": *[_type == "member" && !(_id in path("drafts.**"))]{ _id, name, "slug": slug.current, teams }
        }`,
      )
      .then((r) => {
        setTeams(r.teams)
        setMembers(r.members)
      })

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  const { columns, rows } = useMemo(() => {
    const table = parseTable(text)
    if (!table.length || !teams) return { columns: [] as (Field | null)[], rows: [] as Parsed[] }
    const cols = table[0].map(fieldFor)
    const teamLookup = new Map<string, string>()
    for (const t of teams) for (const k of [t.name, t.code, t.slug]) if (k) teamLookup.set(norm(k), t._id)
    const bySlug = new Map(members.filter((m) => m.slug).map((m) => [m.slug!, m]))
    const byName = new Map(members.map((m) => [norm(m.name ?? ''), m]))
    const photoFor = (name: string) => {
      const n = norm(name)
      if (!n) return null
      const exact = photos.find((f) => norm(f.name.replace(/\.[^.]+$/, '')) === n)
      if (exact) return exact
      // Google Form uploads are named "<original file> - <Person Name>.jpg"
      return photos.find((f) => ` ${norm(f.name.replace(/\.[^.]+$/, ''))} `.includes(` ${n} `)) ?? null
    }

    const out: Parsed[] = table.slice(1).map((cells, i) => {
      const get = (f: Field) =>
        cols
          .map((c, ci) => (c === f ? (cells[ci] ?? '').trim() : ''))
          .filter(Boolean)
          .join(', ')
      const errors: string[] = []
      const name = get('name').replace(/\s+/g, ' ')
      if (!name) errors.push('Missing name')
      const slug = slugify(name)
      const teamIds: string[] = []
      for (const part of get('teams').split(/[;,/\n]| and /i)) {
        const p = part.trim()
        if (!p) continue
        const id = teamLookup.get(norm(p)) ?? teamLookup.get(norm(p.replace(/\bteam\b/i, '')))
        if (id) {
          if (!teamIds.includes(id)) teamIds.push(id)
        } else errors.push(`Unknown team "${p}"`)
      }
      const urls = (['linkedin', 'website', 'github'] as const).map((f) => {
        const r = cleanUrl(get(f))
        if (!r.ok) errors.push(`${FIELD_LABELS[f]} isn't a web address`)
        return r.url
      })
      const yearText = get('gradYear').match(/\d{4}/)?.[0]
      const gradYear = yearText ? Number(yearText) : null
      if (get('gradYear') && !gradYear) errors.push('Graduation year should be a 4-digit year')
      const statusText = get('status')
      const status = parseStatus(statusText)
      if (statusText && !status) errors.push('Status should be Active, Alumni or Inactive')
      return {
        line: i + 2,
        name,
        slug,
        teamIds,
        role: get('role'),
        major: get('major'),
        gradYear,
        linkedin: urls[0],
        website: urls[1],
        github: urls[2],
        email: get('email'),
        status,
        existing: bySlug.get(slug) ?? byName.get(norm(name)) ?? null,
        photo: photoFor(name),
        errors,
      }
    })
    return { columns: cols, rows: out }
  }, [text, teams, members, photos])

  const ready = rows.filter((r) => !r.errors.length)
  const teamName = (id: string) => teams?.find((t) => t._id === id)?.name ?? id
  const hasNameColumn = columns.includes('name')

  const downloadTemplate = () => {
    const example = ['Jane Doe', 'AutoNav; Outreach', '', 'Computer Engineering', '2028', 'linkedin.com/in/janedoe', '', 'github.com/janedoe', 'jdoe@vt.edu', 'Active']
    const csv = [TEMPLATE_HEADERS, example].map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'vtcro-members-template.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const run = async () => {
    setRunning(true)
    setResult(null)
    setProgress({ done: 0, total: ready.length })
    let created = 0
    let updated = 0
    const failed: string[] = []
    for (const [i, r] of ready.entries()) {
      try {
        const id = r.existing?._id ?? `member-${r.slug}`
        const set: Record<string, unknown> = { name: r.name }
        if (r.major) set.major = r.major
        if (r.gradYear) set.gradYear = r.gradYear
        if (r.linkedin) set.linkedin = r.linkedin
        if (r.website) set.website = r.website
        if (r.github) set.github = r.github
        if (r.email) set.email = r.email
        if (r.status) set.status = r.status
        // Keep existing team entries; add the new ones.
        const merged = (r.existing?.teams ?? []).map((t) => ({ ...t }))
        for (const teamId of r.teamIds) {
          const found = merged.find((t) => t.team?._ref === teamId)
          if (found) {
            if (r.role) found.role = r.role
          } else merged.push({ _key: key(), team: { _ref: teamId }, ...(r.role ? { role: r.role } : {}) })
        }
        if (r.teamIds.length) set.teams = merged.map((t) => ({ ...t, _type: 'membership', team: { _type: 'reference', _ref: t.team!._ref } }))
        if (r.photo) {
          const asset = await client.assets.upload('image', r.photo, { filename: r.photo.name })
          set.photo = { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: r.name }
        }
        await client
          .transaction()
          .createIfNotExists({ _id: id, _type: 'member', name: r.name, slug: { _type: 'slug', current: r.slug }, status: 'active' })
          .patch(id, (p) => p.set(set))
          .commit()
        if (r.existing) updated++
        else created++
      } catch (e) {
        failed.push(`${r.name}: ${e instanceof Error ? e.message : String(e)}`)
      }
      setProgress({ done: i + 1, total: ready.length })
    }
    setResult({ created, updated, failed })
    setRunning(false)
    await load()
  }

  return (
    <Box padding={4} style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap={5} style={{ maxWidth: 960 }}>
        <Stack gap={3}>
          <Heading size={2}>Import members from a spreadsheet</Heading>
          <Text size={1} muted>
            Add or update many people at once. Imported members go live on the website straight away. People already in the dashboard are matched by name and updated;
            nothing is deleted, and empty cells never erase existing details.
          </Text>
        </Stack>

        <Card padding={4} radius={3} border>
          <Stack gap={4}>
            <Text weight="semibold">1. Get the spreadsheet ready</Text>
            <Text size={1} muted>
              One row per person. Only <b>Name</b> is required; every other column is optional and can be left out. Column headers can be worded freely (Google Form
              questions like “Which team are you on?” work).
            </Text>
            <Text size={1} muted>
              <b>Teams</b>: one or more team names or codes, separated by commas or semicolons. Current teams:{' '}
              {teams ? teams.map((t) => `${t.name}${t.code ? ` (${t.code})` : ''}`).join(', ') : 'loading…'}.
            </Text>
            <Text size={1} muted>
              <b>Status</b>: Active (default), Alumni or Inactive. <b>Role</b>: optional title on their team(s), e.g. Software Lead. Executive titles and team leads are
              set on the team’s page (People tab), not here.
            </Text>
            <Flex>
              <Button icon={DownloadIcon} mode="ghost" text="Download a blank template (.csv)" onClick={downloadTemplate} />
            </Flex>
          </Stack>
        </Card>

        <Card padding={4} radius={3} border>
          <Stack gap={4}>
            <Text weight="semibold">2. Add the spreadsheet</Text>
            <Text size={1} muted>
              Either choose a .csv file (Google Sheets: File → Download → Comma-separated values), or select the cells in Google Sheets or Excel, including the header
              row, copy them and paste below.
            </Text>
            <Flex gap={2} wrap="wrap">
              <Button icon={UploadIcon} mode="ghost" text="Choose .csv file" onClick={() => fileInput.current?.click()} />
              {text && <Button mode="bleed" tone="critical" text="Clear" onClick={() => setText('')} />}
            </Flex>
            <input
              ref={fileInput}
              type="file"
              accept=".csv,.tsv,.txt,text/csv"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (f) setText(await f.text())
                e.target.value = ''
              }}
            />
            <TextArea rows={6} placeholder="…or paste the rows here" value={text} onChange={(e) => setText(e.currentTarget.value)} style={{ fontFamily: 'monospace' }} />
          </Stack>
        </Card>

        <Card padding={4} radius={3} border>
          <Stack gap={4}>
            <Text weight="semibold">3. Headshots (optional)</Text>
            <Text size={1} muted>
              Select all the photos at once. Each is matched to a person when the file name contains their full name, e.g. “Jane Doe.jpg”. Photos uploaded through a
              Google Form (named “photo - Jane Doe.jpg”) match automatically.
            </Text>
            <Flex gap={2} wrap="wrap" align="center">
              <Button icon={UploadIcon} mode="ghost" text="Choose photos" onClick={() => photoInput.current?.click()} />
              {photos.length > 0 && (
                <>
                  <Text size={1}>
                    {photos.length} {photos.length === 1 ? 'photo' : 'photos'} selected, {rows.filter((r) => r.photo).length} matched
                  </Text>
                  <Button mode="bleed" tone="critical" text="Clear" onClick={() => setPhotos([])} />
                </>
              )}
            </Flex>
            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={(e) => {
                setPhotos(Array.from(e.target.files ?? []))
                e.target.value = ''
              }}
            />
          </Stack>
        </Card>

        {text && (
          <Card padding={4} radius={3} border>
            <Stack gap={4}>
              <Text weight="semibold">4. Check and import</Text>
              {!hasNameColumn ? (
                <Card padding={3} radius={2} tone="critical">
                  <Text size={1}>No “Name” column found. Make sure the first row holds the column headers.</Text>
                </Card>
              ) : (
                <>
                  <Text size={1} muted>
                    Columns found: {[...new Set(columns.filter(Boolean) as Field[])].map((f) => FIELD_LABELS[f]).join(', ')}.{' '}
                    {columns.some((c) => !c) && 'Other columns are ignored.'}
                  </Text>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ textAlign: 'left' }}>
                          {['Row', 'Name', 'Teams', 'Headshot', 'Result'].map((h) => (
                            <th key={h} style={{ padding: '6px 8px', borderBottom: '1px solid var(--card-border-color)', fontWeight: 600 }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <tr key={r.line}>
                            <td style={{ padding: '6px 8px', opacity: 0.6 }}>{r.line}</td>
                            <td style={{ padding: '6px 8px' }}>{r.name || '—'}</td>
                            <td style={{ padding: '6px 8px' }}>{r.teamIds.map(teamName).join(', ') || '—'}</td>
                            <td style={{ padding: '6px 8px' }}>{r.photo ? r.photo.name : '—'}</td>
                            <td style={{ padding: '6px 8px' }}>
                              {r.errors.length ? (
                                <Badge tone="critical">{r.errors.join('; ')}</Badge>
                              ) : r.existing ? (
                                <Badge tone="caution">Update</Badge>
                              ) : (
                                <Badge tone="positive">New</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {rows.some((r) => r.errors.length) && (
                    <Text size={1} muted>
                      Rows with a problem are skipped. Fix them in the spreadsheet and add it again; re-importing is safe.
                    </Text>
                  )}
                  <Flex gap={3} align="center" wrap="wrap">
                    <Button
                      tone="primary"
                      text={running ? 'Importing…' : `Import ${ready.length} ${ready.length === 1 ? 'member' : 'members'}`}
                      disabled={running || !ready.length}
                      onClick={run}
                    />
                    {progress && running && (
                      <Text size={1}>
                        {progress.done} of {progress.total}
                      </Text>
                    )}
                  </Flex>
                </>
              )}
            </Stack>
          </Card>
        )}

        {result && (
          <Card padding={4} radius={3} tone={result.failed.length ? 'caution' : 'positive'} border>
            <Stack gap={3}>
              <Text weight="semibold">
                Done: {result.created} added, {result.updated} updated.
              </Text>
              <Text size={1}>They appear on the website within a minute. Find them under Members → Active members.</Text>
              {result.failed.map((f) => (
                <Text key={f} size={1}>
                  Not imported: {f}
                </Text>
              ))}
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
