import { UsersIcon } from '../icons'
import { orderRankField } from '@sanity/orderable-document-list'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, richTextField, urlValidation } from './helpers'

export const team = defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  icon: UsersIcon,
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'about', title: 'About & project' },
    { name: 'people', title: 'People' },
    { name: 'media', title: 'Video' },
    { name: 'links', title: 'Links' },
    { name: 'more', title: 'Extra sections' },
    { name: 'seo', title: 'Search & sharing' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Team name', type: 'string', group: 'basics', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      group: 'basics',
      description: 'The end of the team page URL: vtcro.org/teams/<this>. Click "Generate" to create it from the name.',
      options: { source: 'name', maxLength: 48 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'teamType',
      title: 'Team type',
      type: 'string',
      group: 'basics',
      options: {
        list: [
          { title: 'Design Team', value: 'design' },
          { title: 'Support Team', value: 'support' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'design',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'code',
      title: 'Team code',
      type: 'string',
      group: 'basics',
      description: 'Optional short code shown as a small label, e.g. NAV or VEX (2–4 capital letters).',
      validation: (r) => r.max(4).uppercase(),
    }),
    defineField({
      name: 'active',
      title: 'Show on website',
      type: 'boolean',
      group: 'basics',
      initialValue: true,
      description: 'Turn off to hide the team everywhere without deleting it (e.g. a paused or former team).',
    }),
    defineField({
      name: 'leadershipGroup',
      title: 'List as "Leadership" on the Team page',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
      description:
        'On for the Executive team: its people are shown first, as the Leadership group, on the main Team (people) page instead of under a team heading.',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      type: 'text',
      rows: 3,
      group: 'basics',
      description: 'One or two sentences. Used on team cards, the homepage, and search results.',
      validation: (r) => r.max(220).warning('Keep it short: this appears on cards.'),
    }),
    imageField('logo', 'Team logo', { group: 'basics', description: 'Square image works best (PNG or SVG with a transparent background).' }),
    imageField('coverImage', 'Cover photo', {
      group: 'basics',
      description: 'Large landscape photo used on the team card and at the top of the team page. Use the crop tool to mark the important area.',
    }),

    richTextField('fullDescription', 'Full description', { group: 'about', description: 'The main text on the team page.' }),
    defineField({ name: 'mission', title: 'Mission', type: 'text', rows: 3, group: 'about' }),
    defineField({
      name: 'objectives',
      title: 'Objectives',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'string' })],
      description: 'A short list of goals for this season. Drag to reorder.',
    }),
    defineField({
      name: 'department',
      title: 'Department affiliation',
      type: 'string',
      group: 'about',
      description: 'e.g. ECE Department. Leave empty if none.',
    }),
    defineField({
      name: 'competition',
      title: 'Competition',
      type: 'object',
      group: 'about',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'name', title: 'Competition name', type: 'string' }),
        defineField({ name: 'url', title: 'Competition website', type: 'url', validation: urlValidation }),
        defineField({ name: 'rulesUrl', title: 'Rules / game manual link', type: 'url', validation: urlValidation }),
        defineField({ name: 'location', title: 'Location', type: 'string' }),
        imageField('logo', 'Competition logo'),
      ],
    }),
    defineField({
      name: 'currentProject',
      title: 'Current project',
      type: 'object',
      group: 'about',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'name', title: 'Project name', type: 'string' }),
        defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 4 }),
        defineField({
          name: 'images',
          title: 'Project images',
          type: 'array',
          of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }, { name: 'caption', title: 'Caption', type: 'string' }] })],
          options: { layout: 'grid' },
        }),
        defineField({
          name: 'specs',
          title: 'Technical specs',
          type: 'array',
          description: 'Optional key facts shown as a spec table, e.g. "Drive" → "Swerve, 4 modules".',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'spec',
              fields: [
                { name: 'label', title: 'Label', type: 'string' },
                { name: 'value', title: 'Value', type: 'string' },
              ],
              preview: { select: { title: 'label', subtitle: 'value' } },
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'leadership',
      title: 'Team leadership',
      type: 'array',
      group: 'people',
      description: 'Pick people from Members and give each a title (e.g. Chief Engineer). Shown first on the team page.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'leader',
          fields: [
            defineField({ name: 'member', title: 'Person', type: 'reference', to: [{ type: 'member' }], validation: (r) => r.required() }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: 'member.name', subtitle: 'title', media: 'member.photo' },
          },
        }),
      ],
    }),
    defineField({
      name: 'roster',
      title: 'Team members',
      type: 'array',
      group: 'people',
      description:
        'Pick people from Members. A person can be on several teams; their photo and details are edited once, in Members. People marked Alumni or Inactive are hidden automatically.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'rosterEntry',
          fields: [
            defineField({ name: 'member', title: 'Person', type: 'reference', to: [{ type: 'member' }], validation: (r) => r.required() }),
            defineField({
              name: 'role',
              title: 'Role on this team (optional)',
              type: 'string',
              description: 'e.g. Software Lead. Leave empty to show "<Team> Engineer" / "<Team> Member".',
            }),
          ],
          preview: {
            select: { title: 'member.name', subtitle: 'role', media: 'member.photo' },
          },
        }),
      ],
    }),

    defineField({ name: 'videoUrl', title: 'Video (YouTube link)', type: 'url', group: 'media', validation: urlValidation }),

    defineField({
      name: 'githubRepos',
      title: 'GitHub repositories',
      type: 'array',
      group: 'links',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'repo',
          fields: [
            { name: 'label', title: 'Label', type: 'string', description: 'e.g. Robot firmware' },
            { name: 'url', title: 'Repository URL', type: 'url', validation: urlValidation },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({
      name: 'applicationUrl',
      title: 'Application link',
      type: 'url',
      group: 'links',
      description: 'Team-specific application form. Leave empty to use the general Apply page.',
      validation: urlValidation,
    }),
    defineField({ name: 'websiteUrl', title: 'External website', type: 'url', group: 'links', validation: urlValidation }),
    defineField({ name: 'docsUrl', title: 'Technical documentation', type: 'url', group: 'links', validation: urlValidation }),

    defineField({
      name: 'extraSections',
      title: 'Extra sections',
      type: 'array',
      group: 'more',
      description: 'Optional additional sections at the bottom of the team page. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'textSection',
          title: 'Text section',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            richTextField('body', 'Text'),
          ],
          preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Text section', subtitle: 'Text' }) },
        }),
        defineArrayMember({
          type: 'object',
          name: 'imageSection',
          title: 'Image section',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            {
              name: 'images',
              title: 'Images',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Alt text', type: 'string' }, { name: 'caption', title: 'Caption', type: 'string' }] }],
              options: { layout: 'grid' },
            },
          ],
          preview: { select: { title: 'heading', media: 'images.0' }, prepare: ({ title, media }) => ({ title: title || 'Image section', subtitle: 'Images', media }) },
        }),
        defineArrayMember({
          type: 'object',
          name: 'videoSection',
          title: 'Video section',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'url', title: 'YouTube link', type: 'url' },
          ],
          preview: { select: { title: 'heading' }, prepare: ({ title }) => ({ title: title || 'Video section', subtitle: 'Video' }) },
        }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'Search & sharing',
      type: 'object',
      group: 'seo',
      description: 'Optional. By default the team name, short description and cover photo are used.',
      fields: [
        { name: 'title', title: 'Page title', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 2 },
      ],
    }),
    orderRankField({ type: 'team' }),
  ],
  preview: {
    select: { title: 'name', type: 'teamType', code: 'code', active: 'active', media: 'logo' },
    prepare: ({ title, type, code, active, media }) => ({
      title,
      subtitle: [type === 'support' ? 'Support Team' : 'Design Team', code, active === false ? 'Hidden' : null].filter(Boolean).join(' · '),
      media,
    }),
  },
})
