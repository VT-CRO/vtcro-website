'use client'

import { useState, type ReactNode } from 'react'
import styles from './AwardLedger.module.css'

/** Keeps the homepage awards short: every award is in the page, extras are hidden until asked for. */
export function ShowMore({ more, less, desktopNeeded, children }: { more: string; less: string; desktopNeeded: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.collapsible} data-open={open || undefined}>
      {children}
      <div className={`${styles.more} ${desktopNeeded ? '' : styles.phoneOnly}`}>
        <button type="button" className="btn btn--secondary" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? less : more}
        </button>
      </div>
    </div>
  )
}
