import { CalendarIcon, DiamondIcon, ImagesIcon, RocketIcon, StarIcon, TagIcon } from '../icons'
import { orderRankField } from '@sanity/orderable-document-list'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, placeholderField, richTextField, urlValidation } from './helpers'

/* ───────────────────────────── Awards ───────────────────────────── */

export const award = defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Award / category',
      type: 'string',
      description: 'e.g. "Open Design Competition" or "Design Award".',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'placement',
      title: 'Placement',
      type: 'string',
      description: 'Short result shown large, e.g. 1st, 3rd, 16th, Champions. Leave empty for non-placing awards.',
    }),
    defineField({
      name: 'rank',
      title: 'Podium finish',
      type: 'number',
      description: 'Used for styling. Choose 1, 2 or 3 for podium finishes.',
      options: {
        list: [
          { title: '1st / Champion', value: 1 },
          { title: '2nd', value: 2 },
          { title: '3rd', value: 3 },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'competition', title: 'Competition / event', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Year', type: 'number', validation: (r) => r.required().integer().min(2000).max(2100) }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'team', title: 'Team', type: 'reference', to: [{ type: 'team' }], description: 'The award will also appear on this team’s page.' }),
    defineField({ name: 'project', title: 'Project (optional)', type: 'reference', to: [{ type: 'project' }], description: 'For awards won by a project such as WorkCell.' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    imageField('image', 'Photo (optional)'),
    defineField({ name: 'url', title: 'Link (optional)', type: 'url', validation: urlValidation }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false, description: 'Highlight this award.' }),
    orderRankField({ type: 'award' }),
  ],
  preview: {
    select: { title: 'title', placement: 'placement', comp: 'competition', year: 'year' },
    prepare: ({ title, placement, comp, year }) => ({
      title: [placement, title].filter(Boolean).join(' · '),
      subtitle: [comp, year].filter(Boolean).join(' · '),
    }),
  },
})

/* ───────────────────────────── Projects ───────────────────────────── */

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: RocketIcon,
  description: 'Highlighted projects, such as work from a former team.',
  fields: [
    defineField({ name: 'name', title: 'Project name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'label', title: 'Small label', type: 'string', description: 'e.g. "Former design team". Shown above the name.' }),
    defineField({ name: 'status', title: 'Status line', type: 'string', description: 'e.g. "Open-source launch coming soon". Shown with a highlight dot.' }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 4 }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Short facts, e.g. "Exhibited at Open Sauce 2026". Awards linked to this project are listed automatically.',
    }),
    imageField('logo', 'Logo'),
    imageField('image', 'Image', { description: 'Used when there is no video, and as the video preview image.' }),
    defineField({ name: 'videoUrl', title: 'Video (YouTube link)', type: 'url', validation: urlValidation }),
    defineField({
      name: 'links',
      title: 'Buttons',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'link',
          fields: [
            { name: 'label', title: 'Button text', type: 'string' },
            { name: 'href', title: 'Link', type: 'string' },
          ],
        }),
      ],
    }),
    defineField({ name: 'showOnHomepage', title: 'Show on homepage', type: 'boolean', initialValue: true }),
    orderRankField({ type: 'project' }),
  ],
  preview: { select: { title: 'name', subtitle: 'status', media: 'logo' } },
})

/* ───────────────────────────── Events ───────────────────────────── */

export const eventCategory = defineType({
  name: 'eventCategory',
  title: 'Event category',
  type: 'document',
  icon: TagIcon,
  fields: [defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() })],
})

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  description: 'Events move from "Upcoming" to "Past" automatically after they end.',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'details', title: 'Details' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Event name', type: 'string', group: 'basics', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', group: 'basics', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({
      name: 'start',
      title: 'Starts',
      type: 'datetime',
      group: 'basics',
      options: { timeStep: 15 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'end', title: 'Ends', type: 'datetime', group: 'basics', options: { timeStep: 15 } }),
    defineField({ name: 'allDay', title: 'All-day event (hide times)', type: 'boolean', group: 'basics', initialValue: false }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'object',
      group: 'basics',
      fields: [
        { name: 'name', title: 'Place', type: 'string', description: 'e.g. Data & Decision Sciences Building' },
        { name: 'address', title: 'Address / city', type: 'string' },
        { name: 'mapUrl', title: 'Map link', type: 'url' },
      ],
    }),
    defineField({ name: 'shortDescription', title: 'Short description', type: 'text', rows: 3, group: 'basics' }),
    imageField('image', 'Event image', { group: 'basics' }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'eventCategory' }], group: 'details' }),
    defineField({ name: 'teams', title: 'Teams involved', type: 'array', group: 'details', of: [defineArrayMember({ type: 'reference', to: [{ type: 'team' }] })] }),
    richTextField('body', 'Full description', { group: 'details' }),
    defineField({ name: 'registrationUrl', title: 'Registration link', type: 'url', group: 'details', validation: urlValidation }),
    defineField({ name: 'externalUrl', title: 'External event page', type: 'url', group: 'details', validation: urlValidation }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', group: 'basics', initialValue: false, description: 'Shown larger at the top of the Events page.' }),
    defineField({ name: 'active', title: 'Show on website', type: 'boolean', group: 'basics', initialValue: true }),
    placeholderField(),
  ],
  orderings: [{ title: 'Date (newest first)', name: 'startDesc', by: [{ field: 'start', direction: 'desc' }] }],
  preview: {
    select: { title: 'name', start: 'start', media: 'image' },
    prepare: ({ title, start, media }) => ({
      title,
      subtitle: start ? new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date',
      media,
    }),
  },
})

/* ───────────────────────────── Photos ───────────────────────────── */

export const album = defineType({
  name: 'album',
  title: 'Photo album',
  type: 'document',
  icon: ImagesIcon,
  description: 'Drag many photos into "Photos" at once. Resizing and optimization happen automatically.',
  fields: [
    defineField({ name: 'title', title: 'Album title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Web address', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'date', title: 'Date', type: 'date' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'teams', title: 'Teams', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'team' }] })], description: 'Photos appear on these teams’ pages.' }),
    defineField({ name: 'event', title: 'Event', type: 'reference', to: [{ type: 'event' }] }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      options: { layout: 'grid' },
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt text', type: 'string' },
            { name: 'caption', title: 'Caption', type: 'string' },
            { name: 'credit', title: 'Photographer', type: 'string' },
            { name: 'featured', title: 'Feature on homepage & gallery top', type: 'boolean' },
            {
              name: 'teams',
              title: 'Teams in this photo (optional)',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'team' }] }],
              description: 'Only needed if different from the album’s teams.',
            },
          ],
        }),
      ],
    }),
    defineField({ name: 'showInGallery', title: 'Show on website', type: 'boolean', initialValue: true }),
    placeholderField(),
  ],
  orderings: [{ title: 'Date (newest first)', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', date: 'date', media: 'photos.0', photos: 'photos' },
    prepare: ({ title, date, media, photos }) => ({
      title,
      subtitle: [date, `${photos?.length ?? 0} photos`].filter(Boolean).join(' · '),
      media,
    }),
  },
})

/* ───────────────────────────── Sponsors ───────────────────────────── */

export const sponsorCategory = defineType({
  name: 'sponsorCategory',
  title: 'Sponsor category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'name', title: 'Category name', type: 'string', description: 'e.g. Corporate Sponsors', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description (optional)', type: 'text', rows: 2 }),
    orderRankField({ type: 'sponsorCategory' }),
  ],
})

export const sponsorTier = defineType({
  name: 'sponsorTier',
  title: 'Sponsor tier',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({ name: 'name', title: 'Tier name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'level',
      title: 'Logo size',
      type: 'string',
      options: {
        list: [
          { title: 'Large', value: 'lg' },
          { title: 'Medium', value: 'md' },
          { title: 'Small', value: 'sm' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'md',
    }),
    orderRankField({ type: 'sponsorTier' }),
  ],
})

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  icon: DiamondIcon,
  fields: [
    defineField({ name: 'name', title: 'Sponsor name', type: 'string', validation: (r) => r.required() }),
    imageField('logo', 'Logo', { description: 'Transparent PNG or SVG preferred.' }),
    imageField('logoOnDark', 'Logo for dark backgrounds (optional)', {
      description: 'A white or light version. If empty, the regular logo is shown on a light tile.',
    }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'sponsorCategory' }], validation: (r) => r.required() }),
    defineField({ name: 'tier', title: 'Tier (optional)', type: 'reference', to: [{ type: 'sponsorTier' }] }),
    defineField({ name: 'url', title: 'Website', type: 'url', validation: urlValidation }),
    defineField({ name: 'description', title: 'Description (optional)', type: 'text', rows: 2 }),
    defineField({ name: 'active', title: 'Show on website', type: 'boolean', initialValue: true }),
    placeholderField(),
    orderRankField({ type: 'sponsor' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category.name', active: 'active', media: 'logo' },
    prepare: ({ title, subtitle, active, media }) => ({ title, subtitle: [subtitle, active === false ? 'Hidden' : null].filter(Boolean).join(' · '), media }),
  },
})
