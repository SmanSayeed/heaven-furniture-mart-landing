# BLUEPRINT.md — "DRAWN TO MEASURE"

> The mathematical design system for the Heaven Furniture Mart landing page.
> Requested by Saadman on 2026-09-01: *"plan mathematically — it is a furniture website, so
> proper alignment, measurement of each section should represent furniture with mathematical
> sections, geometry, 3d rendering. Make it three or six grid, each section should contain
> shapes with mathematically calculated layers."*
>
> Revised same day on Saadman's second directive: *"remove other colors, just keep black
> and white only with neon effect (lighting, shadowing, glowing). No golden color. Objects
> and images can be colorful, logo stays as it is. Images need to be hooky, animated,
> creative with gorgeous dynamic effects. On scroll we can make images animated way black
> and white to colorful."* — SS2.8 (monochrome palette) and SS5.5 (the image motion
> system) are the result; every accent-colour rule elsewhere in this file is dead.
>
> Third directive, same day: *"keep a focus point at center mathematically; on scroll a
> partial % area black and white and another partial % colorful (focused, bright). It will
> seem like there was loadshedding, suddenly light comes."* -> SS5.6, THE LOADSHEDDING CUT.
>
> Fourth directive, same day: *"the website should have a story; it will feel like the
> user is getting into an adventure, directed to the story points."* -> SS0.5, THE STORY.
>
> Fifth directive: *"plan flood light effect within black white shadow and light
> effects."* -> SS5.7, THE FLOODLIGHT + the One Light Law.
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

## 0.5 THE STORY -- "ONE PIECE, DRAWN FOR YOU" (the eight-beat adventure)

The mathematics is the SET; this is the PLOT. The visitor is not reading a company page,
they are walking through the making of their own piece -- second person, present tense,
from a dark studio window at night to the order sheet with their name on it. Every sheet
is one beat, and every beat ends by pulling toward the next.

| # | BEAT (specimen caption on the sheet) | What happens to the visitor | The pull forward |
|---|---|---|---|
| 01 | **THE WINDOW** -- "A piece waits, lit." | Night. Through the studio window one piece stands in a pool of light. They can reach in: grab it, spin it; it changes as they linger (the turntable pin). | SCROLL cue + the plot line starts drawing downward. |
| 02 | **THE STUDIO** -- "The lights come on." | The LOADSHEDDING CUT (SS5.6): current returns, the room blooms from grey to colour. They are inside now; the placard says who works here. | The ticker mantra slides past: Designed. Crafted. Customized. |
| 03 | **THE DRAFTING TABLE** -- "Yours is drawn." | The adventure's centre. A blueprint draws itself, the craft-plane sweeps it real, and THEY pick the fabric (swatches). Dimension lines read real mm: built to your size. | "NEXT: WALK THE RANGE" cue by the title block. |
| 04 | **THE RANGE** -- "Walk the collections." | The rail pin literally WALKS them sideways along the five collections (desktop); mobile strolls down the rack. Cards print (SS5.5). | The rail ends at a lit doorway edge: Sheet 05's aperture is already opening. |
| 05 | **THE SHOWROOM** -- "Step through. Agrabad." | The aperture opens like a door; inside, the loadshedding cut lights the real showroom. Directions link = the real-world door. | "TAKE IT HOME FIRST" line points down. |
| 06 | **YOUR ROOM** -- "See it in your place." | The piece leaves the studio with them: AR places it at real size in their own room. The adventure crosses INTO their house. | The maker's signature beat is promised: who builds this? |
| 07 | **THE MAKER** -- "The man who signs it." | Quiet sheet. The MD's words, his portrait (grayscale until touched), the history drawn as one vertical measured line 2020->2026. Trust lands here. | The final ask is one scroll away. |
| 08 | **THE ORDER** -- "Have yours drawn." | The order sheet: the one CTA, contact, the colophon title block `SHEET 08/08 -- END`. WhatsApp message is pre-written: signing the commission. | (End. The plot line ties off in a triangle.) |

### Wayfinding -- how the visitor is DIRECTED through the beats

1. **The plot line IS the storyline.** The continuous 1px white filament (SS2.8) draws
   itself forward as they scroll, sheet to sheet, and ties off at the footer triangle.
   It is the route on the adventure map, always faintly ahead of them.
2. **Beat captions.** Each sheet opens with its beat in specimen type:
   `02 -- THE STUDIO -- "The lights come on."` These ARE the story points; three or four
   words each, never a paragraph (the placard rule holds).
3. **NEXT cues.** Each sheet's title block carries the next beat's name in text-lo:
   `NEXT -- THE DRAFTING TABLE`. Quiet, consistent place, reads as a drawing's
   continuation note ("continued on sheet 4").
4. **The Index nav becomes the MAP.** The overlay lists the eight beats (not just
   categories): number, beat name, one-word status of where you are. Jumping is allowed
   -- an adventure map, not a corridor.
5. **The preloader is the story's first line.** The S0 curtain becomes: a dark frame, one
   line drawn to measure, the words "ONE PIECE, DRAWN FOR YOU." then the window fades in.
   Two seconds, skippable, sets the second-person voice before the first pixel of UI.

Copy implication: `copy.ts` gains a `story` object (beat names, captions, NEXT strings)
and the sheets render from it, so the plot is one editable list.

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
   `SHEET 03 · THE DRAFTING TABLE · 03/08 · NEXT: THE RANGE` -- the sheet number, the
   story beat, and the pull to the next one (SS0.5) in a single drawn block.
2. **Dimension lines** around 3D stages: `|◄────── 2286 MM ──────►|` — values computed
   from the model's real bounding box at load (stage-state already measures it). When the
   Meshy scans of Heaven's real pieces land, the numbers update themselves.
3. **Crop marks** (⌐ ¬ L ⌐) at panel corners on stage sheets — 45°/90° strokes only.
4. **Sheet edge ticks**: tiny ruler ticks along the left margin of stage sheets, every 8u.
   (Subtle. If it ever competes with content, it goes.)

Budget: **max 3 annotation kinds visible per viewport** — restraint is the luxury.

### 2.8 THE PALETTE — monochrome, lit by neon (REPLACES every earlier colour rule)

The page itself owns NO hue. All warmth and colour on screen comes from the furniture —
the photographs and the 3D pieces — which is exactly the right hierarchy for a furniture
studio: the product is the only colourful thing in the room.

```
GROUND     --ink        #070809      near-black page ground
           --ink-2      #101214      raised dark panel
           --paper      #F2F3F4      near-white ground (NEUTRAL: the old warm ivory
                                     #F4F0E8 was a colour cast, and it goes)
LINES      --line       white @ 12% on ink - black @ 14% on paper (1px hairlines)
TEXT       --text-hi    #F5F6F7 on ink - #0B0C0D on paper
           --text-lo    the same at 62% opacity (existing WCAG floors re-checked)
NEON       --glow       white @ 4-8%, huge-radius shadows and radial pools
           --filament   white @ 55% for 1px lit lines (the plot line, dimension
                        lines, the plotter sweep) with a soft white bloom shadow
```

- **DEAD: every gold/brass token, the per-section accent scrub, the per-piece accent.**
  `--accent` collapses to white; its consumers (CTA border, index numerals, tri glyphs,
  focus ring, swatch ring) all become white-on-ink / black-on-paper.
- "Neon" here means LIGHT, not colour: glow is white with at most an imperceptible cool
  cast (<= 6% saturation) where pure white bloom would grey out; that cast reads as
  temperature, never as a hue.
- **The three exceptions, exactly:** (1) the logo — the wordmark's triangle keeps its
  brand colour, untouched; (2) photographs; (3) the 3D pieces and the fabric swatch
  chips, because the chips ARE material samples. Nothing else on the page may carry hue.
- The statement's `grad-word` ("Crafted") is no longer a gold gradient: it is **the one
  lit word** — white core with a soft neon bloom (text-shadow), a neon sign in a dark
  studio window.
- The golden thread motif is renamed and re-lit: **the plot line** — the same continuous
  1px filament travelling the page, now white, drawn like the pen-line of a plotter.

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
  pin (3 pieces, the caption changes with each), defocused real-photo backdrop,
  idle+interaction mount. The old per-piece ACCENT change is dead (SS2.8): what changes
  with the piece is the piece.
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

### 5.5 THE IMAGE SYSTEM — "THE PLOTTER PRINT" (hooky, dynamic, on-concept)

The page is a technical drawing, so **images do not fade in — they PRINT.** And because
the page is monochrome while the furniture is not, the print has a second act that
Saadman asked for in exactly these words: **on scroll, black and white becomes colour.**
One signature entrance used everywhere (a signature repeated is a style; five different
effects is a template), plus small per-sheet variations:

1. **The print reveal** (every photograph, on scroll-in, once):
   grayscale sheet -> a 1px white filament sweeps down the panel (the plotter head, with
   a soft bloom) revealing the image -> then colour blooms in from grayscale.
   Implementation: `clip-path: inset()` + `filter: grayscale(1) -> none`, both driven by
   a ScrollTrigger class toggle with CSS transitions doing the easing; the filament is
   one absolutely positioned child div. No per-frame JS on any image.
2. **Living at rest:** inside its panel every photo runs a barely-there Ken Burns
   (scale 1.0 -> 1.06 across the sheet's scroll life, translate at 0.9x) so no image is
   ever a dead rectangle. Transform-only, scrubbed.
3. **Hover (pointer devices):** colour deepens (saturate 1 -> 1.08), scale +0.02, and
   the panel's crop marks light up filament-white. 300ms, expo.out.
4. **Per-sheet variations of MOTION (never of colour):**
   - Sheet 02 studio photo: prints top-to-bottom as the paper ground arrives — the
     "lights on" beat of the whole page.
   - Sheet 04 cards: each card prints as it enters the rail; mobile stagger 80ms.
   - Sheet 05 showroom: the aperture reveal STAYS, and the print sweep runs inside it —
     the doorway opens, the room prints, then colours.
   - Sheet 07 MD portrait (when delivered): stays grayscale duotone AT REST beside his
     words; colour arrives only on hover/tap — the one deliberately monochrome image.
5. **Reduced motion / no-JS:** full-colour static images, no sweep, no Ken Burns — the
   finished page, as always.

---

### 5.6 THE FOCUS LIGHT -- "THE LOADSHEDDING CUT" (Saadman's concept)

The most Chattogram-true lighting effect there is: the current goes, the room sits grey,
and then the light COMES BACK -- first a pool around the bulb, then the whole room. Every
visitor Heaven's ads reach knows that exact moment in their body. We stage it, and we
stage it mathematically.

**The geometry.** Each participating panel declares one FOCUS POINT on the grid -- not an
arbitrary spot: the intersection of a column line and a baseline multiple (default: the
panel's centre column at 1/3 height, the same rule-of-thirds anchor the 3D horizon uses).
From that point a circle of radius R divides the panel into its two zones:

```
      inside r < R:   FULL COLOUR, brightness 1.06, the lit zone
      feather band:   R -> 1.18R, colour and light fall off smoothly
      outside:        grayscale(1) brightness(0.68), the loadshedding zone

      R is scrubbed by scroll:  R = R0 + (R1 - R0) x progress
      R0 = 12% of the panel diagonal (a bulb's pool) -> R1 = 120% (fully lit)
```

**The flicker.** The moment R starts growing, the lit zone flickers once -- two 60ms dips
(colour layer opacity 1 -> .35 -> 1 -> .55 -> 1), exactly like a fluorescent tube
catching. One-shot, never repeated, killed under reduced motion. The flicker is what makes
people FEEL the loadshedding rather than read a gradient.

**Implementation.** Two stacked copies of the same image (one network fetch; the browser
caches the file): base layer grayscale + dim, colour layer on top clipped by
`clip-path: circle(var(--focus-r) at var(--focus-x) var(--focus-y))` -- clip-path circles
interpolate natively and stay compositor-friendly; the scrub writes ONE custom property.
A soft white bloom (the filament glow, SS2.8) rides the circle's edge during the reveal,
so the light has a rim like a real bulb's.

**Where it plays (and where it must not).** Two signature moves must never fight, so the
page splits them:

| Sheets | Effect |
|---|---|
| Sheet 02 studio photo + Sheet 05 showroom | **LOADSHEDDING CUT** -- the two room-scale photographs, the two "lights come on" beats. Sheet 05 keeps its aperture doorway; the cut plays inside it. |
| Sheet 04 cards, Sheet 06 AR poster, Sheet 07 portrait | **PLOTTER PRINT** (SS5.5) -- object-scale images print, then colour. |
| Sheet 01 hero backdrop | Neither: it stays the defocused room; its light already belongs to the 3D piece. |

**Reduced motion / no-JS:** fully lit, full colour, no flicker -- the finished room.

### 5.7 THE FLOODLIGHT -- one beam, one law (black-and-white light and shadow)

**THE ONE LIGHT LAW.** Every sheet has exactly ONE light source, always from the
top-left at 45 degrees. Every glow, beam, pool and shadow on the page obeys it: glows
bloom toward bottom-right, shadows fall bottom-right, beams enter from top-left. One
consistent light direction is what makes a monochrome page read as a LIT SPACE instead
of a collection of effects. (45 degrees is already the page's only allowed angle.)

**The beam.** A soft-edged shaft of white light (the floodlight) that lives on dark
sheets:

```
   what   a 45-degree band of white, 6% -> 0 alpha across its width,
          feathered by a mask, mix-blend-mode: screen over the sheet
   moves  GSAP scrub: the beam PANS across the sheet as it crosses the
          viewport (transform only -- translate/rotate, compositor-cheap)
   size   beam width = 2 columns exactly (the grid holds even the light)
```

**THE LIGHT SCRIPT -- the beam changes BEHAVIOUR on scroll, never DIRECTION.**
(Saadman asked whether the floodlight should come from left/right/top/bottom per
section. Decision: no -- swapping the source direction per sheet breaks the One Light
Law and reads as a gimmick. What varies per sheet is the beam's motion, speed and
presence along the SAME 45-degree axis, plus a "switchover" at sheet boundaries, which
delivers the scroll-driven life he wants while the page keeps feeling like one lit
space.)

| Sheet | Beam behaviour (one beam max, same 45 axis always) |
|---|---|
| 01 THE WINDOW | Pans slowly left -> right with scroll, following the turntable; in 3D the key light dips 250ms and snaps back at every piece swap (a floodlight being switched). SplitText chars brighten 0.72 -> 1 with a 40ms stagger as the beam crosses the headline once at load. |
| SWITCHOVER (every entry into a dark sheet) | The sheet's light arrives 120ms AFTER the sheet does: beam+glow opacity dips to .4 and snaps to 1, one-shot -- a breaker being flipped room to room. Scroll-triggered toggle, never scrubbed (a scrubbed flicker judders). |
| 02 THE STUDIO | NO beam: the loadshedding cut owns light on this sheet. |
| 03 THE DRAFTING TABLE | Pans right -> left (reverse travel, same axis) scrubbed by the pin's progress; blueprint edge brightness glints as the beam's x crosses the stage. |
| 04 THE RANGE | Paper sheet: no beam; the 135-degree long shadows carry the light story. |
| 05 THE SHOWROOM | After the cut completes, one slow watchman's pass, then still. |
| 07 THE MAKER | Static shaft, never pans: the quote sits inside it; the portrait stands half in light, half in shadow along the 45. |

**Shadows (the other half of black-and-white).** Panels on dark sheets cast one long
soft shadow at 135 degrees (bottom-right), 24u long, 8% black on paper / deeper ink on
ink; the 3D contact shadows already obey the same direction via the key light position.
No ambient drop-shadows anywhere else -- if it has a shadow, the One Light made it.

**Reduced motion:** the beam exists but never pans; the statement is simply lit.

---

## 6. INTEGRATION PLAN (file by file, in order)

| # | File | Change |
|---|---|---|
| 1 | `globals.css` | New token block: `--u, --cols, --gutter, --margin, --col, --content-max`; **the SS2.8 monochrome purge** (gold/brass tokens deleted, `--accent` collapsed to white, neutral paper, glow/filament tokens); type roles re-snapped (§2.6); panel classes `.panel-land/.panel-port/.panel-sq` (aspect-ratio, radius 0, hairline); structural grid derived from the SAME tokens (§2.5); remove 34px decorative grid tokens. |
| 2 | `sections.module.css` | Every section becomes `display:grid; grid-template-columns: repeat(6, 1fr)` (3 on mobile) with explicit `grid-column` spans from §4. Delete per-section ad-hoc widths. |
| 3 | NEW `ui/SheetBlock.tsx` | The title block AND the wayfinding (SS0.5): sheet no, beat name, `NEXT:` cue, all read from `copy.ts story`. Server component, rendered by every section. |
| 3b | `content/copy.ts` | New `story` object: eight beats (name, caption, next). Beat captions rendered at each sheet's head; the Index nav overlay re-labelled as the map of beats. |
| 4 | NEW `ui/DimensionLine.tsx` | Client island: horizontal/vertical drawn dimension with ticks; subscribes to stage-state's measured size for 3D stages; static values allowed for photos. |
| 4b | `ui/Photo.tsx` + `PageMotion.tsx` | **The plotter print** (SS5.5): Photo renders the filament child + a data-print hook; PageMotion owns the one reusable reveal (class toggle, CSS eases) and the Ken Burns scrub. |
| 4c | NEW `ui/FocusLight.tsx` + `PageMotion.tsx` | **The loadshedding cut** (SS5.6): dual-layer image with a clip-path circle at a grid-anchored focus point; scroll scrubs `--focus-r`; one-shot flicker on first reveal. Sheets 02 and 05 only. |
| 4d | NEW `ui/FloodBeam.tsx` + `StageCanvas.tsx` | **The floodlight** (SS5.7): the 2-column 45-degree beam (screen-blend div, transform-only pan) on sheets 01/03/05/07; 3D key light gets visible falloff + swap-dip; all shadows re-aimed to the One Light Law (135 degrees). |
| 5 | `Hero.tsx` + `Turntable.tsx` | Re-lay on the grid per Sheet 01; stage becomes `.panel-land`; dimension line + crop marks mounted on L5. |
| 6 | `Bespoke.tsx` | Steps to [1–2], stage `.panel-land` [3–6]; dimension text OUT of the panel (bug fix); mobile pinned order per §4. |
| 7 | `Brand.tsx`, `Collections.tsx`, `Showroom.tsx`, `Ar.tsx`, `Proof.tsx`, `Footer.tsx` | Per §4 maps. Collections cards → strict 2-col A-PORT; Proof timeline → dimension-line form. |
| 8 | `PageMotion.tsx` | Selectors follow markup changes; **accent scrub deleted** (SS2.8); the thread re-lit as the white plot line; choreography otherwise unchanged (pins, swaps, dims, marquee). Statement SplitText sizes re-checked at 88/88. |
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
- [ ] **Monochrome audit:** a script walks every rendered element's computed color /
      border-color / background and FAILS on any saturated value outside a photo, the 3D
      canvas, a swatch chip or the logo triangle (SS2.8's three exceptions).
- [ ] Real-phone pass by Saadman (the headless raster artifact makes his eyes the only
      trustworthy check for the pinned sheets).
