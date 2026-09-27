import type { Metadata } from 'next'
import { ArrowRight, DownloadIcon, Icon, MailIcon } from '@/components/icons'
import { SponsorWall } from '@/components/sponsors/SponsorWall'
import { Section } from '@/components/ui/Section'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getSite, getSponsorGroups, getSponsorsPage } from '@/lib/content'
import styles from './page.module.css'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSponsorsPage()
  return {
    title: 'Sponsors',
    description: page.intro.startsWith('[Placeholder]') ? 'Sponsor VT CRO, the Competitive Robotics Organization at Virginia Tech.' : page.intro,
    alternates: { canonical: '/sponsors' },
  }
}

export default async function SponsorsPage() {
  const [page, groups, site] = await Promise.all([getSponsorsPage(), getSponsorGroups(), getSite()])
  const email = site.contact.sponsorship
  const mailto = `mailto:${email}?subject=${encodeURIComponent('Sponsoring VT CRO')}`

  const Packet = ({ block }: { block?: boolean }) =>
    page.packetUrl ? (
      <a href={page.packetUrl} target="_blank" rel="noreferrer" className={`btn btn--secondary ${block ? 'btn--block' : ''}`}>
        <DownloadIcon size={16} className="icon-static" /> {page.packetLabel}
      </a>
    ) : (
      <span className={`btn btn--secondary ${block ? 'btn--block' : ''}`} aria-disabled="true" title="Upload the packet in the CMS: Sponsors → Sponsors page text">
        <DownloadIcon size={16} className="icon-static" /> Sponsorship packet · coming soon
      </span>
    )

  return (
    <>
      <Section first tone="light" background={{ src: '/seed/photo-vt-campus.webp', width: 2027, height: 1344, alt: '', position: '50% 60%' }} labelledBy="sponsor-heading">
        <SectionHeader
          as="h1"
          heading={page.heading || 'Sponsor VT CRO'}
          intro={page.intro}
          id="sponsor-heading"
          action={
            <div className="btn-row">
              {email && (
                <a href={mailto} className="btn btn--primary">
                  <MailIcon size={16} className="icon-static" /> Contact us
                </a>
              )}
              <Packet />
            </div>
          }
        />
        {page.reasons.length > 0 && (
          <ul className={styles.reasons}>
            {page.reasons.map((r, i) => (
              <li key={i} className={`card ${styles.reason}`} data-reveal style={{ ['--reveal-i' as string]: i }}>
                <span className="icon-badge">
                  <Icon name={r.icon} size={24} />
                </span>
                <h2 className="t-h3">{r.title}</h2>
                {r.body && <p className="t-body">{r.body}</p>}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {groups.length > 0 && (
        <Section labelledBy="current">
          <SectionHeader heading="Thank you to our sponsors" id="current" />
          <SponsorWall groups={groups} />
        </Section>
      )}

      <section className={styles.cta} aria-labelledby="cta">
        <div className="container">
          <div className={styles.ctaInner} data-reveal>
            <h2 id="cta" className="t-h1">
              {page.ctaHeading || 'Start a conversation'}
            </h2>
            {page.ctaBody && <p className="t-lead">{page.ctaBody}</p>}
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              {email && (
                <a href={mailto} className="btn btn--light">
                  Email {email} <ArrowRight size={16} />
                </a>
              )}
              <Packet />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
