'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { prefersLightweight } from '@/lib/device'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/**
 * The motion layer for the catalogue routes.
 *
 * A SEPARATE, MUCH SMALLER ORCHESTRATOR than PageMotion, and deliberately so.
 * PageMotion owns three pins, a horizontal rail, a WebGL hand-off, a
 * preloader and a marquee - none of which exist here, and all of which would
 * have to be guarded by null checks if these pages reused it. Worse, it would
 * drag the hero's whole choreography into a route whose entire promise is
 * "the picture appears fast".
 *
 * So this file does four things and nothing else:
 *   1. headings rise out of a mask, exactly as they do on the landing page,
 *      so the two routes are visibly the same piece of work
 *   2. the plotter print + tube strike on every photograph (the shared
 *      [data-print] contract, so Photo.tsx needs no branch)
 *   3. cards settle in as they arrive
 *   4. a slow Ken Burns inside each plate, so nothing is a dead rectangle
 *
 * The same two hard rules as PageMotion: every initial state is set from
 * JavaScript, never CSS, so with JS off the page is complete; and everything
 * lives inside matchMedia, so reduced motion creates not a single tween.
 */
export function CatalogueMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      /* Data Saver, 2G/3G, a weak device: no motion layer at all. Same gate
         as the landing page, and the reason is the same - on the traffic this
         client actually gets, a finished page now beats a choreographed one
         in two seconds. */
      if (prefersLightweight()) return

      /* ---- 1 · headings ---- */
      gsap.utils.toArray<HTMLElement>('h1.section-title, h2.section-title').forEach((title) => {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.95,
              ease: 'power3.out',
              stagger: 0.08,
              scrollTrigger: { trigger: title, start: 'top 92%', once: true },
            }),
        })
      })

      /* ---- 2 · the plotter print, then the tube over the plate ----
         Identical timing to the landing page's, and it has to be: a
         photograph that arrives differently on a second route reads as a
         different website. */
      const calls: gsap.core.Tween[] = []
      gsap.utils.toArray<HTMLElement>('[data-print]').forEach((frame, i) => {
        frame.dataset.unprinted = ''
        const delay = Math.min(i, 3) * 0.08
        ScrollTrigger.create({
          trigger: frame,
          start: 'top 84%',
          once: true,
          onEnter: () => {
            calls.push(
              gsap.delayedCall(delay, () => {
                frame.dataset.printing = ''
                delete frame.dataset.unprinted
                calls.push(
                  gsap.delayedCall(0.95, () => {
                    delete frame.dataset.printing
                    frame.dataset.striking = ''
                    calls.push(
                      gsap.delayedCall(0.68, () => {
                        delete frame.dataset.striking
                      }),
                    )
                  }),
                )
              }),
            )
          },
        })
      })

      /* ---- 3 · the cards, and the quiet type around them ---- */
      gsap.utils.toArray<HTMLElement>('[data-cat-card]').forEach((card) => {
        gsap.from(card, {
          y: 34,
          autoAlpha: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', once: true },
        })
        const media = card.querySelector<HTMLElement>('[data-card-media]')
        if (!media) return
        ScrollTrigger.create({
          trigger: card,
          start: 'top 82%',
          onEnter: () => {
            media.dataset.lit = ''
          },
          onLeaveBack: () => {
            delete media.dataset.lit
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-cat-fade], .specimen-row, .chip').forEach((el) => {
        gsap.from(el, {
          y: 16,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 94%', once: true },
        })
      })

      /* ---- 4 · living at rest ---- */
      gsap.utils.toArray<HTMLElement>('[data-kenburns] img').forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1 },
          {
            scale: 1.06,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('[data-kenburns]') ?? img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          },
        )
      })

      return () => {
        /* delayedCalls outlive a context revert unless killed, and any frame
           caught mid-pass has to be returned to the FINISHED state, never the
           blank one */
        calls.forEach((c) => c.kill())
        document.querySelectorAll<HTMLElement>('[data-print]').forEach((f) => {
          delete f.dataset.unprinted
          delete f.dataset.printing
          delete f.dataset.striking
        })
      }
    })
  })

  return null
}
