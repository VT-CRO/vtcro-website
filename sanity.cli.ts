import { defineCliConfig } from 'sanity/cli'

/** Used by `npx sanity …` commands (login, dataset import/export, CORS). */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'prrl41cn',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
})
