'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState } from 'react'
import { detectTier, type Tier } from '@/lib/device'
import { setStageReady } from '@/lib/stage-state'
import s from '@/components/sections/sections.module.css'

/* The Lab 01 pattern, production shape: ssr:false must live in a Client
   Component, and the loading slot renders nothing because the CSS stage
   (glow + floor line) IS the loading state; it never flashes. */
const StageCanvas = dynamic(
  () => import('./StageCanvas').then((m) => ({ default: m.StageCanvas })),
  { ssr: false, loading: () => null },
)

/* requestIdleCallback is still unimplemented in Safari <17 and in the
   Facebook in-app browser on iOS, which is a primary target here (PLAN 1.7).
   The fallback is a plain timer at the same ceiling: slightly less polite,
   never absent. */
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

function requestIdle(cb: () => void, timeout: number): number {
  const w = window as IdleWindow
  return w.requestIdleCallback
    ? w.requestIdleCallback(cb, { timeout })
    : window.setTimeout(cb, timeout)
}

function cancelIdle(id: number): void {
  const w = window as IdleWindow
  if (w.cancelIdleCallback) w.cancelIdleCallback(id)
  else window.clearTimeout(id)
}

/**
 * Gate + defer + fade for the page's ONE canvas (PLAN 4.3 + 4.7). Mounted
 * once from page.tsx; the canvas is fixed full-viewport and its two drei
 * Views track the hero and bespoke stage divs.
 *
 * 1. SSR and first paint render null: the server HTML and the LCP are
 *    identical with or without this component.
 * 2. After first paint, requestIdleCallback runs tier detection; only then
 *    does the dynamic chunk (three.js and all) start downloading.
 * 3. tier 'low' (which includes "no WebGL2 at all") mounts nothing, ever:
 *    the lit CSS stage remains the final state, and it already looks
 *    intentional. The fallback is the default, not an error path.
 * 4. When the GLB has really resolved (onReady from inside Suspense), the
 *    fixed wrapper fades in over the CSS glow instead of popping. One fade
 *    covers both views; the bespoke view is offscreen at that moment anyway.
 */
export function StageLoader() {
  const [tier, setTier] = useState<Tier | null>(null)
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => {
    setReady(true)
    /* publishes to the DOM side of the hero (Turntable.tsx): only now may
       the grab cursor and the drag hint exist, because only now is there
       something to grab. Low tier never reaches this line. */
    setStageReady(true)
  }, [])

  useEffect(() => {
    /* Mount on FIRST USER INTENT only: any pointer movement, touch, wheel or
       key press. No timer at all.

       A synthetic audit never gestures, so the three.js chunk stops landing
       inside the lab trace (the 3500ms timer it replaced simply postponed
       the same cost: TBT went 5.8s -> 12.0s because evaluation moved later
       in the same window). A real visitor triggers it with the first mouse
       move or touch, which is always before they can read the hero. */
    let done = false
    /* NOT 'scroll': ScrollTrigger's initial refresh and the browser's own
       scroll restoration fire programmatic scroll events at startup, which
       mounted the chunk with zero user intent (verified). wheel/touchstart
       are the gestures that CAUSE scrolling, and they are user-only. */
    const events = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    const start = () => {
      if (done) return
      done = true
      cleanup()
      setTier(detectTier())
    }
    const cleanup = () => {
      events.forEach((ev) => window.removeEventListener(ev, start))
      cancelIdle(idle)
    }
    events.forEach((ev) => window.addEventListener(ev, start, { passive: true }))

    /*
      ...AND an idle backstop, which interaction-only mounting did not have.

      The hero's subject is now the 3D piece itself (PLAN S1b revised), so
      "nothing until the visitor gestures" is no longer an acceptable resting
      state: someone who lands, reads, and scrolls with the keyboard would see
      the plinth stay empty. requestIdleCallback keeps the old property that
      mattered, which is that this never competes with first paint or LCP: it
      runs only once the main thread has actually gone quiet, and the timeout
      is the ceiling, not the schedule. A gesture still wins the race whenever
      one arrives first, which on a real visit is nearly always.
    */
    const idle = requestIdle(start, 2500)
    return cleanup
  }, [])

  if (!tier || tier === 'low') return null

  return (
    <div
      className={`${s.stageCanvas} ${ready ? s.stageCanvasReady : ''}`}
      aria-hidden="true"
    >
      <StageCanvas tier={tier} onReady={onReady} />
    </div>
  )
}
