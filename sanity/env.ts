export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2025-09-01'

/** True once the Sanity project has been connected via environment variables. */
export const isSanityConfigured = Boolean(projectId)
