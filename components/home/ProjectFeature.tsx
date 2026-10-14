import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Icon, TrophyIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { IconBadge } from '@/components/ui/icon-badge'
import { Media } from '@/components/ui/Media'
import { Section } from '@/components/ui/Section'
import { StatusDot } from '@/components/ui/status-dot'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import type { HomeSection, Project } from '@/lib/content'
import { isExternal } from '@/lib/format'

export function ProjectFeature({ project, section }: { project: Project; section: HomeSection }) {
  return (
    <Section id={`project-${project.slug}`} tone={section.tone ?? 'light'} background={section.background} labelledBy={`project-${project.slug}-h`}>
      <div className="grid gap-10 min-[1100px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] min-[1100px]:items-center min-[1100px]:gap-16">
        <div className="relative [&>*]:relative [&>*]:rounded-(--radius-l) [&>*]:[box-shadow:var(--shadow-2)]" data-reveal>
          {project.videoUrl ? (
            <VideoEmbed url={project.videoUrl} poster={project.image} title={`Introducing ${project.name}`} />
          ) : (
            <div className="relative aspect-[16/10] overflow-hidden rounded-(--radius-l)">
              <Media img={project.image} placeholder={`${project.name} · image`} sizes="(min-width: 1100px) 58vw, 100vw" />
            </div>
          )}
        </div>

        <div className="grid content-start gap-5" data-reveal style={{ ['--reveal-i' as string]: 1 }}>
          <div className="flex gap-2">{project.label && <Badge>{project.label}</Badge>}</div>
          <div className="flex items-center gap-[18px]">
            {project.logo && (
              <Image src={project.logo.src} alt="" width={120} height={120} sizes="64px" className="size-16 flex-none rounded-[50%] [box-shadow:var(--shadow-1)]" />
            )}
            <h2 id={`project-${project.slug}-h`} className="t-h2">
              {section.heading || project.name}
            </h2>
          </div>
          {project.status && (
            <p className="inline-flex w-fit items-center gap-2.5 rounded-[999px] py-2 pr-4 pl-[13px] text-[0.875rem] font-medium [box-shadow:0_0_0_1px_var(--line-3)_inset]">
              <StatusDot on />
              {project.status}
            </p>
          )}
          {project.summary && <p className="t-lead">{project.summary}</p>}

          {(project.highlights.length > 0 || project.awards.length > 0) && (
            <ul className="grid border-t border-line [&_strong]:block [&_strong]:font-medium">
              {project.awards.map((a) => (
                <li key={a.id} className="flex items-center gap-4 border-b border-line py-3.5 text-[0.9375rem]">
                  <IconBadge className="[--size:38px]">
                    <TrophyIcon size={18} />
                  </IconBadge>
                  <span>
                    <strong>{[a.placement, a.title].filter(Boolean).join(' · ')}</strong>
                    <span className="mt-0.5 block text-[0.8125rem] text-fg-3">
                      {a.competition} {a.year}
                    </span>
                  </span>
                </li>
              ))}
              {project.highlights
                .filter((h) => h !== project.status)
                .map((h) => (
                  <li key={h} className="flex items-center gap-4 border-b border-line py-3.5 text-[0.9375rem]">
                    <IconBadge className="[--size:38px]">
                      <Icon name="spark" size={18} />
                    </IconBadge>
                    <span>
                      <strong>{h}</strong>
                    </span>
                  </li>
                ))}
            </ul>
          )}

          {project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((l, i) => (
                <Button key={l.href} asChild variant={i ? 'secondary' : 'primary'}>
                  {isExternal(l.href) ? (
                    <a href={l.href} target="_blank" rel="noreferrer">
                      {l.label} <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link href={l.href}>
                      {l.label} <ArrowRight size={16} />
                    </Link>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}
