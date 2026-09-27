import { Fragment } from 'react'

/** Renders CMS text where *word* becomes italic. Line breaks are kept via CSS (white-space: pre-line). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) => (p.startsWith('*') && p.endsWith('*') && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>))}
    </>
  )
}

/** The same text without formatting marks (for meta descriptions). */
export const plain = (text: string) => text.replace(/\*([^*]+)\*/g, '$1')
