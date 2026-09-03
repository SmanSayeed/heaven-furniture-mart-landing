import type Lenis from 'lenis'

/**
 * The one Lenis instance, if there is one. Smooth scrolling is created
 * lazily, only on fine-pointer devices, and only once the browser is idle
 * (SmoothScrollIdle.tsx) - so anything that wants to pause it (the modal)
 * asks here at the moment it needs to, and gets null on a phone, before
 * idle, or under reduced motion. Every consumer treats null as "native
 * scroll, nothing to stop".
 */
let instance: Lenis | null = null

export function getLenis(): Lenis | null {
  return instance
}

export function setLenis(next: Lenis | null): void {
  instance = next
}
