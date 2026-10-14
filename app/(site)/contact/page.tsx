import type { Metadata } from 'next'
import { ContactForm } from '@/components/ContactForm'
import { ArrowUpRight, MailIcon, PinIcon } from '@/components/icons'
import { SOCIAL_ICONS } from '@/components/site/SiteFooter'
import { Card } from '@/components/ui/card'
import { IconBadge } from '@/components/ui/icon-badge'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSite } from '@/lib/content'

export const revalidate = false

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact VT CRO, the Competitive Robotics Organization at Virginia Tech, about joining, sponsorship, outreach and events in Blacksburg, Virginia.',
  alternates: { canonical: '/contact' },
}

// Email and social links lift slightly on hover.
const linkCard =
  'flex items-center gap-3.5 py-3.5 pr-4 pl-3.5 [transition:transform_var(--dur-2)_var(--ease-spring),box-shadow_var(--dur-2)_var(--ease)] hoverable:hover:[transform:translateY(-3px)] hoverable:hover:[box-shadow:0_0_0_1px_rgb(255_255_255/0.135)_inset,0_20px_44px_-22px_rgb(0_0_0/0.45)]'

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
    <Section
      first
      background={{ src: '/seed/photo-splash-pcb.webp', width: 1992, height: 1328, alt: '', position: '60% 50%' }}
      className="min-h-svh before:[background:linear-gradient(to_bottom,rgb(10_10_11/0.72),rgb(10_10_11/0.8)_60%,rgb(10_10_11/0.92))]!"
    >
      <SectionHeader as="h1" heading="Contact" />
      <div className="grid gap-12 min-[1000px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[1000px]:gap-16">
        <aside className="grid content-start gap-9">
          <div className="grid gap-3.5" data-reveal>
            <h2 className={blockTitle}>Email</h2>
            <ul className="grid gap-2.5">
              {inboxes.map((r) => (
                <li key={r.email}>
                  <Card asChild className={linkCard}>
                    <a href={`mailto:${r.email}`}>
                      <IconBadge className="[--size:42px]">
                        <MailIcon size={20} />
                      </IconBadge>
                      <span className="grid min-w-0 gap-0.5">
                        <span className="text-[0.8125rem] text-fg-3">{r.label}</span>
                        <span className="font-semibold break-all">{r.email}</span>
                      </span>
                    </a>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
          {site.socials.length > 0 && (
            <div className="grid gap-3.5" data-reveal>
              <h2 className={blockTitle}>Follow us</h2>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-2.5">
                {site.socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.platform]
                  return (
                    <li key={s.platform}>
                      <Card asChild className={`${linkCard} font-semibold`}>
                        <a href={s.url} target="_blank" rel="noreferrer">
                          <IconBadge className="[--size:42px]">
                            <Icon size={18} />
                          </IconBadge>
                          <span className="flex-1">{s.label}</span>
                          <ArrowUpRight size={14} className="text-fg-3" />
                        </a>
                      </Card>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
          {site.contact.location && (
            <div className="grid gap-3.5">
              <h2 className={blockTitle}>Location</h2>
              <p className="t-body flex items-start gap-2">
                <PinIcon size={16} /> <span className="whitespace-pre-line">{site.contact.location}</span>
              </p>
            </div>
          )}
        </aside>

        <Card className="grid content-start gap-6 p-[clamp(24px,4vw,44px)]" data-reveal>
          <h2 className="t-h3">Send a message</h2>
          <ContactForm topics={site.contact.topics.map((t) => t.label)} />
        </Card>
      </div>
    </Section>
  )
}

const blockTitle = 'text-[1.125rem] font-medium tracking-[-0.02em]'
