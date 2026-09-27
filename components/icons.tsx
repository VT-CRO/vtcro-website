import type { ReactNode, SVGProps } from 'react'

/**
 * Icon set. Brand marks (GitHub, Instagram, YouTube, Discord) use paths from Simple Icons (CC0).
 * UI icons are drawn on a 24px grid with 1.5px strokes.
 */

type P = SVGProps<SVGSVGElement> & { size?: number }

const brand = (d: string) =>
  function BrandIcon({ size = 18, ...props }: P) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
        <path d={d} />
      </svg>
    )
  }

export const GitHubIcon = brand('M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12')
export const InstagramIcon = brand('M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077')
export const YouTubeIcon = brand('M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z')
export const DiscordIcon = brand('M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z')
export const LinkedInIcon = brand('M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z')

const stroke = (children: ReactNode) =>
  function StrokeIcon({ size = 18, ...props }: P) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        {children}
      </svg>
    )
  }

export const ArrowRight = stroke(<path d="M4 12h15m-6-6 6 6-6 6" />)
export const ArrowLeft = stroke(<path d="M20 12H5m6-6-6 6 6 6" />)
export const ArrowUpRight = stroke(<path d="M7 17 17 7M9 7h8v8" />)
export const CloseIcon = stroke(<path d="M6 6l12 12M18 6 6 18" />)
export const PlayIcon = stroke(<path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" />)
export const MailIcon = stroke(<><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m3.5 6 8.5 7 8.5-7" /></>)
export const CalendarIcon = stroke(<><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></>)
export const PinIcon = stroke(<><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>)
export const DownloadIcon = stroke(<path d="M12 4v11m-5-5 5 5 5-5M5 20h14" />)
export const ChevronDown = stroke(<path d="m6 9 6 6 6-6" />)
export const PlusIcon = stroke(<path d="M12 5v14M5 12h14" />)
export const GlobeIcon = stroke(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z" /></>)
export const DocIcon = stroke(<><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>)
export const ClockIcon = stroke(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>)
export const CheckIcon = stroke(<path d="m5 12.5 4.5 4.5L19 7.5" />)

/* ───────── Named icons (selectable in the CMS) ───────── */

export const TrophyIcon = stroke(<><path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 13v4M8.5 20h7M9.5 17h5v3h-5z" /></>)
export const MedalIcon = stroke(<><circle cx="12" cy="15" r="5" /><path d="M9 10.7 6 3h4l2 5M15 10.7 18 3h-4l-2 5M12 13v4" /></>)
export const RibbonIcon = stroke(<><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.3-1.8 7.2L12 18l5.3 2.5-1.8-7.2" /><path d="m12 6.6.8 1.6 1.7.2-1.3 1.2.3 1.7-1.5-.8-1.5.8.3-1.7-1.3-1.2 1.7-.2z" fill="currentColor" stroke="none" /></>)
export const UsersIcon = stroke(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.2a6.5 6.5 0 0 1 3 5.8" /></>)
export const UserIcon = stroke(<><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>)
export const GraduationIcon = stroke(<><path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" /><path d="M6 11.3V16c0 1.6 2.7 3 6 3s6-1.4 6-3v-4.7M22 9.5V15" /></>)
export const MegaphoneIcon = stroke(<><path d="M3 10v4h3l8 4.5V5.5L6 10H3Z" /><path d="M17.5 9a4 4 0 0 1 0 6M6.5 14l1.5 5.5h2.5" /></>)
export const WrenchIcon = stroke(<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-2 2-1.5-1.5a4 4 0 0 1-5-5L4 17l3 3 8.5-8.5" />)
export const CpuIcon = stroke(<><rect x="6" y="6" width="12" height="12" rx="1.5" /><rect x="9.5" y="9.5" width="5" height="5" /><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" /></>)
export const RocketIcon = stroke(<><path d="M12 15c-1.5-1.5-3-3-3-3 1.5-6 5.5-9.5 12-9.5 0 6.5-3.5 10.5-9.5 12Z" /><path d="M9 12H5l2.5-4H12M12 15v4l4-2.5V12" /><circle cx="15.5" cy="8.5" r="1.3" /><path d="M5.5 16.5C4 18 4 20 4 20s2 0 3.5-1.5" /></>)
export const HandshakeIcon = stroke(<><path d="m2 12 3-3 4 1 3-3 4 1 3-1 3 3" /><path d="m5 9 1 6 3 3M8.5 15.5l2.5 2.5M11 13l3 3M13 11l3.5 3.5M19 8l-2 7" /></>)
export const BookIcon = stroke(<><path d="M12 6.5C10 5 7 4.5 3 5v13c4-.5 7 0 9 1.5 2-1.5 5-2 9-1.5V5c-4-.5-7 0-9 1.5Z" /><path d="M12 6.5v13" /></>)
export const TargetIcon = stroke(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.2" fill="currentColor" /></>)
export const LayersIcon = stroke(<><path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" /><path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" /></>)
export const ShieldIcon = stroke(<><path d="M12 3 4.5 6v5.5c0 4.6 3.1 8 7.5 9.5 4.4-1.5 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m8.8 12 2.2 2.2 4.2-4.4" /></>)
export const FeatherIcon = stroke(<><path d="M20 4c-6 0-12 3.5-13.5 13L5 20" /><path d="M20 4c0 7-4 12.5-11 13.5M9.5 10.5h6M8 14h5" /></>)
export const CompassIcon = stroke(<><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" /></>)
export const BulbIcon = stroke(<><path d="M9 17.5h6M10 21h4M8.5 14.5C7 13.3 6 11.6 6 9.5a6 6 0 1 1 12 0c0 2.1-1 3.8-2.5 5L15 17.5H9l-.5-3Z" /></>)
export const FlagIcon = stroke(<><path d="M5 21V4" /><path d="M5 4.5c4-2 7 2 11 0v8c-4 2-7-2-11 0" /></>)
export const StarIcon = stroke(<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.5Z" />)
export const ClipboardIcon = stroke(<><rect x="5" y="4.5" width="14" height="16.5" rx="1.5" /><path d="M9 4.5V3h6v1.5M8.5 10h7M8.5 13.5h7M8.5 17h4" /></>)
export const ChatIcon = stroke(<><path d="M4 5h11v8H9l-4 3.5V13H4z" /><path d="M15 9h5v8h-1v3l-3.5-3H11v-4" /></>)
export const EnvelopeOpenIcon = stroke(<><path d="M3 10v10h18V10L12 3.5 3 10Z" /><path d="m3 10 9 6 9-6M7 7.5V4h10v3.5" /></>)
export const HomeIcon = stroke(<><path d="m3.5 11 8.5-7 8.5 7" /><path d="M5.5 9.5V20h13V9.5M10 20v-5.5h4V20" /></>)
export const ImageIcon = stroke(<><rect x="3" y="4.5" width="18" height="15" rx="1.5" /><circle cx="8.5" cy="9.5" r="1.8" /><path d="m3 17 5-5 4 4 3-3 6 6" /></>)
export const BuildingIcon = stroke(<><path d="M4 21V5l8-2v18M12 8h8v13M2.5 21h19" /><path d="M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2" /></>)
export const CodeIcon = stroke(<path d="m8 7-5 5 5 5M16 7l5 5-5 5M13.5 4.5l-3 15" />)
export const SparkIcon = stroke(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />)
export const GearIcon = stroke(<><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" /><circle cx="12" cy="12" r="6.5" /></>)
export const BoltIcon = stroke(<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6l1-8Z" />)
export const HeartIcon = stroke(<path d="M12 20s-7.5-4.6-9-9.5C2 7 4.3 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.9 1.2-1.8 2.8-2.9 4.8-2.9 2.9 0 5.2 2.5 4.2 6-1.5 4.9-9 9.5-9 9.5Z" />)
export const ArrowDown = stroke(<path d="M12 4v15m-6-6 6 6 6-6" />)

/** Icons the website manager can choose from in the CMS ("Icon" dropdowns). */
export const ICONS = {
  trophy: TrophyIcon,
  medal: MedalIcon,
  ribbon: RibbonIcon,
  users: UsersIcon,
  user: UserIcon,
  graduation: GraduationIcon,
  megaphone: MegaphoneIcon,
  wrench: WrenchIcon,
  cpu: CpuIcon,
  rocket: RocketIcon,
  handshake: HandshakeIcon,
  book: BookIcon,
  target: TargetIcon,
  layers: LayersIcon,
  shield: ShieldIcon,
  feather: FeatherIcon,
  compass: CompassIcon,
  bulb: BulbIcon,
  flag: FlagIcon,
  star: StarIcon,
  clipboard: ClipboardIcon,
  chat: ChatIcon,
  envelope: EnvelopeOpenIcon,
  globe: GlobeIcon,
  calendar: CalendarIcon,
  building: BuildingIcon,
  code: CodeIcon,
  gear: GearIcon,
  bolt: BoltIcon,
  heart: HeartIcon,
  spark: SparkIcon,
  mail: MailIcon,
  pin: PinIcon,
  doc: DocIcon,
  home: HomeIcon,
  image: ImageIcon,
} as const

export type IconName = keyof typeof ICONS

export function Icon({ name, fallback = 'spark', ...props }: P & { name?: string | null; fallback?: IconName }) {
  const C = ICONS[(name && name in ICONS ? name : fallback) as IconName]
  return <C {...props} />
}
