'use client'

import { useSyncExternalStore } from 'react'
import { getPieceSize, onPieceSize, type StageKey } from '@/lib/stage-state'
import s from '@/components/sections/sections.module.css'

/**
 * A drawn dimension line (BLUEPRINT SS2.7.2):
 *
 *   |<------------------ 2286 MM ------------------>|
 *
 * The number is the model's own bounding box, measured off the GLB at load
 * and published through stage-state. Nothing here is typed, so nothing here
 * can be wrong: place a Meshy scan of a real Heaven sofa on the stage and
 * the page starts quoting that sofa's real width.
 *
 * It is the single annotation that carries the whole "drawn to measure"
 * thesis, which is exactly why it must never appear without a model behind
 * it. No 3D (low tier, no WebGL, JS off) means no store value, means this
 * renders null: the page loses an annotation, never gains a fiction.
 *
 * Lives on the ANNOTATION layer (L5), outside the panel — the previous
 * version printed dimension text inside the stage where it floated over the
 * model. On a technical drawing dimensions sit outside the object; here that
 * convention also happens to be the bug fix.
 */
export function DimensionLine({
  stage,
  axis = 'w',
  orientation = 'horizontal',
}: {
  stage: StageKey
  /** which extent of the box to print: width, height or depth */
  axis?: 'w' | 'h' | 'd'
  orientation?: 'horizontal' | 'vertical'
}) {
  /* the store is keyed by stage, so the snapshot has to be the value, not
     the key the listener receives; getPieceSize returns a stable object
     reference until the model actually changes, which is what keeps
     useSyncExternalStore from looping */
  const size = useSyncExternalStore(
    onPieceSize,
    () => getPieceSize(stage),
    () => null,
  )

  if (!size) return null

  const value = size[axis]
  if (!value) return null

  return (
    <div
      className={`${s.dimLine} ${orientation === 'vertical' ? s.dimLineV : ''}`}
      /* the measurement is decoration for a screen reader: the piece's real
         name and category are announced by the caption right beside it, and
         a bounding box read aloud as "two thousand two hundred eighty six"
         is noise, not information */
      aria-hidden="true"
    >
      <span className={s.dimTick} />
      <span className={s.dimRule} />
      <span className={`specimen ${s.dimText}`}>{value} MM</span>
      <span className={s.dimRule} />
      <span className={s.dimTick} />
    </div>
  )
}
