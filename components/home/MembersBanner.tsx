import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { Button } from '@/components/ui/button'
import type { HomeSection } from '@/lib/content'

/** Full-width photo with the VT CRO logo and a link to the Team page. */
export function MembersBanner({ section }: { section: HomeSection }) {
  return (
    <section
      className="relative isolate grid min-h-[clamp(420px,70vh,720px)] place-items-center overflow-hidden bg-[#0a0a0b] px-(--gutter) py-(--section-y) before:absolute before:inset-0 before:-z-1 before:bg-[rgb(10_10_11/0.45)] before:content-['']"
      aria-label="Our members"
    >
      {section.background && (
        <div className="absolute inset-0 -z-2" aria-hidden="true">
          <Image src={section.background.src} alt="" fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: section.background.position }} />
        </div>
      )}
      <div className="grid justify-items-center gap-[clamp(28px,4vw,44px)]" data-reveal>
        <Image
          src="/brand/logo-full-white.png"
          alt="VT CRO"
          width={1833}
          height={444}
          sizes="(min-width: 900px) 520px, 72vw"
          className="h-auto w-[min(72vw,520px)] [filter:drop-shadow(0_2px_6px_rgb(0_0_0/0.45))_drop-shadow(0_14px_36px_rgb(0_0_0/0.5))]"
        />
        <Button asChild variant="light">
          <Link href="/team">
            {section.label || 'View members'} <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </section>
  )
}
