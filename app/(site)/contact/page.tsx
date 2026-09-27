import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { ArrowUpRight, MailIcon, PinIcon } from '@/components/icons'
import { SOCIAL_ICONS } from '@/components/site/SiteFooter'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSite } from '@/lib/content'
import styles from './page.module.css'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with VT CRO for general questions, sponsorship, and outreach.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const site = await getSite()
  const routes = [
    { label: 'General', email: site.contact.general },
    { label: 'Sponsorship', email: site.contact.sponsorship },
    { label: 'Outreach', email: site.contact.outreach },
  ].filter((r) => r.email)
  // Topics that share an inbox are listed together (e.g. while one address handles everything).
  const inboxes = [...new Set(routes.map((r) => r.email))].map((email) => ({
    email,
    label: routes.filter((r) => r.email === email).map((r) => r.label).join(' · '),
  }))

  return (
    <Section first background={{ src: '/seed/photo-splash-pcb.webp', width: 1992, height: 1328, alt: '', position: '60% 50%' }} className={styles.backdrop}>
      <SectionHeader as="h1" heading="Contact" />
      <div className={styles.grid}>
        <aside className={styles.aside}>
          <div className={styles.block} data-reveal>
            <h2 className={styles.blockTitle}>Email</h2>
            <ul className={styles.routes}>
              {inboxes.map((r) => (
                <li key={r.email}>
                  <a href={`mailto:${r.email}`} className={`card ${styles.route}`}>
                    <span className="icon-badge">
                      <MailIcon size={20} />
                    </span>
                    <span>
                      <span className={styles.routeLabel}>{r.label}</span>
                      <span className={styles.routeEmail}>{r.email}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {site.socials.length > 0 && (
            <div className={styles.block} data-reveal>
              <h2 className={styles.blockTitle}>Follow us</h2>
              <ul className={styles.socials}>
                {site.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform]
                  return (
                    <li key={s.platform}>
                      <a href={s.url} target="_blank" rel="noreferrer" className={`card ${styles.social}`}>
                        <span className="icon-badge icon-badge--mono">
                          <Icon size={18} />
                        </span>
                        <span>{s.label}</span>
                        <ArrowUpRight size={14} className={styles.ext} />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {site.contact.location && (
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Location</h2>
              <p className={`t-body ${styles.location}`}>
                <PinIcon size={16} /> <span style={{ whiteSpace: 'pre-line' }}>{site.contact.location}</span>
              </p>
            </div>
          )}
        </aside>

        <div className={`card ${styles.formCol}`} data-reveal>
          <h2 className="t-h3">Send a message</h2>
          <ContactForm topics={site.contact.topics.map((t) => t.label)} />
        </div>
      </div>
    </Section>
  )
}
