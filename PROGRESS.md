# Progress

Current phase: 0 (Setup) — **complete**
Current lab: 01 (next up)
Sofa GLB status: none yet (placeholder GLB comes in Lab 02, real Meshy model in Lab 08)
Splat status: not-requested
Repo: https://github.com/SmanSayeed/heaven-furniture-mart-landing (private)
Deadline (confirmed from hackathon page): **TODO — confirm in the WhatsApp group**

## Stack (installed 2026-09-01, all versions verified on npm)

| Package | Version |
|---|---|
| next | 16.3.4 (App Router, Turbopack) |
| react / react-dom | 19.2.8 |
| three | 0.185.1 |
| @react-three/fiber | 9.7.0 |
| @react-three/drei | 10.7.8 |
| gsap | 3.15.0 |
| @gsap/react | 2.1.2 |
| lenis | 1.3.26 |
| typescript / eslint | 5.x / 9.x |

Deferred until their own lab: `@google/model-viewer` (Lab 09), `@sparkjsdev/spark` (Lab 10),
`@gltf-transform/cli` (Lab 08, via npx).

---

## 2026-09-01

- **Done: stack decision.** Switched from Vite + vanilla Three.js to **Next.js 16 +
  react-three-fiber**, because Saadman already ships Next/React daily — learning Three.js and
  vanilla-DOM patterns simultaneously doubles the difficulty for no gain. WebGPU dropped in
  favour of WebGL2. Full rationale in PLAN.md §0.
- **Done: research.** Verified every package version on npm; confirmed R3F 9.7's React peer
  range (`>=19 <19.3`) is satisfied by Next 16's React 19.2.8; confirmed via the Next.js docs
  that `next/dynamic` with `ssr: false` throws inside a Server Component, so the 3D scene needs
  a `'use client'` wrapper.
- **Done: the Blender problem is solved.** Saadman has no Blender and no 3D background. Meshy
  now ships **Auto Split**, which cuts a generated model into separate parts in one click. The
  whole asset pipeline is now browser + terminal only — no Blender, no After Effects.
- **Done: Phase 0 scaffold.** `heaven-mart/` created (TypeScript, App Router, `src/`, no
  Tailwind, git init skipped). All 3D + motion deps installed. `npm run build` passes clean.
- **Done: git + GitHub.** Repo root is the hackathon folder so PLAN/PROGRESS/ASSETS travel with
  the code. Initial commit pushed to a **private** repo.
- **Struggled with / newly learned vocabulary:** "scaffold" (generating the starter skeleton —
  he already does this with `nest g resource`) and "on the fly" (computed at the moment of use,
  as opposed to precomputed at build time).
- **Next: Lab 01** — first R3F scene: `<Canvas>`, a mesh, a light, and the
  `'use client'` + `dynamic({ ssr: false })` wrapper pattern that every later 3D section reuses.
- **Open questions for the WhatsApp group:**
  1. Exact submission deadline — date **and** time?
  2. Submission format — repo link, live URL, video, or all three?
  3. Is a slow 1–2 minute walkthrough video of the Agrabad showroom available?
  4. Any higher-resolution product photos than what is on Facebook / Instagram?
  5. Is there an official logo file (transparent SVG / PNG)?


## 2026-09-01 (later)
- Done: merged the creative plan (Claude-PLAN.md) into PLAN.md — single source of truth now.
  Key change: S3 bespoke moment is blueprint -> craft-plane -> customize on a SINGLE mesh
  (Meshy Auto Split verified unusable for textured web GLB; correction recorded in PLAN.md 0.2).
  Lab 06 redefined accordingly.
- Done: CLAUDE.md now committed to the repo (was environment-injected only), with a note that
  PLAN.md supersedes its stack sections.
- Done: deleted heaven-studio/ (dead Vite scaffold) and Claude-PLAN.md (merged) with permission.
- Done: installed @sparkjsdev/spark 2.1.0 and @gltf-transform/cli 4.5.0.
  @google/model-viewer NOT installed via npm (peers on three ^0.183 vs our 0.185) — will
  self-host its standalone bundle in Lab 09 instead.
- Done: ASSETS.md now documents the asset hand-off workflow (assets-raw/ folder, git-ignored).
- Tooling: Saadman has paid Gemini (Nano Banana Pro) — first choice for the 4 Meshy sofa views
  and photo cleanup; Reve Remix for grade transfer. Claude Design canvas optional for Day 5-6
  mockups. Playwright MCP available — Claude verifies UI in the browser directly.
- In progress: Lab 01 (code written and explained; awaiting his experiments + check answers).
