import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Icon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { StatusDot } from '@/components/ui/status-dot'
import type { HomeSection, Recruitment } from '@/lib/content'
import Image from 'next/image'

/** Closing call to action. Its state follows the "Applications open?" switch in the CMS. */
export function ApplyBanner({ recruitment: r, section }: { recruitment: Recruitment; section: HomeSection }) {
  const alt = r.alternatives.find((a) => a.url)
  return (
    <section className="relative isolate overflow-hidden bg-[#0a0a0b] py-[clamp(96px,14vw,200px)] text-center" aria-labelledby="apply-heading">
      {section.background && (
        <div className="absolute inset-0 -z-3 [filter:grayscale(1)]" aria-hidden="true">
          <Image src={section.background.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: section.background.position }} />
        </div>
      )}
      <div className="absolute inset-0 -z-2 bg-[rgb(10_10_11/0.8)]" aria-hidden="true" />
      <div className="site-container">
        <div className="mx-auto grid max-w-[880px] justify-items-center gap-6" data-reveal>
          <p className="inline-flex items-center gap-2.5 rounded-[999px] py-2 pr-4 pl-[13px] font-mono text-[0.72rem] tracking-[0.14em] text-[#fff] uppercase [box-shadow:0_0_0_1px_rgb(255_255_255/0.25)_inset]">
            <StatusDot on={r.open} />
            {r.open ? 'Applications open' : 'Applications closed'}
          </p>
          <h2 id="apply-heading" className="t-h1">
            {section.heading || (r.open ? r.openHeading : r.closedHeading)}
          </h2>
          {(section.intro || (r.open ? r.openMessage : r.closedMessage)) && (
            <p className="t-lead max-w-[54ch] whitespace-pre-line text-[rgb(255_255_255/0.75)]">{section.intro || (r.open ? r.openMessage : r.closedMessage)}</p>
          )}
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {r.open && r.applicationUrl ? (
              <Button asChild variant="light">
                <a href={r.applicationUrl} target="_blank" rel="noreferrer">
                  {r.buttonLabel} <ArrowUpRight size={16} />
                </a>
              </Button>
            ) : null}
            <Button asChild variant={r.open && r.applicationUrl ? 'secondary' : 'light'}>
              <Link href="/apply">
                How to join <ArrowRight size={16} />
              </Link>
            </Button>
            {!r.open && alt && (
              <Button asChild variant="secondary">
                <a href={alt.url} target="_blank" rel="noreferrer">
                  <Icon name={alt.icon || 'book'} size={16} className="icon-static" /> {alt.linkLabel || alt.title} <ArrowUpRight size={16} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
