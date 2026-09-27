import { UserIcon } from '../icons'
import { defineField, defineType } from 'sanity'
import { imageField, placeholderField, urlValidation } from './helpers'

export const member = defineType({
  name: 'member',
  title: 'Member',
  type: 'document',
  icon: UserIcon,
  description: 'One entry per person. Add them to teams from the team’s page (Teams → People).',
  fields: [
    defineField({ name: 'name', title: 'Full name', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Profile web address',
      type: 'slug',
      description: 'vtcro.org/team/<this>. Click "Generate".',
      options: { source: 'name', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active member', value: 'active' },
          { title: 'Alumni', value: 'alumni' },
          { title: 'Inactive', value: 'inactive' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'active',
      description: 'Only active members appear on the website. Alumni/inactive records are kept for history.',
      validation: (r) => r.required(),
    }),
    imageField('photo', 'Headshot', {
      description: 'Portrait photo. Use the crop tool to center the face; it is shown as a 4:5 portrait.',
    }),
    defineField({ name: 'major', title: 'Major', type: 'string' }),
    defineField({
      name: 'gradYear',
      title: 'Graduation year',
      type: 'number',
      validation: (r) => r.integer().min(2000).max(2100),
    }),
    defineField({ name: 'bio', title: 'Short bio (optional)', type: 'text', rows: 4 }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url', validation: urlValidation }),
    defineField({ name: 'website', title: 'Personal website', type: 'url', validation: urlValidation }),
    defineField({ name: 'github', title: 'GitHub URL', type: 'url', validation: urlValidation }),
    defineField({
      name: 'email',
      title: 'Email (private)',
      type: 'string',
      description: 'For internal reference only. Not shown on the website.',
    }),
    placeholderField(),
  ],
  orderings: [
    { title: 'Name A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Graduation year', name: 'grad', by: [{ field: 'gradYear', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', status: 'status', major: 'major', year: 'gradYear', media: 'photo' },
    prepare: ({ title, status, major, year, media }) => ({
      title,
      subtitle: [status !== 'active' ? (status === 'alumni' ? 'Alumni' : 'Inactive') : null, major, year].filter(Boolean).join(' · '),
      media,
    }),
  },
})
