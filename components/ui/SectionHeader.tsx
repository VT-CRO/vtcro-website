import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

type Props = {
  heading: string
  intro?: string
  action?: ReactNode
  id?: string
  as?: 'h1' | 'h2'
  center?: boolean
}

/** Section title with an optional intro and action link. */
export function SectionHeader({ heading, intro, action, id, as: Tag = 'h2', center }: Props) {
  return (
    <header className={`${styles.header} ${center ? styles.center : ''}`} data-reveal>
      <div className={styles.text}>
        <Tag id={id} className="t-h2">
          {heading}
        </Tag>
        {intro && <p className={`t-lead ${styles.intro}`}>{intro}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </header>
  )
}
