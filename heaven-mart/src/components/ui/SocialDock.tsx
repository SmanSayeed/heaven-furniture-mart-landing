'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { brand } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { FacebookLogo, InstagramLogo, WhatsApp, YoutubeLogo } from './Icons'
import s from '@/components/ui/shared.module.css'

/**
 * THE DOCK — every way to reach Heaven, folded into one lamp.
 *
 * WHY IT IS FOLDED AND NOT A ROW OF FOUR ICONS.
 * Four permanent circles in the corner of the viewport is what every template
 * ships, and it costs the page four competing marks over whatever photograph
 * or piece happens to be behind them. The page's single-CTA law (CLAUDE.md
 * §3) is about ACTIONS, and none of these four is a competing action — they
 * are all "talk to Heaven" — but four objects is still four objects.
 *
 * So it rests as ONE object: a lit ring with the brand's brass in it. Opening
 * it fans the four out along a vertical rail, staggered, each arriving 45 ms
 * after the one below. That stagger is the whole trick and it is free — a
 * transition-delay per child, no JS animation, no library.
 *
 * WhatsApp sits closest to the thumb because it is the page's one real CTA
 * and it is the only one tinted brass; the three social marks stay quiet
 * behind it. Order is deliberate, not alphabetical.
 *
 * POSITION. On mobile the dock rides ABOVE the sticky Consult pill rather
 * than beside it, because the bottom-right corner already belongs to that
 * pill and two round things fighting for one thumb is worse than either
 * alone. From 900px the pill is gone and the dock takes the corner.
 *
 * NO-JS: the whole component renders its links in the DOM from the first
 * paint. Closed is a transform and an opacity, not a `display: none` and not
 * a conditional render — so with JS off the fan is simply always open, which
 * is a correct page, and the footer carries the same four links anyway.
 */

const LINKS = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    href: whatsappUrl(),
    Icon: WhatsApp,
    lead: true,
  },
  {
    key: 'facebook',
    label: 'Facebook',
    href: brand.social.facebook,
    Icon: FacebookLogo,
    lead: false,
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: brand.social.instagram,
    Icon: InstagramLogo,
    lead: false,
  },
  {
    key: 'youtube',
    label: 'YouTube',
    href: brand.social.youtube,
    Icon: YoutubeLogo,
    lead: false,
  },
] as const

export function SocialDock() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  /* Escape closes, and so does a click anywhere else. Both listeners are
     mounted only while it is open, so a closed dock costs the page nothing
     at all on scroll or on every pointer move. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const toggle = useCallback(() => setOpen((v) => !v), [])

  return (
    <div
      ref={root}
      className={s.dock}
      data-open={open ? '' : undefined}
      /* hovering opens it on a mouse; the click handler below is what serves
         touch and keyboard, so neither input is second class */
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setOpen(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setOpen(false)
      }}
    >
      <ul className={s.dockFan} id="dock-fan">
        {LINKS.map((l, i) => (
          <li
            key={l.key}
            className={s.dockItem}
            /* the stagger, bottom-most first. Custom property rather than an
               inline transition-delay so the CSS keeps ownership of the
               curve and only the INDEX comes from here. */
            style={{ '--i': LINKS.length - 1 - i } as React.CSSProperties}
          >
            <a
              className={s.dockLink}
              data-lead={l.lead ? '' : undefined}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Heaven Furniture Mart on ${l.label}`}
              tabIndex={open ? 0 : -1}
            >
              <l.Icon />
              <span className={s.dockLabel} aria-hidden="true">
                {l.label}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={s.dockTrigger}
        aria-expanded={open}
        aria-controls="dock-fan"
        aria-label={open ? 'Close contact links' : 'Contact Heaven Furniture Mart'}
        onClick={toggle}
      >
        {/* the ring turns slowly on its own; the glyph inside is a speech
            mark that becomes a close cross when the fan is out */}
        <span className={s.dockRing} aria-hidden="true" />
        <svg
          className={s.dockGlyph}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20.5 12a8.5 8.5 0 1 1-4.2-7.3" className={s.dockGlyphArc} />
          <path d="M8.5 11h7M8.5 14.5h4.5" className={s.dockGlyphLines} />
        </svg>
      </button>
    </div>
  )
}
