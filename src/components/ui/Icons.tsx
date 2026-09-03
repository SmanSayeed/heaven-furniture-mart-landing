/**
 * The only icons on the page, inlined from Phosphor (MIT licence, phosphoricons.com).
 * 1.5px-stroke line style, currentColor so they inherit the dynamic accent.
 * No icon font, no package: these eight glyphs are the entire icon system.
 */

type IconProps = { className?: string }

const base = {
  viewBox: '0 0 256 256',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 14,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={20} className={className} aria-hidden="true">
      <line x1="64" y1="192" x2="192" y2="64" />
      <polyline points="88 64 192 64 192 168" />
    </svg>
  )
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={20} className={className} aria-hidden="true">
      <line x1="40" y1="128" x2="216" y2="128" />
      <polyline points="144 56 216 128 144 200" />
    </svg>
  )
}

export function WhatsApp({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M45.4 177A95.9 95.9 0 1 1 79 210.6h0L45.8 220a7.9 7.9 0 0 1-9.8-9.8Z" />
      <path d="M152.1 184A79.9 79.9 0 0 1 72 103.9 28 28 0 0 1 100 76h0a6.8 6.8 0 0 1 6 3.5l11.7 20.4a8.1 8.1 0 0 1-.1 8.1l-9.4 15.7h0a48 48 0 0 0 24.1 24.1h0l15.7-9.4a8.1 8.1 0 0 1 8.1-.1L176.5 150a6.8 6.8 0 0 1 3.5 6h0a28.1 28.1 0 0 1-27.9 28Z" />
    </svg>
  )
}

/* "cube-focus": a piece inside a viewfinder. The AR section's own glyph, and
   the same corner-bracket language as the hero's AR hook. */
export function ArGlyph({ className }: IconProps) {
  return (
    <svg {...base} strokeWidth={16} className={className} aria-hidden="true">
      <polyline points="32 80 32 32 80 32" />
      <polyline points="176 32 224 32 224 80" />
      <polyline points="224 176 224 224 176 224" />
      <polyline points="80 224 32 224 32 176" />
      <polygon points="128 84 180 112 180 144 128 172 76 144 76 112 128 84" />
    </svg>
  )
}

export function MapPin({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="128" cy="104" r="32" />
      <path d="M208 104c0 72-80 128-80 128S48 176 48 104a80 80 0 0 1 160 0Z" />
    </svg>
  )
}

export function FacebookLogo({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="128" cy="128" r="96" />
      <path d="M168 88h-16a24 24 0 0 0-24 24v112" />
      <line x1="96" y1="144" x2="160" y2="144" />
    </svg>
  )
}

export function InstagramLogo({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="128" cy="128" r="40" />
      <rect x="32" y="32" width="192" height="192" rx="48" />
      <circle cx="180" cy="76" r="10" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function YoutubeLogo({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <polygon points="160 128 112 96 112 160 160 128" />
      <path d="M24 128c0 29.9 3.1 47.4 5.4 56.4A16.1 16.1 0 0 0 39 195.5c32.5 12.5 89 12.5 89 12.5s56.5 0 89-12.5a16.1 16.1 0 0 0 9.6-11.1c2.3-9 5.4-26.5 5.4-56.4s-3.1-47.4-5.4-56.4A16.1 16.1 0 0 0 217 60.5C184.5 48 128 48 128 48s-56.5 0-89 12.5a16.1 16.1 0 0 0-9.6 11.1C27.1 80.6 24 98.1 24 128Z" />
    </svg>
  )
}
