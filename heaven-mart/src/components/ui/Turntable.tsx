'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { hero } from '@/content/copy'
import {
  stageState,
  getHeroPiece,
  setHeroPiece,
  onHeroPiece,
  getStageReady,
  onStageReady,
} from '@/lib/stage-state'
import { prefersReducedMotion } from '@/lib/device'
import { CropMarks } from './CropMarks'
import { Bulb } from './Bulb'
import { DimensionLine } from './DimensionLine'
import { Photo, hasPhoto } from './Photo'
import { ArrowRight } from './Icons'
import s from '@/components/sections/sections.module.css'

/**
 * S1 "The Turntable" (PLAN S1b, revised): the hero's centrepiece is a real
 * 3D object you can grab and spin, and it changes as you scroll.
 *
 * This component owns the DOM half of that: the stage rect the drei View
 * scissor-renders into, the light pool it stands in, its caption, and the
 * pointer handling. The 3D half (StageCanvas) never touches the DOM; the two
 * meet only through the stageState module (PLAN 4.4), so either can be
 * missing and the other still behaves.
 *
 * Everything here is progressive: with no JS, no WebGL, or on low tier, the
 * markup below is still a lit plinth with a caption, which is a deliberate
 * composition rather than an empty frame waiting for something to load.
 */

/* A full turn should take a comfortable drag: 2*PI radians per 1.15 stage
   widths. Derived per gesture from the live rect so it feels identical on a
   390px phone and a 1440px desktop. */
const TURNS_PER_WIDTH = 1.15

/* touching anything pauses the slider: an auto-advance that fights the
   visitor's own hands is worse than none. Module scope, not a ref: there is
   exactly one turntable per page, and the React Compiler (correctly) refuses
   writes to hook-owned values inside memoized handlers. */
let lastTouchAt = 0

export function Turntable() {
  const stage = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, lastX: 0, lastY: 0, rate: 0, moved: 0, orbit: false })

  /* Both subscriptions are external stores rather than props: the values are
     produced by GSAP and by three.js, neither of which is in this tree. */
  const piece = useSyncExternalStore(onHeroPiece, getHeroPiece, () => 0)
  const ready = useSyncExternalStore(onStageReady, getStageReady, () => false)

  const current = hero.pieces[piece] ?? hero.pieces[0]

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current
    if (!el || !getStageReady()) return
    /*
      THE ARROWS LIVE ON THE DRAG SURFACE, so the drag must refuse them.

      setPointerCapture below redirects every subsequent pointer event to the
      stage - and the browser then derives `click` from the common ancestor
      of pointerdown target (the button) and pointerup target (the stage,
      because of the capture), which is the stage. Result: the arrows
      received their presses and never their clicks, and the pager silently
      did nothing. A press that starts on a control belongs to the control.
    */
    if ((event.target as HTMLElement).closest('button, a')) return
    /* Pointer capture, so a drag that leaves the stage keeps spinning the
       piece instead of dying the moment the cursor crosses the edge. */
    el.setPointerCapture(event.pointerId)
    drag.current = {
      active: true,
      lastX: event.clientX,
      lastY: event.clientY,
      rate: (Math.PI * 2) / (el.getBoundingClientRect().width * TURNS_PER_WIDTH),
      moved: 0,
      /*
        VERTICAL ORBIT IS A MOUSE GESTURE ONLY, and that is not a limitation
        so much as the same rule the horizontal spin already lives under. The
        stage sets `touch-action: pan-y`, which hands the browser every
        vertical finger movement so the page keeps scrolling — trapping a
        visitor inside the canvas is the one thing the turntable must never
        do. A mouse has a scroll wheel for that, so a dragged cursor is free
        to carry the second axis.
      */
      orbit: event.pointerType === 'mouse',
    }
    stageState.heroGrabbed = true
    stageState.heroSpinVelocity = 0
    lastTouchAt = Date.now()
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    const dx = event.clientX - d.lastX
    const dy = event.clientY - d.lastY
    d.lastX = event.clientX
    d.lastY = event.clientY
    d.moved += Math.abs(dx)
    stageState.heroSpin += dx * d.rate
    /* the frame loop decays this, so a flick keeps turning and settles */
    stageState.heroSpinVelocity = dx * d.rate
    /* the vertical axis takes no inertia: a piece that keeps drifting upward
       after you let go reads as broken, where one that keeps turning reads
       as a turntable. StageCamera clamps the range. */
    if (d.orbit) stageState.heroTilt += dy * d.rate * 0.55
  }, [])

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    drag.current.active = false
    stageState.heroGrabbed = false
    stage.current?.releasePointerCapture(event.pointerId)
  }, [])

  /* THE ARROWS. The piece used to change only as a by-product of scrolling
     past the hero, which meant a visitor who wanted to see the range had to
     guess that scrolling was also a control, and could never go back. Two
     buttons make it an explicit, reversible choice — and they are the reason
     the turntable can now carry five categories instead of three without
     anyone having to scroll through all of them to find one.

     They write to the same store the scroll does, so the caption, the 3D and
     the dimension line all follow with no extra wiring. */
  const step = useCallback((delta: number) => {
    const n = hero.pieces.length
    lastTouchAt = Date.now()
    setHeroPiece((getHeroPiece() + delta + n) % n)
  }, [])

  /*
    THE SLIDER (client call, 2026-09-03): the pieces change on their OWN
    clock, not the scroll's. The hero used to pin and step through the range
    as the visitor scrolled, and it read as the page refusing to move on. Now
    a scroll simply leaves the hero, and the range shows itself: one piece
    every six seconds, only while the stage is actually on screen and the tab
    is visible, never within nine seconds of the visitor touching the arrows
    or the piece, and not at all under reduced motion. The arrows and the
    drag always win; this is a shopkeeper turning the window display, not a
    carousel demanding attention.
  */
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const el = stage.current
    let inView = false
    const io = el
      ? new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting
        }, { threshold: 0.35 })
      : null
    if (el && io) io.observe(el)
    const id = window.setInterval(() => {
      if (!inView || document.visibilityState !== 'visible') return
      if (drag.current.active || Date.now() - lastTouchAt < 9000) return
      setHeroPiece((getHeroPiece() + 1) % hero.pieces.length)
    }, 6000)
    return () => {
      io?.disconnect()
      window.clearInterval(id)
    }
  }, [ready])

  /* The hint retires itself once the visitor has actually turned the piece:
     an instruction that stays after it has been followed is clutter. */
  const [used, setUsed] = useState(false)
  useEffect(() => {
    if (used) return
    const id = window.setInterval(() => {
      if (drag.current.moved > 40) setUsed(true)
    }, 400)
    return () => window.clearInterval(id)
  }, [used])

  return (
    <div className={s.turntable} data-turntable data-col="3-4">
      {/*
        data-stage-hero is the rect drei's View tracks. It is decorative:
        the piece's identity is the caption below, which is real text and is
        present with or without WebGL, so nothing here needs a label.

        touch-action: pan-y (in CSS) is the whole mobile story. The browser
        keeps vertical gestures for scrolling the page and only hands us the
        horizontal ones, so a finger can spin the sofa without ever trapping
        the visitor inside the hero.
      */}
      <div
        ref={stage}
        className={`panel panel-land ${s.stage} ${ready ? s.stageLive : ''}`}
        data-stage-hero
        aria-hidden="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* the light the piece stands in: a pool, not a box. The old framed
            "vitrine" read as an empty placeholder panel whenever the 3D was
            not up yet; light and a floor line never do. */}
        <span className={s.stagePool} data-stage-pool />
        <span className={s.stageShadow} />
        <span className={s.stageFloor} />
        {/* the still centre of the plinth before anything loads: the brand's
            own triangle, so the empty state is a mark, not a missing image */}
        <span className={s.stageMark} />
        {/* the panel is a placed plate on a drawing, and says so */}
        <CropMarks />
        {/* the light the piece is built for: one warm bulb on a cord, top
            left per the One Light Law, swinging very slightly */}
        <Bulb />

        {/*
          THE ARROWS LIVE ON THE STAGE NOW, not in a row of their own.

          The separate control row under the panel cost 53px of an 844px
          phone hero that was already over budget, and it put the controls a
          thumb-stretch away from the thing they control. On the stage's own
          edges they are where every carousel on earth keeps them, they cost
          zero height, and the piece they page through is directly between
          them. The counter they used to bracket lives in the caption as
          01/05.
        */}
        <button
          type="button"
          className={`btn btn-sm ${s.stageArrow} ${s.stageArrowPrev}`}
          onClick={() => step(-1)}
          aria-label={hero.prev}
        >
          <ArrowRight className={s.flip} />
        </button>
        <button
          type="button"
          className={`btn btn-sm ${s.stageArrow} ${s.stageArrowNext}`}
          onClick={() => step(1)}
          aria-label={hero.next}
        >
          <ArrowRight />
        </button>

      </div>

      {/*
        THE STAGE SAYS WHEN IT IS STILL COMING.

        Before this, the seconds between first paint and the 3D chunk landing
        looked like a bug: an empty lit plinth with a caption naming a piece
        that was not there. The page knew the difference and did not say so.
        Now it does, and the line retires itself the moment the piece arrives
        (`ready`), so nobody who never sees the wait ever sees the notice.

        It is deliberately NOT a spinner. A spinner is a browser widget; this
        is a drawing office, so the wait is a specimen line with a filament
        crawling under it. And on low tier, no WebGL or no JS, `ready` is
        never set and this never renders - the lit CSS plinth stays the
        finished look rather than promising something that will not come.
      */}
      {!ready && (
        <p className={`specimen ${s.stageLoading}`} data-stage-loading>
          <span className={s.stageLoadingRule} aria-hidden="true" />
          {hero.loading.toUpperCase()}
        </p>
      )}

      {/* the piece's REAL width, measured off the model. Absent until the 3D
          is genuinely on the panel: the page never draws a dimension for
          something that is not there. */}
      <DimensionLine stage="hero" axis="w" />

      <div className={s.stageCaption}>
        <div className={s.captionText}>
          {/* aria-live: the caption is the only thing that tells a screen
              reader user the hero changed as they scrolled */}
          {/* the piece's name is a LINK to that category's page, and the
              index doubles as the pager's counter now that the arrows live
              on the stage itself */}
          <p className={s.pieceName} aria-live="polite" data-piece-name>
            <span className="index">
              {String(piece + 1).padStart(2, '0')}/{String(hero.pieces.length).padStart(2, '0')}
            </span>
            <a href={current.href} className={s.pieceLink}>
              {current.name}
            </a>
            <span className="specimen">{current.category.toUpperCase()}</span>
          </p>
          {ready && !used && (
            <p className={`specimen ${s.dragHint}`}>
              <span className={s.dragGlyph} aria-hidden="true" />
              {hero.dragHint.toUpperCase()} · {hero.dragHintSpecimen}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * THE PAIR's second half: Heaven's real, delivered work, at plate size.
 *
 * The proof used to be a 2.75rem thumbnail in the caption row - visible in a
 * code review and invisible to a human being (client, verbatim: "what is
 * need of too small that user can not see"). The drawing is how a bespoke
 * order starts; the photograph of built work is why anyone places one, and
 * evidence does not work at postage-stamp size. So the hero now holds two
 * plates of equal rank: THE DRAWING (the turntable, columns 3-4) and THE
 * REAL WORK (this, columns 5-6), changing together off the same piece store.
 *
 * It is rendered by Hero.tsx AFTER the CTA block, which is the whole mobile
 * story: the first viewport keeps exactly the composition that fits an 844px
 * phone today (statement, stage, CTA above the fold - unbreakable), and the
 * photograph is the first thing a scroll reveals. On desktop the grid lifts
 * it back up beside the stage; DOM order and visual order part ways there on
 * purpose.
 *
 * All five photographs stay stacked and the active one is chosen by opacity,
 * so a piece change crossfades here in the same breath as the 3D. The plate
 * is one link to the active piece's category page: a visitor convinced by
 * the evidence goes straight to more of it.
 */
export function HeroReal() {
  const piece = useSyncExternalStore(onHeroPiece, getHeroPiece, () => 0)
  const current = hero.pieces[piece] ?? hero.pieces[0]

  return (
    <div className={s.heroReal} data-col="5-6" data-hero-real>
      <a
        href={current.href}
        className={`panel arch ${s.heroRealPanel}`}
        aria-label={`${current.category}: see the real pieces`}
      >
        {hero.pieces.map(
          (p, i) =>
            hasPhoto(p.photo) && (
              <span
                key={p.photo}
                className={s.heroRealFrame}
                data-active={i === piece ? '' : undefined}
                aria-hidden={i === piece ? undefined : true}
              >
                <Photo
                  name={p.photo}
                  alt=""
                  sizes="(min-width: 900px) 30vw, 92vw"
                  className={s.heroRealImg}
                  priority={i === 0}
                />
              </span>
            ),
        )}
        <CropMarks />
      </a>
      {/* the plate's own caption, mirroring the drawing's: what this half of
          the pair IS, and where the work stands */}
      <p className={s.heroRealCaption} aria-live="polite">
        <span className={`specimen ${s.heroRealTag}`}>{hero.real.label}</span>
        <span className="specimen">{current.category.toUpperCase()} · AGRABAD</span>
      </p>
    </div>
  )
}
