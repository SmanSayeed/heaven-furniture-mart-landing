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

## 2026-09-01 (evening) — Sprint 1 static skeleton BUILT
- Design frozen: Midnight Studio + brand alignment (Heaven Ink #0C1312, two golds, royal blue
  moment) + placards-not-paragraphs + Golden Thread + scroll choreography + business layer.
  All in PLAN.md Parts 1.5-1.7, 2.5, 13. TASKS.md sprint board created.
- Built: full 8-section static page as Server Components. Fraunces/Archivo/IBM Plex Mono via
  next/font, design tokens + text roles in globals.css, single shared sections.module.css,
  inline Phosphor icons, WhatsApp lib, sticky frosted pill, JSON-LD FurnitureStore schema.
  Page is complete and convertible with JS disabled. Build + eslint clean.
- Verified on Playwright at 390x844: hero, placard section, ticker, cards all render as designed.
  Fixed: hero specimen row hidden on phones (collided with sticky pill).
- Assets: 10 FB photos collected by Saadman, renamed semantically, mapped to sections in
  copy.ts. All carry baked-in ad overlays; Gemini cleanup pending (his task, prompts provided).
- Next: his phone check + git permission answer, then Sprint 2 (Lenis, Golden Thread,
  SplitText, accent scrub, card entrances).

## 2026-09-01 (night) — Sprint 2 motion layer COMPLETE (via background agent, verified)
- SmoothScroll (ReactLenis root + GSAP ticker sync) and PageMotion (single client orchestrator).
- Live: SplitText hero intro, Apple-style dim-to-bright scrubs, infinite ticker marquee,
  perspective card entrances, per-section --accent tweening, ghost numeral parallax,
  GOLDEN THREAD v1 (hero rule -> left-edge scroll spine -> footer marigold triangle tie-off),
  S4 desktop horizontal rail pin (>=900px, containerAnimation card triggers).
- All motion inside gsap.matchMedia; reduced-motion and no-JS paths show the full static page.
- Agent-verified at 1280x800 and 390x844, zero console errors; eslint + build clean.
- Sprint 3 dispatched to the agent: single fixed Canvas + placeholder chair GLB
  (public/models/placeholder-chair.glb, Khronos SheenChair CC0, Draco-optimized 570 KB).
- Still uncommitted: git standing permission awaited from Saadman.

## 2026-09-01 (late night) — Sprint 3 hero 3D COMPLETE (agent, verified live)
- Hero stage now renders the placeholder chair in 3D: warm key spotlight breathing, cool rim,
  city environment at 0.3, idle sway, PCF contact shadow on high tier, radial mask so the
  canvas dissolves into a light pool. Fades in only after the GLB resolves.
- lib/device.ts tier detection: low tier (or no WebGL2) never downloads three.js at all;
  the CSS stage glow IS the fallback. Deferred mount via requestIdleCallback protects LCP.
- Two third-party fetches flagged for the perf sprint (self-host later): gstatic Draco decoder,
  drei-assets HDR for the Environment preset.
- Sprint 4 dispatched: one shared Canvas + two drei Views, blueprint -> clip-plane sweep ->
  live swatches (fabric color + accent + WhatsApp prefill), pinned 300vh.

## 2026-09-02 (past midnight) — Sprint 4 bespoke centrepiece COMPLETE (agent, verified)
- One shared transparent fixed Canvas, two drei Views (hero + bespoke), localClippingEnabled.
- S3 pinned 300vh: brass EdgesGeometry blueprint -> world-space clip-plane craft sweep ->
  live SwatchDock. Word spotlight follows the phases. Swatch tap tints fabric + sheenColor,
  tweens --accent, rewrites the bespoke CTA to whatsappUrlWithSwatch. Default Ivory Boucle
  applied at setup (hero chair no longer orange).
- Agent caught a real bug: R3F re-enables pointer-events on its canvas; fixed with a subtree
  rule, clicks verified. Floor is now shadowMaterial. eslint-config-next 16 react-compiler
  rules respected without disables.
- Verified both viewports incl. mobile pinned layout fitting in 844px; SSR HTML fallback
  intact; console clean except R3F-internal Clock deprecation.
- Notable: clip planes are world-space and only valid while the bespoke group sits at origin
  rotating about Y (documented gotcha).

## 2026-09-02 — parallel track (main session, while the agent handled a11y/perf)
- README.md rewritten for the Heaven tech team: the idea in one line, stack, and six
  architecture notes (JS-off completeness, the ssr:false gate, the progressive-enhancement
  ladder, the Facebook in-app-browser funnel with the pixel/UTM story, SEO, perf approach).
  This is the artefact that argues we understood their business, not just their brief.
- Footer now carries one quiet Racdox credit specimen linking to racdox.com/hackathon.
  Deliberately not larger: the page must read as the client's real page.
- scripts/optimize-photos.mjs written and ready: graded photos -> three WebP widths + a 16px
  LQIP + a generated manifest (photos.generated.ts). Needs `sharp` installed, deferred so the
  agent's package.json edits do not collide. Runs as `npm run photos` once wired.
- ASSETS.md licence ledger completed for everything shipped so far: placeholder chair
  (CC0, Wayfair/Khronos, flagged TEMPORARY), Poly Haven HDR (CC0), Draco decoder (Apache 2.0),
  fonts (OFL), Phosphor icons (MIT).
- Verified: copy.ts still has zero em/en dashes; tsc --noEmit clean.

## 2026-09-02 — v3 MONOLITH shipped + two real bugs fixed + a tooling trap found

### Bugs fixed
- **Mouse wheel was completely dead.** SmoothScroll's GSAP ticker callback captured the Lenis
  instance once; with autoRaf off, a stale/absent instance meant Lenis kept swallowing wheel
  events (preventDefault) and never scrolled. React 19 StrictMode's double-invoke made it
  reproducible. Fix: resolve the instance through the ref every tick and rebind ScrollTrigger
  on identity change. Also documented: ReactLenis's `onScroll` prop is a DOM div handler, NOT
  Lenis's scroll event; never use it for ScrollTrigger.
- Hero top-right location chip collided with the fixed Index nav pill. Removed (the location
  already appears in the eyebrow, hero specimens, showroom section and footer).

### TOOLING TRAP (invalidated every earlier "mobile" check)
This Playwright browser runs at `deviceScaleFactor: 0.75` (from the user's Windows display
scaling). `setViewportSize({390, 844})` yields a CSS viewport of **520 x 1125**, so every
"390px verification" up to this point was actually done at tablet width.
**Recipe: multiply by 0.75.** 390x844 CSS = `setViewportSize({293, 633})`; 1280x800 CSS =
`{960, 600}`. Always assert `window.innerWidth === 390` before trusting a measurement. Also:
at this dpr, `screenshot({scale:'css'})` returns a CROP; use `scale:'device'`.

At true 390px, five real hero bugs surfaced and were fixed: sticky pill overlapping the main
CTA, CTA label wrapping to 3 lines, eyebrow and tagline wrapping, and the AR hook pushed below
the fold. Fixes: responsive short label/eyebrow variants, smaller vitrine on short viewports,
sticky pill hidden while the hero is in view. The agent also caught that anchoring the sticky
pill's trigger to the PINNED hero left the flag stuck forever; re-anchored to unpinned S2.

### Unresolved, handed to Saadman
Full-viewport rasters at deep scroll come back black while the DOM says otherwise. Eliminated
so far: viewport crop (`scale:'device'` still black), `backdrop-filter` (disabled, still black),
the WebGL canvas (display:none, still black). Direct measurement of a step word at that scroll
position: colour rgb(242,243,244), opacity 0.58, rect top 88 left 20 331x108, no clip/mask/
filter anywhere in the ancestor chain, `elementFromPoint` returns it as topmost. Every signal
says it renders; only the headless raster disagrees. Almost certainly a headless compositing
artifact with ScrollTrigger's `position: fixed` pins. Needs one human look to close.

### Lighthouse (production, mobile)
Performance 48 -> 67 (TBT 5,840ms -> 910ms, TTI 18.1s -> 4.2s, LCP 4.3s -> 3.8s, CLS 0),
Accessibility 100, Best Practices 100, SEO 100. The lever was interaction-only 3D mount.
Remaining levers: font-swap render delay (87% of LCP), 51 KiB unused JS, 90ms blocking CSS.

## 2026-09-02 — neon grid refined (Saadman: "messy, too focused, needs glow and blur")
Rewrote the grid in globals.css. Before: solid #17191c 1px hairlines on 72px cells, which read
as sharp graph paper. Now:
- **Denser:** 34px minor cells with a 136px major rhythm (every 4th line stronger), so it reads
  as structure rather than a repeating texture.
- **Soft, not blurred by filter:** each line is a bright 1px core PLUS a dimmer 1-2px halo band
  in the same gradient. That reads as a blurred neon filament while costing nothing. A real CSS
  filter was rejected: it would blur the section's content too.
- **Neon, never white:** cool blue triplet `168, 206, 255` used via rgba(); minor core alpha
  0.05, halo 0.018, major core 0.075. Light sections use a cool ink `28, 44, 66` at 0.032/0.05.
- **Unfocused:** the radial wash on top now starts fading at 2% and is opaque by 78%, so the
  grid only survives in a soft central band. Plus a new cool bloom from the top edge
  (rgba(neon, 0.055)) so the grid sits inside a light rather than floating on flat black.
All tokens live in :root (--grid-cell, --grid-major, --grid-neon, --grid-core, --grid-halo,
--grid-major-core) so density and intensity are one-line changes. eslint + build clean.

## 2026-09-02 — DEADLINE AND SUBMISSION FORMAT CONFIRMED (from Saadman / WhatsApp group)

**Answers to the 6 open questions:**
1. **Deadline: 2-3 days from now** (target ship: 2026-09-04). Exact clock time still unstated.
   The 10-day plan in PLAN.md Part 7 is DEAD. See the compressed 3-day plan below.
2. **Submission:** publish a **live URL**, post the **video + live URL publicly on Facebook or
   LinkedIn**, then fill in the organizer's form with that link.
   → Vercel deploy is no longer a Day-10 task, it is a Day-1 task.
   → The video is a public social post, not a private upload: it must carry the brand, the
     hashtag #racdox_hackathon and the live URL in the caption.
   → Open-Graph image + title matter now (the FB/LinkedIn post will render a link card).
3. **No showroom walkthrough video exists.** Any moving showroom footage must be generated
   from Heaven's own real photos (Gemini/Veo image-to-video). Constraint stands: animate a
   REAL Heaven photo, never invent furniture. If it looks fake at all, drop it and stay on
   stills. S5 splat is therefore cancelled.
4. **No higher-resolution photos.** The 10 Facebook originals are all we get; the sharp/upscale
   pass in Gemini is now load-bearing, not optional.
5. **Official logo file IS available** — Saadman to collect it into `assets-raw/logo/`.
6. **No MD signature image.** The MD quote ships without a signature specimen; use a typeset
   attribution line instead (do not fake a signature).

**Re-scope decisions (2-3 days, not 10):**
- SHIP: photo cleanup + logo + real photos wired in + perf pass + Vercel deploy + video + post.
- KEEP, time-boxed: Meshy real sofa (one attempt only; if it fails, the CC0 placeholder chair
  ships and ASSETS.md keeps its TEMPORARY flag).
- KEEP if time allows on Day 2: the handmade pen-and-paper layer (the one thing no other
  entry can have).
- CANCELLED: Gaussian splat showroom (no capture, no video source), AR / model-viewer / USDZ
  (depends on a finished Meshy export we may not have), the remaining teaching labs.

## 2026-09-01 (evening · direction change)
- Saadman stopped work: current design "not up to the mark, looks broken", wants a
  MATHEMATICAL redesign (3/6-col grid, geometric sections, calculated layers).
- Git: everything committed to `backup/hero-turntable-2026-09-01` (45e2079, 95 files);
  new working branch `redesign/drawn-to-measure` created FROM the snapshot so all
  machinery (3D turntable, photo pipeline, AR, watchdog) carries over. NOT pushed.
- Wrote **BLUEPRINT.md** — the "DRAWN TO MEASURE" system: u=8px, 6/3 columns, panels
  only in 1:√2 or 1:1, baseline-snapped type scale, structural (not decorative) grid,
  per-sheet column maps S1–S8, title blocks + real-mm dimension lines, integration
  plan + acceptance checks. Awaiting Saadman's approval before implementing.
- Also this session, pre-stop: hero rebuilt as the grabbable multi-piece Turntable;
  all 10 FB photos were ad graphics → crop pipeline (npm run crop); defocused baked
  hero backdrop; AR press-to-load verified; grid made opt-in; two-level dead-wheel
  watchdog; bespoke blueprint floor 0.22 so the panel is never empty.
- Verified: bespoke 3D genuinely renders (canvas pixel read: 12% opaque, maxA 255).
  Deep-scroll black screenshots are a headless raster artifact, NOT a page bug.
- Next: Saadman reviews BLUEPRINT.md → implement §6 order 1→10.

## 2026-09-01 (late evening · plan locked, handoff written)
- BLUEPRINT.md finalized with all five directives: the math (u=8, 6/3 col, sqrt2
  panels), THE STORY (8 beats, wayfinding), monochrome palette (SS2.8), plotter print
  (SS5.5), loadshedding cut (SS5.6), floodlight + One Light Law + LIGHT SCRIPT (SS5.7:
  behaviour varies per sheet, direction never; switchover dip at dark-sheet entries).
- Wrote BUILD-GUIDE.md: execution handoff for the implementing model. State of the
  world (verified inventories), 16 hard-won traps, 10-step build order with per-step
  gates, verification recipes (dpr 0.75 math, reduced-motion raster workaround, canvas
  pixel read, monochrome + grid audits), do-not-touch list.
- Rewrote SAADMAN-TASKS.md v2: WhatsApp/deadline first, all-10 Gemini cleans (colour
  fidelity now critical: photos carry ALL the site's colour), Meshy + USDZ (iPhone AR),
  video spec, people photos; pen-and-paper task dropped (fights the precise-drawing
  concept; MD signature stays).
- All three docs uncommitted on redesign/drawn-to-measure pending Saadman's git nod.
- Next: implement BUILD-GUIDE SS5 steps 1-10 in order.
