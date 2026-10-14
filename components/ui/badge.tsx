import * as React from 'react'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

/** Small outlined pill in monospace capitals (team codes, labels, majors). */
function Badge({ className, asChild = false, ...props }: React.ComponentProps<'span'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'
  return (
    <Comp
      data-slot="badge"
      className={cn(
        'inline-flex h-[26px] items-center gap-1.5 rounded-[999px] border border-line-2 px-2.5 font-mono text-[0.68rem] tracking-[0.08em] whitespace-nowrap text-fg-2 uppercase',
        className,
      )}
      {...props}
    />
  )
}

export { Badge }
