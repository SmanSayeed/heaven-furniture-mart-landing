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

## PLANNED NEXT (client-approved direction, not yet built): "THE PAIR" hero
Goal: the real photograph in the hero must be BIG - the 2.75rem caption thumb is proof
nobody can see. Layout:
- DESKTOP (>=900): headline tightens to cols 1-2; cols 3-6 become THE PAIR - the 3D stage
  (~55% of the pair, keeps arrows/orbit/dimension line) and a tall real-photo plate
  (~45%) side by side on one shared baseline. Captions under each: left "THE DRAWING ·
  <piece name>", right "THE REAL WORK · AGRABAD" linking to the category page. Both
  crossfade together on piece change (photo plate = 5 stacked PrintPhoto frames, opacity
  toggle, same trick as the thumb). The in-caption thumb DIES once the plate exists.
- MOBILE: "adjusted top-bottom" per client: first viewport stays exactly what fits 844
  today (wordmark, headline, stage, CTA - CTA above the fold is the unbreakable rule);
  the big photo plate goes AFTER heroActions in the DOM, so the hero grows to ~120dvh
  and the real photograph is the first thing scrolling reveals. No height budget war.
- Implementation: Turntable.tsx renders the plate (share the piece store), Hero.tsx grid
  slots, sections.module.css pair layout. Copy/photos already exist (hero.pieces[].photo).
  Est. 1.5-2h. Photo sizes: plate uses (min-width:900px) 30vw, 100vw.

## 2026-09-02 (session: THE PAIR built + AR dark stage)
- Done: "THE PAIR" hero, exactly per the recorded plan. Desktop >=900: statement
  tightens to cols 1-2 (4.4rem), THE DRAWING (turntable) cols 3-4 at 1.05:1,
  THE REAL WORK (new HeroReal in Turntable.tsx) cols 5-6 at 0.88:1 - taller on
  purpose so both panels' TOP edges land on one line (verified 215 vs 214px at
  1440x900) and the photo runs down into the caption row. Mobile: HeroReal sits
  AFTER heroActions in DOM, hero = 1085px, CTA bottom 680 < 844 (above fold),
  the plate's top edge peeks 84px into the first viewport as the scroll teaser.
  All five photos stacked, crossfade off the same piece store as the 3D. The
  2.75rem caption thumb is dead; its CSS block replaced by the PAIR block.
- Done: AR viewer dark stage. Sheet 07 is ivory, the canape is ivory + gilt,
  model-viewer's canvas was transparent = white sofa on white page. .arModel
  now carries the hero's own plate: var(--ink) ground + glow-cool radial pool,
  graphite border. Pixel-verified via mv.toDataURL: seat (245,237,220) opaque,
  crest gilt (139,112,60), corners transparent showing the pool through.
- Gates: tsc clean, eslint clean, build 13 routes, overflowX 0 at both
  viewports, console 0 errors.
- Not committed: awaiting Saadman's git permission (per global rule).
- Next: Maker portrait below title on mobile (user msg, still queued); his
  side: USDZ for iPhone AR, team photo, real logo, VPS deploy.

## 2026-09-02 (session: THE LIGHT STORY, pass 1 - applied on Saadman's word)
- Research: 4 competitor entries autopsied (CONCEPT-V2.md Part 1). Zero canvases,
  zero lighting, 3/4 used the brief's example headline verbatim (so did we).
  Awwwards: cursor-light reveal on dark ground is award-current (Hubtown SOTM
  Apr 2026). Saadman: "keep current as backup, plan a fast theme and apply".
- Done: warm night palette (--ink #0d0906 brown-black, --paper #f4eee3 warm
  ivory, --accent brass #d9b46a, tungsten light tokens). Every stage/pool/
  filament re-lit warm through the tokens alone.
- Done: Fraunces (variable, opsz axis) replaces Inter Tight for .statement and
  .section-title; Noto Sans Bengali (300, bengali subset) for the one Bangla
  word. next/font gotcha: axes require weight 'variable'.
- Done: new headline "Built for the moment the lights come on." (brief example
  line retired), CTA unified to "Request a Quote" everywhere (7 copy keys +
  sticky pill "Quote"), OG title updated.
- Done: THE BULB (Bulb.tsx) - cord + tungsten bulb + screen-blended cone on
  the hero stage, CSS pendulum swing, reduced-motion static.
- Done: THE BLACKOUT (Blackout.tsx + PageMotion) - 3.4s after the hero lands:
  cut to ink above everything (z 96), "আলো আসবে" rises in tungsten, catch/fail/
  hold return. Own session flag (hfm-blackout): keyed to the preloader's flag it
  never fired in dev because StrictMode's first mount consumed it.
- Done: THE TORCH (Torch.tsx) - fixed 640px warm pool follows the pointer,
  transform-only, hover+fine pointer only, z 5 (above the 3D canvas).
- Done: THE ARCH (.arch / .panel.arch) on the hero real-work plate and the AR
  poster; THE ROOMS (.room) - Brand, Proof, Showroom, Ar, Footer overlap the
  previous sheet with a 32px radiused top (never the two 3D sheets).
- Verified: Fraunces computed on h1/h2, arch radius 50%/38%, rooms mt -32px,
  2 pin-spacers alive, overflowX 0 desktop+mobile, mobile CTA bottom 683 < 844,
  blackout opacity peak 1 then hidden, torch data-on after pointer move.
  tsc/eslint clean, production build 13 routes.
- Known: headless screenshots render black past ~4000px and miss fixed layers
  mid-animation; DOM measurement + forced-state shots are the honest tools.
- NOT committed (git needs Saadman's permission). Dev server running on :3000.
- Next (pass 2): quote builder (D6 questions -> composed WhatsApp message),
  overlap choreography on scroll (rooms sliding), arch on Collections cards,
  re-record screen video, Lighthouse mobile, real-phone check. Saadman's D1-D7
  answers still refine the copy (headline/word/detail).
- Bulb v2 (client feedback, same day): moved to the stage's TOP-LEFT CORNER
  (left 7%, cord 9%), cone thrown DIAGONALLY (--beam-angle 135deg desktop /
  122deg on the wider phone stage), then widened on a second note ("more
  covered"): +-34deg wedge + 260px radial spill at the bulb, 860px mask
  falloff, opacity .3. Verified at 1440x900 and 390x844: the wash crosses the
  piece corner to corner.
- Bulb v3 (three client notes in a row: wider -> "a bit lesser" -> "too much
  light, reads as another layer"): ONE quiet wedge, +-14deg core with 16deg
  soft ramps, opacity .15, 620px falloff, NO radial spill (the spill was what
  read as a flat sheet), and .stage now clips (overflow hidden; arrows sit
  12px inside the edge, verified). Corner source, diagonal beam, quiet floor.

## 2026-09-03 (session: PLAN-V5 "THE SLIDES" built)
- Backup: backup-v2-2026-09-02/heaven-mart (118 files, no node_modules).
- Rejected on the way: PLAN-V3 (clean brochure = the competitors' structure,
  Saadman: "looks like other submissions"), CONCEPT "The Room" (sticky stage +
  chapters). Approved: PLAN-V5 after references (sorenrose.com full-screen
  slides, Apple type, arteriors tone). Prototype artifact kept at
  https://claude.ai/code/artifact/1a2df4b2-eb61-44bf-8564-4aa82d20a5a5
- Built: src/components/deck/* (Plate, Header, Modal, CollectionModal,
  ArModal, QuoteModal, Swatches, DeckFooter, deck.module.css), motion/
  DeckMotion + DeckMotionIdle + IdleMount + SmoothScrollIdle, lib/lenis-store,
  ui/shared.module.css (630 lines extracted from the 3,300-line sheet CSS for
  the shared islands), copy.ts `deck` block, page.tsx + layout.tsx rewritten.
  Nine sticky 100svh plates (z 1 / 2 / 5 around the fixed canvas at z 4),
  hero with NO 3D and NO AR button, one 3D plate (Bespoke, R3F view retargeted),
  AR + category pieces + quote builder in one <dialog> Modal (hash-synced so
  the phone's back button closes it), Inter Tight display, system body font.
- Verified: tsc/eslint clean, build 13 routes, 0 page errors; 390x844 CTA
  bottom 724 (above fold), 360x740 checked, overflowX 0; sticky pill hidden on
  the hero (StrictMode double-mount bug fixed in DeckMotion cleanup); modal
  opens/closes with hash; counter, header solid, plate reveals all firing.
- Lighthouse (production build, local): DESKTOP 100/100/100/100. MOBILE
  85-89 perf (FCP=LCP 2.0s, TBT ~400ms, CLS 0) / 100 / 100 / 100. Wins along
  the way: hero text no longer hidden by GSAP (LCP 3.1->2.0s, CLS .056->0),
  Inter+Geist dropped (fonts 102->44 KB), inlineCss (no render-blocking
  CSS), DeckMotion on first gesture, Lenis desktop-only on idle, three.js
  only when Bespoke is 1.5 screens away, shared CSS extracted. Remaining gap
  is LH trace overhead: real Chromium at 4x CPU paints at 0.55s.
- Not committed: awaiting Saadman's git permission.
- Next: Saadman's phone pass; D3 headline ("Furnished to you." is the
  placeholder), D5 evening showroom photo for the hero, cut-out MD PNG
  (the JPEG is keyed with a mask + grade for now), real logo; regenerate
  photos at 1600w (currently 1024 max) for large desktops; screen recording.
- Entrances (Saadman: "all coming bottom to top, randomize, some 3d, some
  left to right, framer motion ideas"): Plate.tsx gained `enter` (rise |
  wipe-r | wipe-l | iris | shutter | zoom | tilt) and `text` (mask | blur |
  slide-l | slide-r) + PlateTitle (words in line masks, --i stagger = CSS
  staggerChildren). Assignment in page.tsx ROOM_ENTER: Living wipe-r/slide-l,
  Bedroom iris/blur, Dining tilt/mask, Office wipe-l/slide-r, Bespoke 3D
  drawing->sofa + blur, Maker zoom + DIM, Showroom shutter/slide-l, Quote
  rise/blur. Fixed order, not random (a direction, not a slot machine).
  DEPTH scrub in DeckMotion: covered plate's img -> scale .94 + shade .6 as
  the next rises (img, not the media layer, to avoid fighting the CSS
  transition). All transform/opacity/clip-path.

## 2026-09-03 (later) — LIFE pass ("make sure it is not boring")
- Diagnosis: nine plates with the same bottom-left caption read as a slideshow,
  whatever the entrance. Fixed with composition + pulse, not more effects.
- Added (deck.module.css `LIFE` block, Plate.tsx, DeckMotion.tsx, page.tsx):
  · `side` per plate: L, L, R, MIDDLE, R, CENTER, L, R, MIDDLE. Middle plates
    (Dining, Quote) sit dead-centre; their VIEW pill drops to bottom-centre.
  · `no`: outlined chapter number (01-04, 07) the size of the plate, opposite
    the caption, rises in with the plate.
  · `Measure`: a dimension line that draws itself under the title ("to your
    wall / room / seats / alcove / measurements / drawn to your room"). No
    numbers, by rule: only the 3D piece prints measured numbers.
  · `drift`: the LIVE plate's photograph creeps 1 -> 1.08 over 26 s (CSS
    `scale`, composes with the GSAP depth `transform`); paused on every other
    plate (DeckMotion stamps data-live on the plate at 50%).
  · `power`: the hero's blackout beat is CSS now: dark, two stutters, then
    the lights come up (opacity over ink = compositor only, plays from the
    first paint, text untouched). Moved out of DeckMotion because that file
    mounts on first gesture, which put the blackout under the first scroll.
  · scroll cue on the hero (hairline + running brass dot, desktop only, fades
    once the hero leaves).
  · counter digit rolls on change.
  · cursor ring on (pointer: fine): follows the pointer, grows to 76px and
    says View over a room's photograph; a click on the photograph (any
    device) forwards to that room's VIEW pill -> modal. Ring ignores captions.
  · swatch tap re-lights the bespoke stage (--stage-glow -> .stage3d colour)
    and still rewrites the CTA with the fabric name.
  · brass hairline on every rising plate's top edge.
- Verified (Playwright, dev): 1440x900: sides/numbers/measures positioned,
  bespoke AR pill kept at right-middle (a centred-side rule had dropped it
  onto the swatch row; fixed), ring show/on/76px + click -> "Living Room"
  modal + #hash + back closes; live plate switches (hero paused, living
  running); swatch -> stage colour rgb(93,116,214) + CTA "Royal Blue".
  390x844 + 360-class: all titles fit, overflowX 0, hero CTA bottom 724,
  sticky pill after hero, VIEW pills at y 716 (above the 88px reserve).
  tsc/eslint clean, production build OK, 0 console errors.
- Lighthouse (production, :3100, two mobile runs): MOBILE 86-87 / 100 / 100
  / 100 (FCP 1.3-1.5s, TBT 120-170ms, CLS 0; simulated LCP 3.5s but the
  OBSERVED LCP = FCP = 1.7s: lantern now counts every script as an LCP
  dependency because the page's JS finishes loading (load event 0.3s)
  before the first paint, which it did not when the build was heavier -
  an artifact of getting faster, not a regression on a device). DESKTOP
  98 / 100 / 100 / 100 (FCP 0.4s, LCP 0.8s, TBT 20ms).
- Not committed: awaiting Saadman's git permission (whole V5 build + LIFE).
- Next: Saadman's phone pass on the LIFE pass (drift speed, ring, blackout
  beat); D3 headline; D5 evening hero photo; cut-out MD PNG; logo; screen
  recording; deploy.

## 2026-09-03 (night) — PLAN-V6 "A Night at Heaven" BUILT
- Saadman rejected the V5 deck mechanic ("all coming from top to bottom - no"),
  asked for the 3D skeleton-to-sofa section back, horizontal sliders, mixed
  section heights, a floodlit hero with view changes, GSAP, a zoom-into-next
  transition, and a story / adventure feel. PLAN-V6.md + storyboard artifact
  https://claude.ai/code/artifact/2df851c2-a627-46e3-9dd2-192fc7cac38e
  approved (D-A hero views as proposed, D-B my call = snap carousel on
  phones, D-C portal into the fabric, D-D floor-plan map).
- Built: src/components/night/* (night.module.css, Words, Narrator/ChapterTag,
  Map, Hero, Studio, Floor, Stage (poster/dimension/inspect islands), Table,
  Maker, Home, Ask), motion/NightMotion + NightMotionIdle, IdleMount `mode`
  (idle, 1.5 s cap: a pinned hero cannot wait for a gesture), copy.ts
  `night` block, page.tsx rewritten, Header nav/counter props, modals
  `inline` prop, Photo `eager` prop. Deck modals/footer/header kept.
  BUG FIXED on the way: StageCanvas only reported ready from the hero view,
  so since V5 the bespoke sofa rendered into a wrapper held at opacity 0;
  BespokeStage now calls onReady.
- Chapters: 1 room (pinned 250vh: flood -> iris -> slide -> zoom portal
  through the fabric; beam sweep + night-lift CSS on load; Torch on
  pointer), 2 studio (paper; hand-off: html[data-night] pulls the studio
  up one viewport under the opened portal, hero z toggled on leave),
  3 floor (desktop pinned rail, measured travel, cards rotateY 16->0 via
  containerAnimation, bar; phones: native scroll-snap + dots), 4 drafting
  table (pinned 300vh, bespokeProgress scrub, steps lit, dock reveal, 360
  inspect arms, DimensionLine prints real mm off the mesh: 2100 x 820 x 950),
  5 maker (dim beat), 6 take it home (AR card + shutter film), 7 ask (beam
  wide). Map (SVG floor plan, right-middle desktop / top-right phone) lights
  rooms + moves the dot; narrator line per chapter; generic data-reveal
  system (rise/blur/shutter/wipe/beam/words).
- Verified with a real mouse wheel via Playwright run_code (synthetic wheel
  events trip SmoothScrollIdle's watchdog - harness artifact, not a bug):
  hero timeline, portal opens at .68-1 and the studio is at viewport top at
  pin end; hdrPaper + data-on-paper on the studio; timeline draws; rail
  pins and travels -589px with bar + card face-in; table pins, canvas
  opacity 1, steps 1/.28/.28 -> .28/1/.28 -> .28/.28/1, dock 0->1, inspect
  armed; map here/lit through all 7; 390x844: titles fit, hero CTA y 663,
  map top-right, table pinned fits (inner 643/844), snap track + dots;
  overflowX 0; tsc/eslint/build clean; 0 console errors.
- Fixes during the pass: CSS Modules pure-selector rule (:global on the
  data-reveal rules), word spacing in Words (space outside the inline
  block), rail track width (grid item grew to 2080px -> dist 0), brass on
  paper contrast (2.0 -> darkened #8a6a2b), AR card art.
- Lighthouse (production, :3100): MOBILE 81-82 / 96->100 (contrast fixed
  after the run) / 100 / 100 - FCP 1.2-1.3s, TBT 290ms, CLS 0, simulated
  LCP 3.7s with OBSERVED LCP 0.65s (lantern counts the idle-mounted GSAP
  chunk as an LCP dependency; the pinned hero needs it on idle, not on
  gesture, so this is the trade). One run at 60 was the machine building
  at the same time; re-run idle = 81. DESKTOP 97 / 100 / 100 / 100
  (FCP 0.4s, LCP 0.8s, TBT 40ms).
- Not committed: awaiting git permission.
- Saadman's screenshot review (late 09-03): hero->studio hand-off overlaps
  (the -100svh margin), studio/floor content hidden (reveals), AR modal wheel
  dead under Lenis, nav anchors broken with pins; wants the previous 3D
  turntable pieces back, a gallery-wall categories chapter, a GSAP timeline
  moment, a mega menu with images, animated category pages.
  PLAN-V6.md PART B (B1-B6) written; next session starts at B1.

## 2026-09-03 (PART B build: the screenshot review, all of B1-B5)
- Done: PLAN-V6 PART B, in the B6 order, one session.
  B1 bugs: (1) the hero->studio hand-off no longer overlaps anything - the
  portal (fixed sheet) stays open after the hero's pin (+=200% now) while
  the hero scrolls away UNDER it, and is hidden the moment #studio reaches
  top top; portal visibility is a pure function of scroll (syncPortal on
  the hero timeline's onUpdate + the studio trigger's onEnter/onLeaveBack/
  onRefresh), so a nav jump or a deep reload can never leave the white sheet
  standing (that sheet WAS the "Showroom -> white screen" bug). The -100svh
  margin, the studio z-index and data-above are gone. (2) reveal system ->
  IntersectionObserver (lib/reveal.ts, rootMargin -18% bottom, once, plus a
  reveal-all at the end of the scroll): hidden titles gone. (3) floor title
  no longer cut. (4) data-lenis-prevent on the <dialog>: modal wheel works
  (measured scrollTop 94, page unmoved). (5) nav scroller: every a[href^=#]
  goes through lenis.scrollTo / window.scrollTo smooth to the section's
  PIN START when pinned (Showroom -> #home top -1px; Bespoke -> pinned table
  at 0); hash landings (a room page's "Back to the floor") re-placed after
  refresh (floorTop 0).
  B2 "The pieces" chapter (ch.3, pinned 200%): the previous build's
  turntable restored - five drawn pieces (royal sofa, bed, dining set, desk,
  armchair) pass on scroll (setHeroPiece per fifth, heroProgress yaws each a
  quarter turn), drag to spin (PiecesStage.tsx), five tabs, caption, real
  mm off the mesh (Dimension stage='hero': "2100 MM · 1190 MM · 880 MM"),
  the real photograph as a small plate beside the caption, a slow window
  display clock when not pinned. No-3D truth = the five photographs in the
  stage. StageLoader now observes both stages. Chapters renumbered 1-8, map
  has 8 rooms.
  B3 the gallery wall (Wall.tsx): five frames of different ratios hung at
  different heights (measured tops 269/332/287/348/292), ivory mat + brass
  frame + crop marks + brass plaque, pointer tilt + light pool + drift +
  "Open the room" rising out of a mask (pointer: fine only), frame = link to
  the room page, pill = quick look modal. Same component as the /collections
  index (mode="grid").
  B4 the timeline: one scrubbed GSAP timeline - the line draws with a brass
  dot at its tip, ticks light brass as the dot passes, milestones slide in
  out of a blur, years count up (textContent + snap). Phone: svg hidden,
  slide + count still run.
  B5 mega menu (deck/MegaMenu.tsx): "Rooms" opens a full-width panel (clip
  drop) with five big titles + one large crossfading photograph + "All
  pieces"/"Walk the floor"; Escape/outside/scroll close. Phone: burger ->
  full-screen <dialog> (hash #menu, Back closes), room tiles + anchors +
  CTA; anchors inside the sheet travel through the scroller after the sheet
  shuts (night:goto event). Room pages redesigned in the night system
  (components/night/Room.tsx): dark, chapter heading, cover in the wall's
  frame, masonry plates (PieceModal.tsx: sheet with photo, specs, CTA naming
  the piece), print-in entrance via CSS @starting-style (no JS, nothing
  hidden without it), Next room / All rooms / Back to the floor. Page
  transition: cross-document View Transitions (@view-transition in
  globals.css; view-transition-name room-<slug> on the frame and the page's
  plate) - plain <a> navigations on purpose.
- Verified (Playwright, real wheel, dev :3000): hand-off at 1440x900
  (portal visible 1600-2560, hidden at studio top), studio waits 0, dot
  0->1000, years 2020,2021,2024,2025,2026; pieces pin + tab + real mm; wall
  rail -393px + bar 1; table steps/dock/mm; nav clicks; modal wheel; mega
  hover swaps the image (Dining · 2 pieces); /collections and
  /collections/living-room full-page screenshots reviewed; piece modal opens
  with hash. 390x844: no horizontal overflow (360 at dpr), burger + sheet,
  sheet anchor -> pinned table at 0, tile -> /collections/bedroom, back ->
  /#floor at 0, pieces pinned fits (stage 137-377, tabs to 708), snap track
  + dots. tsc / eslint / build clean, 0 console errors.
- Harness notes: clip-path TRANSITIONS do not advance in this headless env
  (verified with a bare div) - the mega panel's drop reads as closed to
  getComputedStyle here but its state/links/images all work; real browsers
  are fine. Viewport screenshots after scrolling still render black.
- Lighthouse (production :3100, rebuilt): MOBILE 79 / 100 / 100 / 100 (FCP
  1.3s, LCP 3.9s simulated, TBT 300ms, CLS 0); DESKTOP 96 / 100 / 100 / 100
  (FCP 0.4s, LCP 0.9s, TBT 80ms); /collections/living-room mobile 86 / 100 /
  100 / 100. First run after PART B was 59 / 63 with desktop TBT 1,840ms:
  StageLoader's 150% rootMargin reached the new pieces stage at load and
  mounted three.js during the page's own load -> 60%. Also fixed from that
  run: label-content-name-mismatch (aria-labels on the frame, the plate and
  the real-work link replaced by sr-only / visible names), plaque contrast
  on waiting rail frames (face-in opacity floor .4 -> .7), room-page legible
  text (specs 9.6px -> 12px).
- Not committed: awaiting git permission (~50 files changed/new).
- Next: Saadman's real-phone pass; D3 headline, MD cut-out, logo, evening
  showroom photo, recording, deploy.

## 2026-09-03 (evening) - PART C: Saadman's live review, twelve notes

Everything below was found by him clicking through the running build, and
every one is closed and measured (Playwright, real wheel, 1440x900 + 390x844).

1. **The white screen on every menu click.** THE PORTAL was the bug: a fixed
   ivory sheet carrying the studio's heading, opened by the hero's zoom. Any
   jump past the hero could leave it standing over the page, and an opaque
   fixed sheet is a white broken site whose scroll looks dead. Two attempts
   to keep it in sync lost races against the scrubbed timeline, so it is
   DELETED. The hero ends on `lightsOut` - an ink overlay INSIDE the hero -
   and the studio's paper is a hard cut. A full-screen element that cannot
   outlive its section cannot strand. Verified: Bespoke / Showroom / Contact
   all land at their section top (0px) and the scroll still moves 1200px.
2. **The 3D turntable chapter removed** on his call. Seven chapters again;
   the map lost a room; the components, copy and motion are gone.
3. **The floor is THE GLASS WALL now.** Five plates, different ratios, hung
   at different heights and angles so they cross on a diagonal and overlap.
   The wall is behind glass and in black and white; the plate under the
   pointer - or, with no pointer, the one the scroll brings to the middle
   (`data-focus`, one rule for the rail and the snap track) - slides its
   pane away and comes up in full colour. A brass ring follows the mouse and
   becomes a filled VIEW disc over a plate.
4. **The header's action redrawn**: a hairline brass plate with corner ticks
   that fills from its baseline on hover, label turning to ink. Not the
   hero's filled pill.
5. **The floor plan is a menu**: every room takes the visitor to its chapter
   through the nav scroller (mouse only - 20px rooms are no tap target).
6. **The maker rebuilt.** The quote sat on his face because `.inner
   .makerText` was one element and `.inner` centres what it holds. He is now
   a lit PLATE in the middle of the chapter with the words underneath:
   nothing can overlap at any width. Measured: 126px of air above the plate,
   54px between plate and text on desktop; 108px / 67px on a phone.
7. **The milestones removed from the maker** - the studio's founding line is
   the one timeline.
8. **The founding line stopped counting up**: a scrubbed count-up printed
   years Heaven never had (2025 read 2024 mid-tween).
9. **The 3D sofa was missing.** StageLoader's rootMargin had been cut
   150% -> 60% for the (now removed) turntable chapter; restored. Verified at
   both sizes: canvas up, poster gone, real millimetres off the mesh.
10. **The film autoplays** - muted, looping, no controls, desktop only, once
    the panel is 55% on screen, with "Watch with sound" over it. A phone
    keeps the zero-byte facade.
11. **The wall's names were being clipped** at both ends of the pinned
    chapter. The plate height is a budget now: `min(38svh, calc(100svh -
    470px))`, so a short screen shrinks the plates instead of eating a name.
    Measured: 3px of air above the heading, 39px below the lowest name.
    Every dark chapter also opens on a hairline, so the cuts read as cuts.
12. **The phone's top-right corner belongs to the menu.** The floor plan is
    hidden below 861px (decoration in the way of a control, with rooms far
    under any tap target) and the burger is a brass plate, 46x44, at the top
    right. Its sheet is `inset: 0` rather than `100vw` (the scrollbar was
    pushing the close button off the edge) and its header is sticky.

**The studio, rewritten** (his last note: "customer not like to read texts").
One paragraph, one long quotation and three lines of small print became:
three BIG lines that arrive one at a time, and three points - Drawn to you /
Built in-house / Delivered and fitted - each with a hand-drawn mark (a
drafting compass, a hand plane, a delivery van; inline SVG, drawn on by GSAP
stroke-dashoffset, no icon library) and a Details button that opens a sheet
setting that point's four facts at 24px, one per line. Nothing was cut from
what the page says; it moved behind a button. Every fact is still the
brief's.

Also fixed: the sticky WhatsApp pill never appeared on a room page (the
layout sets html[data-hero-view=1] for every route and only the motion layer
removes it), and the bespoke plate's "See it drawn" pointed at #table from
/collections where no such section exists.

Answered for him: the AR viewer is model-viewer, self-hosted, loaded only on
press - Android with ARCore places the piece at true size, an iPhone gets a
3D view until a USDZ export exists, a desktop gets 3D. The modal is fine at
390px (345x491 in an 844-tall viewport).

- Gates: tsc / eslint / build clean, 0 console errors on every pass.
- Lighthouse (production :3100, mid-session): desktop 96 / 100 / 100 / 100
  (FCP 0.4s, LCP 0.8s, TBT 60ms, CLS 0). The mobile run measured 60 with TBT
  640ms while the dev server and Playwright were both running on the same
  machine; the last idle mobile run of the same build was 79. NEEDS ONE IDLE
  RE-RUN after the studio rewrite before the numbers are quoted anywhere.
- Not committed: awaiting git permission (~50 files).
- Next: his real-phone pass; D3 headline, MD cut-out PNG, logo, evening
  showroom photo, screen recording, deploy.
