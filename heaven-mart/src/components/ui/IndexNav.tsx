'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import gsap from 'gsap'
import { useLenis } from 'lenis/react'
import { brand, collections, nav } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from './Icons'
import s from '@/components/sections/sections.module.css'

/**
 * S1d "The Index" (PLAN S1d): the page's only chrome, plus a full-screen
 * category overlay.
 *
 * Progressive enhancement by construction: the island renders null until
 * after hydration, so a JavaScript-disabled visitor never meets a dead
 * button. Their path is the plain category list the Footer renders, which is
 * always present in the server HTML.
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

  /* Chrome hides on scroll down, returns on scroll up (PLAN S1d). The class
     is toggled straight on the node rather than held in React state: a
     scroll callback that calls setState re-renders the tree on every wheel
     tick (and trips react-hooks/set-state-in-effect). CSS owns the
     transition, so this is one classList write per direction change. */
  useLenis((l) => {
    const btn = openerRef.current
    if (!btn || open) return
    btn.classList.toggle(s.indexBtnHidden, l.direction === 1 && l.actualScroll > 140)
  })

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

  /* entrance: masked line rises for the category names. Inside matchMedia so
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
        stagger: 0.06,
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
    /* the first name takes focus so keyboard users land inside the dialog */
    root.querySelector<HTMLElement>('button')?.focus()
    return () => mm.revert()
  }, [open])

  /** Scroll to a category card, including inside the desktop horizontal rail
      where the card's own rect is not where the scrollbar has to go: there,
      the pin distance maps 1:1 onto the track's horizontal travel. */
  const goTo = useCallback(
    (index: number) => {
      close()
      const cards = document.querySelector<HTMLElement>('[data-cards]')
      const section = document.querySelector<HTMLElement>('#collections')
      if (!cards || !section) return
      const railed = cards.className.includes('isRail')
      let target: number | HTMLElement
      if (railed) {
        const spacer = (section.closest('.pin-spacer') as HTMLElement) ?? section
        const top = spacer.getBoundingClientRect().top + window.scrollY
        const travel = cards.scrollWidth - cards.offsetWidth
        const per = travel / Math.max(1, collections.items.length - 1)
        target = top + per * index
      } else {
        const card = document.getElementById(`collection-${collections.items[index].num}`)
        if (!card) return
        target = card
      }
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
              {collections.items.map((item, i) => (
                <div key={item.num} className={s.indexRow}>
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
                        {item.name}
                      </span>
                    </span>
                    <span className="index">{item.num}</span>
                  </button>
                </div>
              ))}
            </div>

            {/* the category images crossfade on hover/focus. Placeholder
                panels for now: the mechanic is real, so landing the graded
                photos is a path change, not a rebuild. */}
            <div className={s.indexMedia} aria-hidden="true">
              {collections.items.map((item, i) => (
                <div
                  key={item.num}
                  className={`ph ${s.indexMediaPanel} ${i === active ? s.indexMediaOn : ''}`}
                >
                  <span className="specimen">{item.img.toUpperCase()} · INCOMING</span>
                </div>
              ))}
            </div>
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
              className="btn"
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
