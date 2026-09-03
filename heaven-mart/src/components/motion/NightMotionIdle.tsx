'use client'

import dynamic from 'next/dynamic'
import { IdleMount } from './IdleMount'

/* ssr:false must live in a Client Component (Next 16) */
const NightMotion = dynamic(() => import('./NightMotion').then((m) => ({ default: m.NightMotion })), {
  ssr: false,
})

/**
 * The night's motion, mounted at the browser's first idle moment after
 * first paint (1.5 s cap), or on the first gesture if sooner. Idle rather
 * than gesture because the hero PINS: a pin that only exists once the
 * visitor has already scrolled is a jump, not a hold. The page is finished
 * without it.
 */
export function NightMotionIdle() {
  return (
    <IdleMount mode="idle" timeout={1500}>
      <NightMotion />
    </IdleMount>
  )
}
