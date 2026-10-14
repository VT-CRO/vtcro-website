import { SparkIcon } from '@/components/icons'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { HomeSection, Principle } from '@/lib/content'

export function Principles({ principles, section }: { principles: Principle[]; section: HomeSection }) {
  return (
    <Section id="principles" tone={section.tone} background={section.background} labelledBy="principles-heading">
      <SectionHeader heading={section.heading || 'Core Principles'} intro={section.intro} id="principles-heading" center />
      <ul className="grid min-[860px]:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] min-[860px]:[&>li+li]:border-l min-[860px]:[&>li+li]:border-l-line">
        {principles.map((p) => (
          <li
            key={p.name}
            className="grid justify-items-center gap-3.5 border-t border-line px-4 py-10 text-center first:border-t-0 min-[860px]:border-t-0 min-[860px]:px-8 min-[860px]:py-3"
            data-reveal
          >
            <span className="mb-1.5 grid size-16 place-items-center rounded-[50%] [box-shadow:0_0_0_1px_var(--line-2)_inset] [&_img]:size-[30px] [&_img]:object-contain in-[.theme-light]:[&_img]:[filter:invert(1)]">
              {p.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.icon.src.split('?')[0]} alt="" width={36} height={36} />
              ) : (
                <SparkIcon size={28} />
              )}
            </span>
            <h3 className="text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-[1.1] font-medium tracking-[-0.025em]">{p.name}</h3>
            {p.statement && <p className="text-fg-2">{p.statement}</p>}
          </li>
        ))}
      </ul>
    </Section>
  )
}
