# Heaven Furniture Mart — Landing Page

Submission for the **Racdox Hackathon 2026** (`#racdox_hackathon`).
Client: [Heaven Furniture Mart](https://www.facebook.com/HeavenFurnitureMart) — bespoke furniture,
Agrabad Access Road, Chattogram, Bangladesh.

> "Designed. Crafted. Customized."

---

## Repository layout

| Path | What it is |
|---|---|
| [`heaven-mart/`](heaven-mart/) | The Next.js 16 application — this is the deliverable |
| [`PLAN.md`](PLAN.md) | Build plan, architecture, asset pipeline, risk register, learning roadmap |
| [`PROGRESS.md`](PROGRESS.md) | Running session log — what is done, what is next |
| [`ASSETS.md`](ASSETS.md) | Every asset's source, tool and licence (incl. required attributions) |

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.4 (App Router, Turbopack), React 19.2.8, TypeScript |
| 3D | Three.js 0.185 via `@react-three/fiber` 9.7 + `@react-three/drei` 10.7 (WebGL2) |
| Motion | GSAP 3.15 + `@gsap/react` (ScrollTrigger, SplitText) + Lenis smooth scroll |
| Styling | CSS Modules + design tokens (no CSS framework — deliberate, see PLAN.md §0) |
| Backend | **None.** Fully static. The single CTA is a `wa.me` link. |

## Running locally

```bash
cd heaven-mart
npm install
npm run dev          # http://localhost:3000
npm run dev -- -H 0.0.0.0   # expose on LAN to test on a real phone
```

Requires Node 20+.

## Architecture note — why the 3D scene is dynamically imported

Three.js touches `window` at import time, so the `<Canvas>` must never be server-rendered.
`next/dynamic` with `{ ssr: false }` is **not permitted inside a Server Component** in the App
Router, so every 3D section follows this shape:

```
app/page.tsx            Server Component — all copy, all SEO, works with JavaScript disabled
  └─ SceneLoader.tsx    'use client' — dynamic(() => import('./Scene'), { ssr: false })
        └─ Scene.tsx    'use client' — <Canvas>, meshes, GSAP timelines
```

The `loading:` slot of that dynamic import renders the poster image, so the no-WebGL fallback
and the loading state are the same code path.

## Credits

See [`ASSETS.md`](ASSETS.md) for photo sources, tooling and licence attributions.
