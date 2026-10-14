import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from '@/components/icons'
import { Media } from '@/components/ui/Media'
import type { TeamSummary } from '@/lib/content'

/** Team tile. Every tile in a grid is the same size; the whole tile is one link. */
export function TeamCard({ team, headingLevel: H = 'h3' }: { team: TeamSummary; index?: number; headingLevel?: 'h2' | 'h3' }) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className={[
        'group/card flex h-full flex-col overflow-hidden rounded-(--radius-l) bg-surface-2 [box-shadow:0_0_0_1px_var(--line)_inset,var(--shadow-1)] [transition:transform_var(--dur-3)_var(--ease),box-shadow_var(--dur-3)_var(--ease)]',
        'hoverable:hover:[transform:translateY(-3px)] hoverable:hover:[box-shadow:0_0_0_1px_var(--line-2)_inset,var(--shadow-2)]',
      ].join(' ')}
      data-reveal
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-3">
        <Media
          img={team.cover}
          placeholder={`${team.name} · cover photo`}
          sizes="(min-width: 1000px) 30vw, (min-width: 600px) 46vw, 92vw"
          className="[transition:transform_1200ms_var(--ease)] hoverable:group-hover/card:[transform:scale(1.03)]"
        />
      </div>
      <div className="grid flex-1 grid-rows-[auto_1fr_auto] gap-3 px-6 pt-[22px] pb-6">
        <div className="flex items-center gap-3">
          {team.logo && <Image src={team.logo.src} alt="" width={96} height={96} sizes="36px" className="size-9 flex-none rounded-[50%]" />}
          <H className="flex-1 text-[1.35rem] leading-[1.2] font-medium tracking-[-0.02em]">{team.name}</H>
          {team.code && <span className="font-mono text-[0.68rem] tracking-[0.14em] text-fg-3">{team.code}</span>}
        </div>
        {team.shortDescription && <p className="line-clamp-3 text-[0.9375rem] leading-[1.6] text-fg-2">{team.shortDescription}</p>}
        <span className="mt-1.5 inline-flex items-center gap-2 text-[0.875rem] font-medium text-fg [&_svg]:[transition:transform_var(--dur-2)_var(--ease)] hoverable:group-hover/card:[&_svg]:[transform:translateX(3px)]">
          Learn more <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}
