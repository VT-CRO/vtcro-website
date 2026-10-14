import Image from 'next/image'
import type { SponsorGroup } from '@/lib/content'
import { cn } from '@/lib/utils'

/** Sponsor logos, one column per category, in their own colors. The white "dark background" version is used when one is uploaded. */
export function SponsorWall({ groups }: { groups: SponsorGroup[] }) {
  return (
    <div
      className="grid gap-12 min-[900px]:data-[count=2]:grid-cols-[1fr_1fr] min-[900px]:data-[count=2]:gap-16 min-[900px]:data-[count=2]:[&>section+section]:border-l min-[900px]:data-[count=2]:[&>section+section]:border-l-line min-[900px]:data-[count=2]:[&>section+section]:pl-16"
      data-count={groups.length}
    >
      {groups.map((g) => (
        <section key={g.id} className="grid content-start gap-6" aria-label={g.name} data-reveal>
          <h3 className="t-label">{g.name}</h3>
          <ul className="flex flex-col items-start gap-[22px]">
            {g.sponsors.map((s) => {
              const logo = s.logoOnDark ?? s.logo
              const inner = logo ? (
                <Image
                  src={logo.src}
                  alt={s.name}
                  width={logo.width}
                  height={logo.height}
                  sizes="220px"
                  className={cn('h-[34px] w-auto max-w-[240px] object-contain', s.logoOnDark && 'in-[.theme-light]:[filter:brightness(0)]')}
                />
              ) : (
                <span className="text-[0.9375rem] font-medium text-fg-2">{s.name}</span>
              )
              const linkClass = 'inline-flex items-center opacity-92 [transition:opacity_var(--dur-2)_var(--ease)]'
              return (
                <li key={s.id}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer" className={`${linkClass} hover:opacity-100`} title={s.description || s.name}>
                      {inner}
                    </a>
                  ) : (
                    <span className={linkClass}>{inner}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
