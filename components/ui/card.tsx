import * as React from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

/** Raised surface with a hairline edge. `asChild` renders the styles onto a link or list item instead of a div. */
function Card({ className, asChild = false, ...props }: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'div'
  return (
    <Comp
      data-slot="card"
      className={cn('relative rounded-(--radius-m) bg-card [box-shadow:0_0_0_1px_var(--line)_inset,var(--shadow-1)]', className)}
      {...props}
    />
  )
}

export { Card }
