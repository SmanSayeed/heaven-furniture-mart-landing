/**
 * Device tier detection (PLAN Part 4.7 step 2). Pure, client-side, no state:
 * call it when you need it, never at module scope (SSR has no navigator).
 *
 * The tier decides how much 3D a visitor gets. The FB in-app browser (our
 * PRIMARY browser for ad traffic, PLAN Part 1.7) tends to land in 'mid' or
 * 'low', which is exactly the intent: poster-first, 3D only where it is free.
 */
export type Tier = 'high' | 'mid' | 'low'

/* deviceMemory and connection are Chromium-only and absent from lib.dom's
   Navigator. Chromium is what the Facebook in-app browser on Android is, so
   on this page's primary browser they are both present. */
interface NavigatorCapabilities extends Navigator {
  deviceMemory?: number
  connection?: {
    effectiveType?: string
    saveData?: boolean
  }
}

/**
 * "This visitor should not be made to pay for the show."
 *
 * Data Saver on, or a connection the browser itself calls 2g/3g, or two cores
 * or fewer. Any of those and the page drops to its finished-but-quiet form:
 * no preloader, no hero animation, no 3D. Nothing is hidden and nothing is
 * missing, it simply arrives already done.
 *
 * This is not an edge case for this client. The traffic is Facebook ads in
 * Chattogram, largely on mid and low-end Android over mobile data, and the
 * one thing that page has to do is say who Heaven is inside 30 seconds. A
 * headline that waits on a 70 KB animation library before it becomes visible
 * fails that on exactly the devices the ads are aimed at.
 */
export function prefersLightweight(): boolean {
  if (typeof window === 'undefined') return true
  const nav = navigator as NavigatorCapabilities
  const conn = nav.connection
  if (conn?.saveData) return true
  const eff = conn?.effectiveType
  if (eff === 'slow-2g' || eff === '2g' || eff === '3g') return true
  if ((navigator.hardwareConcurrency ?? 4) <= 2) return true
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return true
  return false
}

/*
  ONE ANSWER PER PAGE LOAD.

  detectTier() has two callers at two different moments: NightMotion at the
  browser's first idle (~1.5 s in), and StageLoader when the visitor comes
  within a screen and a half of the drafting table (which can be a minute
  later). `navigator.connection.effectiveType` is a ROLLING ESTIMATE - it
  drifts as the page pulls bytes - so the two callers were getting two
  different tiers off the same device: the motion layer armed the chapter's
  scroll story at 'mid', and by the time the visitor arrived the loader read
  '3g' and refused to mount the piece at all. The steps lit up over an empty
  stage, which is exactly what the client reported ("on scroll texts are
  highlighting only").

  So the tier is decided ONCE, on first ask, and every later caller is told
  the same thing. A page cannot change what kind of page it is halfway down.
*/
let decided: Tier | null = null

export function detectTier(): Tier {
  /* server render or a non-window context: treat as low, mount nothing */
  if (typeof window === 'undefined') return 'low'
  if (decided) return decided
  decided = decide()
  return decided
}

function decide(): Tier {

  const nav = navigator as NavigatorCapabilities
  const conn = nav.connection

  /* Data Saver is the visitor SAYING so. It is the one signal here that is a
     decision rather than a guess, and it is absolute. */
  if (conn?.saveData) return 'low'

  let webgl2 = false
  try {
    webgl2 = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    webgl2 = false
  }

  const memory = nav.deviceMemory
  const cores = navigator.hardwareConcurrency ?? 4

  /* memory is undefined outside Chromium (Safari, Firefox): its absence must
     never force 'low' on an otherwise capable device, so it only counts when
     reported. Cores default to a neutral 4 for the same reason. */
  if (!webgl2 || (memory !== undefined && memory <= 2) || cores <= 2) return 'low'

  /*
    A NETWORK ESTIMATE IS NOT A DEVICE.

    This used to run `prefersLightweight()` first, so effectiveType '3g' shut
    the 3D off completely - and Chrome on a DESKTOP reports '3g' from nothing
    more than a high round-trip time, which is normal here. The client watched
    the bespoke chapter fall back to its photograph on his own machine, twice,
    on hardware that renders the piece at 60fps ("where is the 3d skeleton
    sofa? i want that").

    So the link now decides HOW MUCH, not WHETHER, except on a phone - where
    a 2g/3g estimate really is a 2g/3g connection, the audience is Facebook
    ad traffic in Chattogram, and 350 KB of three.js is a real cost to a real
    person. A phone is the coarse pointer, not the narrow window: a desktop
    browser dragged narrow is still a desktop.
  */
  const eff = conn?.effectiveType
  const slowLink = eff === 'slow-2g' || eff === '2g'
  const modestLink = slowLink || eff === '3g'
  const handheld =
    typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches

  /*
    A SLOW LINK IS A REASON TO WAIT, NOT A REASON TO DELETE THE SUBJECT.

    '3g' on a phone used to return 'low', which meant the drafting table -
    the chapter whose entire subject is a piece being built - rendered a
    drawing and then nothing ever happened to it. That is the worst of both:
    the visitor pays for the section's height and gets none of its story.

    Two things changed that make waiting acceptable now: the stand-in is the
    same piece, drawn (Skeleton.tsx), and it BUILDS ITSELF on the scroll
    whether or not the 3D ever lands - so nobody is looking at a promise.
    And the loader prints a real percentage, so the wait is legible.

    'low' is now reserved for a device or a person that genuinely should not
    be asked: Data Saver on, no WebGL2, 2 GB of memory, two cores, or a link
    the browser calls 2g.
  */
  if (slowLink) return 'low'
  if (modestLink) return 'mid'

  /* a phone with plenty of cores is still a phone: 'high' turns on the
     costlier framing and pixel ratio, and that budget belongs to a machine
     with a fan */
  if (!handheld && cores >= 6 && (memory ?? 8) >= 6) return 'high'
  return 'mid'
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
