# BLUEPRINT.md — "DRAWN TO MEASURE"

> The mathematical design system for the Heaven Furniture Mart landing page.
> Requested by Saadman on 2026-09-01: *"plan mathematically — it is a furniture website, so
> proper alignment, measurement of each section should represent furniture with mathematical
> sections, geometry, 3d rendering. Make it three or six grid, each section should contain
> shapes with mathematically calculated layers."*
>
> This document is the single authority for LAYOUT. PLAN.md remains the authority for
> content, copy, business logic and the asset pipeline. Where they conflict on layout,
> this file wins.

---

## 0. THE THESIS — why mathematics IS the design

Bespoke furniture begins as a technical drawing: a sheet of paper with a grid, a piece
drawn in elevation, and dimension lines that promise "built to YOUR size." That drawing is
the most honest possible symbol of Heaven's #1 differentiator (fully bespoke, built to your
space) — and it is also, not coincidentally, how the best design studios in the world lay
out a page.

**So the page is not decorated with a grid. The page IS a technical drawing of itself.**

- Every section is a numbered SHEET (Sheet 01…08), with a title block like a real drawing.
- Every media panel is a drafting-paper rectangle (ISO 216 proportion, 1 : √2).
- Every element sits on one modular grid; the faint background grid IS that grid, so
  content edges land exactly on drawn lines. (The old grid looked messy precisely because
  it was decoration at 34px while the layout lived on other numbers. That mismatch is the
  difference between "premium studio" and "template with a texture".)
- The 3D pieces stand inside drawn dimension lines fed by their REAL measured bounding
  boxes — the page literally measures the furniture it shows.

One sentence for the README and the judges: **"A bespoke piece starts as a drawing; this
page is drawn the same way — to measure."**

---

## 1. RESEARCH GROUNDING (what the mathematics is borrowed from)

| Source | What we take |
|---|---|
| **ISO 216 / A-series paper** (A4, A3 — the paper furniture is drafted on) | The one panel ratio: **1 : √2 ≈ 1 : 1.414**. Halving an A-sheet yields the same ratio, so panels nest without ever changing shape — mobile and desktop use the *same* rectangle. |
| **Josef Müller-Brockmann, _Grid Systems in Graphic Design_** | The modular column grid as the generator of every layout decision; asymmetric column splits (2+4, not centered 3+3) for tension; type aligned to a baseline grid. |
| **The 8-pt baseline system** (Material/IBM practice, but older than both) | Base unit **u = 8px**. Every spacing, every line-height, every panel offset is a multiple of u. Nothing is eyeballed. |
| **Swiss furniture modernism — USM Haller, Vitra, Dieter Rams' 606** | Furniture that IS a grid: chrome nodes at fixed modules. Visual language: hairlines (1px), sharp corners, one accent, engineered whitespace. |
| **Architectural title blocks** | Every real drawing carries a block: sheet number, title, scale, firm. Our sections each carry one — it is navigation, rhythm and brand at once. |
| **Dimension-line convention** (ticks, extension lines, text above the line) | Drawn around the 3D stages, fed by the models' real bounding boxes. |

**One ratio family, deliberately.** √2 for shapes, 8px for rhythm, 4:3 column splits for
asymmetry. No golden ratio, no second module — mixing ratio systems is how pages start
looking "almost aligned", which is worse than unaligned.

---

## 2. THE CONSTANTS (every number the page is allowed to use)

### 2.1 The module

```
u            = 8px                      the base unit; ALL spacing = n × u
RATIO        = 1.41421  (√2)            the only panel ratio
```

### 2.2 The column grid

```
                 DESKTOP (≥900px)          MOBILE (<900px)
columns          6                         3
gutter           3u  (24px)                2u  (16px)
outer margin     8u  (64px)  → clamp       2.5u (20px)
max content      1360px, centered
column width     col = (content − 5·gutter) / 6
```

Allowed desktop spans: **2, 3, 4, 6** columns. Allowed splits: **2+4, 4+2, 3+3, 6**.
Mobile spans: **3 (full)** or **2+1 / 1+2** for small paired elements only.
Nothing may start or end off-column (bleeds run to the viewport edge but *begin* on a column line).

### 2.3 The vertical rhythm

```
baseline               8px (= u); all line-heights are multiples of u
section padding-y      desktop 20u (160px) · mobile 12u (96px)
gap between blocks     3u / 6u / 9u only (24 / 48 / 72)
title block height     8u (64px), pinned to each sheet's bottom edge
```

### 2.4 Panels (the "shapes")

Every media/stage panel is one of exactly three shapes:

```
A-LAND    w : h = √2 : 1     (like an A4 sheet on its side)   → 3D stages, wide photos, video
A-PORT    w : h = 1 : √2     (an A4 sheet upright)            → editorial photos, cards
SQUARE    1 : 1                                               → small detail cuts, swatches
```

Corners: **0px on all panels** (drafting paper has no rounded corners).
Buttons/pills keep their radius — instruments, not sheets.
Borders: 1px hairline `--line` on panels that need an edge; most rely on the ground shift.

### 2.5 The structural background grid (replaces the old decorative grid)

Drawn from the SAME tokens as the layout, so drawn lines = column lines:

- Vertical lines: at the 7 (desktop) / 4 (mobile) column boundaries only — not every 34px.
- Horizontal lines: every 8u (64px), at ~40% the strength of verticals.
- Strength: verticals rgba(neon, 0.05 core / 0.02 halo) — the existing filament treatment
  survives, only the GEOMETRY changes.
- Appears ONLY on sheets that stage an object (S1, S3, S5, S6) via `data-grid`; prose
  sheets stay clean (kept from the last round of feedback).

### 2.6 The type scale (snapped to baseline)

Perfect fourth (×1.333) from 16px, each line-height a multiple of 8:

```
ROLE            SIZE / LINE-HEIGHT        FAMILY
specimen        12 / 16   tracking .14em  Geist Mono
body / placard  16 / 24                   Inter
placard-title   21 / 32                   Inter Tight 600
section-title   38 / 48  (mobile)         Inter Tight 600, −0.03em
                50 / 64  (desktop)
statement       48 / 48  (mobile)         Inter Tight 600, −0.035em
                88 / 88  (desktop, clamps down by viewport height)
ghost numeral   240+     (decorative, opacity ≤ 0.05)
quote           28 / 40  italic           Fraunces
```

### 2.7 The annotation layer (what makes the math VISIBLE)

1. **Title block** (every sheet, bottom-right on desktop, full-width strip on mobile):
   `SHEET 03 · BESPOKE   ·   HEAVEN FURNITURE MART · AGRABAD   ·   03/08`
2. **Dimension lines** around 3D stages: `|◄────── 2286 MM ──────►|` — values computed
   from the model's real bounding box at load (stage-state already measures it). When the
   Meshy scans of Heaven's real pieces land, the numbers update themselves.
3. **Crop marks** (⌐ ¬ L ⌐) at panel corners on stage sheets — 45°/90° strokes only.
4. **Sheet edge ticks**: tiny ruler ticks along the left margin of stage sheets, every 8u.
   (Subtle. If it ever competes with content, it goes.)

Budget: **max 3 annotation kinds visible per viewport** — restraint is the luxury.

---

## 3. THE LAYER MODEL (each sheet is the same 6-layer sandwich)

```
L6  chrome        index pill, sticky CTA               (fixed, above all)
L5  annotations   title block, dimensions, crop marks  (per sheet)
L4  objects       3D pieces, photos, video             (inside panels only)
L3  panels        A-LAND / A-PORT / SQUARE shapes on the column grid
L2  type          statements, placards, specimens      (on the baseline grid)
L1  structure     the drawn column/baseline grid       (data-grid sheets only)
L0  ground        ink (dark) or paper (ivory)
```

Every section is specified below as: which columns each L2–L4 element occupies.

---

## 4. THE SHEETS — section-by-section mathematical map

Notation: `[1–3]` = occupies columns 1 through 3 of 6 (desktop) or of 3 (mobile).

### SHEET 01 · HERO — "The Piece" (dark, grid ON, pinned turntable)

```
DESKTOP (6 col)                              MOBILE (3 col)
┌────┬────┬────┬────┬────┬────┐             ┌────┬────┬────┐
│ WORDMARK [1–2]      INDEX [6]│             │ WM [1–2] IX[3]│
│                              │             ├──────────────┤
│ EYEBROW [1–3]     ┌─────────┐│             │ ┌──A-LAND───┐│
│ STATEMENT 88/88   │ STAGE   ││             │ │  3D PIECE ││
│ [1–3]             │ A-LAND  ││             │ │ ◄─2286мм─► ││
│ ── rule 2u        │ [4–6]   ││             │ └───────────┘│
│ TAGLINE [1–2]     │◄─2286──►││             │ CAPTION [1–3]│
│ CTA [1–2]         └─────────┘│             │ STATEMENT 48 │
│ AR-HOOK [1–2]     CAPTION[4–6]             │ [1–3]        │
├──────────────────────────────┤             │ CTA [1–3]    │
│ SCROLL [1]   TITLE BLOCK [5–6]             │ AR-HOOK [1–3]│
└──────────────────────────────┘             │ TB strip [1–3]
                                             └──────────────┘
```
- Stage panel: A-LAND spanning cols 4–6 → width = 3col+2gut, height = width/√2.
  Deterministic aspect means the 3D camera framing is now a constant, not a guess.
- **Kept from backup branch:** drag-to-spin with inertia, piece swap on scroll during the
  pin (3 pieces), per-piece accent, defocused real-photo backdrop, idle+interaction mount.
- **New:** drawn dimension line under the stage (real mm from the model), crop marks,
  title block. Statement snaps to 88/88.

### SHEET 02 · THE STUDIO — brand placard (ivory, grid OFF)

```
DESKTOP                                      MOBILE
┌────┬────┬────┬────┬────┬────┐             ┌──────────────┐
│ PLACARD [1–2]  ┌─PHOTO──────┼──▶ bleeds   │ ┌─PHOTO──────┤──▶ edge-to-edge
│  01            │  A-PORT    │   to edge   │ │  A-LAND    ││
│  title 50/64   │  [3–6]     │             │ └────────────┘│
│  line 16/24    │  caption   │             │ PLACARD [1–3]│
│  specimens     │            │             │ TB strip     │
│ TITLE BLOCK[1–2]└───────────┘             └──────────────┘
└──────────────────────────────┘
```
- Split is **2+4** (asymmetric, per Müller-Brockmann), photo begins ON column-3's line and
  bleeds off the right viewport edge. Ticker strip below unchanged (it already IS a module).

### SHEET 03 · BESPOKE — "The Method" (dark, grid ON, pinned)

```
DESKTOP                                      MOBILE (pinned, stage on top)
┌────┬────┬────┬────┬────┬────┐             ┌──────────────┐
│ 02 INDEX [1]                 │             │ ┌──A-LAND───┐│
│ DESIGNED. [1–2] ┌─STAGE─────┐│             │ │ blueprint ││
│ CRAFTED.  [1–2] │  A-LAND   ││             │ │→craft→mat ││
│ CUSTOMIZED.[1–2]│  [3–6]    ││             │ └─◄─dims─►──┘│
│ (steps dim/     │ ◄─dims──► ││             │ STEP (one at │
│  brighten)      │ crop marks││             │  a time)[1–3]│
│ SWATCHES [1–2]  └───────────┘│             │ SWATCHES     │
│ CTA [1–2]      TITLE BLOCK[5–6]            │ CTA · TB     │
└──────────────────────────────┘             └──────────────┘
```
- **Fix for "wireframe looks messy":** dimension text moves OUT of the panel into the
  drawn dimension lines on the panel's edges (it was floating over the model — that was a
  bug, now impossible by construction: annotations live on L5, objects on L4).
- Blueprint → clip-sweep → material phases survive exactly; the blueprint floor (0.22)
  stays so the panel is never empty.

### SHEET 04 · COLLECTIONS — "The Range" (ivory, grid OFF, desktop rail pin)

```
DESKTOP RAIL (pinned, scrubs left)           MOBILE (vertical)
┌────┬────┬────┬────┬────┬────┐             ┌──────────────┐
│ 03 COLLECTIONS [1–3]         │             │ CARD  [1–3]  │
│ ┌A-PORT┐ ┌A-PORT┐ ┌A-PORT┐ →│             │ ┌──A-LAND───┐│
│ │ 01   │ │ 02   │ │ 03   │ →│             │ │ photo     ││
│ │photo │ │photo │ │photo │ →│             │ └───────────┘│
│ │      │ │      │ │      │ →│             │ 01 LIVING    │
│ └──────┘ └──────┘ └──────┘ →│             │ chips        │
│  name+num  (each card 2 col)│             │ …×5          │
│ VIEW ALL ↗ [1–2] TB [5–6]   │             │ VIEW ALL ↗   │
└──────────────────────────────┘             └──────────────┘
```
- Card = exactly 2 columns wide, photo A-PORT, number + name on the baseline under it.
- Mobile cards switch to A-LAND (portrait cards at full phone width are too tall to scan).

### SHEET 05 · SHOWROOM (dark, grid ON)
- Full-width A-LAND panel `[1–6]` (aperture reveal kept), caption + directions link on the
  baseline below, title block right. Media ladder unchanged: video when Saadman delivers
  it → today the cropped wide photo.

### SHEET 06 · AR — "Your Room" (ivory, grid ON)

```
DESKTOP: PANEL A-LAND [1–4] · PLACARD [5–6] (mirror of Sheet 02)
MOBILE:  PANEL A-LAND full · PLACARD below
```
- Press-to-load model-viewer kept exactly (verified working). The panel gets crop marks —
  it is literally a viewfinder.

### SHEET 07 · THE RECORD — proof (dark, grid OFF)

```
DESKTOP                                      MOBILE
┌────┬────┬────┬────┬────┬────┐             quote → timeline → chips, stacked
│ QUOTE 28/40 [1–4]  │ 2020 ─┤             (timeline keeps the dimension-line
│  Fraunces italic   │ 2021 ─┤              form: a vertical measured line)
│  MD name + role    │ 2024 ─┤
│                    │ 2025 ─┤
│ TRUST CHIPS [1–4]  │ 2026 ─┤
│ TITLE BLOCK [5–6]  │ [5–6] │
└──────────────────────────────┘
```
- **The timeline is drawn as a vertical dimension line** — year ticks like mm ticks. The
  company's history, measured. (MD portrait + team photo slot in here when delivered:
  portrait as A-PORT `[5–6]` above the timeline, duotone per PLAN 1.8.)

### SHEET 08 · THE ORDER — footer (dark, grid OFF)
- Final CTA centered `[2–5]`; contact VISIT/TALK/FOLLOW as three 2-col blocks `[1–2][3–4][5–6]`;
  index nav links; the title block here is the real colophon: credits, Racdox line,
  `SHEET 08/08 · END`.

---

## 5. THE 3D MATHEMATICAL PLAN

1. **Stage = A-LAND panel** → constant aspect √2 everywhere → `fitDistance()` output is
   deterministic per piece. FIT stays 0.9 with the rotation-safe radial bound (hypot x,z).
2. **Real dimensions on screen:** `measureFit()` gains `rawSize` (metres, pre-normalise);
   stage-state publishes it; the L5 dimension component renders `⌀ mm` values. Placeholder
   pieces show THEIR true size (honest); Meshy scans of Heaven pieces will show theirs.
3. **Object anchor:** piece feet at panel's ⅔ height line, centre at panel centre-x. The
   camera lift keeps the horizon at ⅓ from the top — rule-of-thirds inside a √2 sheet.
4. Everything else (single canvas + two drei Views, tier ladder, interaction/idle mount,
   swap choreography, inspect mode) carries over from the backup branch unchanged.

---

## 6. INTEGRATION PLAN (file by file, in order)

| # | File | Change |
|---|---|---|
| 1 | `globals.css` | New token block: `--u, --cols, --gutter, --margin, --col, --content-max`; type roles re-snapped (§2.6); panel classes `.panel-land/.panel-port/.panel-sq` (aspect-ratio, radius 0, hairline); structural grid derived from the SAME tokens (§2.5); remove 34px decorative grid tokens. |
| 2 | `sections.module.css` | Every section becomes `display:grid; grid-template-columns: repeat(6, 1fr)` (3 on mobile) with explicit `grid-column` spans from §4. Delete per-section ad-hoc widths. |
| 3 | NEW `ui/SheetBlock.tsx` | The title block. Server component, props: sheet no, title. Rendered by every section. |
| 4 | NEW `ui/DimensionLine.tsx` | Client island: horizontal/vertical drawn dimension with ticks; subscribes to stage-state's measured size for 3D stages; static values allowed for photos. |
| 5 | `Hero.tsx` + `Turntable.tsx` | Re-lay on the grid per Sheet 01; stage becomes `.panel-land`; dimension line + crop marks mounted on L5. |
| 6 | `Bespoke.tsx` | Steps to [1–2], stage `.panel-land` [3–6]; dimension text OUT of the panel (bug fix); mobile pinned order per §4. |
| 7 | `Brand.tsx`, `Collections.tsx`, `Showroom.tsx`, `Ar.tsx`, `Proof.tsx`, `Footer.tsx` | Per §4 maps. Collections cards → strict 2-col A-PORT; Proof timeline → dimension-line form. |
| 8 | `PageMotion.tsx` | Selectors follow markup changes; choreography itself unchanged (pins, swaps, dims, marquee, thread). Statement SplitText sizes re-checked at 88/88. |
| 9 | NEW dev overlay | `?grid=1` draws the true 6/3-col grid + 8u baseline as an overlay so every sheet can be AUDITED against the math (screenshot per sheet, desktop+mobile, before calling it done). |
| 10 | Docs | PROGRESS.md entries per step; ASSETS.md untouched; README gets the one-liner (§0). |

**Order of execution:** 1 → 2 → 3 → 5 (hero visible proof first) → 9 (audit tool) → 6 → 7 → 4 → 8 polish → full-page audit at 390 / 768 / 1280 / 1600.

**What is NOT changing:** copy.ts content, WhatsApp CTA logic, photo pipeline, AR loader,
tier ladder, watchdog, licences. This is a re-LAYOUT, not a rebuild.

---

## 7. WHAT SAADMAN PROVIDES (unblocks, in value order)

1. **Gemini photo cleanups** — same 10 filenames into `assets-raw/photos/graded/`
   (SAADMAN-TASKS.md Task 1/3 — prompts already written). Cropped versions are live today;
   cleaned ones auto-upgrade each slot.
2. **Showroom walkthrough video** (Task 6) → Sheet 05 panel upgrades from photo to video.
3. **MD portrait + team photo** → Sheet 07 A-PORT slot.
4. **Meshy scans** of real Heaven pieces (Task 6) → turntable pieces + real dimension
   numbers become Heaven's actual furniture; CC-BY placeholder credit line comes out.
5. WhatsApp group: the submission deadline (still unknown — this caps everything).

---

## 8. ACCEPTANCE CHECKS (the math is verifiable, so verify it)

- [ ] `?grid=1` overlay: every panel edge on a column line, every text block on the
      baseline — screenshot per sheet, mobile + desktop, kept in PROGRESS.md.
- [ ] All panels report aspect within 0.5% of √2 or 1 (script reads getBoundingClientRect).
- [ ] Only spacing values that are multiples of u appear in computed section styles.
- [ ] Lighthouse mobile ≥ 90 / a11y 100 re-run after re-layout (contrast floors preserved).
- [ ] Real-phone pass by Saadman (the headless raster artifact makes his eyes the only
      trustworthy check for the pinned sheets).
