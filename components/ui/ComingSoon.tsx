import styles from './ComingSoon.module.css'

type Props = {
  /** What is coming, e.g. "Members" or "Events". Shown as a small label above "Coming soon". */
  label: string
  /** Heading level for the label (the label names the section). */
  as?: 'h1' | 'h2' | 'p'
  id?: string
  /** Fill most of the screen (for a page whose only content is empty). */
  page?: boolean
}

/** The one "Coming soon" design, used wherever the CMS has nothing to list yet. Disappears once content is published. */
export function ComingSoon({ label, as: Label = 'p', id, page }: Props) {
  return (
    <div className={`${styles.wrap} ${page ? styles.page : ''}`} data-reveal>
      <Label id={id} className={`t-label ${styles.label}`}>
        {label}
      </Label>
      <p className={styles.title}>Coming soon</p>
    </div>
  )
}
