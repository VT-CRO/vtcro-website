import { cn } from '@/lib/utils'

/** Small ring that fills in when `on` (e.g. applications open). */
function StatusDot({ on, className }: { on?: boolean; className?: string }) {
  return (
    <span
      data-slot="status-dot"
      aria-hidden="true"
      className={cn(
        'inline-block size-[7px] flex-none rounded-[50%] bg-transparent opacity-60 [box-shadow:0_0_0_1px_currentColor_inset]',
        on && 'bg-current opacity-100',
        className,
      )}
    />
  )
}

export { StatusDot }
