import { BuildingIcon, TargetIcon, UsersIcon } from '@/components/icons'
import { Section } from '@/components/ui/Section'
import type { Home, HomeSection } from '@/lib/content'
import styles from './About.module.css'

export function About({ about, section }: { about: Home['about']; section: HomeSection }) {
  const items = [
    { label: 'Our mission', text: about.mission, Icon: TargetIcon },
    { label: 'What we are', text: about.whatWeAre, Icon: BuildingIcon },
    { label: 'What we believe in', text: about.beliefs, Icon: UsersIcon },
  ].filter((i) => i.text)

  return (
    <Section id="about" tone={section.tone ?? 'light'} background={section.background} labelledBy="about-heading">
      <div className={styles.grid}>
        <h2 id="about-heading" className={`t-h2 ${styles.heading}`} data-reveal>
          {section.heading || 'About'}
        </h2>
        <dl className={styles.items}>
          {items.map(({ label, text, Icon }) => (
            <div key={label} className={styles.item} data-reveal>
              <dt>
                <Icon size={18} />
                <span className="t-label">{label}</span>
              </dt>
              <dd className="t-statement">{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
