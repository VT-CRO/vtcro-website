import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Icon, RibbonIcon, TrophyIcon } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import { Section } from '@/components/ui/Section'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import type { HomeSection, Project } from '@/lib/content'
import { isExternal } from '@/lib/format'
import styles from './ProjectFeature.module.css'

export function ProjectFeature({ project, section }: { project: Project; section: HomeSection }) {
  return (
    <Section id={`project-${project.slug}`} tone={section.tone ?? 'light'} background={section.background} labelledBy={`project-${project.slug}-h`}>
      <div className={styles.grid}>
        <div className={styles.media} data-reveal>
          {project.videoUrl ? (
            <VideoEmbed url={project.videoUrl} poster={project.image} title={`Introducing ${project.name}`} />
          ) : (
            <div className={styles.imageFrame}>
              <Media img={project.image} placeholder={`${project.name} · image`} sizes="(min-width: 1100px) 58vw, 100vw" />
            </div>
          )}
        </div>

        <div className={styles.copy} data-reveal style={{ ['--reveal-i' as string]: 1 }}>
          <div className={styles.chips}>
            {project.label && <span className="chip">{project.label}</span>}
          </div>
          <div className={styles.titleRow}>
            {project.logo && <Image src={project.logo.src} alt="" width={120} height={120} sizes="64px" className={styles.logo} />}
            <h2 id={`project-${project.slug}-h`} className="t-h2">
              {section.heading || project.name}
            </h2>
          </div>
          {project.status && (
            <p className={styles.status}>
              <span className="status-dot status-dot--on" aria-hidden="true" />
              {project.status}
            </p>
          )}
          {project.summary && <p className="t-lead">{project.summary}</p>}

          {(project.highlights.length > 0 || project.awards.length > 0) && (
            <ul className={styles.facts}>
              {project.awards.map((a) => (
                <li key={a.id}>
                  <span className="icon-badge">{a.rank === 1 ? <TrophyIcon size={18} /> : <RibbonIcon size={18} />}</span>
                  <span>
                    <strong>{[a.placement, a.title].filter(Boolean).join(' · ')}</strong>
                    <span className={styles.factSub}>
                      {a.competition} {a.year}
                    </span>
                  </span>
                </li>
              ))}
              {project.highlights
                .filter((h) => h !== project.status)
                .map((h) => (
                  <li key={h}>
                    <span className="icon-badge">
                      <Icon name="spark" size={18} />
                    </span>
                    <span>
                      <strong>{h}</strong>
                    </span>
                  </li>
                ))}
            </ul>
          )}

          {project.links.length > 0 && (
            <div className="btn-row">
              {project.links.map((l, i) =>
                isExternal(l.href) ? (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className={`btn ${i ? 'btn--secondary' : 'btn--primary'}`}>
                    {l.label} <ArrowRight size={16} />
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} className={`btn ${i ? 'btn--secondary' : 'btn--primary'}`}>
                    {l.label} <ArrowRight size={16} />
                  </Link>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
