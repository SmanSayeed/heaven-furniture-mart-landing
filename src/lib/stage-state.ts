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
  /*
    THE ARRIVAL, and it is separate from the progress above on purpose.

    Sheet 04's whole story is scrubbed: the blueprint, the sweep, the fabric
    are all a pure function of bespokeProgress, which is exactly what a
    scroll-told story should be. What that could not do was ANSWER THE
    VISITOR AT THE MOMENT THEY ARRIVE. The section pins at 'top top', so
    progress is 0 for the entire time it takes to settle, and scrub adds a
    second of lag on top; someone who scrolled quickly through four sheets
    got a near-empty panel and, reasonably, read it as broken.

    So arrival is its own number, tweened 0 -> 1 by a one-shot trigger that
    fires BEFORE the pin (at 'top 85%'), and multiplied into the blueprint's
    opacity and the piece's rise. The drawing now draws itself the instant
    the sheet comes into view, whatever the scroll is doing. Scrub owns the
    story; this owns the greeting.

    Starts at 1 so that anything which never runs the motion layer — no JS,
    reduced motion, a thrown tween — sees a fully present piece rather than
    an invisible one. Same inversion law as the CSS.
  */
  bespokeArrival: 1,
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
  /*
    THE SECOND AXIS.

    heroSpin turns the PIECE about y. This one moves the CAMERA up and down,
    and the distinction is the whole reason it is a separate number rather
    than a second rotation on the same group: tipping a sofa about its own x
    axis lays it on its back, which is not what "look at it from above"
    means. A turntable has one rotating thing and one orbiting thing.

    Radians from the horizon, positive looking down. Clamped in StageCamera,
    not here, because the clamp is a framing decision and framing belongs to
    the camera — the floor plane is what it must never go under.
  */
  heroTilt: 0,
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

/* ---- HOW FAR THE 3D HAS GOT (0..1) ----

   The drafting table shows a drawn skeleton of the piece until the real one
   is on the table, and that wait is not instant: the WebGL chunk is fetched
   only when the visitor is approaching the chapter, and three.js is a real
   download on Chattogram mobile data. A skeleton with nothing to say about
   itself reads as a broken section (client: "found this section not working
   ... keep this skeleton loaded as image until main 3d loaded with loading
   %"), so the loader publishes its progress here and the drawing prints it.

   THE CHECKPOINTS ARE REAL, and there are three of them: the load is armed,
   the chunk has resolved, the piece is on screen. StageLoader eases between
   them so the readout never sits still, but it can only reach 100 when
   `setStageReady(true)` is genuinely true. -1 means NO LOAD HAS BEEN ARMED -
   a low-tier device, or a visitor who has not come near the chapter - and
   the drawing then says nothing at all rather than promising a piece that
   is never coming. */
let stageProgress = -1
const progressListeners = new Set<(p: number) => void>()

export function getStageProgress(): number {
  return stageProgress
}

export function setStageProgress(next: number): void {
  const clamped = next < 0 ? -1 : Math.min(1, next)
  /* one listener pass per whole percent: this is driven by a rAF ticker and
     the only consumer renders two digits */
  if (Math.round(clamped * 100) === Math.round(stageProgress * 100)) return
  stageProgress = clamped
  progressListeners.forEach((l) => l(clamped))
}

export function onStageProgress(listener: (p: number) => void): () => void {
  progressListeners.add(listener)
  return () => {
    progressListeners.delete(listener)
  }
}

/* ---- the piece's REAL size (BLUEPRINT SS5.2) ----
   The dimension lines drawn around a stage are not decoration and they are
   not made up: they are the model's own bounding box in millimetres, read
   off the GLB at load and published here. Placeholder pieces show THEIR true
   size; the day a Meshy scan of a Heaven sofa replaces one, the numbers on
   screen change by themselves, because nothing about them was ever typed.
   null = nothing measured yet, and the annotation must then not exist: a
   drawn dimension with no model behind it would be the page telling a lie. */
export type PieceSize = { w: number; h: number; d: number }
/** the two stages that can hold a measurable object */
export type StageKey = 'hero' | 'bespoke'

const pieceSizes: Record<StageKey, PieceSize | null> = { hero: null, bespoke: null }
const sizeListeners = new Set<(key: StageKey) => void>()

export function getPieceSize(key: StageKey): PieceSize | null {
  return pieceSizes[key]
}

export function setPieceSize(key: StageKey, next: PieceSize | null): void {
  const prev = pieceSizes[key]
  if (prev === next) return
  if (prev && next && prev.w === next.w && prev.h === next.h && prev.d === next.d) return
  pieceSizes[key] = next
  sizeListeners.forEach((l) => l(key))
}

/** subscribe to every stage; the listener filters by key. One listener set
    keeps this a two-line store instead of a registry of stores. */
export function onPieceSize(listener: (key: StageKey) => void): () => void {
  sizeListeners.add(listener)
  return () => {
    sizeListeners.delete(listener)
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
