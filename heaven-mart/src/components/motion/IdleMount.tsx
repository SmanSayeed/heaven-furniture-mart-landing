'use client'

import { useEffect, useState } from 'react'

/**
 * Mounts its children later than hydration, so a motion layer never
 * competes with React for the main thread while the page becomes readable.
 * The page is complete without the children - that is the inversion law
 * every motion layer here obeys - so nothing a visitor needs waits on this.
 *
 * Two modes:
 *   gesture - on the visitor's first scroll/touch/pointer/key, or after
 *             `timeout` ms. Right for a layer whose first job is a scroll
 *             reveal (PLAN-V5's deck).
 *   idle    - at the browser's first idle moment after first paint, capped
 *             at `timeout` ms, or on the first gesture if that is sooner.
 *             Right for a layer that PINS (PLAN-V6's hero): a pin changes
 *             layout, and a pin that only exists after the visitor has
 *             already scrolled is a jump, not a hold.
 */
type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

export function IdleMount({
  children,
  timeout = 6000,
  mode = 'gesture',
}: {
  children: React.ReactNode
  /** the backstop: mounted no later than this */
  timeout?: number
  mode?: 'gesture' | 'idle'
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let done = false
    const events = ['scroll', 'wheel', 'touchstart', 'pointerdown', 'keydown'] as const
    const w = window as IdleWindow
    let idle = 0
    const go = () => {
      if (done) return
      done = true
      events.forEach((ev) => window.removeEventListener(ev, go))
      window.clearTimeout(timer)
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle)
      setReady(true)
    }
    events.forEach((ev) => window.addEventListener(ev, go, { passive: true, once: true }))
    const timer = window.setTimeout(go, timeout)
    if (mode === 'idle') {
      /* Safari < 17 and the Facebook in-app browser on iOS have no
         requestIdleCallback; the timer above is then the whole schedule */
      if (w.requestIdleCallback) idle = w.requestIdleCallback(go, { timeout })
    }
    return () => {
      done = true
      events.forEach((ev) => window.removeEventListener(ev, go))
      window.clearTimeout(timer)
      if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle)
    }
  }, [timeout, mode])

  return ready ? <>{children}</> : null
}
