import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { Button } from '@/components/ui/button'

export function NotFoundContent() {
  return (
    <section className="pt-[calc(var(--header-h)+clamp(64px,12vw,160px))] pb-(--section-y)">
      <div className="site-container">
        <p className="t-label">Error 404</p>
        <h1 className="t-h1 mt-[18px] max-w-[14ch]">
          This page drove off the course.
        </h1>
        <p className="t-lead mt-[22px] max-w-[48ch]">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/">
              Back to home <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/teams">Browse teams</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
