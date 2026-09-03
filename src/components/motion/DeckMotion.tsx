'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { detectTier, prefersLightweight } from '@/lib/device'
import { stageState } from '@/lib/stage-state'
import s from '@/components/deck/deck.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * THE DECK'S MOTION (PLAN-V5), all of it, in one short file.
 *
 * Four verbs and no more:
 *   ENTER  - a plate arrives: its photograph settles from 1.06 to 1 and its
 *            caption rises. CSS owns the transition; this only removes the
 *            data-wait attribute it stamped, once, as the plate crosses 60%.
 *   LIGHTS - the hero's blackout beat is CSS (deck.module.css `power`) so
 *            it plays from the first paint, before this file exists.
 *   SWEEP  - the bespoke plate scrubs one number (bespokeProgress) that the
 *            3D reads: the drawing becomes the velvet piece as the plate
 *            arrives, and the arrival lifts the piece onto the stage.
 *   DIM    - the Maker: the lights dip once as his plate takes the screen.
 *   LIVE   - the plate on screen is stamped data-live, which is the only
 *            one whose photograph drifts (deck.module.css `drift`).
 *   RING   - pointer devices: a ring follows the cursor and, over a room's
 *            photograph, grows and says View; a click there opens the room.
 *
 * Plus two bits of bookkeeping: the counter, and the header turning solid.
 *
 * INVERSION LAW throughout: every initial hidden state is set here, from
 * JavaScript, so the server HTML is the finished page. Reduced motion and
 * lightweight devices create nothing at all.
 */
/** the VIEW pill of the plate whose photograph (not caption) `t` is over */
function viewPillFor(t: EventTarget | null): HTMLElement | null {
  if (!(t instanceof Element)) return null
  const ground = t.closest('[data-plate-ground]')
  return ground?.closest('[data-plate]')?.querySelector<HTMLElement>('[data-view-pill]') ?? null
}

export function DeckMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const plates = gsap.utils.toArray<HTMLElement>('[data-plate]')
      const counter = document.querySelector<HTMLElement>('[data-counter-now]')
      const header = document.querySelector<HTMLElement>('[data-header]')
      const root = document.documentElement
      const lightweight = prefersLightweight()

      plates.forEach((plate, i) => {
        /* ---- ENTER ---- */
        if (i > 0 && !lightweight) {
          plate.dataset.wait = ''
          ScrollTrigger.create({
            trigger: plate,
            start: 'top 60%',
            once: true,
            onEnter: () => delete plate.dataset.wait,
          })
        }

        /* ---- the counter, the live plate, and the pill that yields to the hero ---- */
        const arrive = () => {
          const label = String(i + 1).padStart(2, '0')
          if (counter && counter.textContent !== label) {
            counter.textContent = label
            /* the digit rolls in along the counter's own (rotated) axis */
            gsap.fromTo(counter, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' })
          }
          plates.forEach((p, j) => {
            if (j === i) p.dataset.live = ''
            else delete p.dataset.live
          })
        }
        ScrollTrigger.create({
          trigger: plate,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            arrive()
            if (i > 0) delete root.dataset.heroView
          },
          onEnterBack: () => {
            arrive()
            if (i === 0) root.dataset.heroView = '1'
          },
        })
      })
      /* the hero is live from the first frame, before any trigger fires */
      if (plates[0] && !plates.some((p) => 'live' in p.dataset)) plates[0].dataset.live = ''

      /* ---- DEPTH: the covered plate recedes ----
         As plate N+1 rises over plate N, N's photograph eases to 0.94 and
         its shade deepens, scrubbed by the same scroll. Two sheets at two
         depths is what makes the stack read as sheets rather than a cut.
         Transform + opacity only; the browser composites both. */
      plates.forEach((plate, i) => {
        if (i === 0 || lightweight) return
        const prev = plates[i - 1]
        /* the IMG, not the media layer: the layer carries the entrance's CSS
           transition on transform, and a scrubbed GSAP transform on the same
           element would be re-eased by that transition every frame */
        const media = prev.querySelector<HTMLElement>('[data-plate-media] img')
        const shade = prev.querySelector<HTMLElement>('[data-plate-shade]')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: plate,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        if (shade) tl.fromTo(shade, { opacity: 0 }, { opacity: 0.6 }, 0)
        if (media) tl.fromTo(media, { scale: 1 }, { scale: 0.94 }, 0)
      })

      /* LIGHTS lives in CSS now (deck.module.css `power`): the beat has to
         play on load, and this file mounts on the first gesture, which put
         the blackout under the visitor's first scroll instead of before it. */

      /* ---- the header turns solid once the hero has gone ---- */
      if (header && plates[1]) {
        ScrollTrigger.create({
          trigger: plates[1],
          start: 'top 20%',
          onEnter: () => header.classList.add(s.hdrSolid),
          onLeaveBack: () => header.classList.remove(s.hdrSolid),
        })
      }

      /* ---- SWEEP: the bespoke plate's one number ---- */
      const bespoke = document.querySelector<HTMLElement>('#bespoke')
      if (bespoke && detectTier() !== 'low') {
        stageState.bespokeArrival = 0
        ScrollTrigger.create({
          trigger: bespoke,
          start: 'top 85%',
          once: true,
          onEnter: () => gsap.to(stageState, { bespokeArrival: 1, duration: 0.9, ease: 'power2.out' }),
        })
        gsap.fromTo(
          stageState,
          { bespokeProgress: 0 },
          {
            bespokeProgress: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: bespoke,
              start: 'top 90%',
              end: 'top 5%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )
      }

      /* ---- DIM: the lights dip once as the Maker arrives ---- */
      const dim = document.querySelector<HTMLElement>('[data-dim]')
      const maker = document.querySelector<HTMLElement>('#maker')
      if (dim && maker && !lightweight) {
        ScrollTrigger.create({
          trigger: maker,
          start: 'top 45%',
          once: true,
          onEnter: () =>
            gsap
              .timeline()
              .to(dim, { opacity: 0.88, duration: 0.08, ease: 'none' })
              .to(dim, { opacity: 0.2, duration: 0.07, ease: 'none' })
              .to(dim, { opacity: 0.85, duration: 0.06, ease: 'none' })
              .to(dim, { opacity: 0, duration: 1.1, ease: 'power2.out' }),
        })
      }

      return () => {
        plates.forEach((p) => {
          delete p.dataset.wait
          delete p.dataset.live
        })
        header?.classList.remove(s.hdrSolid)
        stageState.bespokeProgress = 0
        stageState.bespokeArrival = 1
        /* the flag ARRIVES in the server HTML (layout.tsx) and this context
           only ever takes it away - so a revert must put it back when the
           hero is still on screen. React's development double-mount runs
           this cleanup once before the real mount, and without the restore
           it deleted the flag at scroll 0: three Quote pills on the first
           screen, on the one page whose rule is one. */
        if (window.scrollY < window.innerHeight / 2) root.dataset.heroView = '1'
        else delete root.dataset.heroView
      }
    })

    /* ---- RING: pointer devices only. A finger has no hover, and a ring
       chasing a touch point would be a bug, not a flourish. ---- */
    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const ring = document.querySelector<HTMLElement>('[data-cursor]')
      if (!ring) return
      const x = gsap.quickTo(ring, 'x', { duration: 0.32, ease: 'power3.out' })
      const y = gsap.quickTo(ring, 'y', { duration: 0.32, ease: 'power3.out' })

      const move = (e: PointerEvent) => {
        x(e.clientX)
        y(e.clientY)
        ring.dataset.show = ''
        if (viewPillFor(e.target)) ring.dataset.on = ''
        else delete ring.dataset.on
      }
      const leave = () => {
        delete ring.dataset.show
        delete ring.dataset.on
      }
      window.addEventListener('pointermove', move, { passive: true })
      document.documentElement.addEventListener('pointerleave', leave)
      return () => {
        window.removeEventListener('pointermove', move)
        document.documentElement.removeEventListener('pointerleave', leave)
        leave()
      }
    })

    /* ---- the photograph opens the room: every device, every input.
       A tap on a room's picture is the most natural "show me more" there
       is, and the pill it forwards to is still there for keyboards. ---- */
    const onClick = (e: MouseEvent) => viewPillFor(e.target)?.click()
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  })

  return null
}
