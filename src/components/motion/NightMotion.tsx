'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { detectTier } from '@/lib/device'
import { getLenis } from '@/lib/lenis-store'
import { startReveals } from '@/lib/reveal'
import { stageState } from '@/lib/stage-state'
import { night } from '@/content/copy'
import d from '@/components/deck/deck.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

/* the contrast floor for an unlit step word on the drafting table */
const STEP_FLOOR = 0.28

/**
 * A NIGHT AT HEAVEN: the motion, one file, seven chapters.
 *
 *   ch.1  FLOOD -> IRIS -> SLIDE -> ZOOM, and then the lights go out
 *   ch.2  PRINT: reveals + the founding line, a brass dot riding its tip
 *   ch.3  RAIL: pinned travel past the glass wall; snap track on phones
 *   ch.4  SWEEP: pinned, scrubs the one number the 3D reads
 *   ch.5  DIM: the lights dip once
 *   ch.6  SHUTTER, ch.7 RISE + the beam: reveals
 *   + the map, the header, the sticky pill, the nav scroller and the
 *     reveal system.
 *
 * INVERSION LAW: every hidden state is set here, from JavaScript. The server
 * HTML is the finished page. Reduced motion creates nothing.
 */
export function NightMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = <T extends HTMLElement>(sel: string) => document.querySelector<T>(sel)
      const root = document.documentElement
      const header = q('[data-header]')
      /* the CSS hand-off rules (night.module.css) exist only while this
         layer drives the page */
      root.dataset.night = ''
      /* PIN THE TIER NOW, at idle, rather than leaving it to whichever
         caller asks first. detectTier() memoizes (device.ts), so this is
         also the answer StageLoader gets four chapters down - and it is
         taken at the page's calmest moment rather than off a connection
         estimate that has drifted while the visitor read the hero. */
      detectTier()
      /* the rail runs on every screen now, so there is no `wide` branch left
         to take; only the pointer still decides anything (the wall's cursor) */
      const fine = window.matchMedia('(pointer: fine)').matches
      const cleanups: Array<() => void> = []

      /* ================= THE REVEAL SYSTEM =================
         IntersectionObserver, not scroll positions (lib/reveal.ts): pinned
         chapters and the rail move things without moving the document. */
      cleanups.push(startReveals(document, '[data-hero]'))

      /* ================= CH.1 · THE FLOODLIT ROOM ================= */
      const hero = q('[data-hero]')
      const studio = q('#studio')
      if (hero) {
        const views = gsap.utils.toArray<HTMLElement>('[data-view]', hero)
        const viewsWrap = q('[data-views]')
        const scrim = q('[data-hero-scrim]')
        const beam = q('[data-beam]')
        const vignette = q('[data-vignette]')
        const text = q('[data-hero-text]')
        const counter = q('[data-hero-counter]')
        const now = q('[data-hero-now]')
        const says = gsap.utils.toArray<HTMLElement>('[data-hero-msg]', hero)
        const proofs = gsap.utils.toArray<HTMLElement>('[data-proof-item]', hero)
        const cue = q('[data-cue]')
        const out = q('[data-lights-out]')

        /* NOTHING RUNS HERE ON ARRIVAL.

           Room one used to hold a four-frame reel on a six-second clock,
           cross-fading and drifting while the light lifted, the colour
           arrived and a dust sheet slid off - four animations for a visitor
           who had not asked for any of them (client: "avoid double
           animations - lighting and slided option at very first not looking
           good - remove those, keep only onscroll effects"). The hero is a
           still, lit photograph until the visitor scrolls, and everything
           below is the scroll's.

        /* hidden poses, JS only: view 2 is a closed iris at the beam's
           origin, view 3 waits off the right edge */
        if (views[1]) gsap.set(views[1], { clipPath: 'circle(0% at 12% 8%)', autoAlpha: 1 })
        if (views[2]) gsap.set(views[2], { xPercent: 100, autoAlpha: 1 })

        let shown = 1
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=200%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (st) => {
              const p = st.progress
              const v = p < 0.22 ? 1 : p < 0.5 ? 2 : 3
              if (v !== shown) {
                shown = v
                if (now) {
                  now.textContent = String(v)
                  gsap.fromTo(now, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
                }
                /* THE WORDS TRAVEL WITH THE ROOM. One message per view: the
                   photographs used to change twice under a headline that
                   never did, so views 2 and 3 read as pictures with nothing
                   to say. `data-on` is the only switch; the fade and the
                   lift are CSS transitions on the compositor, so this costs
                   one attribute write per view change and nothing per frame.
                   The proof strip rides the same switch, which is what makes
                   it a single line on a phone instead of three. */
                says.forEach((el, i) => el.toggleAttribute('data-on', i === v - 1))
                proofs.forEach((el, i) => el.toggleAttribute('data-on', i === v - 1))
              }
            },
          },
        })

        /* FLOOD: the room fills with light, the beam widens, the text
           drifts up a touch slower than the scroll */
        if (scrim) tl.to(scrim, { opacity: 0.3, duration: 0.22 }, 0)
        if (beam) tl.to(beam, { scaleX: 2.8, opacity: 0.6, duration: 0.22 }, 0)
        if (text) tl.to(text, { y: -28, duration: 0.22 }, 0)
        if (cue) tl.to(cue, { autoAlpha: 0, duration: 0.04 }, 0.02)

        /* IRIS: view 2 blooms from the light's own origin */
        if (views[1]) tl.to(views[1], { clipPath: 'circle(160% at 12% 8%)', duration: 0.26 }, 0.22)

        /* SLIDE: view 3 in from the right, view 2 pushed a third left */
        if (views[2]) tl.to(views[2], { xPercent: 0, duration: 0.16, ease: 'power1.inOut' }, 0.5)
        if (views[1]) tl.to(views[1], { xPercent: -30, duration: 0.16, ease: 'power1.inOut' }, 0.5)

        /* ZOOM: through the fabric of the seat, and then out.

           There is no fixed sheet any more (PART B, client call): the room
           goes dark inside the hero and the studio's paper is the cut. */
        if (viewsWrap) tl.to(viewsWrap, { scale: 2.6, duration: 0.34, ease: 'power2.in' }, 0.66)
        if (text) tl.to(text, { autoAlpha: 0, y: -90, duration: 0.12 }, 0.66)
        if (counter) tl.to(counter, { autoAlpha: 0, duration: 0.06 }, 0.66)
        if (vignette) tl.to(vignette, { opacity: 0.7, duration: 0.2 }, 0.66)
        if (out) tl.to(out, { opacity: 1, duration: 0.28, ease: 'power2.in' }, 0.72)
      }

      /* ---- chrome: the header turns solid past the hero, the sticky pill
         yields to the hero's own CTA, the chrome turns to ink over paper */
      ScrollTrigger.create({
        start: () => window.innerHeight * 0.6,
        end: 'max',
        onToggle: (st) => {
          header?.classList.toggle(d.hdrSolid, st.isActive)
          if (st.isActive) delete root.dataset.heroView
          else root.dataset.heroView = '1'
        },
      })
      if (studio) {
        /* ink chrome over paper, for exactly the studio's own height */
        ScrollTrigger.create({
          trigger: studio,
          start: 'top 60px',
          end: 'bottom 60px',
          invalidateOnRefresh: true,
          onToggle: (st) => {
            header?.classList.toggle(d.hdrPaper, st.isActive)
            if (st.isActive) root.dataset.onPaper = '1'
            else delete root.dataset.onPaper
          },
        })

        /* the three marks draw themselves on, one stroke at a time, as the
           points arrive: hand-drawn is the impression, and a line that is
           actually drawn is the cheapest honest way to give it */
        const points = studio.querySelector<HTMLElement>('[data-points]')
        if (points) {
          const strokes = gsap.utils.toArray<SVGPathElement | SVGCircleElement>(
            '[data-mark] path, [data-mark] circle',
            points,
          )
          strokes.forEach((el) => {
            const len = 'getTotalLength' in el ? el.getTotalLength() : 0
            if (len) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
          })
          /*
            THE THREE POINTS ARRIVE ONE AT A TIME (client: "animate the
            icons sections on scroll with gsap").

            They used to lean entirely on the CSS reveal - a 0.13s
            transition-delay per card - with the marks drawing themselves
            underneath it, and the two were on different clocks, so the
            sequence read as three cards appearing at once with some line
            work happening somewhere. It is one timeline now, and each
            point is a beat: the card lifts, its mark draws, then its words
            settle. Three beats, 0.16s apart, which is slow enough to read
            as drawn, then built, then delivered.

            data-wait comes off first: the reveal system's CSS is the no-JS
            truth, and GSAP cannot animate an element the CSS is holding.
          */
          const cards = gsap.utils.toArray<HTMLElement>('[data-reveal]', points)
          const beats = cards.map((card) => ({
            card,
            body: gsap.utils.toArray<HTMLElement>('h3, p, button', card),
            mark: card.querySelector<HTMLElement>('[data-mark]'),
          }))
          cards.forEach((card) => card.removeAttribute('data-wait'))
          /* the reveal system's CSS transition would fire on every frame
             GSAP writes, smearing a 0.7s tween into a laggy one. Whoever
             owns the element owns its transition too. */
          gsap.set(cards, { autoAlpha: 0, y: 34, transition: 'none' })
          beats.forEach((b) => {
            if (b.mark) gsap.set(b.mark, { scale: 0.86, transformOrigin: '50% 60%' })
            gsap.set(b.body, { autoAlpha: 0, y: 12 })
          })

          ScrollTrigger.create({
            trigger: points,
            start: 'top 78%',
            once: true,
            onEnter: () => {
              const tl = gsap.timeline()
              beats.forEach((b, i) => {
                const at = i * 0.16
                tl.to(b.card, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, at)
                if (b.mark) {
                  tl.to(b.mark, { scale: 1, duration: 0.9, ease: 'power2.out' }, at)
                  tl.to(
                    gsap.utils.toArray('path, circle', b.mark),
                    { strokeDashoffset: 0, duration: 0.85, ease: 'power2.out', stagger: 0.03 },
                    at + 0.1,
                  )
                }
                tl.to(
                  b.body,
                  { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.06 },
                  at + 0.28,
                )
              })
            },
          })
        }

        /* ============ CH.2b · SIGNATURE PIECES ============

           NOTHING HAPPENS HERE ON SCROLL, AND THAT IS THE FEATURE.

           This chapter was a horizontal rail twice: pinned, then drifting,
           then pinned again with the travel slowed down. Every version had
           the same fault underneath it, and the client found it each time:
           "how can a customer check that product - annoying for customer",
           "first product image is hidden and customer can never see that -
           make it normal without any onscroll effect".

           A moving strip is a way to PRESENT a set. It is not a way to
           SHOP one. Whatever the travel is doing, at any given moment some
           pieces are off the left edge and some have not arrived, so the
           one question this chapter exists to answer - "which of these do
           I want?" - can never be answered from a standing start.

           So the six pieces are a plain grid now: all of them on the page,
           none of them moving, each one a tap away from a WhatsApp thread
           that already names it. The only motion is the page's ordinary
           reveal, which the CSS in lib/reveal.ts already owns - there is
           no code here because there is nothing left to drive.

           The rooms wall above KEEPS its rail, and the contrast is now
           doing real work: the wall is the showroom you are walked
           through, this is the shelf you pick from. */

        /* ================= CH.2 · PRINT: the founding line ==============
           One scrubbed timeline: the line draws itself with a brass dot
           riding the pen's tip; as the dot reaches each year's tick the
           tick lights, the milestone slides in out of a blur and its year
           counts up from 2020. The one place numbers move on the page. */
        const block = studio.querySelector<HTMLElement>('[data-timeline]')
        if (block) {
          const svg = block.querySelector<SVGSVGElement>('svg')
          const line = block.querySelector<SVGPathElement>('[data-tl-line]')
          const dot = block.querySelector<SVGCircleElement>('[data-tl-dot]')
          const ticks = gsap.utils.toArray<SVGPathElement>('[data-tl-tick]', block)
          const items = gsap.utils.toArray<HTMLElement>('[data-milestone]', block)
          const drawn = !!svg && getComputedStyle(svg).display !== 'none'
          const n = Math.max(1, items.length - 1)
          const t = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: block, start: 'top 85%', end: 'top 30%', scrub: 0.6 },
          })
          if (drawn && line && dot) {
            const len = line.getTotalLength()
            gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
            gsap.set(dot, { attr: { cx: 0 }, opacity: 1 })
            ticks.forEach((tk) => {
              const tl2 = tk.getTotalLength()
              gsap.set(tk, { strokeDasharray: tl2, strokeDashoffset: tl2 })
            })
            t.to(line, { strokeDashoffset: 0, duration: 1 }, 0)
            t.to(dot, { attr: { cx: 1000 }, duration: 1 }, 0)
          }
          items.forEach((li, i) => {
            const at = (i / n) * 0.9
            gsap.set(li, { x: -20, autoAlpha: 0, filter: 'blur(6px)' })
            t.to(li, { x: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.1, ease: 'power2.out' }, at)
            if (drawn && ticks[i]) {
              t.to(ticks[i], { strokeDashoffset: 0, duration: 0.03 }, at)
              t.to(ticks[i], { attr: { stroke: '#c9a45c' }, duration: 0.03 }, at)
            }
          })
        }
      }


      /*
        ONE CHAPTER PER FRAME.

        Everything below used to be built in a single synchronous pass, and
        the QA trace found exactly that: a 1,018 ms task at 2.34 s on a 4x
        throttled phone - the moment the GSAP chunk lands and every pin,
        scrub and trigger on a 13,000 px page is created at once. The page
        stops answering input right when the visitor starts to scroll.

        Splitting it in two would barely help (a task is only charged for
        what it costs OVER 50 ms, so one 1,000 ms task and two 500 ms ones
        are nearly the same bill). What helps is many SMALL tasks, so each
        chapter's setup gets its own frame and the browser can answer a tap
        between any two of them.

        Order is deliberate: the hero and the studio are built immediately,
        because they are what the visitor is looking at. The floor is one
        frame later, the drafting table the next, the rest after that -
        all of them long before a scroll could reach them, and any one of
        them is a fraction of the task it used to be part of.

        `killed` is the contract with the cleanup below: React can unmount
        this layer before the queue drains, and a chapter set up after
        teardown would register triggers nobody would ever remove.
      */
      let killed = false
      let frame = 0
      const queue: Array<() => void> = []

      /*
        ...AND ONE REFRESH WHEN THE QUEUE IS EMPTY.

        This is not optional and it is why the split needs care. Every pin
        inserts a spacer, which changes the height of the document, which
        moves the start and end of every trigger measured before it. In one
        synchronous pass ScrollTrigger settled that itself at the end of the
        tick. Spread over frames, the hero was measured against a document
        that did not yet contain the floor's pin or the table's, so its
        numbers were stale by the time the visitor scrolled - pins starting
        early, scrubs finishing before their section, chapters that simply
        did not fire.

        So: measure once more, after the last chapter is in.

        AND SORT BEFORE MEASURING. A plain refresh() recalculates triggers
        in the order they were CREATED, and the queue creates them out of
        document order - the signature chapter is built in the first pass,
        the floor's pin a frame later, and the floor is above it. So
        signature was re-measured against a document that still did not
        include the pin spacer sitting above it, and its whole drift landed
        1388 px early: by the time the chapter reached the screen the
        strip had already finished travelling. sort() puts them back in
        start order, so every pin above is accounted for before the
        chapters below it are measured.
      */
      const remeasure = () => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }
      const drain = () => {
        const next = queue.shift()
        if (killed || !next) return
        next()
        if (queue.length) frame = requestAnimationFrame(drain)
        else remeasure()
      }
      const later = (fn: () => void) => {
        queue.push(fn)
        if (queue.length === 1) frame = requestAnimationFrame(drain)
      }

      /* and if the visitor scrolls before the queue has drained, they are
         ahead of us: build the rest now rather than one frame at a time
         underneath a moving page */
      const flush = () => {
        if (killed || !queue.length) return
        cancelAnimationFrame(frame)
        while (queue.length) queue.shift()!()
        remeasure()
      }
      window.addEventListener('wheel', flush, { passive: true, once: true })
      window.addEventListener('touchstart', flush, { passive: true, once: true })
      window.addEventListener('keydown', flush, { once: true })

      cleanups.push(() => {
        killed = true
        cancelAnimationFrame(frame)
        queue.length = 0
        window.removeEventListener('wheel', flush)
        window.removeEventListener('touchstart', flush)
        window.removeEventListener('keydown', flush)
      })

      /* the elements the cleanup below still needs by name, read now rather
         than inside the deferred blocks that used to declare them */
      const floor = q('#floor')
      const track = q('[data-track]')
      const table = q('#table')

      /* ================= CH.3 · THE FLOOR (the glass wall) ============= */
      later(() => {
        if (floor && track) {
          const cards = gsap.utils.toArray<HTMLElement>('[data-rcard]', track)
          const bar = q('[data-rail-bar] i')
          /* THE RAIL IS THE CHAPTER, ON EVERY SCREEN.

             The phone used to get a native scroll-snap carousel instead: the
             reasoning was that a pinned rail under a thumb fights vertical
             momentum. In practice it meant the one chapter that moves did not
             move on the device most visitors are holding - the visitor had to
             find the strip and swipe it sideways, and most never did (client:
             "in mobile view categories section on scroll not gsap way not auto
             scrolling ... every sections should have some effects on scroll").

             So the pin runs everywhere and the phone simply travels less: the
             plates are smaller there, so `dist()` is smaller, and the chapter
             holds for about a screen and a half rather than three. Vertical
             scrolling still drives it - nothing here asks for a sideways
             gesture. The server HTML is still the snap carousel, which is what
             a no-JS or reduced-motion visitor keeps. */
          {
            floor.dataset.rail = ''
            const dots = gsap.utils.toArray<HTMLElement>('[data-dots] i')
            const swipe = q('[data-swipe]')
            /* HOW FAR THE WALL HAS TO TRAVEL, measured off the LAST PLATE
               rather than off scrollWidth.

               `scrollWidth - clientWidth` looks like the overflow and is
               not: on a flex row with `overflow: visible` the browser
               leaves the container's own end padding out of scrollWidth,
               so the rail stopped one --pad-x short and the fifth room
               (Bespoke) was still half off the right edge when the pin
               released (client: "category onscroll not showing end
               category card"). The last plate's right edge plus that
               padding IS the answer, and reading it from the two rects
               makes the transform cancel, so it stays correct when
               ScrollTrigger re-measures mid-chapter. */
            const dist = () => {
              const last = cards[cards.length - 1]
              if (!last) return 0
              const pad = parseFloat(getComputedStyle(track).paddingInlineEnd) || 0
              const end = last.getBoundingClientRect().right - track.getBoundingClientRect().left
              return Math.max(0, Math.round(end + pad - track.clientWidth))
            }
            /* THE PIN AND THE TRAVEL ARE TWO TRIGGERS, and the pin is the
               longer one.

               With one trigger they ended together, and `scrub` lags on
               purpose - it takes about a second to catch up - so at the
               moment the chapter released, the rail was still ~35px short.
               The fifth room finished arriving while the section was
               already scrolling away, which from a chair looks exactly
               like a rail that never reaches its last plate (client:
               "category onscroll not showing end category card").

               So the chapter now holds for the travel PLUS half a screen.
               The scrub finishes inside that tail, and the last room then
               stands still long enough to be read - which is the beat the
               other four each got from the one after them. */
            const tail = () => Math.round(window.innerHeight * 0.5)
            ScrollTrigger.create({
              trigger: floor,
              start: 'top top',
              end: () => '+=' + (dist() + tail()),
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            })
            const travel = gsap.to(track, {
              x: () => -dist(),
              ease: 'none',
              scrollTrigger: {
                trigger: floor,
                start: 'top top',
                end: () => '+=' + dist(),
                scrub: 0.6,
                invalidateOnRefresh: true,
                onUpdate: (st) => {
                  if (bar) gsap.set(bar, { scaleX: st.progress })
                  /* the dots read the rail's progress rather than the track's
                     scrollLeft, which no longer moves now that GSAP owns the
                     transform */
                  const i = Math.min(
                    cards.length - 1,
                    Math.round(st.progress * (cards.length - 1)),
                  )
                  dots.forEach((dot, j) => {
                    if (j === i) dot.dataset.on = ''
                    else delete dot.dataset.on
                  })
                  if (swipe) swipe.style.opacity = st.progress > 0.02 ? '0' : ''
                },
              },
            })
            /* each frame turns to face the visitor as it enters from the right */
            cards.forEach((card) => {
              gsap.fromTo(
                card,
                /* .7, not .4: the brass plaque on a waiting frame must still
                   read 4.5:1 (the audit measures the page at rest) */
                { rotateY: 16, opacity: 0.7, transformPerspective: 900 },
                {
                  rotateY: 0,
                  opacity: 1,
                  ease: 'power2.out',
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: travel,
                    start: 'left 92%',
                    end: 'left 55%',
                    scrub: true,
                  },
                },
              )
            })
          }

          /* ---- THE LIVE PLATE ----
             One room is in colour at a time: the one nearest the middle of
             the screen. On the rail that is a function of the travel, on a
             phone of the snap position, so it is one rule rather than two
             behaviours. Runs on the ticker (a rect read per frame per card,
             five of them) rather than on scroll, because the rail moves the
             cards with a transform the scroll never sees. */
          const marks = () => {
            const mid = window.innerWidth / 2
            let best: HTMLElement | null = null
            let bestD = Infinity
            cards.forEach((card) => {
              const b = card.getBoundingClientRect()
              const d = Math.abs(b.left + b.width / 2 - mid)
              if (d < bestD) {
                bestD = d
                best = card
              }
            })
            cards.forEach((card) => {
              if (card === best) card.dataset.focus = ''
              else delete card.dataset.focus
            })
          }
          marks()
          gsap.ticker.add(marks)
          cleanups.push(() => {
            gsap.ticker.remove(marks)
            cards.forEach((card) => delete card.dataset.focus)
          })

          /* THE PLATES UNDER A POINTER: each tilts a few degrees toward the
             cursor and a pool of light follows it across the glass. One
             pointermove per plate, custom properties and transforms only; a
             finger gets none of it. */
          if (fine) {
            const cursor = q('[data-floor-cursor]')
            if (cursor) {
              const setX = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
              const setY = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
              const onFloorMove = (e: PointerEvent) => {
                if (e.pointerType !== 'mouse') return
                setX(e.clientX)
                setY(e.clientY)
                cursor.dataset.on = ''
                if ((e.target as Element).closest('[data-frame]')) cursor.dataset.over = ''
                else delete cursor.dataset.over
              }
              const onFloorLeave = () => {
                delete cursor.dataset.on
                delete cursor.dataset.over
              }
              floor.addEventListener('pointermove', onFloorMove)
              floor.addEventListener('pointerleave', onFloorLeave)
              cleanups.push(() => {
                floor.removeEventListener('pointermove', onFloorMove)
                floor.removeEventListener('pointerleave', onFloorLeave)
                onFloorLeave()
              })
            }

            gsap.utils.toArray<HTMLElement>('[data-frame]', track).forEach((frame) => {
              let raf = 0
              const move = (e: PointerEvent) => {
                if (raf) return
                raf = requestAnimationFrame(() => {
                  raf = 0
                  const r = frame.getBoundingClientRect()
                  const px = (e.clientX - r.left) / r.width
                  const py = (e.clientY - r.top) / r.height
                  frame.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
                  frame.style.setProperty('--rx', `${(0.5 - py) * 9}deg`)
                  frame.style.setProperty('--mx', `${px * 100}%`)
                  frame.style.setProperty('--my', `${py * 100}%`)
                })
              }
              const leave = () => {
                frame.style.setProperty('--ry', '0deg')
                frame.style.setProperty('--rx', '0deg')
              }
              frame.addEventListener('pointermove', move)
              frame.addEventListener('pointerleave', leave)
              cleanups.push(() => {
                frame.removeEventListener('pointermove', move)
                frame.removeEventListener('pointerleave', leave)
                leave()
              })
            })
          }
        }

      })

      /* ================= CH.4 · THE DRAFTING TABLE ================= */
      later(() => {
        /*
          NO TIER GATE HERE ANY MORE.

          This whole block used to sit behind `tier !== 'low'`, on the belief
          that the chapter was the 3D. It is not: the chapter is a piece being
          DESIGNED, CRAFTED and CUSTOMIZED, and since Skeleton.tsx the drawing
          tells all three by itself. Gating the story on WebGL left a low-tier
          visitor with three headings lighting up over a stage where nothing
          ever happened (client: "on scroll texts are highlighting only").

          Everything below is DOM opacity and two CSS custom properties. The
          3D reads the same numbers when it exists and ignores them when it
          does not.
        */
        if (table) {
          const stage = q('[data-stage-bespoke]')
          const steps = gsap.utils.toArray<HTMLElement>('[data-step]', table)
          const dock = q('[data-swatch-dock]')
          const pinned = window.innerHeight >= 560

          /* the drawing's own build, on the same clock as the mesh's.
             `--sweep` is the CRAFTED phase alone, mapped out of the whole
             progress, so the material rises off the floor over the middle
             third and nowhere else. */
          const setBuild = (p: number) => {
            if (!stage) return
            stage.style.setProperty('--build', p.toFixed(3))
            const sweep = Math.min(Math.max((p - 0.28) / 0.38, 0), 1)
            stage.style.setProperty('--sweep', sweep.toFixed(3))
          }
          setBuild(0)
          cleanups.push(() => {
            stage?.style.removeProperty('--build')
            stage?.style.removeProperty('--sweep')
          })

          /* THE ARRIVAL, before the pin: the drawing draws itself in and the
             piece settles onto the table as the chapter comes into view */
          stageState.bespokeArrival = 0
          if (stage) stage.dataset.drafting = ''
          ScrollTrigger.create({
            trigger: table,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(stageState, { bespokeArrival: 1, duration: 0.9, ease: 'power2.out' })
              if (stage) delete stage.dataset.drafting
            },
          })

          if (pinned) {
            table.dataset.pinned = ''
            if (steps.length) {
              gsap.set(steps[0], { opacity: 1 })
              gsap.set(steps.slice(1), { opacity: STEP_FLOOR })
            }
            if (dock) gsap.set(dock, { autoAlpha: 0, y: 18 })
            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: table,
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                anticipatePin: 1,
              },
            })
            tl.to(
              stageState,
              {
                bespokeProgress: 1,
                duration: 3,
                onUpdate: () => setBuild(stageState.bespokeProgress),
              },
              0,
            )
            if (steps.length === 3) {
              tl.to(steps[0], { opacity: STEP_FLOOR, duration: 0.25 }, 0.9)
                .to(steps[1], { opacity: 1, duration: 0.25 }, 0.9)
                .to(steps[1], { opacity: STEP_FLOOR, duration: 0.25 }, 1.9)
                .to(steps[2], { opacity: 1, duration: 0.25 }, 1.9)
            }
            if (dock) tl.to(dock, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 2.1)
          } else {
            gsap.fromTo(
              stageState,
              { bespokeProgress: 0 },
              {
                bespokeProgress: 1,
                ease: 'none',
                onUpdate: () => setBuild(stageState.bespokeProgress),
                scrollTrigger: { trigger: table, start: 'top 75%', end: 'center 45%', scrub: 1, invalidateOnRefresh: true },
              },
            )
          }
        }

      })

      later(() => {
        /* ================= CH.5 · DIM ================= */
        const dim = q('[data-dim]')
        const maker = q('#maker')
        if (dim && maker) {
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

        /* ================= THE MAP ================= */
        const map = q('[data-map]')
        const you = map?.querySelector<SVGCircleElement>('[data-map-you]')
        const mapNo = map?.querySelector<HTMLElement>('[data-map-no]')
        const mapName = map?.querySelector<HTMLElement>('[data-map-name]')
        if (map && you) {
          gsap.set(you, { attr: { transform: '' } })
          const goTo = (id: string) => {
            const room = map.querySelector<SVGGElement>(`[data-map-room="${id}"]`)
            if (!room) return
            map.querySelectorAll('[data-here]').forEach((r) => r.removeAttribute('data-here'))
            room.dataset.here = ''
            room.dataset.lit = ''
            gsap.to(you, { x: Number(room.dataset.x), y: Number(room.dataset.y), duration: 0.9, ease: 'power2.inOut' })
            const ch = night.chapters.find((c) => c.id === id)
            if (ch && mapNo && mapName) {
              mapNo.textContent = ch.no
              mapName.textContent = ch.name
            }
          }
          goTo('room')
          gsap.utils.toArray<HTMLElement>('[data-chapter]').forEach((sec) => {
            const id = sec.dataset.chapter ?? ''
            ScrollTrigger.create({
              trigger: sec,
              start: 'top 50%',
              end: 'bottom 50%',
              onEnter: () => goTo(id),
              onEnterBack: () => goTo(id),
            })
          })
        }

        /* ================= THE NAV SCROLLER =================
           Every in-page anchor (header, footer, the frames' "see it drawn")
           goes through the scroller instead of a native hash jump. A jump
           lands inside a pin's spacer, where Lenis and ScrollTrigger disagree
           about where the section is (the "Showroom -> white screen" bug); the
           target here is the section's own pin start when it is pinned, and
           its top otherwise, and the page travels there through the scroll
           the motion layer is watching. */
        const scrollTo = (id: string, instant = false) => {
          const target = id === 'top' ? document.body : document.getElementById(id)
          if (!target) return false
          const pin = ScrollTrigger.getAll().find(
            (t) => t.pin && (t.trigger === target || target.contains(t.trigger as Node)),
          )
          /* THE HEADER IS FIXED, so an un-pinned chapter's own top is not
             where it can be READ from: landing there puts its tag and the
             first line of its heading behind the header. A pinned chapter is
             different - pin.start IS the section held at the top, and its own
             padding is what clears the chrome. */
          const chrome = pin ? 0 : (header?.offsetHeight ?? 0) + 16
          const y =
            id === 'top'
              ? 0
              : pin
                ? pin.start
                : Math.max(0, target.getBoundingClientRect().top + window.scrollY - chrome)
          const lenis = getLenis()
          if (instant) window.scrollTo(0, y)
          else if (lenis) lenis.scrollTo(y, { duration: 1.4, easing: (x) => 1 - Math.pow(1 - x, 3) })
          else window.scrollTo({ top: y, behavior: 'smooth' })
          return true
        }
        const onClick = (e: MouseEvent) => {
          if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
          const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
          if (!a) return
          const id = a.getAttribute('href')?.slice(1)
          if (!id) return
          if (scrollTo(id)) {
            e.preventDefault()
            history.replaceState(null, '', '#' + id)
          }
        }
        document.addEventListener('click', onClick)
        cleanups.push(() => document.removeEventListener('click', onClick))

        /* THE MAP IS ALSO THE MENU. Every room on the plan takes the visitor
           to its chapter through the same scroller. Mouse only (the CSS gives
           the rooms pointer-events on a fine pointer): at 104px wide on a
           phone the rooms are far under any honest tap target, and the burger
           menu is right there. */
        const onMapClick = (e: MouseEvent) => {
          const room = (e.target as Element).closest<HTMLElement>('[data-map-room]')
          const id = room?.dataset.mapRoom
          if (!id) return
          if (scrollTo(id)) history.replaceState(null, '', '#' + id)
        }
        map?.addEventListener('click', onMapClick)
        cleanups.push(() => map?.removeEventListener('click', onMapClick))
        /* the phone menu asks the scroller to travel once its sheet is shut */
        const onGoto = (e: Event) => {
          const id = (e as CustomEvent<string>).detail
          if (scrollTo(id)) {
            e.preventDefault()
            history.replaceState(null, '', '#' + id)
          }
        }
        window.addEventListener('night:goto', onGoto)
        cleanups.push(() => window.removeEventListener('night:goto', onGoto))

        /* a visitor arriving with a hash (a room page's "Back to the floor")
           was placed by the browser before the pins existed; place them again
           now that the layout is real */
        const hash = location.hash.slice(1)
        if (hash && document.getElementById(hash)) {
          ScrollTrigger.refresh()
          scrollTo(hash, true)
        }

      })

      return () => {
        cleanups.forEach((fn) => fn())
        delete root.dataset.night
        header?.classList.remove(d.hdrSolid, d.hdrPaper)
        delete root.dataset.onPaper
        if (window.scrollY < window.innerHeight / 2) root.dataset.heroView = '1'
        else delete root.dataset.heroView
        if (floor) delete floor.dataset.rail
        if (table) delete table.dataset.pinned
        stageState.bespokeProgress = 0
        stageState.bespokeArrival = 1
      }
    })
  })

  return null
}
