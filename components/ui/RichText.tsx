import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlocks } from '@/lib/content'

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? '#'
      const external = /^https?:/.test(href)
      return (
        <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {children}
        </a>
      )
    },
  },
}

export function RichText({ value, className }: { value: PortableTextBlocks; className?: string }) {
  if (!value?.length) return null
  return (
    <div className={`prose ${className ?? ''}`}>
      <PortableText value={value} components={components} />
    </div>
  )
}
