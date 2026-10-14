'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Keeps the homepage awards short: every award is in the page, extras are hidden until asked for. */
export function ShowMore({ more, less, desktopNeeded, children }: { more: string; less: string; desktopNeeded: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    // 4 awards on phones, 6 on larger screens, until "Show all" is pressed.
    <div
      className="max-[700px]:[&:not([data-open])_li:nth-child(n+5)]:hidden [&:not([data-open])_li:nth-child(n+7)]:hidden"
      data-open={open || undefined}
    >
      {children}
      <div className={cn('mt-7 flex justify-center', !desktopNeeded && 'min-[700px]:hidden!')}>
        <Button variant="secondary" type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? less : more}
        </Button>
      </div>
    </div>
  )
}
