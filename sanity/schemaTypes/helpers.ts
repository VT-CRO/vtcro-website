import { defineArrayMember, defineField } from 'sanity'

/** An image upload with required alt text and a crop "hotspot" tool. */
export function imageField(
  name: string,
  title: string,
  opts: { description?: string; required?: boolean; group?: string | string[]; fieldset?: string } = {},
) {
  return defineField({
    name,
    title,
    type: 'image',
    description: opts.description,
    group: opts.group,
    fieldset: opts.fieldset,
    options: { hotspot: true },
    fields: [altField()],
    validation: opts.required ? (r) => r.required() : undefined,
  })
}

export function altField() {
  return defineField({
    name: 'alt',
    title: 'Alt text',
    type: 'string',
    description:
      'Describe the image for people using screen readers, e.g. "AutoNav rover on the IGVC course". Leave empty only for purely decorative images.',
  })
}

/** Rich text limited to what the site styles: paragraphs, subheadings, lists, bold/italic, links. */
export function richTextField(name: string, title: string, opts: { description?: string; group?: string } = {}) {
  return defineField({
    name,
    title,
    type: 'array',
    group: opts.group,
    description: opts.description,
    of: [
      defineArrayMember({
        type: 'block',
        styles: [
          { title: 'Paragraph', value: 'normal' },
          { title: 'Subheading', value: 'h3' },
          { title: 'Quote', value: 'blockquote' },
        ],
        lists: [
          { title: 'Bullets', value: 'bullet' },
          { title: 'Numbered', value: 'number' },
        ],
        marks: {
          decorators: [
            { title: 'Bold', value: 'strong' },
            { title: 'Italic', value: 'em' },
          ],
          annotations: [
            {
              name: 'link',
              type: 'object',
              title: 'Link',
              fields: [{ name: 'href', type: 'url', title: 'URL', validation: (r) => r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }) }],
            },
          ],
        },
      }),
    ],
  })
}

export function linkObjectFields() {
  return [
    defineField({ name: 'label', title: 'Button text', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'string',
      description: 'A page on this site (e.g. /apply) or a full web address (https://…).',
      validation: (r) => r.required(),
    }),
  ]
}

/** Marks sample content created during the website build so it is easy to find and replace. */
export function placeholderField() {
  return defineField({
    name: 'isPlaceholder',
    title: 'Sample / placeholder content',
    type: 'boolean',
    initialValue: false,
    description:
      'Turned on for sample entries created while the site was being built. Replace the details (and switch this off) or delete the entry.',
  })
}

export const urlValidation = (r: any) => r.uri({ scheme: ['http', 'https'] })
