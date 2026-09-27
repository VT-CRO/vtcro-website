/**
 * Builds seed/seed.ndjson from seed/documents.ts for `sanity dataset import`.
 *  - Local sample images (/seed/*.webp) become real Sanity image uploads.
 *  - Array items get the `_key` Sanity requires.
 *
 * Run via: npm run seed:import   (builds, then imports into the "production" dataset)
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { seedDocuments } from '../seed/documents.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let counter = 0

function transform(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item) => {
      const out = transform(item)
      if (out && typeof out === 'object' && !Array.isArray(out) && !out._key) out._key = `k${(counter++).toString(36)}`
      return out
    })
  }
  if (value && typeof value === 'object') {
    if (typeof value._seed === 'string') {
      const { _seed, ...rest } = value
      const file = pathToFileURL(resolve(root, 'public' + _seed)).href
      return { ...transform(rest), _type: rest._type ?? 'image', _sanityAsset: `image@${file}` }
    }
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(value)) if (v !== undefined) out[k] = transform(v)
    return out
  }
  return value
}

const lines = seedDocuments.map((doc) => JSON.stringify(transform(doc)))
writeFileSync(resolve(root, 'seed/seed.ndjson'), lines.join('\n') + '\n')
console.log(`Wrote ${lines.length} documents to seed/seed.ndjson`)
