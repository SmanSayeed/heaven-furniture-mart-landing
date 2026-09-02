# BUILD-GUIDE.md — implementation handoff for "DRAWN TO MEASURE"

> **Who this is for:** the Claude (or any agent) implementing the redesign on branch
> `redesign/drawn-to-measure`. It assumes you have NOT read the previous sessions.
> Everything you need is in this file plus [BLUEPRINT.md](BLUEPRINT.md) (design law) and
> [PLAN.md](PLAN.md) (content/business law). Follow the build order in §5 exactly; each
> step ends with a verification you must actually run.
>
> **Written 2026-09-01 by the prior session after deep investigation of the live code.**
> Facts below (selectors, exports, file paths) were grepped from the working tree, not
> remembered. If code and this doc disagree, trust the code and note it in PROGRESS.md.

---

## 1. NON-NEGOTIABLE WORKING RULES

1. **Talk to Saadman in Bangla** (tumi register, tech terms in English). All code,
   comments, commits, docs in English.
2. **Git: NEVER run any git action without his explicit permission for that task.**
   Committing after a milestone: ask first. This rule has bitten before; it is absolute.
3. **No em dashes / en dashes** in any user-facing string (`copy.ts`). Use `.`, `,`, `·`.
4. **Progressive enhancement is law.** Server HTML must be a complete page: JS-off,
   WebGL-off, reduced-motion all get a finished-looking page. Therefore: initial
   hidden/dim states are set ONLY from JS (gsap.from / fromTo), never in CSS.
5. **Never fabricate client facts** beyond PLAN.md Part 2 / the brief. AI touch-up of
   real Heaven photos is allowed; AI invention of furniture is not.
6. One CTA on the whole page: WhatsApp consultation. Never add a second competing action.
7. Update `PROGRESS.md` at the end of every working block (it is the only session memory).
8. Verify with the recipes in §6 — screenshots lie in this environment (§3.1).

## 2. STATE OF THE WORLD (verified 2026-09-01)

### 2.1 Branches
| Branch | Meaning |
|---|---|
| `main` | pre-redesign base, old |
| `backup/hero-turntable-2026-09-01` | frozen full snapshot (45e2079). NEVER commit here. |
| `redesign/drawn-to-measure` | **you work here**; starts from the snapshot, so all machinery below is present |

### 2.2 What already WORKS (do not rebuild, only re-skin/re-lay)
- **App**: Next.js 16.3.4 App Router + Turbopack, React 19.2.8, TS. Dev server usually on
  `http://localhost:3000`. `npm run build` passes. `npx eslint src` and `npx tsc --noEmit`
  are the lint/type gates (Next 16 removed `next lint`).
- **3D**: ONE `<Canvas>` for the whole page (`StageCanvas.tsx`), fixed and transparent,
  drei `<View>`s scissor-render into two server-rendered stage divs: `[data-stage-hero]`
  and `[data-stage-bespoke]`. `tier` gating in `StageLoader.tsx` (interaction OR idle
  mount; low tier mounts nothing). Hero: 3 swappable pieces with drag-to-spin (custom
  pointer handlers in `Turntable.tsx`, NOT OrbitControls; inertia; `touch-action: pan-y`).
  Bespoke: blueprint edges (floor opacity 0.22) → clip-plane sweep → fabric swatches.
  Models: `public/models/{sofa-velvet,chair-damask,sofa-leather,placeholder-chair}.glb`
  (Draco; decoder self-hosted at `/draco/`, HDR at `/hdr/potsdamer_platz_1k.hdr`).
- **Photos**: `npm run crop` (originals -> graded, removes burned-in ad overlays; every
  FB photo IS an ad graphic; crop SKIPS any name that already has a cleaned graded file,
  whatever its extension) then `npm run photos` (graded-else-originals -> 3 WebP widths +
  LQIP + `src/content/photos.generated.ts`). `Photo.tsx` renders plain `<img srcset>`
  with LQIP background (deliberate: no next/image; reasons in its doc comment). The hero
  backdrop is a build-time defocused webp (`hero-backdrop`). **HARD FACT (measured
  2026-09-02): every photo source caps at 1024 px wide** - Gemini's output ceiling, and
  the client has nothing larger - so the 1600 tier is an enlargement; design per
  BLUEPRINT 2.4b and never depend on >1024 detail.
- **AR**: `ArViewer.tsx` — model-viewer 4.3.1 self-hosted at
  `/vendor/model-viewer-4.3.1.min.js`, loaded ONLY on button press,
  `dracoDecoderLocation = '/draco/'` set before use. Verified loading (loaded:true,
  modelIsVisible:true, 0 errors). JSX types: `src/types/model-viewer.d.ts`
  (augments `declare module 'react'`, NOT global JSX — React 19).
- **Scroll**: `SmoothScroll.tsx` — Lenis via `lenis/react` with `autoRaf:false`, driven by
  `gsap.ticker`; ScrollTrigger fed from Lenis `scroll` event; **two-level dead-wheel
  watchdog** (destroys Lenis if a wheel moves nothing; manual `scrollBy` if something
  foreign still eats wheel). Do not simplify this file; every line exists because of a
  real failure.
- **Motion**: `PageMotion.tsx` is the ONLY orchestrator. Everything inside
  `gsap.matchMedia()` with `motionOK` + `desktop (min-width:900px)` conditions; reduced
  motion creates zero tweens. Hero pin (220%/170% hold, piece swap thresholds 0.30/0.56,
  exit at 0.80), curtain, ticker marquee (measured px), S3 pin, S4 desktop rail
  (containerAnimation), aperture, dim floors, ghost numerals, thread, preloader.
- **A11y/perf state**: contrast floors are WCAG-computed constants in PageMotion
  (`DIM_FLOOR_LIGHT 0.66`, `DIM_FLOOR_DARK 0.5`, `STEP_FLOOR 0.58`); last Lighthouse:
  Perf 67 / A11y 100 / BP 100 / SEO 100 (before the redesign; re-run after).

### 2.3 Authoritative inventories (grepped)
- **data-attributes in use:** `data-accent, data-aperture, data-bespoke-cta, data-card,
  data-card-index, data-cards, data-curtain, data-dim, data-grid, data-hero-fade,
  data-hero-photo, data-hero-rule, data-hero-scrim, data-hero-statement, data-hero-view,
  data-nav-fade, data-nav-line, data-nav-open, data-piece-name, data-stage-bespoke,
  data-stage-hero, data-stage-pool, data-step, data-swatch-dock, data-thread,
  data-thread-tip, data-ticker, data-turntable`
- **stage-state API:** `stageState {bespokeProgress, heroProgress, heroSpin,
  heroSpinVelocity, heroGrabbed}` + pub/subs `get/set/onInspectArmed`,
  `get/set/onHeroPiece`, `get/set/onStageReady`, `get/set/onSwatch`.
- **copy.ts exports:** `brand, hero, intro, ticker, bespoke, collections, arHook, nav,
  showroom, ar, proof, footer, whatsappMessages`.
- **global text/UI classes:** `.statement .section-title .placard-title .placard-line
  .specimen .specimen-row .index .ghost-num .chip .btn .textlink .rule .tri .grad-word
  .dark .light .section .ph .sr-only .only-narrow .only-wide .thread .thread-tip
  .preloader* .glass .glow-pool .logo-block .quote-serif .will-transform`.
- **Sections:** `Hero, Brand(+Ticker), Bespoke, Collections, Showroom, Ar, Proof, Footer`
  in `src/components/sections/`, all Server Components; client islands live in
  `ui/` (`Turntable, ArViewer, IndexNav, SwatchDock, StickyCta, InspectHint, Cta, Photo,
  Icons, ArHook`) and `motion/` and `three/`.

## 3. THE TRAPS (hard-won; each cost real hours — read twice)

### 3.1 Verification traps
1. **Playwright MCP viewport is dpr-scaled 0.75.** `setViewportSize({390,844})` gives CSS
   520×1125. Recipe: multiply desired CSS size by 0.75 → `{293,633}` = CSS 390×844;
   `{960,600}` = 1280×800. ALWAYS assert `window.innerWidth` before trusting anything.
   Screenshots: `scale:'device'` (`'css'` returns a crop).
2. **Deep-scroll screenshots come back BLACK in this headless Chromium** even when the DOM
   is perfect. It is a raster artifact (verified: identical rects at scroll 0 vs pinned;
   direct canvas pixel-read shows content). NEVER "fix" the page because a screenshot is
   black. Verify pinned/deep sections by: (a) `getBoundingClientRect` measurements,
   (b) `page.emulateMedia({reducedMotion:'reduce'})` + reload (no pins → honest rasters)
   — and RESET it after (`'no-preference'`), it leaks across runs (this trap fired twice),
   (c) the canvas pixel-read recipe (§6.3) for WebGL.
3. Element screenshots of `position:fixed` (pinned) elements show the same artifact.

### 3.2 Architecture traps
4. **`dynamic(..., {ssr:false})` throws inside a Server Component.** Pattern everywhere:
   Server section → `'use client'` loader → the heavy client thing.
5. **R3F re-enables pointer-events on its canvas.** The fixed canvas wrapper has
   `pointer-events:none` AND a `* {pointer-events:none !important}` subtree rule. Never
   remove; without it the canvas eats every click on the page.
6. **drei useGLTF caches by URL and three objects have ONE parent** — render a `clone()`
   per view (`HeroPiece` does this) or views steal the model from each other.
7. **ReactLenis's `onScroll` prop is a DOM handler, not Lenis's scroll event.** Subscribe
   via `lenis.on('scroll', ...)`. Also resolve the instance through the ref EVERY tick
   (StrictMode/HMR swap instances; capturing once = silently dead wheel).
8. **GSAP `contextSafe` inside matchMedia recursed to a stack overflow** on revert; use
   `ctx.add(() => {...})` to add tweens after setup (see `startHeroIntro`).
9. **Two ScrollTriggers pinning/measuring the same element conflict.** The hero uses ONE
   timeline (pin + scrub + exit as timeline positions). Keep it that way.
10. **fromTo immediateRender**: in scrubbed timelines, `fromTo` applies its `from` at
    creation. Only harmless if `from` equals the natural state — keep it so.
11. **CSS Modules + global classes**: targeting `.statement` etc. inside a module needs
    `:global(.statement)` (silently no-ops otherwise — this shipped a bug once).
12. **Windows paths in node scripts**: `join()` yields backslashes; slug/replace logic
    must handle `[\\/]`. Bash heredocs with quotes break — write scripts to files.
13. **Models normalise by LARGEST dimension** (`measureFit`), and the camera fits BOTH
    axes with the rotation-safe radial `hypot(x,z)` (`fitDistance`). Never assume height-1.
14. **Meshy Auto Split is unusable** (untextured drafts only) — the bespoke design needs
    a single mesh; do not reintroduce split-dependent ideas.
15. `requestIdleCallback` does not exist in Safari/FB in-app browser — use the wrapper in
    `StageLoader.tsx`.
16. `next/dynamic` chunks, fonts: 4 families via next/font are already loaded in
    `layout.tsx`; do not add more families (font swap is the biggest LCP cost).

## 4. THE TARGET (what you are building)

**[BLUEPRINT.md](BLUEPRINT.md) is design law.** Summary of its five directives:
1. **§0.5 THE STORY** — 8 beats ("ONE PIECE, DRAWN FOR YOU"), beat captions, `NEXT:` cues
   in the title block, Index nav = the map, preloader speaks the story's first line.
2. **§2 THE MATH** — u=8px; 6-col desktop / 3-col mobile; only √2 and 1:1 panels; sharp
   panel corners; baseline-snapped type scale; structural background grid = the real
   column lines (only on `data-grid` sheets 01/03/05/06).
3. **§2.8 MONOCHROME** — no hue anywhere except photos, 3D pieces + swatch chips, and the
   logo triangle. `--accent` → white. Gold/brass tokens deleted. Warm ivory → neutral
   `#F2F3F4`. grad-word = white neon sign. Thread = white "plot line".
4. **§5.5/5.6/5.7 LIGHT** — Plotter print (grayscale → filament sweep → colour) for
   object images; Loadshedding cut (grid-anchored clip-circle, one flicker) for Sheets
   02+05; Floodlight beam (2 columns wide, 45°, One Light Law: light top-left, shadows
   135°) on dark sheets.
5. **§4 THE SHEETS** — per-section column maps, mobile + desktop.

## 4.5 STATUS (2026-09-02: the build below is DONE unless noted)

Steps 1 and 3 through 10 are built and verified; see PROGRESS.md for the measurement
results, the five bugs found, the two deliberate deviations from BLUEPRINT, and the
honest performance position. Step 2 was cut as planned (SS5.0) and replaced by console
measurement. Step 0's OG card is built (`public/og/card.png`); **Step 0's DEPLOY is the
one thing still outstanding and it needs Saadman's permission.**

Read this section as history now. What remains actionable:
- deploy to Vercel, then re-run the checks against the live URL and inside the Facebook
  in-app browser;
- the two Step 9 stretch items (scrubbed panning beams, blueprint glint);
- landing Saadman's assets, all of which are drop-ins (SS8).

## 5. BUILD ORDER (do steps in order; each has a gate)

### 5.0 THE 3-DAY CUT (deadline 2026-09-04; decided, not silent)
DO IN FULL: Step 0 (deploy + OG), 1, 3, 4, 5, 6, 7, 8, and Step 10's audits/README.
CUT OR TRIMMED, with reasons:
- **Step 2 `?grid=1` overlay component -> CUT as product tooling.** Replaced by a
  console-run measurement script during each sheet's gate (6.5). Same rigor, zero build
  time on a tool users never see.
- **Step 9 floodlight -> TRIMMED to the cheap 80%:** static beams on Sheets 01/07 + the
  120ms switchover dip at dark-sheet entries. The scrubbed panning beams and the
  blueprint glint are stretch - only if everything else is gated with slack left.
- **Sheet-edge ruler ticks (BLUEPRINT 2.7.4) -> CUT** (already marked expendable).
- **Monochrome audit -> run once manually** at Step 10, not built as tooling.
- **Lighthouse: ship gate Perf >= 85**; the deep font/three-chunk surgery toward 90 only
  if the deadline allows. A11y stays gated at 100 (non-negotiable).
- **iPhone AR (USDZ)**: time-boxed to whatever Meshy delivers; the AR section ships
  regardless with Android + 3D-viewer paths.

> Work loop per step: implement → `npx eslint src` + `npx tsc --noEmit` → verify recipe →
> PROGRESS.md entry → show Saadman a screenshot when it is visually meaningful → next.
> Ask permission before any commit.

### STEP 0 - Live URL + the Open Graph card (submission format demands both on day 1)
- Deploy the current branch state to Vercel FIRST (needs Saadman's account/permission;
  ask him, never create infrastructure silently). Every later step iterates against the
  live URL; test inside the Facebook in-app browser early.
- **The OG card is a designed surface** (judges meet the social link card before the
  page). Build `public/og/card.png` at 1200x630: ink ground + structural grid lines +
  the cleaned hero sofa photo in a white light pool + a drawn dimension line under it +
  the wordmark + "Furniture, Crafted Around You." Compose a small HTML file, render once
  via Playwright at exactly 1200x630 (dpr 0.75: viewport 900x473, verify innerWidth
  1200), screenshot, optimize to < 300 KB.
- `layout.tsx` metadata: openGraph.images = [{url:'/og/card.png', width:1200,
  height:630}], twitter: { card: 'summary_large_image' }, absolute URLs via metadataBase
  set from an env (previews stay correct).
- **Gate:** deployed URL renders; the HTML head carries og:image/title/description and
  the twitter card; the card file looks composed, not like a screenshot.

### STEP 1 · Tokens + monochrome purge (`globals.css`)
- Replace the token block: add
  ```css
  --u: 8px;  --gutter: 24px;  --margin: clamp(20px, 5vw, 64px);
  --content-max: 1360px;
  --ink:#070809; --ink-2:#101214; --paper:#F2F3F4;
  --text-hi-ink:#F5F6F7; --text-hi-paper:#0B0C0D;
  --line-on-ink: rgba(255,255,255,.12); --line-on-paper: rgba(0,0,0,.14);
  --glow: rgba(255,255,255,.06); --filament: rgba(255,255,255,.55);
  --accent:#FFFFFF; /* collapsed; consumers keep working */
  ```
  (mobile: `--gutter:16px` under 900px). DELETE gold/brass/teal/tan tokens and the warm
  ivory. Search the whole tree for hex colours — any saturated hex outside `copy.ts`
  swatches and the logo block is a bug (§6.4 audit).
- `grad-word` → white core + `text-shadow: 0 0 18px rgba(255,255,255,.45), 0 0 60px
  rgba(255,255,255,.18)`; remove the gold gradient.
- Panel primitives:
  ```css
  .panel { position:relative; overflow:hidden; border-radius:0;
           border:1px solid var(--line-on-ink); }
  .panel-land { aspect-ratio: 1.41421 / 1; }
  .panel-port { aspect-ratio: 1 / 1.41421; }
  .panel-sq   { aspect-ratio: 1 / 1; }
  ```
- Structural grid (replaces the 34px decorative grid) on `.dark[data-grid]` /
  `.light[data-grid]`: verticals ONLY at column boundaries, horizontals every 64px at
  ~40% strength, keep the core+halo filament treatment and the radial wash. Implement
  with a repeating-linear-gradient whose period is `calc((100% + var(--gutter)) / 6)`
  inside a full-bleed pseudo-element aligned to the content box — verify alignment with
  the §6.5 overlay, not by eye.
- **Gate:** build passes; page still renders every section (colors now monochrome);
  `?grid=1` overlay (STEP 2) pending.
- Keep `data-accent` attributes in markup harmless for now (PageMotion stops reading
  them in STEP 8; removing markup attrs then).

### STEP 2 · The audit overlay (`?grid=1`)
- Small client component mounted in `page.tsx` (dev-only by env or query param): draws
  the true 6/3-column overlay + 8px baseline as translucent lines over the page.
- **Gate:** overlay lines coincide with the structural grid background on a `data-grid`
  sheet at 1280 and 390 (measure with evaluate, not eyes: sample the background
  gradient's period vs `(contentWidth+gutter)/6`).

### STEP 3 · Story copy + SheetBlock
- `copy.ts`: add
  ```ts
  export const story = [
    { no:'01', beat:'The Window',        caption:'A piece waits, lit.' },
    { no:'02', beat:'The Studio',        caption:'The lights come on.' },
    { no:'03', beat:'The Drafting Table',caption:'Yours is drawn.' },
    { no:'04', beat:'The Range',         caption:'Walk the collections.' },
    { no:'05', beat:'The Showroom',      caption:'Step through. Agrabad.' },
    { no:'06', beat:'Your Room',         caption:'See it in your place.' },
    { no:'07', beat:'The Maker',         caption:'In his own words.' },
    { no:'08', beat:'The Order',         caption:'Have yours drawn.' },
  ] as const
  ```
  (No dashes in strings. Sheet numbering: hero=01 … footer=08; the old per-section
  `index` fields become redundant — retire them as sections adopt SheetBlock.)
- `ui/SheetBlock.tsx` (server): renders
  `SHEET 03 · THE DRAFTING TABLE · 03/08 · NEXT: THE RANGE` styled as a drawn block
  (1px hairline top, specimen type), bottom-right on desktop (grid col 5–6), full-width
  strip on mobile. Every section renders it; beat caption component for sheet heads.
- IndexNav overlay: relabel items from `story` (map of beats), keep category jump links.
- **Gate:** all 8 sheets show block + caption; no dash characters
  (`node -e` unicode scan of copy.ts for –/—).

### STEP 4 · Sheet 01 re-layout (the visible proof)
- `Hero.tsx` + module CSS onto the 6-col grid per BLUEPRINT §4 Sheet 01: type [1–3],
  stage panel `.panel .panel-land` on [4–6] (mobile: full-width A-LAND first), statement
  88/88 desktop / 48/48 mobile, CTA + AR hook, SCROLL cue, SheetBlock.
- The stage div `[data-stage-hero]` becomes the A-LAND panel — 3D framing then needs no
  change (`fitDistance` is aspect-aware; aspect is now constant √2).
- Add crop marks (4 corner glyphs) + `DimensionLine` under the stage:
  - `stage-state.ts`: add `rawSize` publication — in `measureFit` keep the pre-normalise
    box size; publish via a new `set/get/onPieceSize` pub/sub from `HeroPiece.onMeasure`.
  - `ui/DimensionLine.tsx` ('use client'): `|◄── {mm} MM ──►|` with 1px filament lines +
    ticks; subscribes to `onPieceSize`; hidden until stageReady (no 3D → no fake dims).
- Floodlight seed: statement chars brighten once on load (extend the existing SplitText
  intro with a 40ms stagger brightness pass) — the full beam comes in STEP 9.
- **Gate:** 390 + 1280 measurements: stage aspect within 0.5% of √2; no element outside
  columns (overlay check); drag still spins; pieces still swap at 0.30/0.56; caption
  updates; dimension mm text appears only after 3D ready and changes per piece.

### STEP 5 · Image systems (Photo print + FocusLight)
- `Photo.tsx`: wrap img in a positioned span with (a) the filament sweep child div,
  (b) `data-print` attr when `print` prop true. CSS: `[data-print].is-unprinted img
  {filter:grayscale(1) brightness(.8)} ... .is-printed` transitions clip/filter; the
  sweep is a 1px + bloom bar translating top→bottom once (CSS animation triggered by the
  class; 900ms; ends removed).
- `ui/FocusLight.tsx` ('use client'): props `{name, alt, sizes, focusX='50%', focusY='33%'}`;
  renders TWO `Photo`-equivalent imgs (same file, browser-cached): base grayscale+dim,
  top clipped `clip-path: circle(var(--focus-r) at var(--focus-x) var(--focus-y))`,
  plus the rim-bloom div. `--focus-r` default 12%.
- `PageMotion.tsx`: one reusable block — for every `[data-print]`: ScrollTrigger toggle
  at `top 75%` adds `.is-printed` (one-shot). For every `[data-focus]`: scrub writes
  `--focus-r` 12%→120% across `top 80% → center 45%`, plus the one-shot flicker tween
  (opacity dips 1→.35→1→.55→1, total ~240ms) on first activation; skip flicker if
  `!motionOK` (whole block only exists under motionOK anyway — reduced motion falls back
  to the CSS default: static, `--focus-r` initial must therefore be **120%** in CSS and
  JS SETS it down to 12% before scrubbing, per the JS-only-initial-states law. Same for
  print: CSS default is printed/full colour; JS adds `.is-unprinted` first.)
  **This inversion is the most important detail of the step.**
- Ken Burns: transform-only scrub on the img inside each panel (scale 1→1.06).
- **Gate:** with JS disabled (`?` — use Chromium `--disable-javascript` via Playwright
  route or just reduced-motion emulation): every image full colour, no sweep. With JS:
  scroll past S4 cards → grayscale→print→colour observed via computed styles
  (`getComputedStyle(img).filter` transitions to `none`), not screenshots.

### STEP 6 · Sheets 02, 04, 05, 06 re-layout
- Sheet 02: placard [1–2], photo `.panel-port` [3–6] bleeding right (keep `justify-self:
  end` + negative right margin technique already in `brandPhoto`), **FocusLight** on it
  (the "lights come on" beat), caption in the photo corner, SheetBlock. Mobile: A-LAND
  full-bleed photo, placard below.
- Sheet 04: cards exactly 2 columns wide, media `.panel-port`, print on enter (stagger
  80ms mobile); desktop rail pin survives (adjust `.cards.isRail` flex-basis to the
  2-col width: `calc((min(100vw,1360px) - 2*margin - 5*gutter)/6*2 + gutter)`).
  Mobile card media switches to `.panel-land`.
- Sheet 05: full-width `.panel-land` [1–6]; aperture stays; FocusLight inside it.
- Sheet 06: panel [1–4] + placard [5–6]; ArViewer poster gets print treatment; crop marks.
- **Gate:** per-sheet overlay audit at 390/1280; rail still pins and scrubs; aperture
  still opens; AR press still mounts (re-run the press test).

### STEP 7 · Sheets 03, 07, 08
- Sheet 03: steps [1–2] with the dim/brighten floors UNCHANGED (contrast constants),
  stage `.panel-land` [3–6]; **dimension text moves out of the panel** into
  DimensionLine components on its edges (fixes the old text-over-model bug); swatch dock
  under the steps; mobile pinned order: stage on top. Blueprint edge colour: was brass —
  becomes filament white (`#FFFFFF` at the same opacities; edgeMat color change in
  `buildBespoke`).
- Sheet 07: quote [1–4] (Fraunces 28/40), vertical DimensionLine as the timeline [5–6]
  (years as ticks, drawn top→bottom on scroll via scaleY from JS-set 0 — CSS default
  fully drawn), trust chips, portrait slot (`people-md-portrait` when the photo lands:
  grayscale at rest, colour on hover — the ONE resting-grayscale image).
- Sheet 08: CTA centered [2–5], contact blocks [1–2][3–4][5–6], beats index, colophon
  SheetBlock `SHEET 08/08 · END`; the plot line tip ties off here (existing thread-tip).
- **Gate:** contrast re-check on the three floors (unchanged values, new grounds — the
  paper changed from #F4F0E8 to #F2F3F4, slightly LIGHTER, so light-ground floors get
  safer, but RE-COMPUTE 4.5:1 for #0B0C0D-on-#F2F3F4 at 0.66 and note it in PROGRESS).

### STEP 8 · Motion re-wire (`PageMotion.tsx`)
- DELETE the accent scrub block (`[data-accent]` forEach) and the per-piece accent tween
  in the hero showPiece; then strip `data-accent` from section markup.
- Thread: rename visuals to the plot line (white filament + bloom); behaviour unchanged.
- Statement SplitText: confirm masked-lines intro still correct at 88/88.
- **Gate:** full-scroll journey at 1280 and 390 (measurement probes at each sheet:
  pinned states, spacer count = 3, ticker transform non-none, scroll reaches
  `scrollHeight - innerHeight`), zero console errors.

### STEP 9 · The floodlight (`ui/FloodBeam.tsx` + 3D)
- FloodBeam: absolutely positioned, width = 2 columns, full sheet height × 1.5, rotated
  45°, `background: linear-gradient(90deg, transparent, rgba(255,255,255,.06), transparent)`,
  `mix-blend-mode: screen`, `pointer-events:none`. Mounted on sheets 01/03/05/07 only.
  CSS default position: centered, opacity 1 (reduced-motion = still, lit beam).
- **The LIGHT SCRIPT (BLUEPRINT §5.7 table) — behaviour varies, direction NEVER:**
  - 01: scrub `xPercent -60 → 60` (left→right) across the hero pin.
  - 03: scrub `xPercent 60 → -60` (reverse travel) across the S3 pin; also drive
    `edgeMat` brightness glint from the beam's progress (cheap: one scalar per frame).
  - 05: one-shot slow pass (tween, not scrub) fired when the loadshedding cut completes.
  - 07: no tween at all — the static shaft.
  - **SWITCHOVER:** on every dark sheet's ScrollTrigger `onEnter` (once per direction),
    tween that sheet's beam+glow wrapper opacity `.4 → 1` in 120ms — toggle, never
    scrubbed (a scrubbed flicker judders). Skip entirely under reduced motion.
- 3D: key spotlight gets `penumbra 1`, visible falloff pool (existing stagePool covers
  it), and the piece-swap "dip": in the swap handler, tween key light intensity
  down→up 250ms. Shadows already fall bottom-right from the key light position — verify
  and if not, move the light to top-left of camera space.
- **Gate:** beam pans on scroll (computed transform changes), no layout shift (it is
  absolutely positioned + overflow hidden on the sheet), fps sane on CPU throttle.

### STEP 10 · Preloader + final audits + docs
- Preloader: line draws to measure + "ONE PIECE, DRAWN FOR YOU." (skippable, session-once
  behaviour already exists).
- Run: monochrome audit (§6.4), overlay audit each sheet, Lighthouse mobile (target
  Perf ≥ 85 first pass; then chase ≥ 90: the known levers are font families and the
  three chunk), a11y 100, full JS-off render, real-phone pass by Saadman (LAN).
- Update README (the one-liner from BLUEPRINT §0), ASSETS.md (unchanged licences),
  PROGRESS.md. Remove the `/labs` route before the final deploy.
- **Gate:** BLUEPRINT §8 checklist all ticked or explicitly deferred with reasons.

## 6. VERIFICATION RECIPES (copy-paste)

### 6.1 Viewport truth (Playwright MCP)
```js
await page.setViewportSize({ width: 293, height: 633 }); // = CSS 390x844 (dpr 0.75!)
const w = await page.evaluate(() => window.innerWidth);  // MUST be 390
```
Desktop: `{960,600}` → 1280×800. Screenshot always `scale:'device'`.

### 6.2 Honest rasters for deep sections
```js
await page.emulateMedia({ reducedMotion: 'reduce' });  // pins gone, rasters honest
...screenshots...
await page.emulateMedia({ reducedMotion: 'no-preference' }); // ALWAYS reset
```

### 6.3 Is the WebGL view actually drawing? (screenshots lie)
Temporarily add `preserveDrawingBuffer: true` to Canvas gl props, then:
```js
const url = canvas.toDataURL(); // draw into 2d canvas, count alpha>8 pixels in the view rect
```
Remove the flag afterwards. (Used before: bespoke read 12% lit pixels while screenshots
were black.)

### 6.4 Monochrome audit (BLUEPRINT §8)
Walk all elements; for computed `color`, `backgroundColor`, `borderColor`: convert to
HSL; FAIL if saturation > 0.08 && alpha > 0 unless the element is inside `[data-stage-*]`,
a `.photo`/`picture`, a swatch chip, or the logo block.

### 6.5 Grid alignment audit
With `?grid=1`: for each panel and text block, `getBoundingClientRect().left/right` must
sit within 1px of a column boundary `margin + i*(col+gutter)`; log offenders.

### 6.6 The wheel must never die
After any SmoothScroll/PageMotion change: dispatch 30 real `mouse.wheel` events, assert
scrollY advances, assert reaching document end, and assert zero
`[SmoothScroll]` warnings in console (warnings mean the watchdog fired — investigate).

## 7. DO NOT TOUCH (without a written reason in PROGRESS.md)
- `SmoothScroll.tsx` watchdog logic; `StageLoader` gating; the `.stageCanvas *`
  pointer-events rule; Draco/HDR/model-viewer self-hosting; the crop/photos scripts'
  graded-over-originals resolution; contrast floor constants (recompute, don't delete);
  `suppressHydrationWarning` on body; the Meta Pixel env gate in layout.tsx;
  CC-BY attribution line in the footer (legal, until Meshy models replace the pieces).

## 8. WHEN SAADMAN'S ASSETS LAND (see SAADMAN-TASKS.md)
- Gemini-cleaned photos → drop into `graded/` (same names) → `npm run photos` → done.
- Meshy GLB → optimize:
  `npx @gltf-transform/cli optimize in.glb public/models/<id>.glb --compress draco
  --texture-compress webp --texture-size 1024 --simplify false`
  → point `hero.pieces[].id` at it → footer attribution line switches to the Meshy line
  (`copy.ts` comment explains) → ASSETS.md ledger updated. USDZ → `public/models/` +
  `ios-src` on model-viewer (unlocks iPhone AR).
- ~~Video~~ - CONFIRMED none exists and none is coming (2026-09-02). Sheet 05 is
  stills-only: a slow Ken Burns pan inside the aperture. Do not build a video branch.
- MD/team photos → `people/` in raw folders → pipeline → Sheet 07 slots.
```
