import * as React from 'react'
import { cn } from '@/lib/utils'
import { fieldClasses } from './input'

/** The browser's own select, styled like the other fields, with a drawn chevron. */
function NativeSelect({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <div
      data-slot="native-select-wrapper"
      className="relative after:pointer-events-none after:absolute after:top-1/2 after:right-[18px] after:-mt-1.5 after:size-2 after:border-r-[1.5px] after:border-b-[1.5px] after:border-r-fg-2 after:border-b-fg-2 after:[transform:rotate(45deg)] after:content-['']"
    >
      <select data-slot="native-select" className={cn(fieldClasses, className)} {...props} />
    </div>
  )
}

export { NativeSelect }
