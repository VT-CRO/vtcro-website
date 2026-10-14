import type { ReactNode } from 'react'

/** Shared grid for event cards. */
export function EventGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 min-[760px]:grid-cols-[repeat(auto-fill,minmax(380px,1fr))] min-[760px]:gap-5">{children}</div>
}
