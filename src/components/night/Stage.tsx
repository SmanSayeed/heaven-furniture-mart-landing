'use client'

import { useSyncExternalStore } from 'react'
import {
  getInspectArmed,
  getPieceSize,
  getStageProgress,
  getStageReady,
  getSwatch,
  onInspectArmed,
  onPieceSize,
  onStageProgress,
  onStageReady,
  onSwatch,
  type StageKey,
} from '@/lib/stage-state'
import { bespoke, night } from '@/content/copy'
import { Skeleton } from './Skeleton'
import s from './night.module.css'

/**
 * The three small client islands around the drafting table's stage. Each
 * subscribes to stage-state, so each can only ever say something the 3D
 * has actually made true.
 */

/**
 * THE DRAWING THAT STANDS IN FOR THE PIECE, and says how far off it is.
 *
 * Two things were wrong here. The stand-in was a photograph of a DIFFERENT
 * sofa, so the chapter opened on one object and swapped it for another
 * (client: "here showing another image at first - confusing"); and it said
 * nothing while the 3D chunk downloaded, so a slow connection looked like a
 * dead section ("found this section not working").
 *
 * Now: the same piece, drawn (Skeleton), with the loader's real progress
 * printed under it. The readout exists ONLY while a load is actually armed
 * - `progress` is -1 on the server, on a low-tier device and on any visitor
 * who never comes near this chapter - so the drawing never promises a piece
 * that is not coming. When the real one arrives, this unmounts.
 */
export function StagePoster() {
  const ready = useSyncExternalStore(onStageReady, getStageReady, () => false)
  const progress = useSyncExternalStore(onStageProgress, getStageProgress, () => -1)
  /* the fabric the visitor picked. The drawing is dyed by the same store the
     mesh is, so the swatch dock is a working control on a device that will
     never render a mesh - which is most of this page's traffic. */
  const swatch = useSyncExternalStore(onSwatch, getSwatch, () => bespoke.swatches[0])
  if (ready) return null
  /* -1 means no load was ever armed (low tier, or nobody came near this
     chapter). The line below then says nothing at all: the drawing builds
     itself on the scroll either way, so there is no wait to announce. */
  const loading = progress >= 0
  return (
    <div className={s.blueprint} style={{ '--fabric': swatch.hex } as React.CSSProperties}>
      <Skeleton />
      {loading ? (
        <p className={s.blueprintNote}>
          <span className={s.blueprintWord}>{night.table.drawing}</span>
          <span className={s.blueprintBar}>
            <i style={{ transform: `scaleX(${progress})` }} />
          </span>
          <span className={s.blueprintPct}>{Math.round(progress * 100)}%</span>
        </p>
      ) : null}
    </div>
  )
}

/**
 * The drawn dimension line: the piece's REAL width in millimetres, read off
 * the mesh at load. Nothing typed, so nothing can be wrong; no 3D means no
 * number, and the line prints the brief's fact instead.
 */
export function Dimension({ fallback, stage = 'bespoke' }: { fallback: string; stage?: StageKey }) {
  const size = useSyncExternalStore(onPieceSize, () => getPieceSize(stage), () => null)
  const text = size?.w ? `${size.w} MM · ${size.h} MM · ${size.d} MM` : fallback
  return (
    <div className={s.dimLine} aria-hidden="true">
      <span className={s.dimTick} />
      <span className={s.dimRule} />
      <span className={s.dimText}>{text}</span>
      <span className={s.dimRule} />
      <span className={s.dimTick} />
    </div>
  )
}

/** "Drag to inspect · 360", only once the 3D has armed the orbit */
export function Inspect() {
  const armed = useSyncExternalStore(onInspectArmed, getInspectArmed, () => false)
  if (!armed) return null
  return (
    <p className={s.inspect} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12a8 8 0 0 1 8-8m8 8a8 8 0 0 1-8 8" />
        <path d="M12 2.5 14.5 5 12 7.5M12 21.5 9.5 19l2.5-2.5" />
      </svg>
      {bespoke.inspect}
    </p>
  )
}
