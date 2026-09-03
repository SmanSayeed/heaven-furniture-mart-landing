'use client'

import { useSyncExternalStore } from 'react'
import {
  getInspectArmed,
  getPieceSize,
  getStageReady,
  onInspectArmed,
  onPieceSize,
  onStageReady,
  type StageKey,
} from '@/lib/stage-state'
import { bespoke } from '@/content/copy'
import { Photo } from '@/components/ui/Photo'
import s from './night.module.css'

/**
 * The three small client islands around the drafting table's stage. Each
 * subscribes to stage-state, so each can only ever say something the 3D
 * has actually made true.
 */

/** the sofa photograph standing in until (or instead of) the 3D piece */
export function StagePoster() {
  const ready = useSyncExternalStore(onStageReady, getStageReady, () => false)
  if (ready) return null
  return (
    <Photo
      name="hero-sofa-01-frontal"
      alt=""
      sizes="(min-width: 861px) 60vw, 92vw"
      className={s.poster}
      low
    />
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
