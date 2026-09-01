'use client'

import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { hero, ticker } from '@/content/copy'
import { detectTier } from '@/lib/device'
import { stageState, setHeroPiece } from '@/lib/stage-state'
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

/* ---------------------- S0 preloader (PLAN Part 2 S0) ----------------------
   Built imperatively, never as React markup: the overlay must not exist in
   the server HTML (the crawlable page and the LCP element stay exactly the
   plain document), must never appear for no-JS visitors, and is owned start
   to finish by GSAP. Client-only DOM created after hydration is the one
   shape that guarantees all three with zero hydration gymnastics. */

function shouldShowPreloader(): boolean {
  try {
    if (sessionStorage.getItem('hfm-preloaded') === '1') return false
    sessionStorage.setItem('hfm-preloaded', '1')
    return true
  } catch {
    /* storage blocked (private mode / in-app browser): show it anyway, it
       is capped at 1.2s and skippable */
    return true
  }
}

/** Runs the S0 sequence and calls onDone as the curtain clears (the hero
    intro fires from there, so the two can never race). Returns a cleanup. */
function runPreloader(onDone: () => void): () => void {
  const overlay = document.createElement('div')
  overlay.className = 'preloader'
  overlay.setAttribute('aria-hidden', 'true')
  const word = document.createElement('span')
  word.className = 'preloader-word'
  word.textContent = 'Heaven'
  const line = document.createElement('span')
  line.className = 'preloader-line'
  overlay.append(word, line)
  document.body.appendChild(overlay)

  /* the wordmark letter-spaces in, per-char */
  const split = SplitText.create(word, { type: 'chars' })
  const wordIntro = gsap.timeline()
  wordIntro
    .from(
      split.chars,
      { autoAlpha: 0, yPercent: 40, duration: 0.5, ease: 'power2.out', stagger: 0.045 },
      0,
    )
    .fromTo(
      word,
      { letterSpacing: '0.05em' },
      { letterSpacing: '0.32em', duration: 1.15, ease: 'power3.out' },
      0,
    )

  /* the brass line doubles as the progress bar; its base duration IS the
     1.2s hard cap, so slow assets can never hold the page hostage */
  const lineTween = gsap.to(line, { scaleX: 1, duration: 1.2, ease: 'none' })

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    removeSkips()
    capCall.kill()
    lineTween.kill()
    gsap
      .timeline()
      .to(line, { scaleX: 1, duration: 0.18, ease: 'power1.out' })
      .to(overlay, { yPercent: -100, duration: 0.65, ease: 'power3.inOut' }, '+=0.08')
      /* hero intro starts while the curtain is still clearing: the masked
         lines rise into view as the ink lifts */
      .call(onDone, undefined, '-=0.3')
      .call(() => overlay.remove())
  }

  /* real-ish progress: fonts + full load finish it early, but never under
     a 0.9s hold: a sub-second flash of the overlay reads as a glitch, not a
     brand moment. The 1.2s cap is absolute and a skip is always instant. */
  const startedAt = performance.now()
  const capCall = gsap.delayedCall(1.2, finish)
  let minCall: gsap.core.Tween | null = null
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((res) => window.addEventListener('load', () => res(), { once: true }))
  Promise.all([document.fonts.ready, loaded]).then(() => {
    const remain = Math.max(0, 900 - (performance.now() - startedAt))
    minCall = gsap.delayedCall(remain / 1000, finish)
  })

  /* skippable: any input gesture completes it instantly */
  const skip = () => finish()
  const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
  skipEvents.forEach((ev) => window.addEventListener(ev, skip, { passive: true }))
  const removeSkips = () => skipEvents.forEach((ev) => window.removeEventListener(ev, skip))

  return () => {
    finished = true
    removeSkips()
    capCall.kill()
    minCall?.kill()
    lineTween.kill()
    wordIntro.kill()
    overlay.remove()
  }
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
      },
      (ctx) => {
        const { motionOK, desktop } = ctx.conditions as {
          motionOK: boolean
          desktop: boolean
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
        const startHeroIntro = () => {
          ctx.add(() => {
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
          stickyHost.dataset.heroView = '1'
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
          /* ---- S1 · THE PINNED TURNTABLE (PLAN S1b, revised) ----

             The hero holds while the visitor scrolls and the piece on the
             plinth CHANGES: velvet sofa, then armchair, then leather lounge,
             each announced by its own caption and accent. Then, over the last
             fifth, the hero performs its exit and hands over to S2.

             pinSpacing is TRUE here (it was false while the pin only lasted
             one viewport). Real spacing is what buys the hold: the extra
             scroll distance belongs to the hero and nothing else moves during
             it, so the piece changes read as deliberate scenes rather than as
             S2 sliding over a hero that happens to be mutating. It also
             removes the un-pin snap the old pinSpacing:false pin had to hide
             behind a full-viewport curtain.

             The hold is shorter on phones: the same three scenes, less thumb.
          */
          const HOLD_VH = desktop ? 220 : 170
          /* progress thresholds inside the pin: scene, swap, scene, swap,
             scene, then the exit. Fractions of the pinned range, so the same
             rhythm holds at either hold length. */
          const SWAP_1 = 0.3
          const SWAP_2 = 0.56
          const EXIT_FROM = 0.8

          let shownPiece = -1
          const showPiece = (index: number) => {
            if (index === shownPiece) return
            shownPiece = index
            setHeroPiece(index)
            /* each piece brings its own accent, so the CTA, the index
               numerals and the thread all shift with the material on stage */
            gsap.to(document.documentElement, {
              '--accent': hero.pieces[index].accent,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }

          /* ONE timeline owns the pin, the scrub and the exit. A second
             ScrollTrigger on the same element would have to measure a
             position that the first one has made `fixed`, which is exactly
             the case GSAP warns about; nesting the exit inside this
             timeline's last fifth sidesteps it entirely. */
          const heroTl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: heroSec,
              start: 'top top',
              end: `+=${HOLD_VH}%`,
              pin: true,
              anticipatePin: 1,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                /* a step function, not a tween: the piece is a discrete
                   thing and interpolating an index would mean nothing */
                showPiece(self.progress >= SWAP_2 ? 2 : self.progress >= SWAP_1 ? 1 : 0)
              },
              /* scrolled back above the hero: first piece on stage again */
              onLeaveBack: () => showPiece(0),
            },
          })

          const EXIT_DUR = 1 - EXIT_FROM
          heroTl
            /* spacer: fixes the timeline's total at exactly 1 so the
               positions below are true fractions of the pinned range */
            .to({}, { duration: 1 }, 0)
            /* photo parallaxes slower than the page and its scrim deepens,
               so the room sinks away behind the rising ivory */
            .fromTo('[data-hero-photo]', { yPercent: 0 }, { yPercent: 18, duration: EXIT_DUR }, EXIT_FROM)
            /* 0.82 -> 1: opacity above 1 clamps, so the deepening is a real
               range. JS-set start only, and the no-JS default is the FULL
               scrim, so text contrast without JS is higher, never lower. */
            .fromTo('[data-hero-scrim]', { opacity: 0.82 }, { opacity: 1, duration: EXIT_DUR }, EXIT_FROM)
            /* the plinth lifts and its light goes out: the piece is taken
               off stage, and the 3D on it yaws and recedes off stageState */
            .fromTo('[data-turntable]', { yPercent: 0 }, { yPercent: -10, duration: EXIT_DUR }, EXIT_FROM)
            .fromTo('[data-stage-pool]', { opacity: 0.5 }, { opacity: 0, duration: EXIT_DUR }, EXIT_FROM)
            .to(stageState, { heroProgress: 1, duration: EXIT_DUR }, EXIT_FROM)
            /* statement drifts up at 0.6x: type leaves before the room does */
            .fromTo('[data-hero-statement]', { yPercent: 0 }, { yPercent: -60, duration: EXIT_DUR }, EXIT_FROM)

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

        /* ---- S4 -> S5 · the aperture (PLAN 2.5) ----
           The showroom panel reveals through an expanding rounded window,
           like stepping through a doorway. One-shot scrub, no pin; the
           18px end radius matches the .ph panel's own. */
        gsap.fromTo(
          '[data-aperture]',
          { clipPath: 'inset(18% 24% 18% 24% round 32px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 18px)',
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
        const bespokePinned = !!bespokeSec && detectTier() !== 'low'
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
          const media = card.querySelector<HTMLElement>('.ph')
          const inner = media?.firstElementChild
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
              onEnter: () => media?.classList.add('is-lit'),
              onLeaveBack: () => media?.classList.remove('is-lit'),
            },
          })
          /* The turn stays on the card; the fade moved to the media panel.
             A card-wide 0.4 dimmed every piece of text inside it below
             4.5:1 (the audit flagged cardName at 2.36:1, and the nested
             0.7-opacity specimen could never pass under any card floor).
             The photo panel fading up + the perspective turn keeps the
             entrance; the placard text stays legible from the start. */
          tl.fromTo(
            card,
            { rotateY: 14, transformPerspective: 900 },
            { rotateY: 0, ease: 'power2.out' },
            0,
          )
          if (media) {
            tl.fromTo(media, { opacity: 0.4 }, { opacity: 1, ease: 'power2.out' }, 0)
          }
          if (inner) {
            tl.fromTo(inner, { scale: 1.06 }, { scale: 1, ease: 'power2.out' }, 0)
          }
        })

        /* ---- e · dynamic accent ----
           Each section declares its accent; crossing the viewport middle
           tweens the global --accent, and every consumer (buttons, indexes,
           tri, focus ring) follows through var(). overwrite: 'auto' kills the
           previous colour tween mid-flight when someone scrolls fast. */
        gsap.utils.toArray<HTMLElement>('[data-accent]').forEach((sec) => {
          const toAccent = () => {
            gsap.to(document.documentElement, {
              '--accent': sec.dataset.accent,
              duration: 0.6,
              ease: 'power2.out',
              overwrite: 'auto',
            })
          }
          ScrollTrigger.create({
            trigger: sec,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter: toAccent,
            onEnterBack: toAccent,
          })
        })

        /* ---- f · ghost numerals: slow parallax ----
           The watermark drifts up 18% of its own height while its section
           crosses the viewport, giving the flat sections one layer of depth. */
        gsap.utils.toArray<HTMLElement>('.ghost-num').forEach((el) => {
          gsap.to(el, {
            yPercent: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section, header') ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
        })

        /* matchMedia cleanup: the async-built ticker tween, the resize
           listener and the rail class are the only things GSAP's context
           cannot collect itself. */
        return () => {
          alive = false
          tickerTween?.kill()
          resizeCall?.kill()
          window.removeEventListener('resize', onResize)
          cardsWrap?.classList.remove(s.isRail)
          bespokeSec?.classList.remove(s.isPinned)
          delete stickyHost.dataset.heroView
          stageState.bespokeProgress = 0
          stageState.heroProgress = 0
          preloaderCleanup?.()
        }
      },
    )
  })

  return null
}
