'use client'

import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '@/lib/device'

/**
 * THE TORCH (CONCEPT-V2): on a pointer device the cursor carries a pool of
 * warm light across the page. The visitor does not read about the light
 * story - they hold the light.
 *
 * Cost discipline: one fixed element, moved by transform inside a single
 * requestAnimationFrame per pointer event, so it composites and never lays
 * out. Touch devices get nothing (a finger is not a cursor, and a pool
 * jumping between taps reads as a bug), and reduced motion gets nothing.
 * The element is decorative and pointer-events: none throughout.
 */
const R = 320 /* half the circle's CSS width */

export function Torch() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let x = 0
    let y = 0
    let raf = 0
    const paint = () => {
      raf = 0
      el.style.transform = `translate3d(${x - R}px, ${y - R}px, 0)`
    }
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (!el.dataset.on) el.dataset.on = ''
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const leave = () => {
      delete el.dataset.on
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="torch" aria-hidden="true" />
}
