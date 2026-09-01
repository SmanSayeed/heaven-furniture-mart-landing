import type { Metadata } from 'next'
import SceneLoader from './SceneLoader'

// Labs are learning scratchpads, never part of the submitted page.
export const metadata: Metadata = {
  title: 'Lab 01 — Hello Scene',
  robots: { index: false, follow: false },
}

/**
 * Note what is NOT at the top of this file: 'use client'.
 * This is a Server Component. All the real page's copy and SEO will live in
 * files like this one, so the page is complete before any JavaScript runs.
 */
export default function Lab01Page() {
  return (
    // <Canvas> sizes itself to its parent. A parent with no height means a
    // 0px canvas and a blank screen — the most common first-day R3F bug.
    <main style={{ height: '100dvh', background: '#0B0C0C' }}>
      <SceneLoader />
    </main>
  )
}
