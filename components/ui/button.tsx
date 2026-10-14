import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import { cn } from '@/lib/utils'

/** Pill buttons. Icons nudge right on hover; give an icon `icon-static` to keep it still. */
const buttonVariants = cva(
  [
    'inline-flex max-w-full min-h-(--btn-h) items-center justify-center gap-2.5 rounded-[999px] border border-transparent px-6 py-2 text-center text-[0.9375rem] leading-[1.25] font-medium [--btn-h:48px] [-webkit-tap-highlight-color:transparent]',
    '[transition:background-color_var(--dur-2)_var(--ease),border-color_var(--dur-2)_var(--ease),color_var(--dur-2)_var(--ease),opacity_var(--dur-2)_var(--ease)]',
    '[&_svg]:[transition:transform_var(--dur-2)_var(--ease)] hoverable:hover:[&_svg:not(.icon-static)]:[transform:translateX(2px)]',
    'aria-disabled:pointer-events-none aria-disabled:opacity-50',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:opacity-88',
        /** Same as primary; used on photos and dark banners. */
        light: 'bg-primary text-primary-foreground hover:opacity-88',
        secondary: 'border-line-3 text-fg hover:border-fg',
      },
      size: {
        default: '',
        // Repeats the line height: a font size later in the list would otherwise drop it when classes are merged.
        sm: 'px-4 py-1.5 text-[0.875rem] leading-[1.25] [--btn-h:38px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
