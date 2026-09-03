'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { brand, catalogue, deck, night } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { getLenis } from '@/lib/lenis-store'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { ArrowRight, WhatsApp } from '@/components/ui/Icons'
import s from './deck.module.css'

/**
 * THE MEGA MENU (PLAN-V6 PART B5): the customer's path to the rooms.
 *
 * Wide screens: "Rooms" in the header opens a full-width panel under it
 * (a clip-path drop, half a second) with the five rooms as big titles and
 * one large photograph that changes as a title is hovered, plus "All
 * pieces". Every title is a real link to that room's page, so the panel
 * works with the keyboard and the links exist in the HTML for a crawler.
 *
 * Phones: the wordmark row gains a burger, and the menu is a full-screen
 * <dialog> - the same system the modals use (Escape, backdrop, focus
 * containment for free), hash-synced so the phone's Back button closes the
 * menu instead of leaving the site. It lists the rooms as image tiles, the
 * page's four anchors, the one CTA and the phone number.
 *
 * `home` is '' on the landing page and '/' on the room pages, so the same
 * four anchors work from either.
 */
export function MegaMenu({
  nav,
  home = '',
}: {
  nav: readonly { label: string; href: string }[]
  home?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [sheet, setSheet] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const pushed = useRef(false)
  const rooms = catalogue.categories
  const m = night.menu
  /* the first nav item is "Rooms", which the panel replaces on wide
     screens; the rest stay anchors */
  const anchors = nav.filter((n) => n.href !== '#floor')

  /* ---- the wide panel ---- */
  const close = useCallback(() => setOpen(false), [])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        button.current?.focus()
      }
    }
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node
      if (panel.current?.contains(t) || button.current?.contains(t)) return
      close()
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    window.addEventListener('scroll', close, { passive: true })
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
      window.removeEventListener('scroll', close)
    }
  }, [open, close])

  /* ---- the phone sheet ---- */
  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const lenis = getLenis()
    if (sheet && !el.open) {
      el.showModal()
      lenis?.stop()
      try {
        history.pushState({ modal: 'menu' }, '', '#menu')
        pushed.current = true
      } catch {
        pushed.current = false
      }
    } else if (!sheet && el.open) {
      el.close()
      lenis?.start()
    }
  }, [sheet])

  useEffect(() => {
    if (!sheet) return
    const onPop = () => {
      pushed.current = false
      setSheet(false)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [sheet])

  const closeSheet = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      history.back()
      return
    }
    setSheet(false)
  }, [])

  /* an anchor inside the sheet: close first (which pops the #menu entry),
     then travel. Left to the browser, the hash jump and the popstate that
     closes the sheet cancel each other and the page stays put. The motion
     layer claims the event when it is running (its scroller knows where a
     pinned chapter really starts); otherwise a plain hash jump. */
  const goFromSheet = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#') && !href.startsWith('/#')) {
        closeSheet()
        return
      }
      e.preventDefault()
      closeSheet()
      const id = href.slice(href.indexOf('#') + 1)
      window.setTimeout(() => {
        const ev = new CustomEvent('night:goto', { detail: id, cancelable: true })
        if (window.dispatchEvent(ev)) location.hash = id
      }, 160)
    },
    [closeSheet],
  )

  useEffect(() => () => getLenis()?.start(), [])

  const current = rooms[active] ?? rooms[0]

  return (
    <div className={s.navWrap}>
      <nav className={s.nav} aria-label="Sections">
        <button
          ref={button}
          type="button"
          className={s.navBtn}
          aria-expanded={open}
          aria-controls="rooms-menu"
          onClick={() => setOpen((o) => !o)}
          onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        >
          {m.rooms}
          <span className={s.navCaret} aria-hidden="true" />
        </button>
        {anchors.map((item) => (
          <a key={item.href} href={home + item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      {/* the panel: in the HTML always, opened by data-on */}
      <div
        id="rooms-menu"
        ref={panel}
        className={s.mega}
        data-on={open ? '' : undefined}
        onPointerLeave={(e) => e.pointerType === 'mouse' && close()}
        aria-hidden={!open}
      >
        <div className={s.megaInner}>
          <ul className={s.megaList}>
            {rooms.map((c, i) => (
              <li key={c.slug}>
                <a
                  href={`/collections/${c.slug}`}
                  className={s.megaTitle}
                  data-active={i === active ? '' : undefined}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  tabIndex={open ? 0 : -1}
                >
                  <span className={s.megaNo}>{c.num}</span>
                  <span>{c.name}</span>
                  <span className={s.megaLead}>{c.lead}</span>
                </a>
              </li>
            ))}
            <li className={s.megaFoot}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full navigation on purpose: the cross-document view transition (globals.css) needs one */}
              <a href="/collections" className={s.megaAll} tabIndex={open ? 0 : -1}>
                {m.all} <ArrowRight />
              </a>
              <a href={home + '#floor'} className={s.megaAll} tabIndex={open ? 0 : -1} onClick={close}>
                {m.walk} <ArrowRight />
              </a>
            </li>
          </ul>
          <div className={s.megaArt} aria-hidden="true">
            {rooms.map(
              (c, i) =>
                hasPhoto(c.cover) && (
                  <span key={c.slug} className={s.megaImg} data-active={i === active ? '' : undefined}>
                    <Photo name={c.cover} alt="" sizes="(min-width: 900px) 40vw, 1px" low />
                  </span>
                ),
            )}
            <span className={s.megaCap}>
              {current.name} · {current.pieces.length} {current.pieces.length === 1 ? 'piece' : 'pieces'} ·{' '}
              {m.built}
            </span>
          </div>
        </div>
      </div>

      {/* the phone's burger and its sheet */}
      <button
        type="button"
        className={s.burger}
        aria-label={m.open}
        aria-haspopup="dialog"
        aria-expanded={sheet}
        onClick={() => setSheet(true)}
      >
        <span />
        <span />
      </button>
      <dialog
        ref={dialog}
        className={s.sheet}
        aria-label={m.open}
        data-lenis-prevent=""
        onCancel={(e) => {
          e.preventDefault()
          closeSheet()
        }}
      >
        {sheet && (
          <>
            <div className={s.sheetHead}>
              <span className={s.brand} aria-hidden="true">
                HE<span className="tri" />VEN
                <span className={s.brandSub}>FURNITURE MART</span>
              </span>
              <button type="button" className={s.modalClose} onClick={closeSheet}>
                {m.close.toUpperCase()} ×
              </button>
            </div>
            <p className={s.sheetLine}>{m.line}</p>
            <div className={s.sheetTiles}>
              {rooms.map(
                (c) =>
                  hasPhoto(c.cover) && (
                    <a key={c.slug} href={`/collections/${c.slug}`} className={s.tile}>
                      <Photo name={c.cover} alt="" sizes="45vw" low />
                      <span>
                        {c.num} · {c.name}
                      </span>
                    </a>
                  ),
              )}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full navigation on purpose: the cross-document view transition (globals.css) needs one */}
              <a href="/collections" className={`${s.tile} ${s.tileAll}`}>
                <span>
                  {m.all} <ArrowRight />
                </span>
              </a>
            </div>
            <nav className={s.sheetLinks} aria-label="Sections">
              {nav.map((item) => (
                <a key={item.href} href={home + item.href} onClick={(e) => goFromSheet(e, home + item.href)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className={s.sheetFoot}>
              <a className={`${s.pill} ${s.pillBrass}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsApp />
                {deck.cta}
              </a>
              <a className={s.quiet} href={`tel:${brand.phoneTel}`}>
                {brand.phoneDisplay}
              </a>
            </div>
          </>
        )}
      </dialog>
    </div>
  )
}
