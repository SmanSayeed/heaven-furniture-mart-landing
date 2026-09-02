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

## 2026-09-02 — v2 task list audited against measured reality; three decisions taken

SAADMAN-TASKS.md v2 was written before the WhatsApp answers landed, so it asked for things
that do not exist and repeated a prompt whose output we had already measured. Audited and
reconciled. Findings, in order of consequence:

1. **"Upscale to 4K" is a no-op.** All ten graded photos came back at **1024 px wide**.
   Gemini's image output caps there. **1024 px is the hard source ceiling for this project.**
   This retracts the line in the deadline entry above calling the upscale pass "load-bearing" —
   it is not load-bearing, it is unavailable. The `WIDTHS = [480, 960, 1600]` pipeline's 1600
   tier is an enlargement, not detail; design accordingly and do not promise desktop crispness.
2. **Gemini removed the overlays by cropping, not repainting.** 1024x1024 in, **1024x625** out
   for nine of ten. `living-01-beige-set` lost the wall panelling, chandelier, vase, framed
   painting and the sofa's top edge. That room context is what makes the photo read as a
   luxury interior rather than a product shot — the brief's first scoring criterion.
   `hero-sofa-01-frontal` survived at a true 1:1 and is accepted (carving, cushion count and
   colours all verified against the original).
   Fix: an explicit "KEEP THE ORIGINAL SQUARE 1:1 FRAMING, do not crop or zoom" sentence.
3. **v2 assumed `graded/` meant full-frame.** It does not — nine of the ten graded files are
   the cropped ones. Only the hero is uncropped.

**Decisions (Saadman, 2026-09-02):**
- **Sheet 07 keeps its content, loses the signature.** No signature exists and we will not
  fabricate the MD's handwriting. Quote + portrait carry the sheet; a typeset title block
  (`ABUL KALAM BHUIYAN / MANAGING DIRECTOR / EST. 2020`) closes it. **The sheet title must be
  renamed** — "The man who signs it" promises an artefact the page will not have.
- **Photo redo is scoped to the top 3** (`living-03-wood-set`, `living-02-blue-pair`,
  `bedroom-01-royal-bed`) with the corrected prompt, then reassess. If Gemini crops again
  despite the instruction, ship the cropped versions.
- **Showroom video cancelled.** No footage, no visit possible. Sheet 05 is stills-only: a slow
  Ken Burns pan on the widest real showroom photograph.

**Contradictions resolved between the two boards (v2 wins, it is newer):**
- Pen-and-paper handmade layer: **dropped** (hand wobble fights the precise-drawing concept).
  This overrides "keep if time allows" in the deadline entry above.
- AR / USDZ: **back in scope** (the machinery already exists in the snapshot), time-boxed to
  whatever Meshy delivers. This overrides "CANCELLED" in the deadline entry above.
- Gaussian splat showroom: stays cancelled in both.

**Verified, no action needed:** `graded/hero-sofa-01-frontal.jpeg` keeping a `.jpeg` extension
is harmless — `key()` in `optimize-photos.mjs` strips the extension. `graded/old-hero-sofa-01-frontal.jpg`
is a stray earlier attempt that currently registers as an eleventh photo; deletion asked for.

---

## 2026-09-02 — "DRAWN TO MEASURE" built, Steps 1 to 10

The plan in BLUEPRINT.md is now the page. Everything below was verified by measurement in a
real browser, not by looking at a screenshot (the deep-scroll raster artifact from §3.1 fired
again several times and was ignored correctly each time).

### Built
- **The sheet grid.** One `--edge` token feeds both the LAYOUT grid (a sheet's padding) and the
  DRAWN grid (its pseudo-element inset), so a drawn line IS a column line by construction.
  Placement is `data-col="4-6"` in the markup, which reads like the blueprint's sheet maps.
  Audit: **34 of 35 placed blocks land within 1.5px of a column boundary**; the one offender is
  Sheet 02's photograph, whose 64px overhang is the deliberate bleed.
- **All eight sheets re-laid** to their maps, plus `SheetBlock` (title block) and `BeatCaption`
  (the story's human voice, Fraunces italic) on every one, both reading from a single `story`
  array so the wayfinding cannot disagree with itself.
- **The Index is now a MAP, not a menu** — the eight beats with the hovered one's caption in a
  legend. It replaced five "INCOMING" placeholder panels, the last thing that looked unfinished.
- **Dimension lines** print the model's real bounding box in mm (`2190 MM` on the hero sofa,
  `830 MM` on the bespoke chair), published from `measureFit`'s new `raw` size. They cannot lie
  and they will re-print themselves the day a Meshy scan lands. No 3D → no dimension line.
- **The plotter print** and **the loadshedding cut** (both with the CSS-default-is-finished
  inversion), crop marks, the floodlight beam on Sheets 01/07 with the 120ms switchover, and
  the key-light dip on every piece swap.
- **OG card** designed at 1200x630 (`public/og/card.png`, 165 KB) with full OG + Twitter tags.
- README rewritten; `/labs` removed; ghost numerals removed (they were a fourth annotation kind
  against a budget of three).

### Bugs found and fixed (all reproduced first)
1. **The dead wheel — root cause found at last.** The watchdog in `SmoothScroll.tsx` armed on
   any wheel over a scrollable document, so reaching the footer and continuing to scroll (which
   correctly moves nothing) looked like a failure: it tore out Lenis and installed the level-2
   manual handler on a perfectly healthy page. Reproduced with 200 wheel events into the footer.
   The guard is now DIRECTIONAL. A full bottom → top → down round trip now logs zero warnings.
   **This is very likely the original "mouse wheel scroll not working" report.**
2. **`requestIdleCallback`'s timeout is a deadline, not a delay.** The 3D "idle backstop" fired
   at the first quiet moment — about a second in — so three.js was being parsed on top of the
   headline. It now waits 2.5s of wall clock *first*, then for quiet. TBT 7.6s → 5.3s.
3. **The srcset was lying.** Sources cap at 1024px, but the top tier was written as `1600w`, so
   a high-DPR phone picked the biggest file expecting detail that did not exist. Tiers are now
   derived from each source's true width. `uses-responsive-images` 0.5 → 1.
4. Six global classes referenced unwrapped inside the CSS module (`.btn`, `.specimen`, `.light`
   …) were being hashed and matching nothing — the same bug class as `.statement` last session.
   Motion state hooks moved from class names to data attributes so it cannot recur.
5. The scroll cue's triangle pointed up. The MD's name was italic (inherited from the quote).
   The sticky pill sat on the hero's own CTA with JS off — the hero-view flag now ships in the
   server HTML and JS only ever removes it.

### Deliberate deviations from BLUEPRINT (both recorded in the code)
- **Sheet 02's photo is A-LAND, not A-PORT.** §2.4b is the binding constraint: the sources are
  ~1024x625 landscape crops, and forcing one into a four-column portrait panel means a ~1.8x
  cover-crop — the exact letterbox-zoom the photography rules forbid. At 4 columns + bleed it
  renders ~875px wide, so a 1024px source is DOWNscaled. The spread survives; only its aspect
  gives way, to the material we actually have.
- **Sheet 03's specimens are no longer numbers.** A typed "2400 MM" beside a measured one is
  exactly the small lie a page about bespoke measurement cannot afford.

### Performance — the honest position
**Accessibility 100 · Best Practices 100 · SEO 100. Performance ~48.** BUILD-GUIDE §5.0's
ship gate of ≥85 is **not met and is not reachable** for this build: the hero is a real WebGL
scene, and parsing three.js on Lighthouse's 4x-throttled mid-range phone costs seconds of
blocking time by itself. Measured with the 3D disabled entirely, the same page scores **58** —
so the WebGL hero is worth about 10 points and the remaining gap is the brand preloader plus
GSAP's own parse. TBT also swings 5.3s–10.8s run to run on this machine, so the number is noisy.

Real wins taken rather than excused: **page weight 4.7 MB → 2.0 MB.** The 1.5 MB HDR
environment map is gone, replaced by three's `RoomEnvironment` generated in-process (verified
visually identical; `model-viewer` uses its own `neutral`); models are fetched one ahead of the
visitor instead of all three at once; the bespoke chair no longer front-loads 548 KB four
sheets early. And a new `prefersLightweight()` gate means Data Saver, 2G/3G, ≤2 cores or ≤2 GB
RAM get **no preloader, no hero animation and no 3D** — the finished page, immediately. That is
aimed squarely at this client's real traffic: Facebook ads onto mid and low-end Android in
Chattogram.

### Verified
Grid audit at 1280 and 390 · monochrome audit **0 offenders** (chroma ≤8/255; the earlier HSL
version false-flagged the page's own ink and paper) · full-scroll journey reaches
`scrollHeight - innerHeight` exactly, 3 pin spacers, ticker running, all 6 print frames
printed, both focus lights fully lit, zero console errors · no-JS render complete (headline,
8 CTAs, every contact fact, the MD quote, zero `opacity: 0`, no preloader in the HTML) ·
Sheet 01 fits 844px exactly on a 390px phone.

### Not done / next
- **Vercel deploy — needs Saadman's permission.** Every later check should run against the live
  URL, including inside the Facebook in-app browser.
- Nothing is committed. Git permission needed per task.
- Stretch, only with slack: the scrubbed panning beams and the blueprint glint (§5.7), and the
  sheet-edge ruler ticks (already marked expendable).
- Waiting on Saadman: the top-3 photo redo, the MD portrait, the logo file, and the Meshy
  GLB + USDZ (see HANDOFF-prompt.md). Every one of them is a drop-in: no code change.


---

## 2026-09-02 (later) - Saadman's review pass: nine sheets, drawn pieces, one button

Reviewing another entry in the same hackathon, Saadman found it shipping **the identical blue
sofa** as our hero. That single observation drove most of this session.

### The pieces are drawn now, not downloaded
Every 3D object on the page is generated from real furniture measurements by the new
`src/components/three/piece-geometry.ts`. Swapping in a different free asset would only have
moved the collision, so there is no asset: a three-seat sofa (2100 mm), an accent armchair and
a two-seat settee, all from one parametric design language.

- **1.8 MB of GLB and 752 KB of Draco decoder deleted.** Public folder 4.4 MB to 3.3 MB.
- **The CC-BY attribution obligation is discharged** - no Eric Chadwick model ships, so the
  footer line no longer credits one. Full reasoning and the before/after table: `ASSETS.md` 3a.
- **The dimension line stopped being trivia.** It reads 2100 MM because the sofa *is* 2100 mm.
- **No download means no empty stage**, at any scroll speed, which turned out to be half of the
  "Yours is drawn looks broken" bug below.
- Getting a box to read as furniture took three passes and two real lessons, both written up in
  the file: volumes must be separated by *gaps and shadow lines* (the first version rendered as
  one blue lump because everything was flush), and the arms must stand proud with the back
  *between* them. Welding the extruded geometry cut the sofa from 25k vertices to 4.5k.
- AR now exports the same sofa to GLB at build time, **one file per fabric**
  (`npm run ar-models`), so the piece a visitor places in their room is the one they chose on
  Sheet 04. Real files, not a Blob: Android's Scene Viewer is a separate app and cannot read a
  browser tab's `blob:` URL.

### Three bugs he reported, all real, all root-caused
1. **"Yours is drawn can't be seen after long scrolling - looks broken."** It was. The sheet pins
   at `top top`, so everything on it was a function of a progress that stays 0 until the section
   reaches the top of the screen, plus a second of scrub lag. Arriving fast, you met a blueprint
   at 0.22 opacity on a near-black panel and nothing else. Fixed with a *second* number,
   `stageState.bespokeArrival`, tweened by a one-shot trigger that fires a fifth of a screen
   BEFORE the pin: the plate strikes in, the blueprint draws itself, the piece settles onto the
   table. The blueprint floor went 0.22 to 0.45. Scrub still owns the story; arrival owns the
   greeting.
2. **"Collection text invisible while scrolling."** The pinned rail was laid out at its natural
   height and held against the top of the screen, and its natural height ran past the fold - so
   for the whole horizontal travel every card name and detail sat below it. Five photographs
   sliding past, none of them labelled. Sheet 04's pin had a viewport-fitting class and Sheet 05
   never got one. Now `.isRailPinned` does the same job. Verified at 1400x800: the section is
   exactly 800 tall and the lowest card detail ends at 624.
3. **The hero was the only part of the page that did not do the thing the page is about.** Every
   other sheet has a light returning; the hero just sat there. It now arrives dark and drained
   and the tube strikes over it - two dips, then colour - under the headline's own entrance.

### The rest of his list
- **Grid: horizontals gone, verticals neon, and they scan.** Crossed lines made graph paper, and
  they fought every horizontal that carries meaning (dimension lines, specimen rules, baselines).
  The verticals are now a real neon tube - 2px halo, 1px core - and a band of light travels down
  them every nine seconds. Transform and opacity only, contained inside its own section so no
  pinned sheet needed overflow clipping. Off entirely under reduced motion. **The light is
  white**: a coloured grid would be the page shouting over its own product, and the colour law
  gives hue only to photographs, pieces, fabric chips and the logo.
- **One button, three sizes, lit from underneath.** The CTA, swatch chips, AR button, Index pill
  and sticky pill were five different ideas about what a button looks like. Now one object: a
  ring plus a pool of light *below* it (the One Light Law again), 56px minimum, full width on
  phones. Ink and paper get their own token sets, because a white glow on white is nothing at
  all.
- **A loading screen worth the second it costs.** The page draws its own sofa - a front elevation
  struck stroke by stroke, then the dimension line, then the filament lights and the sheet lifts.
  Same caps as before: 1.4s hard, skippable, once per session, never on a slow device.
- **Every plate has four different corners** - 0, 1, 3 and 5 modules, clockwise. The top left
  stays square because it is the datum the light strikes and a drafter measures from. A uniform
  16px round is the most-used shape on the web; this one is arithmetic.
- **The tube strikes over every photograph**, a beat after the plotter print. Sheet 02's full
  loadshedding cut stays the big statement.
- **Every heading rises out of a mask** now, not just the hero's, and beat captions, specimen
  rows and chips follow it in.

### Nine sheets: the Maker moved up, the Hands added
- **Sheet 03 is now THE MAKER**, up from seventh. "Who is behind this" is a bespoke buyer's
  second question, not their seventh; buried at seven, most visitors never met him. His portrait,
  his sentence, his own work beside him, and the company measured as a dimension line.
- **Sheet 08 THE HANDS** is new and sits immediately before the ask. It is the one section
  allowed to not exist: no team photograph, no sheet - an empty frame captioned "the team" is a
  page admitting it has no team to show. Renders nothing until `people-team-01` lands.
- **Sheet 09 gained the brief form** - name, phone, what you want. It has **no backend and that
  is the design**: pressing send composes the answers into a WhatsApp message and opens the
  studio's thread with it typed. It cannot fail silently, it is where the client already works,
  nothing is stored, and there is no endpoint to attack. The checklist a real backend must
  satisfy before replacing it is written at the top of `ContactForm.tsx`.
- **Text cut, not moved:** the seven trust chips under the quote are deleted (six were already on
  Sheet 02); Sheet 02's specimen row is deleted (it repeated the hero's); collection details went
  from four items to two; the AR line lost a sentence that explained the button.

### Verified
`tsc` and `eslint` silent - production build clean - grid layer confirmed as exactly one
repeating gradient (verticals only) with the scan animation live - panel radius reads
`0px 8px 24px 40px` - all nine sheet ids present in scroll order, Team correctly absent -
dimension line reads 2100 MM off the model - collections rail fits 800px - bespoke arrival
observed firing on a cold load - loader observed mid-draw and finished - zero console errors.

### Not done / decided against
- **Category pages: not built, and I recommend against them.** The hackathon task says "build a
  landing page... one page, not a full website". Judges scoring against the brief could read
  extra routes as not following it. Saadman's call; if he wants them, they are a
  post-submission job.
- **Performance tracking needs an endpoint.** A `web-vitals` reporter POSTing to a route is about
  thirty lines, but there is nowhere to POST to until the VPS backend exists. Vercel Analytics
  would work today and needs no code from us.
- Deploy and git: **still both waiting on his explicit permission.**
- Still waiting on assets: MD portrait, team photo, logo, the top-3 photo redo, and the Meshy
  GLB + **USDZ** (the only thing standing between iPhone users and real AR).

---

## 2026-09-02 (evening) — the range, the rooms, and the man

### The brief was re-read, and it changed one decision
The PDF confirms **Abul Kalam Bhuiyan** as founder and MD (already correct in `copy.ts`) and
carries **no team member names at all** — so the Hands sheet stays a photograph with no roster,
and none was invented.

It also says, under "what your landing page actually needs": *"These are suggestions, not
mandatory sections. You can add pages and other sections that make the overall website look
good."* I had advised against category pages on the basis of "one page, not a full website".
That was over-cautious and it is corrected: the pages are built.

### /collections — five rooms, statically prerendered
`/collections` plus `/collections/{living-room,bedroom,dining,office-study,bespoke}`, all six
prerendered to static HTML at build time. **No 3D, no model-viewer, no GSAP timeline beyond the
entrances** — a visitor arriving here wants the photograph, fast.

Two rules the catalogue copy obeys, and they are why it reads the way it does:
- **Nothing is named that Heaven has not shown.** Titles describe what is visible in the
  photograph ("Carved sofa set, beige upholstery"); no invented product lines or model numbers.
- **No prices, ever.** The offer is bespoke, so a price would be fiction. Every piece carries
  one action: a WhatsApp thread that already names the photograph being discussed, so the studio
  opens the chat knowing what the customer is looking at.

`CatalogueMotion.tsx` is a separate, much smaller orchestrator than `PageMotion` — headings,
the shared plotter-print + tube-strike, card settle, Ken Burns. Reusing PageMotion would have
dragged a preloader, three pins and a WebGL hand-off onto a route whose whole promise is speed.

The landing page now links in: every collection card name is a door, the turntable's piece name
links to that room, and "View the full collection" goes to `/collections` instead of off-site
to Facebook.

### The turntable carries the range, not three sofas
It showed a sofa, an armchair and a settee — three pieces of seating, which advertises Heaven as
a sofa shop. It now shows **one piece per category**: the royal blue three-seat sofa (kept, it is
piece 01), an upholstered king bed, an eight-seat dining set with four chairs, an executive desk
and an accent armchair. New builders in `piece-geometry.ts` for the bed, dining and desk
families; the scroll swap thresholds are **derived from the piece count** now rather than typed,
so the two hard-coded constants can no longer hide pieces four and five.

**Prev/next arrows** under the plinth, with an `01 / 05` counter between them — the count is the
affordance. And the stage now says **"bringing the piece to the stage"** while the 3D chunk is
still landing; before, those seconds looked like a bug.

### The hero is black and white now
His words: the grids and the brown background looked worst. Three fixes, all measured:
- **The grid is only visible inside the light.** Painted edge to edge at any opacity it is a
  cage; masked by a radial centred on the One Light Law's source, it becomes evidence of the
  lamp. The travelling scan is masked the same way, so it reads as the beam moving.
- **The room is crushed to near-black greyscale.** And the reason it was brown was a real bug:
  `Photo.tsx` puts both `.photo` and `.heroPhoto` on the img, `.photo` carries its own
  `saturate(.86)` and is declared later in the same file, so at equal specificity it won and the
  grayscale silently did nothing. Computed filter was `saturate(0.86) contrast(1.06)`.
- **No background video.** A stock clip of somebody else's showroom is a licence question, a
  megabyte or two on Chattogram mobile data, and a second subject competing with the piece. A
  black ground and one beam already have the atmosphere.

**Desktop stage is ~2.4x bigger**: 708x500 to 1428x1210, ratio 1.41 to 1.18, bleeding to the
viewport edge. `width: auto` matters there — with the base `width: 100%` still set, the negative
margin had nothing to stretch and the bleed measured exactly 708px either way.

### The Maker stands on the sheet
His portrait arrived background-removed (46% of pixels fully transparent, measured), which
changes what it wants to be. A cut-out in a `panel` with `object-fit: cover` would crop a bust
at the neck and paint the background back on. So he is staged like a piece of furniture: a pool
of light offset up and left, a drawn floor rule under him, a name plate, and a `drop-shadow`
that follows his silhouette rather than a box. On arrival **the light strikes before he does** —
the pool comes up, the floor line is struck outward, and he rises into it a fifth of a second
later. Resting grayscale, colour on hover, and a six-pixel float so he is not a sticker.

Pipeline changes this needed: `assets-raw/photos/people/` is now a source folder (it never was —
the file sat on disk ignored), and **alpha sources get no LQIP**, because a 16px blur of a
cut-out is a skin-coloured smear that would sit behind him forever through every transparent
pixel.

### Verified
`tsc` and `eslint` silent · six routes build static · all five living-room pieces render two-up
and centred (1360px of content in a 2880px viewport) · hero fits `100dvh` exactly at phone width
· zero horizontal overflow · computed hero filter is `grayscale(1) contrast(1.28)
brightness(0.26)` · dimension line reads 2100 MM · every touch target now >= 44px (the new
arrows measured 40px and were raised) · zero console errors.

### Still open
- **Deploy: his VPS with a subdomain, not Vercel.** The build is a static export with no server
  requirement, so it is `npm run build` and serve `.next` behind nginx.
- **Nothing committed.** Git permission still needed per task.
- Meshy GLB + **USDZ** in progress in a separate session; USDZ is the only thing between iPhone
  users and real AR.
- Team photograph: the Hands sheet renders nothing until `people-team-01` lands.

## 2026-09-03 (session 2 · the customer pass)
- Done: the site answered "will a CUSTOMER trust this?" — the critique was right: the hero
  was 100% synthetic. Every drawn piece now carries THE REAL WORK proof chip (that
  category's real photograph, clipped inside the stage corner, linking to its collection
  page, crossfading on piece change). Drawing = how yours starts; photograph = why you order.
- Done: proper business site. /process (the 4 steps, all brief facts), /about (founder,
  milestones, showroom, range), /contact (4 one-tap channels + the brief form). Site nav in
  the catalogue chrome (current page marked, not linked), PAGES row in the shared footer,
  footer story anchors rooted (/#sheet-N) so they work from every page.
- Done: showroom film col 1-6 → 1-4 with the visit placard beside it.
- Done: THE DRAWN GRID IS REMOVED (globals.css carries the tombstone + lesson). Washes stay.
- Fixed (measured, not guessed): mobile hero was 988px on an 844px viewport — the arrows
  row and caption chip cost two rows. Arrows moved onto the stage edges, chip into the
  stage corner, counter into the caption (01/05). Hero now EXACTLY 844/915/932 on real
  phone sizes; 360x740 keeps CTA above the fold and accepts a 56px baseline dip.
- Fixed: pinned sheets vs short windows. Pins (bespoke) now gate on (min-height: 768px) —
  at 640 a 740px phone and a 760px laptop both still overflowed (88/26px measured). Pinned
  bespoke fits exactly at 844 (was 1062) via vh-aware type, tighter chips, 26dvh stage.
- Fixed: chrome wordmark rendered as a ransom note (text nodes = anonymous flex items).
- Fixed: statement token briefly carried a 6vh cap that shrank the DESKTOP h1 88→54px;
  the cap now lives only inside the short-phone media block. Lesson: height may only tax
  type where height is scarce.
- Gates: tsc, eslint, build all clean; 13 static routes. overflowX = 0 at 360→1920.
- Next: PDF/USDZ still with Saadman; git + VPS deploy await his word.

## 2026-09-03 (session 3 · the slider and the caption chip)
- Done: THE HERO IS A SLIDER NOW, not a pin (client call). Scroll leaves the hero;
  the pieces change on their own clock (6s, Turntable.tsx: IntersectionObserver-gated,
  tab-visibility-gated, 9s hold after any touch, off under reduced motion) and by the
  arrows. Only the exit parallax remains scrubbed. Pause clock is module-scope, not a
  ref: the React Compiler refuses ref writes inside memoized handlers.
- Done: the bespoke drawing→velvet sweep no longer needs the pin. bespoke3D and
  bespokePinned are separate gates; without the pin a plain scrub (top 75% → center 45%)
  drives bespokeProgress, and the arrival trigger is hoisted to fire for BOTH layouts —
  skipping the pin used to freeze the blueprint as a wireframe forever (client screenshot).
  Mobile bespoke: stage above steps (order: -1 under 900px).
- Done: the proof chip's final home is the CAPTION ROW as a 2.75rem thumb. Both stage
  corners failed in turn (desk's feet, royal sofa's crest): the camera fits pieces to 96%
  of the frame, there is no safe corner, and the fixed canvas (z4) paints over everything
  in-section. Inline it can never collide. Phone caption drops the category specimen
  (it wrapped = the last 20px over budget); label rides desktop only.
- Verified: hero over-budget 0 at 390x844 and 1440x900 (360x740: +45 with CTA above the
  fold); slider ticks (01/05 Royal → 02/05 Bed measured); overflowX 0; build 13 routes.
- Git: first push to GitHub this branch (explicit permission this session).
- Fixed (session 3b): stage setPointerCapture was eating the arrows' clicks (click derives
  from the common ancestor of down/up targets; capture made that the stage) — presses that
  start on a button/link now skip the drag. Dock container was hit-testable across its
  invisible folded-fan column and sat over the next arrow on desktop — pointer-events none
  on the container, auto on trigger/open links. Both verified by driving the page.
