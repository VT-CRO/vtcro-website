import Link from 'next/link'
import { ArrowUpRight, TrophyIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import type { Award } from '@/lib/content'
import { ShowMore } from './ShowMore'

type Props = {
  awards: Award[]
  /** Off on team pages (the team is implied). */
  showTeam?: boolean
  /** Homepage: show only the most recent (4 on phones, 6 on larger screens); the rest open with "Show all awards". */
  collapse?: boolean
}

/** Awards as a compact grid of tiles, most recent first. */
export function AwardLedger({ awards, showTeam = true, collapse }: Props) {
  const list = (
    <ul className="grid gap-3 min-[700px]:grid-cols-2 min-[700px]:gap-4 min-[1080px]:grid-cols-3">
      {awards.map((a) => {
        const tag = a.team ? a.team.code || a.team.name : a.projectCode || a.projectName
        return (
          <li
            key={a.id}
            className="grid grid-cols-[18px_minmax(0,1fr)] gap-3.5 rounded-(--radius-m) px-[18px] pt-[18px] pb-4 [box-shadow:0_0_0_1px_var(--line-2)_inset] min-[700px]:px-[22px] min-[700px]:pt-[22px] min-[700px]:pb-5"
            data-reveal
          >
            <TrophyIcon size={18} className="mt-[3px] text-fg-3" aria-hidden="true" />
            <div className="flex min-w-0 flex-col gap-1.5">
              <h3 className="text-[1.0625rem] leading-[1.35] font-medium tracking-[-0.01em] wrap-anywhere [&_a_svg]:inline [&_a_svg]:align-[-1px]">
                {a.placement && (
                  <span className="mr-2 font-semibold after:ml-2 after:font-normal after:text-fg-3 after:content-['·']">{a.placement}</span>
                )}
                {a.url ? (
                  <a href={a.url} target="_blank" rel="noreferrer">
                    {a.title} <ArrowUpRight size={13} />
                  </a>
                ) : (
                  a.title
                )}
              </h3>
              <p className="text-[0.875rem] leading-[1.45] text-fg-3">
                {a.competition}
                {a.location && <span> · {a.location}</span>}
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                {showTeam && tag ? (
                  a.team ? (
                    <Badge asChild>
                      <Link href={`/teams/${a.team.slug}`}>{tag}</Link>
                    </Badge>
                  ) : (
                    <Badge>{tag}</Badge>
                  )
                ) : (
                  <span />
                )}
                <span className="font-mono text-[0.8rem] text-fg-3 tabular-nums">{a.year}</span>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )

  if (!collapse || awards.length <= 4) return list
  return (
    <ShowMore more={`Show all ${awards.length} awards`} less="Show fewer" desktopNeeded={awards.length > 6}>
      {list}
    </ShowMore>
  )
}
