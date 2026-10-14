import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Media } from '@/components/ui/Media'
import type { Home, SponsorGroup } from '@/lib/content'
import { HeroVideo } from './HeroVideo'

type Props = { hero: Home['hero']; sponsors: SponsorGroup[]; applicationsOpen: boolean }

// Buttons over the photo: solid white, or a frosted outline.
const lightButton = 'bg-[#fff] text-[#0a0a0b]'
const outlineButton =
  'border-[rgb(255_255_255/0.4)] bg-[rgb(255_255_255/0.04)] text-[#fff] [-webkit-backdrop-filter:blur(6px)] [backdrop-filter:blur(6px)] hover:border-[#fff]'

/** Opening screen: the VT CRO logo, large and centered, with sponsor logos beneath it. */
export function Hero({ hero, sponsors, applicationsOpen }: Props) {
  const groups = hero.showSponsors ? sponsors.slice(0, 2) : []
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden pt-(--header-h) pb-[clamp(32px,5vh,56px)]">
      <div className="absolute inset-0 -z-1" aria-hidden="true">
        <Media img={hero.image} placeholder="Homepage background photo" sizes="100vw" preload className="animate-settle [filter:grayscale(1)]" />
        {hero.videoUrl && <HeroVideo src={hero.videoUrl} className="absolute inset-0 size-full object-cover [filter:grayscale(1)]" />}
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgb(10_10_11/0.55),rgb(10_10_11/0.8)_100%),linear-gradient(to_bottom,rgb(10_10_11/0.5),rgb(10_10_11/0.2)_40%,rgb(10_10_11/0.85)_88%,var(--bg))]" />
      </div>

      <div className="site-container grid flex-[1.25] content-end justify-items-center gap-6 pt-[clamp(32px,6vh,72px)] text-center">
        <h1 className="m-0 w-[min(84vw,720px)] animate-[fade_1.2s_var(--ease)_0.1s_both]">
          <Image
            src="/brand/logo-full-white.png"
            alt="VT CRO"
            width={1833}
            height={444}
            sizes="(min-width: 1100px) 720px, 84vw"
            preload
            className="h-auto w-full [filter:drop-shadow(0_2px_6px_rgb(0_0_0/0.5))_drop-shadow(0_14px_40px_rgb(0_0_0/0.55))]"
          />
        </h1>
        {hero.eyebrow && (
          <p className="animate-[fade_1.2s_var(--ease)_0.4s_both] font-mono text-[clamp(0.62rem,0.58rem+0.25vw,0.76rem)] tracking-[0.26em] text-[rgb(255_255_255/0.72)] uppercase">
            {hero.eyebrow}
          </p>
        )}
      </div>

      {/* Buttons sit midway between the organization name and the sponsors. */}
      <div className="site-container grid flex-1 place-items-center py-[clamp(28px,5vh,56px)]">
        <nav className="flex animate-[fade_1.2s_var(--ease)_0.55s_both] flex-wrap justify-center gap-2.5" aria-label="Get started">
          {/* Apply only appears while applications are open (Recruitment / Apply in the CMS). */}
          {applicationsOpen && (
            <Button asChild variant="light" className={lightButton}>
              <Link href="/apply">Apply</Link>
            </Button>
          )}
          <Button asChild variant={applicationsOpen ? 'secondary' : 'light'} className={applicationsOpen ? outlineButton : lightButton}>
            <a href="#design-teams">Teams</a>
          </Button>
          <Button asChild variant="secondary" className={outlineButton}>
            <Link href="/team">Members</Link>
          </Button>
        </nav>
      </div>

      {/* Sponsors: two quiet columns of logos */}
      {groups.length > 0 && (
        <div className="site-container animate-[fade_1.2s_var(--ease)_0.7s_both]">
          <div
            className="grid gap-8 min-[900px]:data-[count=2]:grid-cols-[1fr_1fr] min-[900px]:data-[count=2]:gap-12 min-[900px]:data-[count=2]:[&>*+*]:border-l min-[900px]:data-[count=2]:[&>*+*]:border-l-[rgb(255_255_255/0.14)]"
            data-count={groups.length}
          >
            {groups.map((g) => (
              <div key={g.id} className="grid content-start justify-items-center gap-[18px]">
                <p className="font-mono text-[0.66rem] tracking-[0.2em] text-[rgb(255_255_255/0.55)] uppercase">{g.name}</p>
                <ul className="flex flex-col items-center gap-4">
                  {g.sponsors.map((s) => {
                    const logo = s.logoOnDark ?? s.logo
                    const inner = logo ? (
                      <Image
                        src={logo.src}
                        alt={s.name}
                        width={logo.width}
                        height={logo.height}
                        sizes="200px"
                        className="h-7 w-auto max-w-[220px] object-contain min-[900px]:h-8"
                      />
                    ) : (
                      <span className="text-[0.875rem] font-medium tracking-[0.02em] text-[rgb(255_255_255/0.7)]">{s.name}</span>
                    )
                    const linkClass = 'inline-flex items-center opacity-92 [transition:opacity_var(--dur-2)_var(--ease)]'
                    return (
                      <li key={s.id}>
                        {s.url ? (
                          <a href={s.url} target="_blank" rel="noreferrer" className={`${linkClass} hover:opacity-100`}>
                            {inner}
                          </a>
                        ) : (
                          <span className={linkClass}>{inner}</span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
