import { CogIcon, EnvelopeIcon, HomeIcon, DiamondIcon, AddUserIcon } from '../icons'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { iconField } from '../iconOptions'
import { imageField, richTextField, urlValidation } from './helpers'

/* ───────────────────────────── Site settings ───────────────────────────── */

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({ name: 'organizationName', title: 'Organization name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'shortName', title: 'Short name', type: 'string', description: 'e.g. VT CRO', validation: (r) => r.required() }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'Used in the footer and as the default description for search engines and link previews.',
    }),
    imageField('shareImage', 'Default link-preview image', {
      description: 'Shown when a page is shared on social media or messaging apps. Leave empty to use the VT CRO logo. Landscape, at least 1200×630.',
    }),
    defineField({
      name: 'footerTagline',
      title: 'Footer code line',
      type: 'string',
      description: 'The small monospace line at the bottom of every page.',
    }),
    defineField({ name: 'copyrightName', title: 'Copyright name', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})

/* ───────────────────────────── Contact & social ───────────────────────────── */

export const contactSettings = defineType({
  name: 'contactSettings',
  title: 'Contact & social links',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'generalEmail', title: 'General email', type: 'string', validation: (r) => r.required().email() }),
    defineField({ name: 'sponsorshipEmail', title: 'Sponsorship email', type: 'string', validation: (r) => r.email() }),
    defineField({ name: 'outreachEmail', title: 'Outreach email', type: 'string', validation: (r) => r.email() }),
    defineField({
      name: 'formTopics',
      title: 'Contact form topics',
      type: 'array',
      description: 'The "What is this about?" options on the contact form, and the inbox each one is sent to.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'topic',
          fields: [
            { name: 'label', title: 'Topic', type: 'string', validation: (r) => r.required() },
            { name: 'email', title: 'Send to', type: 'string', validation: (r) => r.required().email() },
          ],
          preview: { select: { title: 'label', subtitle: 'email' } },
        }),
      ],
    }),
    defineField({ name: 'githubUrl', title: 'GitHub', type: 'url', validation: urlValidation }),
    defineField({ name: 'instagramUrl', title: 'Instagram', type: 'url', validation: urlValidation }),
    defineField({ name: 'linkedinUrl', title: 'LinkedIn', type: 'url', validation: urlValidation }),
    defineField({ name: 'youtubeUrl', title: 'YouTube', type: 'url', validation: urlValidation }),
    defineField({
      name: 'discord',
      title: 'Discord',
      type: 'object',
      fields: [
        { name: 'label', title: 'Label', type: 'string', description: 'e.g. CroLearning Discord' },
        { name: 'url', title: 'Invite link', type: 'url' },
      ],
    }),
    defineField({ name: 'location', title: 'Location / address (optional)', type: 'text', rows: 2 }),
  ],
  preview: { prepare: () => ({ title: 'Contact & social links' }) },
})

/* ───────────────────────────── Homepage ───────────────────────────── */

export const HOME_SECTIONS = [
  { title: 'About', value: 'about' },
  { title: 'Design Teams', value: 'designTeams' },
  { title: 'Awards', value: 'awards' },
  { title: 'Featured project', value: 'project' },
  { title: 'Core Principles', value: 'principles' },
  { title: 'Support Teams', value: 'supportTeams' },
  { title: 'Upcoming events', value: 'events' },
  { title: 'Members banner (logo + View members button)', value: 'members' },
  { title: 'Apply banner', value: 'apply' },
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Top of page', default: true },
    { name: 'about', title: 'About & principles' },
    { name: 'sections', title: 'Section order & headings' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Top of page',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'eyebrow', title: 'Line under the logo', type: 'string', description: 'e.g. Competitive Robotics Organization at Virginia Tech' }),
        imageField('image', 'Background photo', {
          description: 'Wide, high-resolution photo. The left and bottom are darkened for the text. Use the crop tool to keep the subject visible.',
        }),
        defineField({
          name: 'video',
          title: 'Background video (optional)',
          type: 'file',
          options: { accept: 'video/mp4,video/webm' },
          description: 'Short, silent MP4 loop (10–20 s, under 8 MB). Plays muted; the photo is shown until it loads and for visitors who prefer reduced motion.',
        }),
        defineField({
          name: 'showSponsors',
          title: 'Show sponsors under the logo',
          type: 'boolean',
          initialValue: true,
          description: 'Lists sponsor logos (from Sponsors) on the opening screen, one column per sponsor category.',
        }),
      ],
    }),
    defineField({
      name: 'about',
      title: 'About VT CRO',
      type: 'object',
      group: 'about',
      description: 'Keep each part to one or two sentences.',
      fields: [
        defineField({ name: 'mission', title: 'Our mission', type: 'text', rows: 2 }),
        defineField({ name: 'whatWeAre', title: 'What we are', type: 'text', rows: 3 }),
        defineField({ name: 'beliefs', title: 'What we believe in', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'principles',
      title: 'Core principles',
      type: 'array',
      group: 'about',
      description: 'Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'principle',
          fields: [
            { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
            { name: 'statement', title: 'Short statement', type: 'string' },
            imageField('icon', 'Icon (optional)', { description: 'Simple white icon (SVG or PNG with transparency).' }),
          ],
          preview: { select: { title: 'name', subtitle: 'statement' } },
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Homepage sections',
      type: 'array',
      group: 'sections',
      description: 'Drag to change the order of sections. Switch "Show" off to hide a section. Headings and intros are optional.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'homeSection',
          fields: [
            { name: 'section', title: 'Section', type: 'string', options: { list: HOME_SECTIONS }, validation: (r) => r.required() },
            { name: 'enabled', title: 'Show', type: 'boolean', initialValue: true },
            { name: 'label', title: 'Button text (Members banner only)', type: 'string' },
            { name: 'heading', title: 'Heading', type: 'string' },
            { name: 'intro', title: 'Intro text', type: 'text', rows: 2 },
            {
              name: 'tone',
              title: 'Background',
              type: 'string',
              options: {
                list: [
                  { title: 'Dark', value: 'dark' },
                  { title: 'Light', value: 'light' },
                ],
                layout: 'radio',
                direction: 'horizontal',
              },
            },
            imageField('background', 'Background photo (optional)', {
              description: 'Shown behind the section with a translucent strip over it.',
            }),
          ],
          preview: {
            select: { section: 'section', enabled: 'enabled', heading: 'heading' },
            prepare: ({ section, enabled, heading }) => ({
              title: HOME_SECTIONS.find((s) => s.value === section)?.title ?? section,
              subtitle: [enabled === false ? 'Hidden' : 'Shown', heading].filter(Boolean).join(' · '),
            }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Homepage' }) },
})

/* ───────────────────────────── Recruitment ───────────────────────────── */

export const recruitment = defineType({
  name: 'recruitment',
  title: 'Recruitment',
  type: 'document',
  icon: AddUserIcon,
  groups: [
    { name: 'status', title: 'Status', default: true },
    { name: 'details', title: 'Details' },
    { name: 'faq', title: 'Other ways to join' },
  ],
  fields: [
    defineField({
      name: 'applicationsOpen',
      title: 'Applications open?',
      type: 'boolean',
      group: 'status',
      initialValue: false,
      description: 'Flip this to switch the whole site between "open" and "closed". The Apply page updates automatically.',
    }),
    defineField({ name: 'applicationUrl', title: 'Application form link', type: 'url', group: 'status', validation: urlValidation }),
    defineField({ name: 'buttonLabel', title: 'Apply button text', type: 'string', group: 'status', initialValue: 'Apply now' }),
    defineField({ name: 'cycleLabel', title: 'Recruitment cycle name', type: 'string', group: 'status', description: 'e.g. "Fall 2027 recruitment"' }),
    defineField({
      name: 'periodStart',
      title: 'Applications open on',
      type: 'date',
      group: 'status',
      description: 'The application period is shown on the Apply page only while applications are open.',
    }),
    defineField({ name: 'periodEnd', title: 'Applications close on', type: 'date', group: 'status' }),
    defineField({ name: 'openHeading', title: 'Heading when open', type: 'string', group: 'status' }),
    defineField({ name: 'openMessage', title: 'Message when open', type: 'text', rows: 3, group: 'status' }),
    defineField({ name: 'closedHeading', title: 'Heading when closed', type: 'string', group: 'status' }),
    defineField({ name: 'closedMessage', title: 'Message when closed', type: 'text', rows: 3, group: 'status' }),
    richTextField('eligibility', 'Eligibility', { group: 'details' }),
    defineField({
      name: 'process',
      title: 'Recruitment process (steps)',
      type: 'array',
      group: 'details',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            iconField(),
            { name: 'title', title: 'Step', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
          ],
          preview: { select: { title: 'title', subtitle: 'description' } },
        }),
      ],
    }),
    defineField({
      name: 'opportunities',
      title: 'Open positions by team (optional)',
      type: 'array',
      group: 'details',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'opportunity',
          fields: [
            { name: 'team', title: 'Team', type: 'reference', to: [{ type: 'team' }] },
            { name: 'note', title: 'What they’re looking for', type: 'text', rows: 2 },
            { name: 'url', title: 'Team-specific application link (optional)', type: 'url' },
          ],
          preview: { select: { title: 'team.name', subtitle: 'note', media: 'team.logo' } },
        }),
      ],
    }),
    defineField({
      name: 'alternatives',
      title: 'Other ways to get involved',
      type: 'array',
      group: 'faq',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'alternative',
          fields: [
            iconField(),
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            { name: 'linkLabel', title: 'Button text', type: 'string' },
            { name: 'url', title: 'Link', type: 'string' },
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { open: 'applicationsOpen' },
    prepare: ({ open }) => ({ title: 'Recruitment', subtitle: open ? 'Applications OPEN' : 'Applications closed' }),
  },
})

/* ───────────────────────────── Sponsors page ───────────────────────────── */

const statFields = (title: string, description: string) =>
  defineField({
    name: 'stats',
    title,
    description,
    type: 'array',
    of: [
      defineArrayMember({
        type: 'object',
        name: 'stat',
        fields: [
          { name: 'value', title: 'Number', type: 'string', description: 'e.g. 17% or ~$65K' },
          { name: 'label', title: 'Label', type: 'string', description: 'e.g. Acceptance rate' },
        ],
        preview: { select: { title: 'value', subtitle: 'label' } },
      }),
    ],
  })

export const sponsorsPage = defineType({
  name: 'sponsorsPage',
  title: 'Sponsor page',
  type: 'document',
  icon: DiamondIcon,
  groups: [
    { name: 'top', title: 'Top', default: true },
    { name: 'talent', title: 'Talent' },
    { name: 'events', title: 'Events' },
    { name: 'offer', title: 'What sponsors get' },
    { name: 'tiers', title: 'Tiers' },
    { name: 'closing', title: 'Closing & pitch deck' },
  ],
  fields: [
    defineField({ name: 'heading', title: 'Page heading', type: 'string', group: 'top', description: 'Put *asterisks* around a word to show it in italics.' }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', rows: 3, group: 'top' }),
    defineField({
      name: 'highlights',
      title: 'Key figures',
      group: 'top',
      description: 'Shown in a row under the heading, after the number of design teams and awards (those two are counted automatically).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'highlight',
          fields: [
            { name: 'value', title: 'Number', type: 'string', description: 'e.g. ~$65K' },
            { name: 'label', title: 'Label', type: 'string', description: 'e.g. Yearly spend' },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),

    defineField({
      name: 'talent',
      title: 'Talent',
      type: 'object',
      group: 'talent',
      fields: [
        { name: 'heading', title: 'Heading', type: 'string' },
        { name: 'body', title: 'Text', type: 'text', rows: 4 },
        { name: 'disciplines', title: 'Majors / disciplines', type: 'array', of: [{ type: 'string' }], description: 'Shown as small tags. Drag to reorder.' },
        statFields('Figures', 'e.g. 17% · Acceptance rate'),
      ],
    }),

    defineField({ name: 'eventsHeading', title: 'Heading', type: 'string', group: 'events' }),
    defineField({ name: 'eventsIntro', title: 'Intro', type: 'text', rows: 2, group: 'events' }),
    defineField({
      name: 'hostedEvents',
      title: 'Events we host',
      group: 'events',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hostedEvent',
          fields: [
            iconField(),
            { name: 'name', title: 'Event name', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            statFields('Figures', 'e.g. 550 · Attendees'),
          ],
          preview: { select: { title: 'name', subtitle: 'description' } },
        }),
      ],
    }),

    defineField({ name: 'reasonsHeading', title: 'Heading', type: 'string', group: 'offer' }),
    defineField({
      name: 'reasons',
      title: 'Benefits',
      group: 'offer',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reason',
          fields: [iconField(), { name: 'title', title: 'Title', type: 'string' }, { name: 'body', title: 'Text', type: 'text', rows: 3 }],
          preview: { select: { title: 'title', subtitle: 'body' } },
        }),
      ],
    }),

    defineField({ name: 'tiersHeading', title: 'Heading', type: 'string', group: 'tiers' }),
    defineField({
      name: 'tiers',
      title: 'Sponsorship tiers',
      group: 'tiers',
      description: 'Highest tier first. The first tier is highlighted.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tier',
          fields: [
            { name: 'name', title: 'Tier name', type: 'string' },
            { name: 'amount', title: 'Amount', type: 'string', description: 'e.g. $5,000 – $14,999' },
            { name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'string' }] },
          ],
          preview: { select: { title: 'name', subtitle: 'amount' } },
        }),
      ],
    }),
    defineField({ name: 'tiersNote', title: 'Note under the tiers', type: 'string', group: 'tiers' }),

    defineField({ name: 'sponsorsHeading', title: 'Heading above current sponsors', type: 'string', group: 'closing' }),
    defineField({ name: 'ctaHeading', title: 'Contact heading', type: 'string', group: 'closing' }),
    defineField({ name: 'ctaBody', title: 'Contact text', type: 'text', rows: 3, group: 'closing' }),
    defineField({
      name: 'packet',
      title: 'Pitch deck (PDF)',
      type: 'file',
      group: 'closing',
      options: { accept: 'application/pdf' },
      description: 'Upload the sponsor pitch deck. The "Pitch deck" download button appears on the page only once a file is uploaded.',
    }),
    defineField({ name: 'packetLabel', title: 'Pitch deck button text', type: 'string', group: 'closing', initialValue: 'Pitch deck' }),
  ],
  preview: { prepare: () => ({ title: 'Sponsor page' }) },
})

export const SINGLETONS = ['siteSettings', 'contactSettings', 'homePage', 'recruitment', 'sponsorsPage']
