'use client'

import dynamic from 'next/dynamic'
import { IdleMount } from './IdleMount'

/* The motion orchestrator ships as its own chunk: GSAP + ScrollTrigger are
   ~60 KB the first paint has no use for. `ssr: false` has to live in a
   Client Component (Next 16), which is the whole reason this file exists.
   Server-rendered null; mounted once the browser is idle. */
const DeckMotion = dynamic(
  () => import('./DeckMotion').then((m) => ({ default: m.DeckMotion })),
  { ssr: false, loading: () => null },
)

export function DeckMotionIdle() {
  return (
    <IdleMount>
      <DeckMotion />
    </IdleMount>
  )
}
