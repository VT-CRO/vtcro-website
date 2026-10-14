import { BuildingIcon, TargetIcon, UsersIcon } from '@/components/icons'
import { Section } from '@/components/ui/Section'
import type { Home, HomeSection } from '@/lib/content'

export function About({ about, section }: { about: Home['about']; section: HomeSection }) {
  const items = [
    { label: 'Our mission', text: about.mission, Icon: TargetIcon },
    { label: 'What we are', text: about.whatWeAre, Icon: BuildingIcon },
    { label: 'What we believe in', text: about.beliefs, Icon: UsersIcon },
  ].filter((i) => i.text)

  // Compact enough that the whole About section fits in one screen, on laptops and phones alike.
  return (
    <Section id="about" tone={section.tone ?? 'light'} background={section.background} labelledBy="about-heading" className="py-[clamp(64px,8vw,112px)]">
      <div className="grid gap-7 min-[1000px]:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] min-[1000px]:gap-16">
        <h2 id="about-heading" className="t-h2 min-[1000px]:sticky min-[1000px]:top-[calc(var(--header-h)+40px)] min-[1000px]:self-start" data-reveal>
          {section.heading || 'About'}
        </h2>
        <dl className="grid">
          {items.map(({ label, text, Icon }) => (
            <div
              key={label}
              className="grid gap-2.5 border-t border-line-2 py-[clamp(18px,2.4vw,28px)] last:pb-0 min-[1000px]:first:border-t-0 min-[1000px]:first:pt-2"
              data-reveal
            >
              <dt className="flex items-center gap-2.5 text-fg-3">
                <Icon size={18} />
                <span className="t-label">{label}</span>
              </dt>
              <dd className="t-statement max-w-[44ch] text-[clamp(1.2rem,1rem+0.9vw,1.75rem)] leading-[1.28]">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
