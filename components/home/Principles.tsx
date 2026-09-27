import { SparkIcon } from '@/components/icons'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { HomeSection, Principle } from '@/lib/content'
import styles from './Principles.module.css'

export function Principles({ principles, section }: { principles: Principle[]; section: HomeSection }) {
  return (
    <Section id="principles" tone={section.tone} background={section.background} labelledBy="principles-heading">
      <SectionHeader heading={section.heading || 'Core Principles'} intro={section.intro} id="principles-heading" center />
      <ul className={styles.list}>
        {principles.map((p) => (
          <li key={p.name} className={styles.item} data-reveal>
            <span className={styles.icon}>
              {p.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.icon.src.split('?')[0]} alt="" width={36} height={36} />
              ) : (
                <SparkIcon size={28} />
              )}
            </span>
            <h3 className={styles.name}>{p.name}</h3>
            {p.statement && <p className={styles.statement}>{p.statement}</p>}
          </li>
        ))}
      </ul>
    </Section>
  )
}
