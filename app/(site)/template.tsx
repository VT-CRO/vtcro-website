import type { ReactNode } from 'react'

/** Re-mounts on every navigation, giving each page a soft fade-in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="animate-page-in">{children}</div>
}
