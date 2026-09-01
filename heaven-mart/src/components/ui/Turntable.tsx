'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { hero } from '@/content/copy'
import { stageState, getHeroPiece, onHeroPiece, getStageReady, onStageReady } from '@/lib/stage-state'
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

export function Turntable() {
  const stage = useRef<HTMLDivElement>(null)
  const drag = useRef({ active: false, lastX: 0, rate: 0, moved: 0 })

  /* Both subscriptions are external stores rather than props: the values are
     produced by GSAP and by three.js, neither of which is in this tree. */
  const piece = useSyncExternalStore(onHeroPiece, getHeroPiece, () => 0)
  const ready = useSyncExternalStore(onStageReady, getStageReady, () => false)

  const current = hero.pieces[piece] ?? hero.pieces[0]

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current
    if (!el || !getStageReady()) return
    /* Pointer capture, so a drag that leaves the stage keeps spinning the
       piece instead of dying the moment the cursor crosses the edge. */
    el.setPointerCapture(event.pointerId)
    drag.current = {
      active: true,
      lastX: event.clientX,
      rate: (Math.PI * 2) / (el.getBoundingClientRect().width * TURNS_PER_WIDTH),
      moved: 0,
    }
    stageState.heroGrabbed = true
    stageState.heroSpinVelocity = 0
  }, [])

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d.active) return
    const dx = event.clientX - d.lastX
    d.lastX = event.clientX
    d.moved += Math.abs(dx)
    stageState.heroSpin += dx * d.rate
    /* the frame loop decays this, so a flick keeps turning and settles */
    stageState.heroSpinVelocity = dx * d.rate
  }, [])

  const endDrag = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return
    drag.current.active = false
    stageState.heroGrabbed = false
    stage.current?.releasePointerCapture(event.pointerId)
  }, [])

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
    <div className={s.turntable} data-turntable>
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
        className={`${s.stage} ${ready ? s.stageLive : ''}`}
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
      </div>

      <div className={s.stageCaption}>
        {/* aria-live: the caption is the only thing that tells a screen
            reader user the hero changed as they scrolled */}
        <p className={s.pieceName} aria-live="polite" data-piece-name>
          <span className="index">{String(piece + 1).padStart(2, '0')}</span>
          {current.name}
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
  )
}
