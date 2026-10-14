'use client'

import * as React from 'react'
import { Label as LabelPrimitive } from 'radix-ui'
import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn('font-mono text-[0.72rem] tracking-[0.1em] text-fg-2 uppercase', className)}
      {...props}
    />
  )
}

export { Label }
