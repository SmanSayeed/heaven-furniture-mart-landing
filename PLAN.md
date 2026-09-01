# Heaven Furniture Mart — Build Plan & Learning Roadmap
_Racdox Hackathon 2026 · Saadman Sayeed · started 2026-09-01_

---

## 0. Decisions locked (and what changed from CLAUDE.md)

| Topic | CLAUDE.md §4 said | We are doing | Why |
|---|---|---|---|
| Build tool | Vite + vanilla TS | **Next.js 16.3.4 (App Router)** | Saadman already ships Next/React daily. Learning Three.js AND vanilla-DOM patterns at the same time doubles the difficulty. Next also gives `next/image`, `next/font`, route-level code splitting, and one-click Vercel deploy. |
| 3D API | raw `three/webgpu` | **@react-three/fiber 9.7 + @react-three/drei 10.7** (renders Three.js 0.185) | R3F is *just* React for Three.js. Every concept maps to something he knows: `<mesh>` = a component, `useFrame` = a rAF hook, `<Canvas>` = a provider. He still learns real Three.js — R3F does not hide it. |
| Renderer | WebGPU | **WebGL2 (R3F default)** | R3F 9's WebGPU path is still opt-in and fights with `drei` helpers. WebGL2 is universal, and on a mid-range Android there is no visible win from WebGPU for one sofa. Not a downgrade for this project. |
| Motion | GSAP + Lenis | **GSAP 3.15 + @gsap/react 2.1.2 + lenis 1.3.26** (unchanged) | ScrollTrigger `scrub` is the only sane way to drive a 3D timeline from scroll. Framer Motion has no equivalent. |
| Framer Motion | — | **Not installed** | Two motion libraries = wasted KB. His Framer Motion mental model transfers to GSAP directly (see §5, Lab 03). |
| Styling | plain CSS | **CSS Modules + a global token file** | Tailwind pushes toward default spacing/type scales — exactly the "generic template" look the judges penalise. Hand-set type and whitespace is what reads as luxury. |
| Blender | required for splitting the sofa | **Not required — Meshy Auto Split** | Verified 2026-09-01: Meshy ships a one-click **Auto Split** that cuts a model into separate parts and caps the cuts. This removes the only Blender dependency in the whole plan. |
| After Effects | never required | Not required | All motion is code (GSAP). Screen recording is OBS or Windows Game Bar. |

### Non-negotiables carried over from CLAUDE.md (unchanged)
- Bangla conversation, English code / docs / commits.
- One lab per session. Explain → tiny code → he runs it → verify → extend.
- Every 3D feature ships with a non-3D fallback.
- One CTA only (WhatsApp). No shop / cart / price list.
- Lighthouse mobile >= 90; hero GLB < 1.5 MB; total JS gz < 300 KB.
- No git command without explicit permission.

---

## 1. Verified stack (every version checked on npm, 2026-09-01)

```
next                 16.3.4      App Router, Turbopack
react / react-dom    19.2.8      (R3F 9.7 peer range is >=19 <19.3 — compatible)
typescript           5.x

three                0.185.1     the actual 3D engine
@react-three/fiber   9.7.0       React renderer for three
@react-three/drei    10.7.8      helpers: useGLTF, Environment, OrbitControls, Html
@types/three         0.185.4

gsap                 3.15.0      all plugins free (ScrollTrigger, SplitText)
@gsap/react          2.1.2       useGSAP() hook — auto cleanup, StrictMode safe
lenis                1.3.26      smooth scroll; use the `lenis/react` <ReactLenis> export

--- added later, at their own lab ---
@google/model-viewer 4.3.1       Lab 09 (AR)
@sparkjsdev/spark    latest      Lab 10 (Gaussian splat) — STRETCH GOAL
@gltf-transform/cli  latest      Lab 08, dev-only, run via npx (Draco + KTX2)
```

### Known Next.js gotcha (verified against the Next.js docs)
`next/dynamic` with `{ ssr: false }` **is not allowed inside a Server Component** — it throws.
Three.js touches `window` at import time, so the Canvas must never be server-rendered.

The pattern we use everywhere:

```
app/page.tsx                    Server Component — all the HTML / copy / SEO
  └─ <SceneLoader />            'use client' wrapper
        └─ dynamic(() => import('./SofaScene'), { ssr: false, loading: Poster })
              └─ SofaScene.tsx  'use client' — <Canvas>, meshes, GSAP
```

Bonus: the `loading:` slot is where the **poster image fallback** lives. The fallback is free —
it is the same code path as the loading state.

---

## 2. What Saadman already knows vs. what is actually new

| Already fluent | Brand new (this is the real learning) |
|---|---|
| Next.js App Router, RSC vs client components | Three.js scene graph: scene / camera / renderer / mesh / material / light |
| React hooks, refs, effects | `useFrame` render loop, `useGLTF` asset loading |
| Framer Motion (declarative animation) | GSAP timelines + **ScrollTrigger scrub** (imperative, scroll-bound) |
| Node, Nest, Postgres | (not used — this is a static page, **no backend at all**) |
| CSS | 3D asset pipeline: GLB, Draco, KTX2, real-world scale |
| — | Meshy (image → 3D), Reve (photo cleanup) |
| — | AR via `<model-viewer>`, Gaussian splats via Spark |

**Backend: none.** No Node / Nest / Postgres in this project. The CTA is a `wa.me` link — a plain
`<a href>`. Zero server. That is deliberate: static = fast = Lighthouse points.

---

## 3. The Blender-free, After-Effects-free asset pipeline

```
 Real Heaven photos (Facebook / Instagram / YouTube frames)
        │
        ▼
 [ Reve — app.reve.com ]            browser only, no Photoshop
   • remove clutter / background
   • relight, upscale to 2K
   • Remix: one consistent warm editorial grade across ALL photos
        │
        ├──► /public/img/*.webp          → Collections strip, hero poster
        │
        └──► 4 clean views of ONE sofa (front / left / right / back, plain bg)
                    │
                    ▼
          [ Meshy — meshy.ai ]           browser only, no Blender
            1. Image to 3D (multi-view, up to 4 images)
            2. Remesh → target <= 40k triangles
            3. *** Auto Split *** → cuts into separate parts (frame / cushions / legs)
            4. Export GLB (web) + USDZ (iOS AR)
                    │
                    ▼
          [ npx @gltf-transform/cli optimize in.glb out.glb
              --compress draco --texture-compress ktx2 ]      ← terminal only
                    │
                    ▼
            /public/models/sofa.glb   (< 1.5 MB target)
            /public/models/sofa.usdz  (iOS AR)
```

**If Meshy Auto Split gives ugly parts** → fallback plan, in order:
1. Re-run Auto Split with a different part count (it is non-destructive).
2. Generate 2–3 *separate* Meshy models (sofa base, cushion, leg) and compose them in R3F —
   the explode still works, we just author the parts by hand.
3. Last resort: skip the geometry explode; do a **label explode** — the sofa stays whole and
   annotation lines fly out to labelled hotspots (`<Html>` from drei). Still sells "bespoke".

---

## 4. Target architecture

```
heaven-mart/
├─ public/
│  ├─ img/            hero-poster.webp, collections/*.webp   (Reve output)
│  ├─ models/         sofa.glb, sofa.usdz                    (Meshy output)
│  └─ splats/         showroom.spz                           (stretch)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           fonts (next/font), metadata, <ReactLenis root>
│  │  ├─ page.tsx             SERVER component — all copy, all sections, works with JS off
│  │  ├─ globals.css          design tokens: --ink, --ivory, --accent, type scale
│  │  └─ labs/                throwaway learning routes: /labs/01 ... /labs/12
│  ├─ components/
│  │  ├─ sections/            Hero, BrandIntro, Bespoke, Collections, Showroom, Proof, Footer
│  │  ├─ three/               SceneLoader.tsx ('use client' + dynamic), SofaScene.tsx, Sofa.tsx
│  │  └─ ui/                  CtaWhatsApp.tsx, Swatches.tsx, StickyCta.tsx
│  └─ lib/
│     ├─ whatsapp.ts          builds the wa.me link + prefilled text
│     └─ device.ts            tier detection (hardwareConcurrency, deviceMemory)
└─ PLAN.md   PROGRESS.md   ASSETS.md   README.md
```

**Labs are routes, not separate projects.** One `npm run dev`, open `/labs/01`.
They get deleted (or `noindex`-ed) before submission.

---

## 5. The learning path — 12 labs, each anchored to something he already knows

> Session shape for every lab: **(a)** 3-min concept story in Bangla → **(b)** small code he
> types himself → **(c)** he runs it → **(d)** one "make it yours" tweak → **(e)** 2–3 check
> questions → **(f)** commit (with permission) → **(g)** PROGRESS.md updated.

### Lab 01 — First scene: cube, light, camera · `/labs/01`
- **Bridge from what he knows:** `<Canvas>` is a provider. `<mesh>` is a component. That is genuinely it.
- **New:** scene graph; camera; `meshStandardMaterial` vs `meshBasicMaterial`; why a light is
  required at all; `dpr={[1, 2]}` (pixel-ratio cap); Y-up coordinate system.
- **Next.js piece:** the `'use client'` + `dynamic(..., { ssr: false })` wrapper. Get this right
  once, reuse it forever.
- **Check:** Mesh vs Material vs Geometry — which is which? Why cap dpr at 2?

### Lab 02 — Make it look expensive: GLB + lighting · `/labs/02`
- **New:** `useGLTF` (drei); `<Suspense>` for 3D assets; `<Environment>` (HDRI reflections);
  `ACESFilmicToneMapping`; colour space; 3-point lighting.
- Uses a **free placeholder sofa GLB** until Lab 08 replaces it with the real one.
- **Check:** why does a model look flat grey with no environment map?

### Lab 03 — GSAP without scroll · `/labs/03`
- **Bridge:** Framer Motion is *declarative* — state changes, it animates. GSAP is *imperative* —
  you own a timeline object and can scrub it to any point in time. That scrubbing is exactly why
  GSAP is required for the 3D story and Framer Motion is not enough.
- **New:** `useGSAP()` hook (auto cleanup, StrictMode-safe, scoped); `gsap.to / from / fromTo`;
  timelines; `stagger`; `ease`; `SplitText` on the serif headline.
- **Check:** in a stagger, what is the difference between `duration` and `stagger`?

### Lab 04 — ScrollTrigger + Lenis · `/labs/04`
- **New:** `trigger / start / end`; `pin`; `scrub: 1`; `markers: true`; `ScrollTrigger.refresh()`;
  `<ReactLenis root>` and syncing Lenis to the GSAP ticker.
- **Check:** what does `start: "top top"` mean? Why `scrub: 1` and not `scrub: true`?

### Lab 05 — Scroll-drive the 3D scene (THE core trick) · `/labs/05`
- **New:** GSAP animates a plain JS object → `useFrame` reads it → camera follows.
  Why we never animate the R3F camera prop directly. `invalidateOnRefresh`.
- **The single most important lab.** Everything visual in the page depends on this pattern.

### Lab 06 — Explode / reassemble · `/labs/06`
- **New:** walking `nodes` from `useGLTF`; storing original positions; `Vector3` math;
  per-part stagger; labels tied to timeline progress.
- **This is the "bespoke moment" the judges will remember.**

### Lab 07 — Material swap + dynamic `--accent` · `/labs/07`
- **New:** `material.color.set()`; `MeshPhysicalMaterial` sheen for fabric; GSAP tweening a
  **CSS custom property** on `document.documentElement`, driven by ScrollTrigger.
- Swatch choice lives in React state → feeds the WhatsApp prefilled message.

### Lab 08 — Asset pipeline day (no coding) · terminal + browser
- Reve → Meshy (multi-view → remesh → **Auto Split**) → `gltf-transform` → drop into `/public`.
- **Record the screen while doing this** — 30 seconds of it goes into the submission video.
- **Check:** what does Draco compress, and what does KTX2 compress? (geometry vs textures)

### Lab 09 — AR: "See it in your room" · `/labs/09`
- **New:** `<model-viewer>` web component inside React (client-side dynamic import + a TS
  declaration for the custom element); Scene Viewer (Android) vs Quick Look (iOS);
  why the GLB must be modelled in **real-world metres**.
- **Test on his actual Android phone.**

### Lab 10 — Gaussian splat showroom · `/labs/10` · **STRETCH**
- **New:** what a splat actually is; Spark `SplatMesh` inside R3F via `<primitive>`;
  `IntersectionObserver` lazy init; disposing on exit.
- **Gate: if no showroom capture exists by Day 8 → drop it and ship the YouTube walkthrough.**
  This is the first thing cut if time runs short. Cutting it costs zero judging points.

### Lab 11 — CSS scroll-driven reveals + reduced motion · `/labs/11`
- **New:** `animation-timeline: view()` — runs on the compositor thread, effectively free on a
  cheap phone; `@media (prefers-reduced-motion: reduce)` killing Lenis + GSAP and showing posters.

### Lab 12 — Performance · whole app
- **New:** device-tier detection; `next/image` with `priority` on the hero poster; `next/font`
  self-hosting; bundle analyzer; Lighthouse mobile run; `r3f-perf` overlay.

---

## 6. Day-by-day plan (deadline TBC — confirm in the WhatsApp group)

| Day | Date | Goal | Deliverable |
|---|---|---|---|
| 1 | Sep 1 | Next 16 scaffold + **Lab 01, 02** | A GLB sofa renders on his phone |
| 2 | Sep 2 | **Lab 03, 04** | Headline animates; a pinned scroll section works |
| 3 | Sep 3 | **Lab 05** | Scroll moves the camera around the sofa |
| 4 | Sep 4 | **Lab 06, 07** | Explode + reassemble + 3 swatches |
| 5 | Sep 5 | **Lab 08** — assets | Real Heaven sofa GLB + graded photos in `/public` |
| 6 | Sep 6 | Phase 2a: page skeleton | Full HTML + copy + fonts + tokens + footer, JS-off-proof |
| 7 | Sep 7 | Phase 2b: wire sections | Hero + Bespoke + Collections assembled |
| 8 | Sep 8 | **Lab 09** AR + Lab 10 or fallback | AR works on Android; showroom section decided |
| 9 | Sep 9 | **Lab 11, 12** + polish | Lighthouse >= 90, a11y pass, real-device pass, README |
| 10 | Sep 10 | Record + submit | <= 3 min video, posted with `#racdox_hackathon` |

**Slack is built in:** Labs 10 (splat) and 11 (CSS scroll animation) are both droppable.
If Day 5 slips, the page still ships complete.

---

## 7. Reference material (read, do not copy)

| What | Where |
|---|---|
| R3F docs | https://r3f.docs.pmnd.rs |
| drei helper list | https://github.com/pmndrs/drei |
| GSAP + React official guide (`useGSAP`) | https://gsap.com/resources/React/ |
| ScrollTrigger docs | https://gsap.com/docs/v3/Plugins/ScrollTrigger |
| Exploded view with R3F — written walkthrough | https://blog.anaili.fr/articles/exploded |
| R3F + GSAP scroll animations tutorial | https://wawasensei.hashnode.dev/scroll-animations-with-react-three-fiber-and-gsap |
| R3F scroll starter repo | https://github.com/Thabish-Kader/r3f-scroll |
| Meshy Auto Split docs | https://docs.meshy.ai/en/webapp/guides/3d-model/auto-split |
| Next.js lazy loading / `ssr:false` rules | https://nextjs.org/docs/app/guides/lazy-loading |
| model-viewer | https://modelviewer.dev |
| Spark (splats) | https://sparkjs.dev |
| gltf-transform | https://gltf-transform.dev |

---

## 8. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Meshy sofa geometry looks bad | High | Photos matter more than the model. Use the best 4 Reve-cleaned views. Fallback: label explode (§3). |
| Auto Split produces junk parts | Medium | Re-run with a different part count → compose separate models → label explode. |
| No showroom video for the splat | High | Drop Lab 10, use the YouTube walkthrough. Zero impact on the judging criteria. |
| Lighthouse < 90 because of Three.js | Medium | 3D is `ssr:false` + dynamic; the poster image is the LCP element; device-tier gate on low-end phones. |
| iOS AR untested (no iPhone) | High | Ship USDZ anyway; Android Scene Viewer is what gets recorded. Note the limitation in the README. |
| Scope creep | **Highest** | The page ships without splat, without AR, without WebGPU. Only Hero + Bespoke explode + Collections + Proof + CTA are mandatory. |
| Time | High | Labs 10 and 11 are explicitly droppable. Cut in that order. |

---

## 9. Definition of done (judge's checklist — from CLAUDE.md §7)

- [ ] Luxury feel: black / ivory, one accent, big serif, huge whitespace, real photos, no clutter
- [ ] Brand clear in 5 seconds: name + "bespoke furniture, Chattogram" + tagline above the fold
- [ ] Mobile-first: every section designed at 390px first
- [ ] One CTA repeated (WhatsApp), nothing competing
- [ ] Lighthouse mobile >= 90 Perf, >= 95 A11y / BP / SEO; hero interactive < 3s on 4G
- [ ] Bespoke has its own moment (explode / reassemble)
- [ ] Graceful fallbacks: no WebGL → poster; no AR → hint; no splat → video; JS off → full page
- [ ] Footer: address, phone, email, socials
- [ ] Clean commented code + a README the Heaven tech team would respect
- [ ] ASSETS.md lists every photo source and the Meshy CC BY 4.0 credit

---

## 10. Open questions for the WhatsApp group
1. Exact submission deadline — date **and** time?
2. Submission format — GitHub repo link, live URL, video, or all three?
3. Is a 1–2 minute slow walkthrough video of the Agrabad showroom available? (needed for the splat)
4. Any higher-resolution product photos than what is on Facebook / Instagram?
5. Is there an official logo file (SVG / PNG, transparent background)?
