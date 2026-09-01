'use client'

import dynamic from 'next/dynamic'

/**
 * The bridge between the server-rendered page and the browser-only 3D scene.
 *
 * Why this file exists at all:
 *   three.js reads `window` at import time, so the scene can never be rendered
 *   on the server. `next/dynamic` with { ssr: false } is how we opt out — but
 *   that option THROWS inside a Server Component in the App Router, so the call
 *   has to live in a Client Component. That Client Component is this file.
 *
 * This is the exact shape every 3D section of the real page will reuse.
 */
const Scene = dynamic(() => import('./Scene'), {
  ssr: false,
  // The `loading` slot doubles as our no-WebGL / slow-network fallback: the
  // poster is on the same code path as the loading state, so it is free.
  loading: () => (
    <div
      style={{
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        color: '#F4F0E8',
        font: '400 0.875rem/1 system-ui, sans-serif',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        opacity: 0.5,
      }}
    >
      Loading
    </div>
  ),
})

export default function SceneLoader() {
  return <Scene />
}
