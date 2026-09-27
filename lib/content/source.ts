import { cache } from 'react'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, isSanityConfigured, projectId } from '@/sanity/env'
import { seedDocuments } from '@/seed/documents'

/** Every document type the website reads. */
const TYPES = [
  'siteSettings',
  'contactSettings',
  'homePage',
  'recruitment',
  'sponsorsPage',
  'team',
  'member',
  'project',
  'award',
  'event',
  'eventCategory',
  'album',
  'sponsor',
  'sponsorCategory',
  'sponsorTier',
]

export const SANITY_CACHE_TAG = 'sanity'

const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'published' })
  : null

export type RawDoc = { _id: string; _type: string; [key: string]: any }

/**
 * Loads all published content in a single request. The site is small enough
 * that this is faster and simpler than many per-page queries. Results are cached
 * and refreshed when the Sanity webhook calls /api/revalidate, or hourly at most.
 *
 * Until Sanity is connected (see .env.example) the built-in sample content is used.
 */
export const getDocuments = cache(async (): Promise<RawDoc[]> => {
  if (!client) return seedDocuments as RawDoc[]
  return client.fetch<RawDoc[]>(
    `*[_type in $types && !(_id in path("drafts.**"))]`,
    { types: TYPES },
    // Local development always shows the latest published content (the publish webhook
    // can't reach a laptop). The live site caches and refreshes on publish, or hourly at most.
    process.env.NODE_ENV === 'development' ? { cache: 'no-store' } : { next: { tags: [SANITY_CACHE_TAG], revalidate: 3600 } },
  )
})

export const cmsAssetBase = { projectId, dataset }
