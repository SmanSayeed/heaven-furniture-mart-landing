'use client'

import { useEffect } from 'react'
import { setLenis } from '@/lib/lenis-store'
/* Lenis's own stylesheet (~300 bytes): while smoothing is active it forces
   scroll-behavior: auto, so globals.css's `smooth` (kept for the no-JS
   page) cannot fight Lenis on anchor scrolls */
import 'lenis/dist/lenis.css'

/**
 * Smooth scrolling, as an enhancement that costs the first paint nothing.
 *
 * WHO GETS IT: fine-pointer devices (a mouse wheel is the gesture Lenis
 * smooths; a finger already scrolls natively and Lenis leaves touch alone),
 * without prefers-reduced-motion, and only after the browser is idle. A
 * phone never downloads Lenis or GSAP for this at all, which on a throttled
 * mid-range Android was a measurable slice of the page's blocking time.
 *
 * HOW: imperative, not the React provider. The provider had to wrap the
 * whole tree from the layout, which put lenis + gsap into the initial
 * bundle for every device. This renders null, imports both on idle, binds
 * Lenis's easing to GSAP's ticker (one frame loop, so ScrollTrigger and
 * the scroll advance together) and publishes the instance to lenis-store
 * for the modal to pause.
 *
 * The dead-wheel watchdog survives from the old wrapper, in its simplest
 * form: smooth scroll fails CLOSED (Lenis swallows the wheel event), so if
 * a wheel gesture with room to move has not moved the page within 700 ms,
 * Lenis is destroyed and the browser scrolls natively from then on.
 */
export function SmoothScrollIdle() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let teardown: (() => void) | null = null

    const start = async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('lenis'),
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({ autoRaf: false })
      setLenis(lenis)
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      /* the watchdog */
      let pending: number | undefined
      const canMove = (dy: number) => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        if (max <= 1) return false
        return dy > 0 ? window.scrollY < max - 1 : window.scrollY > 1
      }
      const onWheel = (e: WheelEvent) => {
        if (pending !== undefined || e.deltaY === 0 || !canMove(e.deltaY)) return
        const startY = window.scrollY
        pending = window.setTimeout(() => {
          pending = undefined
          if (window.scrollY !== startY || lenis.isStopped) return
          console.warn('[SmoothScrollIdle] wheel produced no scroll; falling back to native.')
          teardown?.()
        }, 700)
      }
      window.addEventListener('wheel', onWheel, { capture: true, passive: true })

      teardown = () => {
        teardown = null
        window.removeEventListener('wheel', onWheel, { capture: true })
        if (pending !== undefined) clearTimeout(pending)
        gsap.ticker.remove(tick)
        lenis.off('scroll', ScrollTrigger.update)
        lenis.destroy()
        setLenis(null)
        ScrollTrigger.refresh()
      }
    }

    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const id = w.requestIdleCallback
      ? w.requestIdleCallback(() => void start(), { timeout: 2500 })
      : window.setTimeout(() => void start(), 2500)

    return () => {
      cancelled = true
      if (w.cancelIdleCallback) w.cancelIdleCallback(id)
      else window.clearTimeout(id)
      teardown?.()
    }
  }, [])

  return null
}
