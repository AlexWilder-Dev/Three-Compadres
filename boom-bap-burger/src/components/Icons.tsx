import type { JSX, SVGProps } from 'react'
import type { EventIcon } from '../data/venue'

type IconProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

export const ArrowRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
)

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const Phone = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />
  </svg>
)

export const Mail = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const Pin = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
)

export const Clock = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
)

export const Calendar = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export const Bag = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 8h14l-1 13H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
)

export const Scooter = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="17" r="3" />
    <circle cx="18" cy="17" r="3" />
    <path d="M9 17h6l-2-8h-3M13 9l2-4h3M15 5v3h4v5" />
  </svg>
)

export const MenuIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
)

export const Close = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const Play = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
)

export const Pause = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
)

export const Instagram = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </svg>
)

export const TikTok = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
    <path d="M14 3c.5 3 2.5 5 5.5 5" />
  </svg>
)

export const Facebook = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15V3Z" />
  </svg>
)

/* Event icons, drawn a bit heavier. */

const Decks = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={2.4} {...p}>
    <rect x="3" y="12" width="42" height="26" rx="4" />
    <circle cx="15" cy="25" r="8" />
    <circle cx="15" cy="25" r="2" />
    <circle cx="33" cy="25" r="8" />
    <circle cx="33" cy="25" r="2" />
    <path d="M22 18v14M26 18v14" opacity="0.6" />
  </svg>
)

const Football = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={2.4} {...p}>
    <circle cx="24" cy="24" r="19" />
    <path d="m24 15 7 5-2.7 8h-8.6L17 20l7-5Z" />
    <path d="M24 15V6M31 20l8-3M28.3 28l5 7M19.7 28l-5 7M17 20l-8-3" />
  </svg>
)

const Group = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={2.4} {...p}>
    <circle cx="16" cy="16" r="6" />
    <circle cx="32" cy="16" r="6" />
    <path d="M4 40c0-7 5.4-12 12-12s12 5 12 12M24 34c1.6-3.6 4.6-6 8-6 6.6 0 12 5 12 12" />
  </svg>
)

const Door = (p: IconProps) => (
  <svg {...base} viewBox="0 0 48 48" strokeWidth={2.4} {...p}>
    <path d="M10 42V8a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v34M6 42h36" />
    <circle cx="26" cy="25" r="1.5" fill="currentColor" />
    <path d="M38 14v10M35 19h6" />
  </svg>
)

export const eventIcons: Record<EventIcon, (p: IconProps) => JSX.Element> = {
  decks: Decks,
  football: Football,
  group: Group,
  door: Door,
}
