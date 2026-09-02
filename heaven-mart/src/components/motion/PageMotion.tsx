'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ticker } from '@/content/copy'
import { detectTier, prefersLightweight } from '@/lib/device'
import { stageState } from '@/lib/stage-state'
import { runPreloader, shouldShowPreloader } from './preloader'
import s from '@/components/sections/sections.module.css'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

/* Contrast-safe dim floors (WCAG math, not guesses): the dim-to-bright
   floor is what Lighthouse snapshots, so the DIMMED state must still pass
   4.5:1 against its section ground.
     ivory #F4F0E8 + brown text: floor 0.66 -> 4.88:1 (0.6 was 4.05, fails)
     ink   #0C1312 + ivory text: floor 0.50 -> 4.84:1 (0.45 was 4.10, fails)
   The scrub still travels to 1; only the start brightened. */
const DIM_FLOOR_LIGHT = 0.66
const DIM_FLOOR_DARK = 0.5
/* S3's pinned steps nest a .placard-line at CSS opacity 0.85 inside the
   dimmed container, so the container floor must satisfy 0.85 x f >= the
   dark floor: 0.58 -> line lands at 0.493 = 4.77:1, word at 5.7:1. */
const STEP_FLOOR = 0.58

function dimFloorFor(el: HTMLElement): number {
  return el.closest('.light') ? DIM_FLOOR_LIGHT : DIM_FLOOR_DARK
}

/**
 * The ONE motion orchestrator (Sprint 2). Mounted last in page.tsx and renders
 * nothing: every section stays a Server Component and this island animates
 * them through DOM selectors and data-* hooks. Two hard rules govern the file:
 *
 * 1. Initial hidden/dim states are set ONLY from JS (from/fromTo tweens), so
 *    with JavaScript disabled the server HTML is fully visible and readable.
 * 2. Everything lives inside gsap.matchMedia(): under prefers-reduced-motion
 *    not a single tween is created, which combined with rule 1 means reduced
 *    motion users get the complete static page, not a half-hidden one. The
 *    golden thread and its triangle then simply stand fully drawn.
 *
 * Motion grammar (PLAN Part 2.5): power2/power3/expo out, 0.6 to 1.2s,
 * scrub: 1 for everything scroll-driven. No bounce, no elastic.
 */
export function PageMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia()

    /* One combined add: crossing 900px must rebuild the S4 rail (and revert
       the pin spacer), and matchMedia's revert-and-rerun is exactly that. */
    mm.add(
      {
        motionOK: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 900px)',
        /* PINNING NEEDS HEADROOM. A pinned sheet holds ALL of its content
           against one viewport, so on a short window (a 591px laptop with
           the bookmarks bar open, measured) the bottom of the sheet is
           simply cut off for the whole pin - the CTA sat 260px below the
           fold with no way to reach it. Under this height the pins are not
           created and both sheets fall back to their spacious scroll
           layouts, which fit any window because they scroll.

           768, measured twice: at 640 a 740px phone and a 760px laptop both
           still pinned and both were still over budget (88px and 26px). The
           compressed pinned layouts genuinely fit from 768 up; below it the
           scroll layout is simply the better page. */
        tall: '(min-height: 768px)',
      },
      (ctx) => {
        const { motionOK, desktop, tall } = ctx.conditions as {
          motionOK: boolean
          desktop: boolean
          tall: boolean
        }
        /* reduced motion: create nothing at all (rule 2 above) */
        if (!motionOK) return

        /* ---- a · hero load-in: masked lines rise, then the quiet bits ----
           mask: 'lines' makes SplitText build its own overflow-clip wrappers,
           so no CSS is needed and reverting restores the original markup.
           autoSplit re-splits when Fraunces swaps in; returning the tween from
           onSplit lets SplitText revert and replay it against fresh lines.
           Deferred because the preloader invokes it from an async timeline
           callback: first visit it fires as the S0 curtain lifts, later
           visits it fires immediately. ctx.add is GSAP's official way to add
           animations to a matchMedia context AFTER its setup ran, and unlike
           useGSAP's contextSafe it cannot create a parent/child context
           cycle (contextSafe here recursed Context.getTweens to a stack
           overflow on the first breakpoint revert). */
        /* Same reasoning as the preloader (see shouldShowPreloader): the
           masked-lines intro sets the h1's hidden initial state from JS, so
           on a slow device the headline waits for GSAP to parse before it can
           be read at all. Lightweight visitors get it painted, immediately,
           by the server HTML - which is the state this whole file's rule 1
           exists to guarantee. */
        const lightweight = prefersLightweight()

        const startHeroIntro = () => {
          if (lightweight) return
          ctx.add(() => {
            /* ---- THE POWER COMES BACK ON (BLUEPRINT SS5.6, stated first) ----

               The page's recurring event is a light returning: Sheet 02's
               loadshedding cut, the tube striking over every photograph, the
               floodlight dipping as the turntable revolves. All of it used to
               begin on Sheet 02, which meant the hero — the one screen every
               visitor sees — was the only part of the page that did not do
               the thing the page is about.

               So the room now arrives the way a Chattogram showroom does
               after a cut: dark, drained of colour, and then the tube
               strikes. Two fast flickers, then the room is warm and in full
               colour. The whole event is 1.8s and it lands under the
               headline's own entrance, so nothing waits on it.

               INVERSION LAW, as everywhere: the CSS describes the finished
               room. This pushes it back to the blackout and animates forward,
               so no JS, reduced motion or a thrown tween all leave a visitor
               looking at the lit room rather than a dark one. */
            const room = document.querySelector<HTMLElement>('[data-hero-photo]')
            if (room) {
              gsap.fromTo(
                room,
                { filter: 'grayscale(1) brightness(0.18) contrast(1.3)' },
                {
                  /* keyframes, not a tween: a fluorescent tube does not fade
                     up, it catches, fails, catches again and holds. The dips
                     are what make people read it as a light rather than as an
                     opacity animation. */
                  keyframes: [
                    { filter: 'grayscale(0.9) brightness(0.9) contrast(1.2)', duration: 0.09 },
                    { filter: 'grayscale(1) brightness(0.22) contrast(1.3)', duration: 0.1 },
                    { filter: 'grayscale(0.5) brightness(1.15) contrast(1.1)', duration: 0.08 },
                    { filter: 'grayscale(0.6) brightness(0.45) contrast(1.2)', duration: 0.12 },
                    { filter: 'none', duration: 1.1, ease: 'power2.out' },
                  ],
                  delay: 0.35,
                },
              )
            }

            SplitText.create('h1.statement', {
            type: 'lines',
            mask: 'lines',
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.0,
                ease: 'power3.out',
                stagger: 0.09,
              }),
            })

            /* eyebrow, sub and CTA follow the headline; the delay roughly
             matches the last line clearing its mask */
            gsap.from('[data-hero-fade]', {
            y: 26,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power2.out',
            stagger: 0.12,
            delay: 0.55,
            })

            /* the thread's start: a short brass rule draws under the h1 right
             as the SplitText intro lands. expo.out reads as a confident
             single pen stroke, not a UI wipe. */
            gsap.from('[data-hero-rule]', {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: 0.9,
              ease: 'expo.out',
              delay: 1.2,
            })
          })
        }

        /* ---- S0 · preloader ----
           Inside the motion-OK block on purpose: reduced motion gets no
           overlay at all. Repeat visitors in the same session skip straight
           to the hero intro (sessionStorage flag, guarded). */
        let preloaderCleanup: (() => void) | null = null
        if (shouldShowPreloader()) {
          preloaderCleanup = runPreloader(startHeroIntro)
        } else {
          startHeroIntro()
        }

        /* ---- golden thread (PLAN Part 2.5 "the signature") ----
           A fixed 1px spine on the left gutter, drawn top-to-bottom by total
           page progress. scaleY on a div beats SVG dashoffset here: one
           transform, no path measuring, identical look at 1px wide. CSS keeps
           it fully drawn by default so no-JS and reduced-motion both see the
           finished thread. */
        const thread = document.querySelector<HTMLElement>('[data-thread]')
        if (thread) {
          gsap.fromTo(
            thread,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: 'main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        }

        /* the tie-off: the gold triangle appears at the thread's tip once the
           footer arrives. Event-tweened, not scrubbed: a tie-off is a small
           ceremony, it should complete on its own once earned. */
        const tip = document.querySelector<HTMLElement>('[data-thread-tip]')
        const pageFooter = document.querySelector<HTMLElement>('main > footer')
        if (tip && pageFooter) {
          gsap.set(tip, { autoAlpha: 0 })
          ScrollTrigger.create({
            trigger: pageFooter,
            start: 'top 80%',
            onEnter: () =>
              gsap.to(tip, { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }),
            onLeaveBack: () =>
              gsap.to(tip, { autoAlpha: 0, duration: 0.4, ease: 'power2.out' }),
          })
        }

        /* ---- the sticky pill defers to the hero's own CTA ----
           While the hero is on screen the real CTA is right there, so the
           floating pill is both redundant and (at 390px) physically on top
           of it. Structural spacing already keeps them apart; this makes the
           first viewport read as ONE call to action, which is the rule. */
        const stickyHost = document.documentElement
        /* Anchored to S2, NOT to the hero: the hero is pinned (pinSpacing
           false), so its own start/end never resolve to stable scroll
           positions and the flag would stick on forever (verified: the pill
           never came back). S2 is unpinned, so "its top has reached 85% of
           the viewport" is a reliable "the hero is leaving" signal. */
        const curtainForPill = document.querySelector<HTMLElement>('[data-curtain]')
        if (curtainForPill) {
          /* the flag now ARRIVES in the server HTML (layout.tsx) rather than
             being set here, so it is correct on first paint and correct with
             JavaScript off; this block only ever takes it away */
          ScrollTrigger.create({
            trigger: curtainForPill,
            start: 'top 85%',
            onEnter: () => delete stickyHost.dataset.heroView,
            onLeaveBack: () => {
              stickyHost.dataset.heroView = '1'
            },
          })
        }

        /* ---- S1 -> S2 · the ivory curtain (PLAN 2.5) ----
           "The room lights come on": the hero pins with pinSpacing: false,
           so the document keeps its exact no-JS height while S2 slides up
           OVER the dark stage. End is a full viewport, not the plan's 60-80:
           the un-pin snaps the hero back into flow, and that snap is only
           invisible once the curtain has covered 100% of it. The 3D chair
           cannot bleed through because S2 and the ticker sit at z-index 5,
           one layer above the fixed canvas (4). */
        const heroSec = document.querySelector<HTMLElement>('main > header')
        const curtainSec = document.querySelector<HTMLElement>('[data-curtain]')
        if (heroSec && curtainSec) {
          /* ---- S1 · THE TURNTABLE, UNPINNED (client call, 2026-09-03) ----

             The hero USED to pin for ~2 viewports while scrolling stepped
             through the five pieces. The client watched real users meet it
             and called it: scroll-as-pager reads as the page being stuck,
             because the visitor's gesture says "next section" and the page
             answers "same section, different sofa". The pieces now change
             on their own clock (the slider effect in Turntable.tsx) and by
             the arrows, and a scroll does the one thing a scroll means:
             leaves.

             What remains here is only the EXIT - the parallax of the room,
             the deepening scrim, the plinth's light going out - scrubbed
             over the single viewport the hero occupies as it hands over to
             S2. No pin, no pin spacer, no hold. */
          const heroTl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: heroSec,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          })
          heroTl
            .fromTo('[data-hero-photo]', { yPercent: 0 }, { yPercent: 18 }, 0)
            /* 0.82 -> 1: opacity above 1 clamps, so the deepening is a real
               range. JS-set start only, and the no-JS default is the FULL
               scrim, so text contrast without JS is higher, never lower. */
            .fromTo('[data-hero-scrim]', { opacity: 0.82 }, { opacity: 1 }, 0)
            .fromTo('[data-turntable]', { yPercent: 0 }, { yPercent: -10 }, 0)
            .fromTo('[data-stage-pool]', { opacity: 0.5 }, { opacity: 0 }, 0)
            .to(stageState, { heroProgress: 1 }, 0)
            /* statement drifts up faster than the page: type leaves first */
            .fromTo('[data-hero-statement]', { yPercent: 0 }, { yPercent: -60 }, 0)

          /* ---- S1 -> S2 · the ivory curtain (PLAN 2.5) ----
             "The room lights come on." S2 rises a little faster than the page
             and its top corners flatten as it takes the frame, so it reads as
             a curtain drawn up over the dark stage rather than as the next
             block of a document. Both are JS-set initial states. */
          gsap.fromTo(
            curtainSec,
            { yPercent: 6, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
            {
              yPercent: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: curtainSec,
                start: 'top bottom',
                end: 'top 15%',
                scrub: 1,
              },
            },
          )
        }

        /* ---- SHEET 05 · the aperture ----
           The showroom panel reveals through an expanding window, like
           stepping through a doorway. One-shot scrub, no pin. The end state
           has NO corner radius, because a drafting panel has none: the
           doorway opens into a drawn sheet, not a rounded card. */
        gsap.fromTo(
          '[data-aperture]',
          { clipPath: 'inset(18% 24% 18% 24%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: {
              trigger: '[data-aperture]',
              start: 'top 85%',
              end: 'top 35%',
              scrub: 1,
            },
          },
        )

        /* ---- S3 · the bespoke moment (PLAN 4.4): pinned ~300vh ----
           Gate matches the 3D gate (StageLoader): on 'low' tier there is no
           bespoke view, so there must be no pin either; the static section
           scrolls by untouched, exactly as with JS disabled. The timeline
           does NOT touch three.js: it scrubs one number into stageState and
           the scene (whenever it mounts) reads it per frame. */
        const bespokeSec = document.querySelector<HTMLElement>('#bespoke')
        /* the 3D gate and the pin gate are SEPARATE questions now. 3D exists
           on any non-low tier; the pin additionally needs a viewport tall
           enough to hold the whole sheet. Skipping the pin used to skip the
           progress scrub with it, which froze the blueprint as a wireframe
           for every short-viewport visitor - the drawing never became the
           sofa, and the sheet read as broken (client screenshot, mobile). */
        const bespoke3D = !!bespokeSec && detectTier() !== 'low'
        const bespokePinned = bespoke3D && tall

        /* ---- THE ARRIVAL, shared by both layouts: the plate strikes in and
           the piece settles a beat before the sheet is fully on screen. It
           used to live inside the pinned branch only, which meant a phone
           never got it. `once`: an arrival happens once; a return is not an
           entrance. Inversion law: the 3D's arrival number rests at 1, so
           the motion layer is what pushes it back to 0. */
        if (bespokeSec && bespoke3D) {
          const stagePanel = bespokeSec.querySelector<HTMLElement>('[data-stage-bespoke]')
          stageState.bespokeArrival = 0
          if (stagePanel) stagePanel.dataset.drafting = ''
          ScrollTrigger.create({
            trigger: bespokeSec,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(stageState, {
                bespokeArrival: 1,
                duration: 0.9,
                ease: 'power2.out',
              })
              /* the DOM half of the same beat: CSS owns the finished state;
                 removing the attribute is what lets it transition to it */
              if (stagePanel) delete stagePanel.dataset.drafting
            },
          })
        }
        if (bespokeSec && bespoke3D && !bespokePinned) {
          /* NO PIN, SAME STORY: the one number the 3D reads is scrubbed by
             the section's own passage across the viewport instead of by a
             hold. By the time the stage is centred on screen the sweep is
             done and the visitor is looking at the finished velvet piece;
             scrolling back re-draws it. Steps and dock keep their static
             fully-visible layout (inversion law): a spotlight sequence needs
             a hold to be legible, and there is no hold. */
          gsap.fromTo(
            stageState,
            { bespokeProgress: 0 },
            {
              bespokeProgress: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: bespokeSec,
                start: 'top 75%',
                end: 'center 45%',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          )
        }
        if (bespokeSec && bespokePinned) {
          /* compact pinned-state layout (stage + steps share the viewport);
             the class exists only while the pin does */
          bespokeSec.classList.add(s.isPinned)

          const steps = gsap.utils.toArray<HTMLElement>('#bespoke [data-step]')
          /* initial states, JS-only: Designed is the bright word at entry,
             the dock waits for the Customized phase */
          if (steps.length) {
            gsap.set(steps[0], { opacity: 1 })
            gsap.set(steps.slice(1), { opacity: STEP_FLOOR })
          }
          gsap.set('[data-swatch-dock]', { autoAlpha: 0, y: 24 })

          /* ---- THE ARRIVAL, and it fires BEFORE the pin ----

             THE BUG THIS FIXES, precisely: the pin starts at 'top top', so
             everything on this sheet was a function of a progress that is 0
             until the section's top reaches the top of the screen — and then
             scrub adds a second of lag on top of that. Scroll down through
             four sheets at any speed and you arrived to a stage holding a
             nearly invisible wireframe, a stack of dim words and no dock. It
             read as a section that had failed to load. It had not; it had
             simply not been asked to do anything yet.

             So the sheet now GREETS the visitor a fifth of a screen before it
             pins: the blueprint draws itself in, the piece settles onto the
             table, the first word lights and the panel's own frame is struck.
             None of it touches bespokeProgress, so the scrubbed story is
             untouched and starts from exactly where it always did.

             `once` because an arrival happens once; scrolling back up and
             down again is a return, not an entrance. */
          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: bespokeSec,
              start: 'top top',
              end: '+=300%',
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          })
          /* the one number the 3D reads: 0..1 across the whole pin */
          tl.to(stageState, { bespokeProgress: 1, duration: 3 }, 0)
          /* word spotlight swaps at the phase boundaries (1 and 2 of 3) */
          if (steps.length === 3) {
            tl.to(steps[0], { opacity: STEP_FLOOR, duration: 0.25 }, 0.9)
              .to(steps[1], { opacity: 1, duration: 0.25 }, 0.9)
              .to(steps[1], { opacity: STEP_FLOOR, duration: 0.25 }, 1.9)
              .to(steps[2], { opacity: 1, duration: 0.25 }, 1.9)
          }
          /* Customized: the dock slides in as the sweep completes */
          tl.to(
            '[data-swatch-dock]',
            { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' },
            2.1,
          )
        }

        /* ================= THE IMAGE SYSTEMS (BLUEPRINT SS5.5 / SS5.6) =====
           Both obey the same inversion, and it is the most important detail
           in this file: the CSS in sections.module.css already describes the
           FINISHED image (printed, full colour, fully lit). The code below
           first pushes each image BACK to its "before" state and only then
           animates it forward. So with JavaScript off, under reduced motion,
           or if anything here throws, the visitor is left with complete
           photographs rather than blank panels. Never invert this. */

        /* ---- THE PLOTTER PRINT: a filament sweeps down, the sheet prints,
           then colour blooms in out of grayscale. One signature entrance for
           every photograph on the page (SS5.5). Class-free on purpose: CSS
           Modules hash class names, so the state hooks are data attributes,
           which are never rewritten. */
        const printCalls: gsap.core.Tween[] = []
        gsap.utils.toArray<HTMLElement>('[data-print]').forEach((frame) => {
          frame.dataset.unprinted = ''
          /* cards inside one row print in sequence, not in unison: a stagger
             is what makes a page feel plotted rather than switched on */
          const siblings = frame.closest('[data-cards]')
            ? Array.from(document.querySelectorAll('[data-cards] [data-print]')).indexOf(frame)
            : 0
          const delay = Math.max(0, siblings) * 0.08

          ScrollTrigger.create({
            trigger: frame,
            start: 'top 78%',
            once: true,
            onEnter: () => {
              printCalls.push(
                gsap.delayedCall(delay, () => {
                  frame.dataset.printing = ''
                  delete frame.dataset.unprinted
                  /* the sweep animation is 900ms; the attribute is removed
                     after it so a re-entry can never replay a finished pass */
                  printCalls.push(
                    gsap.delayedCall(0.95, () => {
                      delete frame.dataset.printing
                      /* ...and THEN the tube over the plate catches. Two
                         beats, never one: the plotter reveals the sheet, the
                         light comes on over it. Overlapping them would put
                         two owners on `filter` and the strike would fight the
                         print's own grayscale-to-colour ramp. 620ms later the
                         attribute goes, so nothing can replay it. */
                      frame.dataset.striking = ''
                      printCalls.push(
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

        /* ---- LIVING AT REST: a barely-there Ken Burns inside the panel, so
           no photograph is ever a dead rectangle. Transform only, scrubbed,
           and it owns this element's transform outright (the hover state is
           filter-only for exactly that reason). */
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

        /* ---- THE LOADSHEDDING CUT: the room sits grey, then the light comes
           back - a pool around the bulb first, then the whole room (SS5.6).
           The scrub writes ONE custom property, which clip-path consumes on
           the compositor; nothing here touches layout. */
        gsap.utils.toArray<HTMLElement>('[data-focus]').forEach((el) => {
          gsap.fromTo(
            el,
            { '--focus-r': '12%' },
            {
              '--focus-r': '120%',
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'center 45%',
                scrub: 1,
              },
            },
          )

          /* THE FLICKER: two 60ms dips as the light catches, exactly like a
             tube striking. One-shot. This is what makes people FEEL the
             loadshedding instead of reading a gradient. */
          const lit = el.querySelector<HTMLElement>('[data-focus-lit]')
          if (!lit) return
          ScrollTrigger.create({
            trigger: el,
            start: 'top 80%',
            once: true,
            onEnter: () => {
              gsap
                .timeline()
                .to(lit, { opacity: 0.35, duration: 0.06, ease: 'none' })
                .to(lit, { opacity: 1, duration: 0.06, ease: 'none' })
                .to(lit, { opacity: 0.55, duration: 0.06, ease: 'none' })
                .to(lit, { opacity: 1, duration: 0.06, ease: 'none' })
            },
          })
        })

        /* ---- THE SWITCHOVER (BLUEPRINT SS5.7) ----
           A dark sheet's light arrives 120ms AFTER the sheet does: the beam
           dips to .4 and snaps back to 1, once per entry. A breaker being
           flipped, room to room.

           A TOGGLE, never a scrub. A scrubbed flicker judders with the wheel
           and reads as a rendering fault rather than as a light; the whole
           effect depends on it completing at its own speed regardless of how
           fast the visitor is scrolling. */
        gsap.utils.toArray<HTMLElement>('[data-beam]').forEach((beam) => {
          const sheet = beam.closest('section, header')
          if (!sheet) return
          const flip = () => {
            gsap
              .timeline()
              .set(beam, { opacity: 0.4 })
              .to(beam, { opacity: 1, duration: 0.12, ease: 'power1.out' }, '+=0.12')
          }
          ScrollTrigger.create({
            trigger: sheet,
            start: 'top 70%',
            onEnter: flip,
            onEnterBack: flip,
          })
        })

        /* ---- b · Apple-style dim-to-bright ----
           Placard lines, the S3 step words and the S7 quote sit at 0.25 until
           they cross the viewport's middle band. Linear ease: with scrub the
           scroll gesture IS the easing, a curve here would double-ease. */
        gsap.utils.toArray<HTMLElement>('.placard-line, [data-dim]').forEach((el) => {
          /* the pinned S3 runs its own word spotlight; the generic scrub
             would fight it. Unpinned (low tier) S3 keeps the generic dim. */
          if (bespokePinned && el.closest('#bespoke')) return
          gsap.fromTo(
            el,
            { opacity: dimFloorFor(el) },
            {
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 45%', scrub: 1 },
            },
          )
        })

        /* ---- b1 · THE MAKER ARRIVES ----

           The one moment on this page that is about a person rather than an
           object, so it gets the staging an object gets and then one more
           beat on top: the light strikes BEFORE he does. The pool comes up
           out of nothing, and he rises into it a fifth of a second later,
           which is the difference between a photograph appearing and someone
           stepping into a lit room.

           Inversion law as everywhere: the CSS above describes him standing
           lit, and these are `from` tweens, so no-JS and reduced motion get
           the finished composition rather than an empty stage. */
        const mdStage = document.querySelector<HTMLElement>('[data-md]')
        if (mdStage) {
          const glow = mdStage.querySelector<HTMLElement>(':scope > span:first-child')
          const cutout = mdStage.querySelector<HTMLElement>('img')
          const floor = mdStage.querySelector<HTMLElement>(':scope > span:last-of-type')
          const plate = mdStage.querySelector<HTMLElement>('figcaption')

          const tl = gsap.timeline({
            scrollTrigger: { trigger: mdStage, start: 'top 82%', once: true },
          })
          if (glow) {
            tl.from(glow, { autoAlpha: 0, scale: 0.55, duration: 0.9, ease: 'power2.out' }, 0)
          }
          if (floor) {
            /* the floor line is struck outward from under his feet, which is
               where the beam hits: a rule that draws left-to-right here would
               contradict the light */
            tl.from(
              floor,
              { scaleX: 0, transformOrigin: 'center', duration: 0.8, ease: 'expo.out' },
              0.12,
            )
          }
          if (cutout) {
            tl.from(
              cutout,
              { yPercent: 12, autoAlpha: 0, duration: 1.0, ease: 'power3.out' },
              0.2,
            )
          }
          if (plate) {
            tl.from(plate, { y: 14, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 0.62)
          }

          /* AND HE STAYS ALIVE. A very slow float, two pixels, out of phase
             with the light breathing above him. It is under the threshold of
             "an animation" and over the threshold of "a dead cut-out", which
             is the only place a portrait can sit on a page like this. */
          gsap.to(cutout, {
            y: -6,
            duration: 4.5,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          })
        }

        /* ---- b2 · EVERY SHEET'S HEADING ARRIVES THE WAY THE HERO'S DOES ----

           The hero's statement rose out of a mask and every other heading on
           the page simply existed, which made the hero look like the only
           designed moment and the rest like a document underneath it. One
           entrance, applied to all of them, is what turns nine sheets into
           one piece of work.

           `mask: 'lines'` has SplitText build its own overflow-clipped
           wrapper per line, so the type rises from behind a hard edge rather
           than fading — the difference between something being revealed and
           something appearing. `autoSplit` re-splits on resize and on the
           late webfont swap, which is the only way a masked line stays
           correct when the font metrics change under it.

           `once` on the trigger, not scrub: an entrance replayed every time a
           visitor scrolls back past it stops being an entrance. */
        gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
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
                scrollTrigger: { trigger: title, start: 'top 88%', once: true },
              }),
          })
        })

        /* ---- b3 · the annotations follow the heading in ----
           Beat captions, specimen rows and trust chips: the small type that
           frames every sheet. A short stagger, from below, once. These are
           `from` tweens for the same reason everything here is: the CSS has
           them present and legible, and only JavaScript ever hides them. */
        gsap.utils
          .toArray<HTMLElement>('[data-beat-caption], .specimen-row, .chip')
          .forEach((el) => {
            /* the hero runs its own intro on its own clock; doubling it here
               would fight the preloader hand-off */
            if (el.closest('#sheet-01')) return
            gsap.from(el, {
              y: 18,
              autoAlpha: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            })
          })

        /* ---- c · ticker marquee ----
           Seamless infinite loop. We animate by the measured pixel width of
           ONE copy of the word set (items + gaps, via offsetLeft delta)
           instead of a guessed xPercent: with flex gaps and the strip's lead
           padding a percentage is always a few px off and the loop point
           visibly jumps. Lead padding is zeroed from JS only, so the no-JS
           static strip keeps its aligned left edge. */
        const tickerEl = document.querySelector<HTMLElement>('[data-ticker]')
        let tickerTween: gsap.core.Tween | null = null
        let resizeCall: gsap.core.Tween | null = null
        let alive = true

        const buildTicker = () => {
          if (!tickerEl || !alive) return
          const per = ticker.length // words in one copy of the strip
          const kids = tickerEl.children
          if (kids.length <= per) return
          tickerTween?.kill()
          gsap.set(tickerEl, { paddingLeft: 0, x: 0 })
          const dist =
            (kids[per] as HTMLElement).offsetLeft - (kids[0] as HTMLElement).offsetLeft
          tickerTween = gsap.to(tickerEl, {
            x: -dist,
            duration: 40,
            ease: 'none',
            repeat: -1,
          })
        }

        /* measure only after the serif has swapped in, or the loop width lies */
        document.fonts.ready.then(buildTicker)
        const onResize = () => {
          resizeCall?.kill()
          resizeCall = gsap.delayedCall(0.2, buildTicker)
        }
        window.addEventListener('resize', onResize)

        /* ---- S4 desktop rail: pinned horizontal travel (>= 900px only) ----
           The rail layout exists ONLY as a JS-applied class: default CSS stays
           the vertical grid, so no-JS desktop and every mobile width keep the
           stacked cards untouched. Travel distance is measured, not guessed,
           and re-measured on refresh (invalidateOnRefresh) so resize inside
           the breakpoint stays correct; crossing 900px reverts and reruns
           this whole matchMedia block. */
        const cardsWrap = document.querySelector<HTMLElement>('[data-cards]')
        const railSection = cardsWrap?.closest('section')
        let railTween: gsap.core.Tween | null = null
        if (desktop && cardsWrap && railSection) {
          cardsWrap.classList.add(s.isRail)
          /* THE FIX FOR "THE CARD NAMES ARE CUT OFF".

             The rail pins at 'top top', which means the section is laid out
             at its full natural height and then held against the top of the
             screen. Its natural height was taller than the viewport — section
             padding, the title block, a tall photo plate, the card's name and
             detail, the footer link and the title block — so for the entire
             pin the bottom of every card sat BELOW the fold. The cards moved
             sideways past a visitor who could not see what any of them were
             called, which is the one job the rail has.

             A pinned section has to be sized to the viewport, exactly as
             Sheet 04's pin already is (.bespoke.isPinned). This class does
             that for Sheet 05: compressed padding, centred content, and a
             media height that yields to the space actually available. It
             exists only while the pin does, so the stacked mobile layout and
             the no-JS desktop layout are untouched. */
          railSection.classList.add(s.isRailPinned)
          const dist = () => cardsWrap.scrollWidth - cardsWrap.offsetWidth
          railTween = gsap.to(cardsWrap, {
            x: () => -dist(),
            ease: 'none',
            scrollTrigger: {
              trigger: railSection,
              start: 'top top',
              end: () => '+=' + dist(),
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          })
        }

        /* ---- d · collections cards: physical panels turning to face you ----
           rotateY 14 -> 0 with a per-element perspective (no wrapper needed),
           opacity 0.4 baseline so the strip is never invisible, and the
           media's first child (the photo, once Sprint 5 lands it) settles from
           1.06 to 1 inside the .ph overflow clip. In rail mode the cards move
           horizontally inside the pinned track, so their triggers ride the
           rail tween via containerAnimation and fire on 'left' positions.
           The deepening shadow is the cheap variant: a class the CSS
           transitions, added on enter and only removed when the visitor backs
           out above the card, so a settled card keeps its shadow. */
        gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
          const media = card.querySelector<HTMLElement>('[data-card-media]')
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              scrub: 1,
              ...(railTween
                ? {
                    containerAnimation: railTween,
                    start: 'left 92%',
                    end: 'left 50%',
                  }
                : { start: 'top 88%', end: 'top 40%' }),
              onEnter: () => {
                if (media) media.dataset.lit = ''
              },
              onLeaveBack: () => {
                if (media) delete media.dataset.lit
              },
            },
          })
          /* The turn stays on the card, and ONLY the turn. The old version
             also faded the media panel from 0.4; the plotter print now owns
             every photograph's entrance, and two entrances on one element
             would fight (the print's clip-path reveal under a fade reads as
             a stutter). One effect, one owner.
             A card-wide fade is separately forbidden: at 0.4 it dimmed every
             piece of text inside the card below 4.5:1 (the audit flagged
             cardName at 2.36:1). */
          tl.fromTo(
            card,
            { rotateY: 14, transformPerspective: 900 },
            { rotateY: 0, ease: 'power2.out' },
            0,
          )
        })

        /* ---- e · (dead) dynamic accent ----
           The per-section accent scrub was removed with the monochrome
           palette (BLUEPRINT SS2.8): --accent is a constant white and the
           only colour on the page lives in photos, pieces and the logo. */

        /* ---- f · THE TIMELINE DRAWS ITSELF (Sheet 07) ----
           The company's history is a vertical dimension line, so it arrives
           the way a drawn line does: from the top, at the speed of the
           scroll. CSS keeps it fully drawn by default, which is why this is
           a fromTo and not a to. */
        const timelineRule = document.querySelector<HTMLElement>('[data-timeline-rule]')
        if (timelineRule) {
          gsap.fromTo(
            timelineRule,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineRule.closest('section') ?? timelineRule,
                start: 'top 75%',
                end: 'bottom 75%',
                scrub: 1,
              },
            },
          )
        }

        /* matchMedia cleanup: the async-built ticker tween, the resize
           listener and the rail class are the only things GSAP's context
           cannot collect itself. */
        return () => {
          alive = false
          tickerTween?.kill()
          resizeCall?.kill()
          /* the print passes are delayedCalls, which outlive a context revert
             unless they are killed; and any frame caught mid-pass has to be
             returned to the FINISHED state, never the blank one */
          printCalls.forEach((c) => c.kill())
          document.querySelectorAll<HTMLElement>('[data-print]').forEach((f) => {
            delete f.dataset.unprinted
            delete f.dataset.printing
            delete f.dataset.striking
          })
          window.removeEventListener('resize', onResize)
          cardsWrap?.classList.remove(s.isRail)
          railSection?.classList.remove(s.isRailPinned)
          bespokeSec?.classList.remove(s.isPinned)
          delete stickyHost.dataset.heroView
          stageState.bespokeProgress = 0
          stageState.heroProgress = 0
          /* back to the resting state the CSS and the 3D both describe: a
             piece fully present. Crossing the 900px breakpoint reverts this
             context and reruns it, and a piece left at arrival 0 would be
             invisible until the next entrance that will never fire again. */
          stageState.bespokeArrival = 1
          document
            .querySelectorAll<HTMLElement>('[data-drafting]')
            .forEach((el) => delete el.dataset.drafting)
          preloaderCleanup?.()
        }
      },
    )
  })

  return null
}
