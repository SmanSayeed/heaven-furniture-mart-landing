/**
 * Device tier detection (PLAN Part 4.7 step 2). Pure, client-side, no state:
 * call it when you need it, never at module scope (SSR has no navigator).
 *
 * The tier decides how much 3D a visitor gets. The FB in-app browser (our
 * PRIMARY browser for ad traffic, PLAN Part 1.7) tends to land in 'mid' or
 * 'low', which is exactly the intent: poster-first, 3D only where it is free.
 */
export type Tier = 'high' | 'mid' | 'low'

/* navigator.deviceMemory is Chromium-only and absent from lib.dom's Navigator */
interface NavigatorCapabilities extends Navigator {
  deviceMemory?: number
}

export function detectTier(): Tier {
  /* server render or a non-window context: treat as low, mount nothing */
  if (typeof window === 'undefined') return 'low'

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
