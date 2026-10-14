import * as React from 'react'
import { cn } from '@/lib/utils'

/** Quiet circular icon container. Resize with `[--size:…]`. */
function IconBadge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="icon-badge"
      className={cn(
        'inline-grid size-(--size) flex-none place-items-center rounded-[50%] text-fg [--size:44px] [box-shadow:0_0_0_1px_var(--line-2)_inset]',
        '[&_img]:size-[54%] [&_img]:object-contain in-[.theme-light]:[&_img]:[filter:invert(1)]',
        className,
      )}
      {...props}
    />
  )
}

export { IconBadge }
