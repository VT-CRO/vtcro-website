import { UserIcon } from '../icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { imageField, placeholderField, urlValidation } from './helpers'

export const member = defineType({
  name: 'member',
  title: 'Member',
  type: 'document',
  icon: UserIcon,
  description: 'One entry per person. Pick their teams below; leadership titles are set on each team’s page.',
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
    defineField({
      name: 'teams',
      title: 'Teams',
      type: 'array',
      description:
        'Every team this person is on. Design teams put them under "Engineering Team" on the Team page, support teams under "Support Team". Leadership (the Executive board and team leads) is set on the team’s own page: Teams → the team → People → Team leadership.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'membership',
          fields: [
            defineField({ name: 'team', title: 'Team', type: 'reference', to: [{ type: 'team' }], validation: (r) => r.required() }),
            defineField({
              name: 'role',
              title: 'Role on this team (optional)',
              type: 'string',
              description: 'e.g. Software Lead. Leave empty to show "<Team> Engineer" / "<Team> Member".',
            }),
          ],
          preview: {
            select: { title: 'team.name', subtitle: 'role', media: 'team.logo' },
          },
        }),
      ],
      validation: (r) =>
        r.custom((items: any[] | undefined) => {
          const ids = (items ?? []).map((i) => i?.team?._ref).filter(Boolean)
          return new Set(ids).size === ids.length ? true : 'Each team only needs to be added once.'
        }),
    }),
    imageField('photo', 'Headshot (optional)', {
      description: 'Portrait photo. Use the crop tool to center the face; it is shown as a 4:5 portrait.',
    }),
    defineField({ name: 'major', title: 'Major (optional)', type: 'string' }),
    defineField({
      name: 'gradYear',
      title: 'Graduation year (optional)',
      type: 'number',
      validation: (r) => r.integer().min(2000).max(2100),
    }),
    defineField({
      name: 'gradSemester',
      title: 'Graduation semester (optional)',
      type: 'string',
      description: 'Shown with the graduation year on the Team page, e.g. "Spring 2027".',
      options: {
        list: [
          { title: 'Spring', value: 'Spring' },
          { title: 'Summer', value: 'Summer' },
          { title: 'Fall', value: 'Fall' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'bio', title: 'Short bio (optional)', type: 'text', rows: 4 }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL (optional)', type: 'url', validation: urlValidation }),
    defineField({ name: 'website', title: 'Personal website (optional)', type: 'url', validation: urlValidation }),
    defineField({ name: 'github', title: 'GitHub URL (optional)', type: 'url', validation: urlValidation }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Shown on the Team page as an email link.',
    }),
    placeholderField(),
  ],
  orderings: [
    { title: 'Name A→Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
    { title: 'Graduation year (optional)', name: 'grad', by: [{ field: 'gradYear', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name', status: 'status', team0: 'teams.0.team.name', team1: 'teams.1.team.name', team2: 'teams.2.team.name', media: 'photo' },
    prepare: ({ title, status, team0, team1, team2, media }) => ({
      title,
      subtitle: [status !== 'active' ? (status === 'alumni' ? 'Alumni' : 'Inactive') : null, [team0, team1, team2].filter(Boolean).join(', ') || 'No team yet']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
