# Heaven Furniture Mart — Landing Page

Submission for the **Racdox Hackathon 2026** (`#racdox_hackathon`).
Client: [Heaven Furniture Mart](https://www.facebook.com/HeavenFurnitureMart) · bespoke furniture
and interior styling · Agrabad Access Road, Chattogram, Bangladesh.

> "Designed. Crafted. Customized."

---

## The idea in one line

Other furniture sites *show* furniture. This one **builds a piece around you while you scroll**:
the sofa appears as a glowing blueprint, a craft plane sweeps it into real wood and fabric, then
you pick your fabric and that choice travels into a prefilled WhatsApp message to the studio.

## Repository layout

| Path | What it is |
|---|---|
| [`heaven-mart/`](heaven-mart/) | The Next.js 16 application. This is the deliverable. |
| [`PLAN.md`](PLAN.md) | Design and implementation authority: creative direction, section specs, scroll choreography, architecture, risk register. |
| [`TASKS.md`](TASKS.md) | Sprint board. |
| [`PROGRESS.md`](PROGRESS.md) | Dated session log with every decision and correction. |
| [`ASSETS.md`](ASSETS.md) | Asset provenance, tooling and licence ledger. |
| [`SAADMAN-TASKS.md`](SAADMAN-TASKS.md) | The manual (non-code) asset workflow. |
| [`CLAUDE.md`](CLAUDE.md) | Working agreement for the AI pairing sessions. |

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.3.4 (App Router, Turbopack), React 19.2.8, TypeScript |
| 3D | Three.js 0.185 via `@react-three/fiber` 9.7 + `@react-three/drei` 10.7, WebGL2 |
| Motion | GSAP 3.15 (ScrollTrigger, SplitText) + `@gsap/react`, Lenis smooth scroll |
| Styling | CSS Modules + design tokens. No CSS framework, deliberately. |
| Fonts | Fraunces / Archivo / IBM Plex Mono, self-hosted via `next/font` |
| Backend | **None.** Fully static. The single CTA is a `wa.me` link. |

## Running locally

```bash
cd heaven-mart
npm install
npm run dev                  # http://localhost:3000
npm run dev -- -H 0.0.0.0    # expose on the LAN to test on a real phone
```

Node 20+. There are no environment variables to set; see `.env.example` for the one optional hook.

---

## Architecture notes for the Heaven tech team

### 1. The page is complete before JavaScript runs
`app/page.tsx` is a Server Component: every headline, trust point, phone number and CTA link is
in the server-rendered HTML. Motion and 3D are layered on top and can all fail without costing
the visitor anything. Initial "hidden" or "dimmed" animation states are set **from JavaScript
only**, never in CSS, so a JS failure leaves a finished page rather than a blank one.

### 2. Why the 3D scene is dynamically imported
Three.js touches `window` at import time, so the `<Canvas>` must never be server-rendered.
`next/dynamic` with `{ ssr: false }` is **not permitted inside a Server Component** in the App
Router, so 3D lives behind a client gate:

```
app/page.tsx              Server Component: copy, SEO, structured data
  └─ StageLoader          'use client': device tier gate + deferred dynamic import
        └─ StageCanvas    'use client': one <Canvas>, two drei <View>s
```

**One canvas, two views.** The hero and the bespoke section show the same model through drei's
`<View>`, which scissor-renders into each section's rectangle. There is never a second WebGL
context.

### 3. Progressive enhancement ladder
| Visitor | What they get |
|---|---|
| Modern phone / desktop | Full experience: preloader, smooth scroll, 3D, pinned bespoke sequence |
| Low-tier device or no WebGL2 | Three.js is **never downloaded**; the CSS-lit stage is the finished look |
| `prefers-reduced-motion` | No preloader, no smooth scroll, no scroll animation; all content visible |
| JavaScript disabled | The complete static page, every CTA working |

`src/lib/device.ts` makes that call once, after first paint.

### 4. Built for the client's Facebook ad funnel
Heaven advertises on Facebook and Instagram, so most traffic arrives inside the **Facebook
in-app browser** — a constrained WebView. That is not an edge case here, it is the primary path:

- Poster-first hero; the 3D chunk loads only on first user intent (or after a short timeout), so
  it never competes with first paint.
- The page renders and converts identically with JavaScript unavailable or WebGL blocked.
- `?utm_*` parameters pass through harmlessly.
- Optional Meta Pixel: set `NEXT_PUBLIC_META_PIXEL_ID` and it initialises via `next/script`;
  unset (the default) it emits **zero bytes**. The id is validated as digits-only before it is
  interpolated into markup, so a malformed or hostile value cannot become script.
- One CTA only. No cart, no price list, no competing button.

### 5. SEO
`FurnitureStore` JSON-LD (address, founder, founding date, social profiles), semantic landmarks,
descriptive `aria-label`s, Open Graph metadata, self-hosted fonts. Lighthouse SEO and Best
Practices both score 100.

### 6. Performance approach
Budgets and the degradation ladder live in [`PLAN.md`](PLAN.md) Part 5. In short: the LCP element
is text, CLS is 0, and every heavy asset (model, HDR environment, Draco decoder) is self-hosted
and lazily fetched. **No third-party requests are made at runtime** with the pixel disabled.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npx eslint src` | Lint (note: `next lint` was removed in Next 16) |
| `npm run photos` | Re-encode cleaned photos into `public/img` WebP sets plus a manifest |

## Credits

Photography © Heaven Furniture Mart. 3D and image tooling, licences and every asset's provenance
are listed in [`ASSETS.md`](ASSETS.md).

Thanks to **[Racdox](https://www.racdox.com/hackathon)** for organising the hackathon and to
Heaven Furniture Mart for the brief.
