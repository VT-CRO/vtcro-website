'use client'

import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'
import { SINGLETONS } from './sanity/schemaTypes/singletons'
import { defaultDocumentNode, structure } from './sanity/structure'

export default defineConfig({
  name: 'vtcro',
  title: 'VT CRO Website',
  basePath: '/studio',
  projectId: projectId || 'prrl41cn',
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons (Homepage, Settings…) can't be created from the "+" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    // Singletons can't be duplicated or deleted.
    actions: (actions, { schemaType }) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
  plugins: [
    structureTool({ structure, defaultDocumentNode, title: 'Content' }),
    // Query playground: only useful for developers.
    visionTool({ defaultApiVersion: apiVersion, title: 'Developer' }),
  ],
})
