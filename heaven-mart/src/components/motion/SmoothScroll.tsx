'use client'

import { useEffect, useRef } from 'react'
import type Lenis from 'lenis'
import { ReactLenis, type LenisRef } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
/* Lenis's own stylesheet: while smoothing is active it forces
   scroll-behavior: auto, so our globals.css `scroll-behavior: smooth`
   (kept for the no-JS page) cannot fight Lenis on anchor scrolls. */
import 'lenis/dist/lenis.css'

/* Safe to call during SSR of this client module; ScrollTrigger defers its
   window work until a browser exists. Registering here AND in PageMotion is
   fine: registerPlugin is idempotent. */
gsap.registerPlugin(ScrollTrigger)

/**
 * The Lenis client island. layout.tsx stays a Server Component; only this
 * wrapper ships JS. Lenis drives the real window scroll (so ScrollTrigger,
 * anchors and the browser's own restore all keep working), but its easing
 * runs on GSAP's ticker so scroll position and scrubbed timelines advance in
 * the exact same frame. Two rAF loops would give scrub animations a one-frame
 * lag that reads as jitter, which is why autoRaf is off.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    /* Reduced motion: hand scrolling straight back to the browser. Destroying
       (not just stopping) removes the wheel/touch listeners entirely, so the
       page behaves as if Lenis was never there. Deferred one frame so the
       provider has certainly published its instance to the ref. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const id = requestAnimationFrame(() => lenisRef.current?.lenis?.destroy())
      return () => cancelAnimationFrame(id)
    }

    /*
      Resolve the instance INSIDE the tick, never capture it once.

      With autoRaf off, Lenis swallows every wheel event (preventDefault) and
      only moves when something calls raf(). A callback that captured the
      instance at effect time silently stops driving it if the ref was still
      empty on that first run, or if React remounted the provider and handed
      us a new instance (StrictMode does exactly that in development). The
      failure is silent and total: wheel events are consumed and the page
      never scrolls. Resolving through the ref each tick makes that
      impossible, and rebinding on identity change keeps ScrollTrigger
      subscribed to whichever instance is actually live.
    */
    let bound: Lenis | null = null
    /* set once level 1 has handed scrolling back to the browser */
    let fallenBack = false

    const tick = (time: number) => {
      const lenis = lenisRef.current?.lenis
      if (!lenis) return

      if (bound !== lenis) {
        bound?.off('scroll', ScrollTrigger.update)
        lenis.on('scroll', ScrollTrigger.update)
        bound = lenis
      }

      lenis.raf(time * 1000) // GSAP ticks in seconds, Lenis wants milliseconds
    }

    gsap.ticker.add(tick)
    /* ScrollTrigger positions must never be "smoothed" after a dropped frame;
       they have to stay locked to the real scroll value. */
    gsap.ticker.lagSmoothing(0)

    /*
      ---- the dead-wheel watchdog ----

      Smooth scroll is an enhancement, but it fails CLOSED: Lenis consumes the
      wheel event before it can reach the browser, so anything that stops it
      from raf()-ing does not merely remove the smoothing, it removes
      scrolling. That is unrecoverable for a visitor and unacceptable on a
      page whose whole story is scrolled, so the enhancement is made to
      supervise itself.

      Rule: a wheel gesture on a scrollable document must move window.scrollY.
      If one does not inside GRACE ms, the smoothing layer is provably broken
      (whatever the cause: a stopped ticker, a detached instance, a future
      refactor's mistake) and it is destroyed. Destroying detaches Lenis's own
      wheel/touch listeners, so the very next gesture is handled natively and
      the page scrolls normally. ScrollTrigger is switched back to listening to
      the real scroll event, so the section animations survive too.

      It must not misfire, and the first version DID. "The document is taller
      than the viewport" is not the same as "this gesture can move the page":
      at the very bottom, scrolling down moves nothing, and so does scrolling
      up at the very top. A visitor who reaches the footer and keeps scrolling
      - one of the most ordinary gestures there is - therefore tripped the
      watchdog, lost smooth scrolling for the rest of the session and got the
      level-2 manual handler installed on a page that was working perfectly.
      Reproduced by driving 200 wheel events into the footer.
      So the guard is now DIRECTIONAL: the check only arms when there is
      actually room to move the way the visitor asked. Any movement at all
      (Lenis animates within a frame or two) still clears it.

      Two levels, because destroying our own instance is not always enough.
      The failure seen in development is a ZOMBIE: a hot reload (or any future
      double-mount) leaves an orphaned Lenis whose wheel listener is still
      attached and still calling preventDefault, while nothing raf()s it.
      Destroying the instance we can see does not detach a listener owned by
      one we cannot. So if the wheel is still dead after the fallback, level 2
      scrolls the window ourselves, by hand, for the rest of the session. It
      is a crude thing to do and it is deliberately the LAST thing we do: a
      page whose entire content is scrolled must scroll, whatever is broken.
    */
    const GRACE = 700
    let pending: number | undefined
    let manual = false

    /* level 2: the wheel is being eaten by something we do not own. Move the
       page ourselves. Only ever installed after level 1 has demonstrably
       failed, so a healthy page never runs a line of this. */
    const manualWheel = (event: WheelEvent) => {
      if (!event.defaultPrevented) return
      window.scrollBy({ top: event.deltaY, behavior: 'auto' })
    }

    const goManual = () => {
      if (manual) return
      manual = true
      console.warn('[SmoothScroll] wheel still blocked after fallback; driving scroll manually.')
      /* NOT passive: this one has to run whether or not someone else has
         already prevented the default, and reading defaultPrevented is only
         meaningful once the other listeners have had their turn (bubble). */
      window.addEventListener('wheel', manualWheel)
    }

    /* Is there room to move the way this gesture asked? A 1px tolerance
       covers fractional scroll positions, which Lenis produces constantly. */
    const canMove = (deltaY: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 1) return false
      return deltaY > 0 ? window.scrollY < max - 1 : window.scrollY > 1
    }

    const onWheel = (event: WheelEvent) => {
      if (pending !== undefined || event.deltaY === 0) return
      /* at an edge, "no movement" is the correct outcome, not a failure */
      if (!canMove(event.deltaY)) return
      const startY = window.scrollY
      const wasDead = fallenBack
      pending = window.setTimeout(() => {
        pending = undefined
        if (window.scrollY !== startY) return // healthy: something is driving
        /* already handed back to the browser and STILL nothing moved: the
           listener eating this wheel is not ours to remove */
        if (wasDead) return goManual()
        const lenis = lenisRef.current?.lenis
        if (!lenis || lenis.isStopped) return // deliberately paused, not broken
        console.warn('[SmoothScroll] wheel produced no scroll; falling back to native scrolling.')
        fallenBack = true
        gsap.ticker.remove(tick)
        bound?.off('scroll', ScrollTrigger.update)
        bound = null
        lenis.destroy()
        /* ScrollTrigger fed off Lenis until now; hand it the native event. */
        window.addEventListener('scroll', ScrollTrigger.update, { passive: true })
        ScrollTrigger.refresh()
      }, GRACE)
    }

    /* capture phase: Lenis calls preventDefault, never stopPropagation, but
       capture means we are measured even if that ever changes */
    window.addEventListener('wheel', onWheel, { capture: true, passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      window.removeEventListener('wheel', manualWheel)
      window.removeEventListener('scroll', ScrollTrigger.update)
      if (pending !== undefined) clearTimeout(pending)
      gsap.ticker.remove(tick)
      bound?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
