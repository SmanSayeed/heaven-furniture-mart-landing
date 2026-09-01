'use client'

import { useSyncExternalStore } from 'react'
import { getInspectArmed, onInspectArmed } from '@/lib/stage-state'
import { bespoke } from '@/content/copy'
import s from '@/components/sections/sections.module.css'

/**
 * S3b affordance: "DRAG TO INSPECT · 360" under the vitrine.
 *
 * Subscribes to the arming signal the 3D view publishes, so it is physically
 * impossible for the hint to appear where the interaction does not exist:
 * no WebGL, low tier or reduced motion means no canvas, which means nothing
 * ever arms it, which means this renders null forever. That is the S3b
 * fallback rule expressed as data flow rather than as a duplicated check.
 */
export function InspectHint() {
  /* useSyncExternalStore is exactly the right shape here: an external store
     (stage-state) with a subscribe function and a snapshot, and the server
     snapshot is false so the hint is never in the server HTML. */
  const armed = useSyncExternalStore(
    onInspectArmed,
    getInspectArmed,
    () => false,
  )

  if (!armed) return null

  return (
    <p className={`specimen ${s.inspectHint}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12a8 8 0 0 1 8-8m8 8a8 8 0 0 1-8 8" />
        <path d="M12 2.5 14.5 5 12 7.5M12 21.5 9.5 19l2.5-2.5" />
      </svg>
      {bespoke.inspect}
    </p>
  )
}
