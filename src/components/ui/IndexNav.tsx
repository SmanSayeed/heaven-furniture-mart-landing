'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import { brand, nav, story } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from './Icons'
import s from '@/components/sections/sections.module.css'

/**
 * THE INDEX — the page's only chrome, and its MAP.
 *
 * It used to list five product categories, which made it a menu. On a page
 * that is one continuous eight-beat story (BLUEPRINT SS0.5) a menu is the
 * wrong object: what a visitor needs is to see the route they are on, where
 * they are, and what each stop is. So the overlay is now the drawing set's
 * contents page - sheet number, beat name, and the beat's own line of story
 * for whichever one is under the cursor.
 *
 * Progressive enhancement by construction: the island renders null until
 * after hydration, so a JavaScript-disabled visitor never meets a dead
 * button. Their path is the same eight-beat list the Footer renders as plain
 * anchors, which is always present in the server HTML.
 *
 * Scroll locking goes through Lenis stop()/start(), never body overflow:
 * Lenis drives the real window scroll, so mutating overflow would fight it.
 */
/* the canonical "has hydrated" read: server snapshot false, client snapshot
   true, no subscription. setState-in-effect would do the same job but trips
   react-hooks/set-state-in-effect and costs an extra render. */
const subscribeNever = () => () => {}

export function IndexNav() {
  const mounted = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  )
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()

  /*
    THE INDEX NEVER LEAVES.

    It used to hide on scroll down and return on scroll up — the standard
    "smart header" behaviour, and the wrong one here. This page is nine
    sheets of continuous scrolling and the Index is its ONLY map; a map that
    disappears exactly while you are travelling is a map you learn not to
    trust, and a visitor two thirds of the way down had no way back that did
    not involve scrolling up to summon a button.

    It is also the one piece of chrome that proves the page has structure at
    all. Keeping it costs a fixed 44 px pill over a page whose corners are
    deliberately empty, which is a trade worth making. The hidden class stays
    in the stylesheet for the nav-open state, which still uses it.
  */

  /* body scroll lock, the Lenis way, plus the flag the sticky CTA hides on */
  useEffect(() => {
    const root = document.documentElement
    if (open) root.dataset.navOpen = '1'
    else delete root.dataset.navOpen
    if (!lenis) return () => delete root.dataset.navOpen
    if (open) lenis.stop()
    else lenis.start()
    return () => {
      delete root.dataset.navOpen
      lenis.start()
    }
  }, [open, lenis])

  const close = useCallback(() => {
    setOpen(false)
    /* focus returns to the control that opened the overlay */
    openerRef.current?.focus()
  }, [])

  /* Escape closes; Tab cycles inside (focus trap) */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const root = overlayRef.current
      if (!root) return
      const focusables = root.querySelectorAll<HTMLElement>('a[href], button')
      if (!focusables.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const activeEl = document.activeElement
      if (e.shiftKey && (activeEl === first || !root.contains(activeEl))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  /* entrance: masked line rises for each beat name. Inside matchMedia so
     reduced motion creates no tweens at all; the overlay is only in the DOM
     while open, so its initial state can never hide server content. */
  useEffect(() => {
    if (!open) return
    const root = overlayRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.querySelectorAll('[data-nav-line]'), {
        yPercent: 110,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.05,
      })
      gsap.from(root.querySelectorAll('[data-nav-fade]'), {
        autoAlpha: 0,
        y: 14,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2,
        stagger: 0.08,
      })
    })
    /* the first beat takes focus so keyboard users land inside the dialog */
    root.querySelector<HTMLElement>('button')?.focus()
    return () => mm.revert()
  }, [open])

  /** Jump to a sheet. Sheet 04's cards live inside a pinned horizontal rail
      on desktop, but the jump target is the SECTION either way: the rail's
      own pin spacer is what the scrollbar has to reach, and scrolling to the
      section top lands exactly there. */
  const goTo = useCallback(
    (index: number) => {
      close()
      const target = document.getElementById(story[index].target)
      if (!target) return
      /* one frame later: the overlay is unmounting and Lenis has just been
         restarted, so the scroll has to be issued after that settles */
      requestAnimationFrame(() => lenis?.scrollTo(target, { offset: -24 }))
    },
    [close, lenis],
  )

  if (!mounted) return null

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className={s.indexBtn}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={s.indexGlyph} aria-hidden="true">
          <span />
          <span />
        </span>
        {open ? nav.close : nav.open}
      </button>

      {open && (
        <div
          ref={overlayRef}
          className={s.indexOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={nav.overlayLabel}
        >
          <div className={s.indexOverlayInner}>
            <div className={s.indexList}>
              {story.map((beat, i) => (
                <div key={beat.no} className={s.indexRow}>
                  <button
                    type="button"
                    className={s.indexLink}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => goTo(i)}
                  >
                    {/* the mask wrapper is what makes the line RISE rather
                        than merely fade (same grammar as the hero h1) */}
                    <span className={s.indexMask}>
                      <span className={s.indexName} data-nav-line>
                        {beat.beat}
                      </span>
                    </span>
                    <span className="index">{beat.no}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* the legend: the hovered sheet's own line of the story, in the
                human voice. It replaced five placeholder image panels, which
                were the last thing on the page that looked unfinished. */}
            <aside className={s.indexLegend} aria-hidden="true">
              <span className="specimen">SHEET {story[active].no} / 08</span>
              <p className="beat-caption">{story[active].caption}</p>
              <span className="specimen">
                {story[active].beat.toUpperCase()}
              </span>
            </aside>
          </div>

          <div className={s.indexFoot} data-nav-fade>
            <div className={s.indexFootCol}>
              <span className="specimen">VISIT</span>
              <p className="placard-line">{brand.address}</p>
            </div>
            <div className={s.indexFootCol}>
              <span className="specimen">TALK</span>
              <p className="placard-line">
                <a href={`tel:${brand.phoneTel}`}>{brand.phoneDisplay}</a>
              </p>
            </div>
            <a
              className="btn btn-sm"
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              {nav.cta}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
