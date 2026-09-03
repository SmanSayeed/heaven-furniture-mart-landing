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

export function detectTier(): Tier {
  /* server render or a non-window context: treat as low, mount nothing */
  if (typeof window === 'undefined') return 'low'

  /* a slow link or a data-saving visitor never gets 2 MB of geometry, whatever
     the GPU could technically handle */
  if (prefersLightweight()) return 'low'

  let webgl2 = false
  try {
    webgl2 = !!document.createElement('canvas').getContext('webgl2')
  } catch {
    webgl2 = false
  }

  const memory = (navigator as NavigatorCapabilities).deviceMemory
  const cores = navigator.hardwareConcurrency ?? 4

  /* memory is undefined outside Chromium (Safari, Firefox): its absence must
     never force 'low' on an otherwise capable device, so it only counts when
     reported. Cores default to a neutral 4 for the same reason. */
  if (!webgl2 || (memory !== undefined && memory <= 2) || cores <= 2) return 'low'
  if (cores >= 6 && (memory ?? 8) >= 6) return 'high'
  return 'mid'
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
