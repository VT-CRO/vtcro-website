import * as React from 'react'
import { cn } from '@/lib/utils'

/** Shared by Input, Textarea and NativeSelect. 16px text prevents iOS from zooming in on focus. */
export const fieldClasses = [
  'min-h-[52px] w-full appearance-none rounded-[12px] border border-line-2 bg-surface-2 px-4 py-3.5 [font:inherit] text-[16px] text-fg',
  '[transition:border-color_var(--dur-2)_var(--ease),background-color_var(--dur-2)_var(--ease)]',
  'hover:border-line-3 focus:border-accent focus:bg-surface-3 focus:[box-shadow:0_0_0_3px_rgb(255_255_255/0.054)] focus:outline-none',
]

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return <input type={type} data-slot="input" className={cn(fieldClasses, className)} {...props} />
}

export { Input }
