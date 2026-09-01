import { bespoke } from '@/content/copy'

/**
 * Tiny shared state between the page's separate client islands (PLAN 4.4).
 *
 * Why not context or a store library: the scroll orchestrator (PageMotion),
 * the swatch dock (inside the server-rendered Bespoke section) and the 3D
 * canvas (StageCanvas, mounted later and lazily) are three independent React
 * roots' worth of islands; they share no tree. A module singleton is the
 * smallest thing that connects them, and it decouples timing completely:
 * GSAP writes numbers here whether or not the 3D ever mounts, and the 3D
 * reads them whenever it happens to arrive.
 */

export type SwatchChoice = {
  id: string
  name: string
  hex: string
  accent: string
}

/* Mutated by GSAP (scrubbed timeline), read by useFrame every frame.
   0..1 across the whole pinned S3 sequence. */
export const stageState = {
  bespokeProgress: 0,
  /* 0..1 across the hero's pinned exit: the piece yaws and recedes on the
     turntable as the ivory curtain rises (PLAN S1b choreography) */
  heroProgress: 0,
  /* ---- S1 turntable (the hero's grabbable piece) ----
     Written by the DOM drag handler (Turntable.tsx), read by useFrame.
     Radians of accumulated yaw, plus the leftover velocity that keeps
     spinning after the finger or mouse lets go. Kept here, not in React
     state, because it changes every pointermove and every frame: routing
     that through a re-render would drop frames for no benefit. */
  heroSpin: 0,
  heroSpinVelocity: 0,
  /* true while a pointer is actually held down on the stage: the idle sway
     and the auto-turn both yield to a visitor's hand */
  heroGrabbed: false,
}

/* ---- 360 inspect mode (S3b) ----
   The 3D view arms this once the pinned story resolves; the affordance line
   in the DOM subscribes. Same shape as the swatch store, and it means the
   hint can only ever exist when the 3D actually mounted, which is exactly
   the fallback rule (no 3D, no affordance). */
let inspectArmed = false
const inspectListeners = new Set<(armed: boolean) => void>()

export function getInspectArmed(): boolean {
  return inspectArmed
}

export function setInspectArmed(next: boolean): void {
  if (inspectArmed === next) return
  inspectArmed = next
  inspectListeners.forEach((l) => l(next))
}

export function onInspectArmed(listener: (armed: boolean) => void): () => void {
  inspectListeners.add(listener)
  return () => {
    inspectListeners.delete(listener)
  }
}

/* ---- the hero turntable's current piece (S1) ----
   PageMotion advances this from the hero's pinned scroll; the DOM label and
   the 3D view both subscribe, so the caption can never name a piece the
   scene is not showing. Index into copy.ts `hero.pieces`. */
let heroPiece = 0
const pieceListeners = new Set<(index: number) => void>()

export function getHeroPiece(): number {
  return heroPiece
}

export function setHeroPiece(next: number): void {
  if (heroPiece === next) return
  heroPiece = next
  pieceListeners.forEach((l) => l(next))
}

export function onHeroPiece(listener: (index: number) => void): () => void {
  pieceListeners.add(listener)
  return () => {
    pieceListeners.delete(listener)
  }
}

/* ---- "the 3D actually arrived" flag ----
   Same discipline as inspectArmed: an affordance that promises interaction
   (the drag hint, the grab cursor) may only exist once the piece it refers
   to is genuinely on screen. Low tier and no-WebGL never set this, so they
   never advertise a control they do not have. */
let stageReady = false
const readyListeners = new Set<(ready: boolean) => void>()

export function getStageReady(): boolean {
  return stageReady
}

export function setStageReady(next: boolean): void {
  if (stageReady === next) return
  stageReady = next
  readyListeners.forEach((l) => l(next))
}

export function onStageReady(listener: (ready: boolean) => void): () => void {
  readyListeners.add(listener)
  return () => {
    readyListeners.delete(listener)
  }
}

/* ---- swatch pub/sub ---- */
const DEFAULT_SWATCH: SwatchChoice = bespoke.swatches[0]

let current: SwatchChoice = DEFAULT_SWATCH
const listeners = new Set<(s: SwatchChoice) => void>()

export function getSwatch(): SwatchChoice {
  return current
}

export function setSwatch(next: SwatchChoice): void {
  current = next
  listeners.forEach((l) => l(next))
}

/** subscribe; returns the unsubscribe function */
export function onSwatch(listener: (s: SwatchChoice) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
