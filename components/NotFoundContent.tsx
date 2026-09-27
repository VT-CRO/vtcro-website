import Link from 'next/link'
import { ArrowRight } from '@/components/icons'

export function NotFoundContent() {
  return (
    <section style={{ paddingTop: 'calc(var(--header-h) + clamp(64px, 12vw, 160px))', paddingBottom: 'var(--section-y)' }}>
      <div className="container">
        <p className="t-label">Error 404</p>
        <h1 className="t-h1" style={{ marginTop: 18, maxWidth: '14ch' }}>
          This page drove off the course.
        </h1>
        <p className="t-lead" style={{ marginTop: 22, maxWidth: '48ch' }}>
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="btn-row" style={{ marginTop: 32 }}>
          <Link href="/" className="btn btn--primary">
            Back to home <ArrowRight size={16} />
          </Link>
          <Link href="/teams" className="btn btn--secondary">
            Browse teams
          </Link>
        </div>
      </div>
    </section>
  )
}
