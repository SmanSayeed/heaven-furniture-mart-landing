# PLAN.md — "The Studio"
## Heaven Furniture Mart × Racdox Hackathon 2026 — creative direction + implementation

> **Precedence.** `CLAUDE.md` = rules, tone and mentoring curriculum. **This file = the design
> and implementation authority.** Where they conflict, `CLAUDE.md`'s *rules* win and this file's
> *design decisions* win.
>
> Read both at session start. Update `PROGRESS.md` at the end of every session.
>
> Two constraints shape everything below: **Saadman has no Blender and no After Effects**, and
> **he is learning Three.js and GSAP from zero while building this.** Every step is browser or
> CLI only, and every technique gets a lab before it gets shipped.

_Merged 2026-09-01 from the original build plan and the creative plan. Supersedes both._

---

# PART 0 — DECISIONS LOCKED

## 0.1 Stack — what changed from `CLAUDE.md` §4 and why

| Topic | `CLAUDE.md` §4 said | **We are doing** | Why |
|---|---|---|---|
| Build tool | Vite + vanilla TS | **Next.js 16.3.4 (App Router, Turbopack)** | Saadman ships Next/React daily. Learning Three.js *and* vanilla-DOM patterns at once doubles the difficulty for no gain. Next also gives `next/image`, `next/font`, route-level code splitting and one-click Vercel deploy. |
| 3D API | raw `three/webgpu` | **`@react-three/fiber` 9.7 + `@react-three/drei` 10.7** (rendering Three.js 0.185) | R3F is React for Three.js — nothing is hidden. `<mesh>` is a component, `useFrame` is a rAF hook, `<Canvas>` is a provider. |
| Renderer | WebGPU | **WebGL2** (R3F default) | R3F 9's WebGPU path is opt-in and fights `drei` helpers. **It also de-risks the single biggest technical unknown in this plan:** clipping planes (§4.4) are mature and well-documented on WebGL2, whereas on WebGPU node materials they were an open question. Universal support, no visible cost for one sofa. |
| Motion | GSAP + Lenis | **GSAP 3.15 + `@gsap/react` 2.1.2 + `lenis` 1.3.26** — unchanged | `ScrollTrigger` `scrub` is the only sane way to drive a 3D timeline from scroll. |
| Framer Motion | — | **Not installed** | Two motion libraries is wasted KB. Saadman's Framer Motion model transfers to GSAP directly. |
| Styling | plain CSS | **CSS Modules + a global token file** | Tailwind pushes toward default type and spacing scales — exactly the "generic template" look the brief penalises. Hand-set type is what reads as luxury. |
| Backend | — | **None.** Fully static. | The single CTA is a `wa.me` link. No form, no DB, no API. Static = fast = Lighthouse points. |
| Blender | needed to split the sofa | **Not needed — the design does not require splitting** (§2 S3, §3.2) | See the correction below. |
| After Effects | never needed | Not needed | All motion is code. Recording is OBS / Windows Game Bar; editing in CapCut or DaVinci. |

## 0.2 Correction on the record — Meshy Auto Split

An earlier draft of this plan claimed Meshy's **Auto Split** could cut the sofa into textured
parts for the explode animation. **It cannot.** Verified against Meshy's own documentation
(2026-09-01):

- Works **only on Standard, untextured (draft) models** from Meshy 6/7 — textured support is
  "planned but not available today".
- **Textures are not preserved.** Meshy's FAQ: *"Split parts are currently exported without
  colour information."*
- Output is aimed at slicers (STL, Bambu Studio / OrcaSlicer). Not a web GLB workflow.
- Costs 10 credits per run; dense or abstract geometry splits poorly.

**Consequence:** the bespoke section is redesigned so it never needs a split mesh (§2 S3).
Part splitting drops to an optional Day-8 flourish (§3.4). Blender is still not required.

Sources: [Meshy help — how Auto Split works](https://help.meshy.ai/en/articles/15898622-how-does-auto-split-work-in-meshy) ·
[Meshy docs — Auto Split](https://docs.meshy.ai/en/webapp/guides/3d-model/auto-split)

## 0.3 Verified versions (checked on npm, 2026-09-01)

```
next                 16.3.4      App Router, Turbopack
react / react-dom    19.2.8      R3F 9.7 peer range is >=19 <19.3 — satisfied
typescript           5.x         eslint 9.x (note: `next lint` was REMOVED in Next 16 —
                                 run `npx eslint src` directly)

three                0.185.1
@react-three/fiber   9.7.0
@react-three/drei    10.7.8
@types/three         0.185.4

gsap                 3.15.0      ScrollTrigger + SplitText, all plugins free
@gsap/react          2.1.2       useGSAP() — auto cleanup, StrictMode-safe, scoped
lenis                1.3.26      use the `lenis/react` <ReactLenis> export

--- already installed for later labs ---
@sparkjsdev/spark    2.1.0       Lab 10 (splat) — STRETCH
@gltf-transform/cli  4.5.0       Lab 08, dev dependency

--- deliberately NOT installed via npm ---
@google/model-viewer             4.3.1 peers on three ^0.183 and conflicts with our 0.185.
                                 Decision: use its STANDALONE bundle (ships its own three),
                                 self-hosted in /public and lazy-loaded only in the AR
                                 section (Lab 09). No peer conflict, no bundle weight.
```

---

# PART 1 — WINNING THESIS

Judges weigh **"does it feel like luxury, not a shop?"** above everything else. Most entries
will be a template with a gold gradient. We win on **three axes at once**:

1. **Taste** — a monochrome editorial page (black / ivory / one moving accent), one hero object,
   almost no words. Restraint reads as expensive.
2. **Story** — the page *demonstrates* bespoke instead of claiming it: the sofa is
   **designed → crafted → customized** in front of the visitor as they scroll, then they pick a
   fabric and that choice lands inside a WhatsApp message.
3. **Reality** — their real sofa, their real showroom, their real quote, their real timeline.
   Real beats stock every time.

Everything else (AR, splat, dynamic accent) is a bonus layer with a fallback. **If every bonus
layer fails, the page is still a beautiful, fast editorial landing page that converts.** That is
the safety net, and it is why the static skeleton ships before any 3D.

**One-liner for the recording:** *"Other sites show furniture. This one builds it around you."*

---

# PART 1.5 — DESIGN LANGUAGE: "MIDNIGHT STUDIO" (locked 2026-09-01, per Saadman's direction)

Saadman asked for: black/white + neon light effects + glossy/glassy + artistic premium creative-studio
with a few colour moments. Researched Awwwards-grade references (screenshots taken 2026-09-01);
the direction below is the synthesis — **light as material, not decoration**. It deliberately
refines "neon" into warm glow so the page stays luxury-first (the #1 judging criterion).

## The three reference archetypes and what we take from each

| Reference | What it proves | What we borrow |
|---|---|---|
| **Æbele Interiors** (aebeleinteriors.com) — luxury interior, Awwwards | Ivory + giant brass serif overlapping real photography = instant luxury | Our ivory sections (S2/S4/S6): oversized serif that overlaps photos, brass on ivory |
| **Igloo Inc** (igloo.inc) — Awwwards SOTY-tier | A monochrome object **glowing from within** + engineering dimension lines feels premium, not gimmicky | S3 blueprint state: sofa edges glowing brass from inside, glowing measurement lines; hero light pools |
| **Lusion** (lusion.co) — creative studio | Dark glossy 3D stage framed by a light page + ONE electric accent colour | Glossy PBR materials (sheen/clearcoat), dark canvas "stage" framed in ivory, one saturated accent moment |

## v3 REVISION — "MONOLITH" (2026-09-01 evening, per Saadman, SUPERSEDES the palette/type below)

Saadman's verdict on v2: the Fraunces/Archivo warm-brass treatment read "old model", not premium.
New direction, his words: black and white, neon light, glass, glow, gloom, a neon grid, premium
Apple-grade type, brand colour only in a few places, and the logo as a solid colour block.

**Stated risk, accepted and mitigated.** The client brief asks for "an elegant serif for headlines"
and a warm ivory/brass palette. Monochrome + neon-grid moves away from both. Saadman has asked for
this direction twice; proceeding. Mitigations: the serif survives as the MD quote's voice (so the
brief's serif intent still appears), brand gold remains the accent, and the grid stays at low
opacity so the page reads as a lit gallery rather than a tech dashboard.

### Type (all Google Fonts, self-hosted via next/font)
Apple's own face is **SF Pro Display**, which is licensed to Apple platforms and cannot be used on
the web. Closest legal relative, and the correct pick for this look:

| Slot | Font | Setting |
|---|---|---|
| Display / statements | **Inter Tight** | 600, `letter-spacing: -0.035em`, `line-height: 0.95`, huge |
| UI / body / buttons | **Inter** | 400 and 600, `-0.011em` |
| Specimen / data | **Geist Mono** | 400, uppercase, `+0.16em` |
| The one serif | **Fraunces** italic | MD quote only, so the brief's serif intent survives |

The premium comes from the *setting*, not from an exotic face: enormous display sizes, negative
tracking, tight leading, and a single gradient word. That is exactly what Apple does.

### Palette (monochrome, brand colour rationed)
```
--ink        #070809   near black, the page ground
--ink-2      #0E1113   raised panels / glass base
--paper      #F2F3F4   cool white for light sections (no more warm ivory)
--paper-2    #E6E8E9
--graphite   #17191C   grid lines, hairline borders
--text-dim   rgba(242,243,244,.62)
--brand      #0C1312   the logo's own ground, used ONLY as the logo block
--gold       #C8A96A   THE accent. Rationed: max 3 uses per viewport
--marigold   #F0A62B   logo gold, micro doses only (triangle, hairline tips, glow cores)
--glow-cool  rgba(214,232,255,.55)   the "neon" white light
```
Rule: a viewport is **black, white, and one gold thing**. Colour arrives only from the real
furniture photography and from the S3 fabric swatches.

### The neon grid
A fixed, full-page 1px grid (`repeating-linear-gradient`, 72px cells) at ~3% opacity on dark
sections, radially masked so it fades at the edges and never tiles visibly. It is the same visual
language as the S3 blueprint, which makes the bespoke sequence feel inevitable rather than bolted
on. Light sections get the inverted version at ~4%. Zero images, zero JS, negligible cost.

### Glass and glow
- **Glass:** frosted panels (`backdrop-filter: blur(14px)`, 1px `--graphite` border, inner
  top highlight `inset 0 1px 0 rgba(255,255,255,.06)`) for the nav pill, index overlay, vitrine,
  swatch dock, sticky CTA. Max 3 glass surfaces per viewport.
- **Glow:** never a coloured haze over everything. Two only: a cool white pool where light falls
  (hero vitrine, stage), and a gold halo on the CTA hover and the thread's tip.

### The logo block
Per Saadman: the wordmark sits inside a solid `--brand` block (the logo's own dark teal), padded,
slightly rounded. One saturated rectangle in an otherwise monochrome page reads as a real
identity mark rather than styled text.

---

## Brand alignment (2026-09-01, from their real logo + product albums) — palette superseded by v3 above

Their logo: white wordmark, a MARIGOLD-GOLD triangle "A", on a **deep charcoal-teal** ground.
Their bestselling product look (all over their albums): **royal blue velvet** with champagne and
silver-gold frames, plus cream/ivory sets and some emerald velvet. Adjustments:

1. **"Heaven Ink"** replaces pure black: the page dark is `#0C1312`, a near-black with the
   logo's teal undertone. Reads black, feels theirs. Ivory `#F4F0E8` unchanged.
2. **Two golds, two jobs.** Logo marigold `#F0A62B` appears ONLY in micro doses (the logo, the
   triangle motif, one hairline). Muted brass `#C8A96A` stays the working accent for larger
   surfaces. Big areas muted, tiny pops bright: that split is what keeps it premium.
3. **The triangle motif.** The gold "A" caret from the logo becomes the page's recurring mark:
   preloader glyph (triangle fills with gold), scroll-down indicator in the hero, list markers
   on specimen chips, the map pin. Brand DNA without pasting the logo everywhere.
4. **Royal blue is the electric moment.** The S3 swatches become fabrics they demonstrably
   sell: `Ivory Bouclé` (default, matches the hero sofa), `Royal Blue Velvet` (their signature,
   THE saturated glow moment), `Emerald Velvet` (seen across their green sofa range).
   The old walnut/teal swatch set is retired as off-brand.

## The rules of Midnight Studio

1. **Base stays black + ivory.** Neon never becomes the base; it is applied light ON the base.
2. **"Neon" = glow, two temperatures.** Warm brass glow (default: hero spotlight pools, blueprint
   edges, CTA hover halo) + ONE cool electric moment: tapping **Deep Teal Velvet** makes the page
   glow teal — the customization IS the colour moment. No rainbow, max one saturated hue on screen.
3. **"Glassy" = frosted panels, used sparingly.** `backdrop-filter: blur` panels (nav chip, swatch
   dock, sticky CTA pill) with 1px light borders — only ever ON TOP of the 3D/photo layers, never
   as decoration on empty background. This consciously overrides the earlier "no glassmorphism"
   rule at Saadman's request — controlled, ≤ 3 elements per viewport.
4. **"Glossy" lives in the 3D materials**, not in CSS: clearcoat/sheen on fabric and lacquer,
   glossy dark floor reflection under the sofa. CSS gloss is limited to subtle specular gradients
   on buttons.
5. Everything else from the brief holds: huge whitespace, ≤ 3 lines of copy, real photography,
   one CTA. Restraint is still the luxury signal — glow is the seasoning, not the dish.
6. Performance guard: glow = pre-blurred radial gradients / box-shadows, `backdrop-filter` capped
   to small panels, **no full-screen blur, no bloom post-processing on mid/low tier**.

---

# PART 1.6 — CONTENT UI/UX: "PLACARDS, NOT PARAGRAPHS" (locked 2026-09-01)

Saadman's rule: no typical big description blocks. Descriptions exist, but presented another
way. Observed pattern across the reference sites (Æbele, Igloo, Lusion): award-level pages carry
almost no paragraphs; text appears as huge display type, tiny technical labels, or one-line
statements. Our system:

## 1. Every piece of text is one of five roles (nothing else exists)

| Role | Looks like | Rules |
|---|---|---|
| **STATEMENT** | Huge display serif, 1 idea | Max 6 words. The H1 and section openers. |
| **PLACARD** | A museum label: index number + small-caps title + ONE line | Max 14 words per line. This replaces every "description paragraph" on the page. |
| **SPECIMEN** | Mono microtext, uppercase, letterspaced | Data fragments: `EST. 2020` · `AGRABAD, CTG` · `2400 MM` · `05 COLLECTIONS`. Descriptions become data. |
| **TICKER** | A slow marquee strip | Only one on the page: `DESIGNED · CRAFTED · CUSTOMIZED ·` between S2 and S3. |
| **QUOTE** | Large serif italic, line-by-line reveal | The MD quote is the ONLY long text on the page, staged as artwork, not a paragraph. |

Concretely: the S2 brand intro is NOT a paragraph any more. It becomes a placard cluster:
index `01` + small-caps `BESPOKE FURNITURE STUDIO` + one line `Built to your space, your size,
your taste.` + specimen row `EST. 2020 · AGRABAD, CHATTOGRAM · HUNDREDS OF HOMES`.
Trust points render as seven short specimen chips, not a bulleted list.

## 2. Type system (all free, all self-hosted via next/font, no typical choices)

| Slot | Font (Google Fonts, free) | Why premium |
|---|---|---|
| Display serif | **Fraunces** (variable, optical sizing, soft warm serifs) | Editorial warmth that suits wood and fabric; distinctive, not the overused Playfair/Inter look |
| UI sans | **Archivo** (narrow grotesque) | Quiet, precise; disappears behind the serif |
| Specimen mono | **IBM Plex Mono** | The technical/engineering voice for measurements and data chips (the Igloo move) |

Hierarchy is scale-driven: display goes to `clamp(2.75rem, 12vw, 8rem)`; placard lines stay
0.9375rem; specimen 0.6875rem uppercase +0.18em tracking. Contrast in size, never in decoration.

## 3. Icons
Minimal 1.5px-stroke line icons, **Phosphor (MIT, free) light weight**, copied as inline SVG for
only the glyphs we need (WhatsApp, arrow, plus, map pin, FB/IG/YT). No icon font, no npm package,
monochrome only, currentColor so they inherit the accent.

## 4. Punctuation rule (hard)
**No em or en dashes anywhere in user-facing copy, titles or labels.** Use a period, comma, or
the middot `·` separator instead. (Middots and ampersands are allowed.) `copy.ts` is the single
place to enforce it.

---

# PART 1.8 — THE HUMAN LAYER: "THE ATELIER MARKS" (locked 2026-09-01)

Saadman's requirement: the page must carry work a human visibly did by hand, something AI cannot
easily fake. The answer is literal: **his own hand.** Bespoke furniture is hand-made; the page
about it carries hand-made marks. This is also the strongest possible differentiator in an
AI-allowed hackathon: every other entry will be 100% machine output.

## What Saadman physically makes (pen on white paper, ~30 minutes)

| Artifact | What he draws / writes | Where it lands |
|---|---|---|
| Sofa sketch | Rough pen outline of the hero sofa, traced loosely from the photo. Imperfect lines wanted. | S3 "Designed" phase: the sketch draws itself before the blueprint glow |
| Measurement scribbles | Arrows + rough "2400", "430" figures, like a carpenter's margin notes | S3 dimension layer, alongside the clean mono specimens |
| 6 short handwritten phrases | `your size` · `solid wood` · `hand stitched` · `for your home` · `আপনার জন্য` · a squiggly underline | Margin annotations: one per key section, slightly rotated (0.6–1.6°) |
| The Bangla word | `আপনার জন্য` ("for you") in his handwriting | Next to the S3 CTA. Local, warm, unfakeable; judges are Bangladeshi |
| Initial mark | A small squiggle/underline stroke | Under the hero's gradient word "Crafted" |

Capture: photograph each on plain paper in daylight → `assets-raw/handmade/`. Gemini removes
the paper background (transparent PNG, strokes only). Claude animates each with a CSS
mask-wipe reveal (reads as being drawn live); tiny rotations and off-grid placement are
deliberate. On ivory sections the strokes render in deep brown ink, on dark sections in brass.

## Ask the client (WhatsApp group)
The MD's real signature (photo of it on paper) to sit under his quote in S7. If it never
arrives, the quote stands without it; never fake a signature.

## Code-side humanity (Claude)
- Slight irregular rotations on annotation marks and taped photo corners; nothing perfectly
  aligned in the atelier layer (the grid stays clean; only the marks are loose).
- Subtle paper-fiber texture on ivory sections (distinct from the dark sections' film grain).
- The rule that keeps it premium: **marks are seasoning.** Max one handwritten mark per
  viewport; they annotate real content, never decorate empty space.

---

# PART 1.7 — BUSINESS LAYER (locked 2026-09-01)

## What Heaven actually sells (from their real Facebook content, 2026-09-01)
Their product is **royal / palace-style classic luxury**: carved wood, gold-leaf frames, velvet
and bouclé, premium king beds, king dining sets, full golden-room ensembles. NOT minimal
Scandinavian. This is a feature for us: ornate gold pieces photographed against our near-black
editorial stage look like museum artifacts. The monochrome page is the frame; their maximal
furniture is the art. Never flatten their identity into minimalism; frame it.

## Category strategy on ONE page (no catalog, no second CTA)
The brief's taxonomy stays the law: Living / Bedroom / Dining / Office & Study / Bespoke.
Every premium range Saadman found maps INTO those five as specimen chips on the S4 cards:

| Card | Signature photo | Specimen chips (their real ranges) |
|---|---|---|
| Living Room | beige or blue royal sofa set | `SOFA SETS · COFFEE TABLES · TV UNITS` |
| Bedroom | royal king bed | `PREMIUM KING BEDS · WARDROBES · DRESSERS` |
| Dining | cream marble dining set | `KING DINING SETS · CHAIRS · CABINETS` |
| Office & Study | black brass cabinet | `EXECUTIVE DESKS · BOOKSHELVES` |
| Bespoke | the most extravagant palace/golden-room shot available | `FULL ROOMS · YOUR SIZE · YOUR TASTE` |

The Bespoke card IS the answer to "they sell so much more": a full golden room proves
"we build anything around you". The catalog lives on their Facebook; this page's job is not to
list products, it is to convert interest into a WhatsApp conversation. One CTA, unchanged.

## The Facebook-marketing funnel (they will run ads INTO this page)
```
FB/IG ad (their existing creatives) → tap → THIS PAGE inside the FB IN-APP BROWSER
  → understands the brand in 5s (poster hero, no JS needed)
  → scrolls the bespoke moment → taps WhatsApp with prefilled context
```
Consequences we build for:
1. **The FB in-app browser is the primary browser.** It is a limited WebView: treat it as
   mid/low tier by default, poster-first hero, WebGL only after capability check. Our fallback
   matrix is not an edge case; for ad traffic it is the MAIN path.
2. **Speed = ad money.** Every 100ms of LCP costs conversions; the static-first architecture is
   a business feature, not just a Lighthouse score.
3. **UTM-ready:** the page must not break with `?utm_*` query params; the WhatsApp prefill can
   append the campaign name later if their team wants attribution. Optional Day 9: a
   `NEXT_PUBLIC_META_PIXEL_ID` env hook (documented in README, disabled by default) so their
   team can plug their pixel without touching code. Zero weight until enabled.
4. **README sells this understanding to the tech team** in a short "Built for your ad funnel"
   paragraph: in-app browser strategy, speed, UTM/pixel readiness, WhatsApp-first conversion.

---

# PART 2 — THE EXPERIENCE, SECTION BY SECTION (mobile-first, 390px)

8 sections, roughly 6–7 viewport heights on mobile. Every section: **one idea, ≤ 3 lines of
copy, one image or one 3D moment.**

### S0 — Preloader (≤ 1.2 s, skippable)
Black screen. The serif wordmark "Heaven" letter-spaces in (SplitText). A thin brass line draws
left→right on real load progress. Covers 3D init and sets the tone. **Never longer than 1.2 s** —
if assets are slow, fade out anyway and let the hero poster carry it.

### S1 — Hero: "Furniture, Crafted Around You."
- **Mobile layout:** eyebrow line, headline top-left, sofa centred filling ~55% of height, one CTA at the bottom.
- **Visual:** the real Heaven sofa GLB on black. Single warm key light + soft rim. Faint floor
  reflection (a dark rough plane + a radial-gradient div — implies reflection without `Reflector` cost).
- **Idle:** 2° yaw sway, key-light intensity breathing. Slow enough to feel like a lit object, not a toy.
- **Desktop only:** pointer parallax ±3°. **No device orientation on mobile** — the permission
  prompt and battery cost are not worth it.
- **Poster:** a pre-rendered WebP of the exact same frame is the `<img>` LCP element; the canvas
  fades over it when ready.
- **Copy:** `Bespoke furniture & interior styling · Chattogram` / `Furniture, Crafted Around You.` / `Designed. Crafted. Customized.`

### S1b — HERO v2: "THE VITRINE" (revised 2026-09-01 evening, per Saadman)

The v1 hero was type on black with a small 3D stage: correct but reserved, and it reads empty
until real photography lands. v2 makes the hero the hook, full-bleed, and gives it a real
photograph so it is never boring even before 3D loads.

**Structure (mobile-first, full viewport):**
1. **Layer 0, the room:** the graded hero sofa photograph, full-bleed, scaled 1.12 and darkened
   by a Heaven-Ink gradient scrim (opaque at the top for text contrast, clearing at the bottom).
   This is the LCP element: `next/image` with `priority` + `blurDataURL`, so the hero is
   photographic within one paint on any device, forever.
2. **Layer 1, the vitrine:** a centred rounded "display case" panel (frosted 1px brass border,
   inner glow) sitting over the photo. The 3D sofa renders INSIDE this panel. The panel makes
   the canvas edges intentional (a museum vitrine, not a floating cutout) and gives the hero a
   focal object even while the model streams in.
3. **Layer 2, type:** eyebrow / statement / italic tagline / one CTA, left aligned, over the
   scrim; the golden thread starts under the statement as it already does.
4. **Layer 3, the AR/VR hook** (see below).

**Hero scroll choreography (Saadman: "must have onscroll animation"):**
- Photo layer parallaxes at 0.82x and its scrim deepens as the hero leaves.
- Vitrine panel lifts 8% and its glow fades; the 3D sofa yaws ~20 degrees and recedes.
- Statement drifts up at 0.6x; the whole hero cross-dissolves into the S2 ivory curtain.
- All scrubbed, all inside the reduced-motion gate.

**The poster / cached-3D rule (Saadman: "fallback image and cached 3d image"):**
Lab 12 renders the settled 3D frame to a WebP (`/img/hero-sofa-poster.webp`) at build time.
That poster lives inside the vitrine from the first paint; the live canvas fades over it only
once loaded, and on low tier or no-WebGL it simply stays. Same code path, so it can never rot.

### S3b — 360 INSPECT MODE (added 2026-09-01, per Saadman)

After the pinned sequence resolves (phase C, sofa fully material, swatches live), the vitrine
becomes **grabbable**: the visitor can drag to orbit the piece a full 360 degrees.

- **Where:** only here, and only after the scroll story has finished. Making the hero draggable
  would fight scrolling on a phone; making it draggable before the story lands would let people
  skip the point of the page.
- **Affordance:** a specimen line fades in under the vitrine, `DRAG TO INSPECT · 360`, plus a
  brief one-time nudge (the piece rotates ~12 degrees and eases back) so the interaction is
  discovered without a tutorial.
- **Implementation:** drei `<OrbitControls>` on the bespoke view, `enableZoom={false}`,
  `enablePan={false}`, `minPolarAngle`/`maxPolarAngle` clamped near seat height so it can never
  be viewed from underneath, `autoRotate` off, damping on. Azimuth is unrestricted (the full 360
  is the feature). Enabled ONLY once `bespokeProgress >= 0.98`, disabled again if the visitor
  scrolls back up, so the scroll timeline and the pointer never fight for the same object.
- **Touch:** the canvas is pointer-inert everywhere except this view while inspect mode is armed,
  and `touch-action` is set so a vertical swipe still scrolls the page while a horizontal drag
  orbits. Never trap the visitor inside the canvas.
- **Fallbacks:** low tier / reduced motion / no WebGL = no inspect mode and no affordance line;
  the static section is unchanged. This is a bonus layer, cut first if it costs stability.

### S1c — THE AR HOOK (top of page, revised per Saadman)

Saadman asked for something "incredible, outstanding, hooky" at the top, AR/VR flavoured.
Decision: **do not move the AR experience into the hero** (a permission prompt or a heavy
`model-viewer` bundle above the fold would wreck both LCP and the ad-funnel path). Instead the
hero carries an **AR invitation** that is pure promise and near zero weight:

- A small frosted pill under the CTA: a live-looking viewfinder glyph (four animated corner
  brackets that breathe, drawn in SVG) + `SEE IT IN YOUR ROOM` + a specimen line
  `AR · POINT YOUR PHONE`.
- On phones it deep-links to S6 (`#ar`) and starts the real AR session there.
- On desktop it scrolls to S6 and reveals the QR code.
- The brackets are the same motif as the S3 measurement marks: one visual language, "we can
  place this in your space", stated in the first viewport without paying for it.

### S1d — NAVIGATION: "THE INDEX" (added 2026-09-01, per Saadman)

There was no navigation at all: correct for a pure one-pager, wrong for a brand that wants
category browsing and Facebook ad traffic that lands mid-funnel. Added, without breaking the
one-CTA rule:

- **Closed state:** the wordmark left, and right a single frosted pill button `INDEX` with a
  two-line glyph. That is the entire chrome. It hides on scroll-down, returns on scroll-up.
- **Open state:** a full-screen ink overlay that is itself a piece of design, not a menu list:
  - Left column: five oversized serif category names (Living Room / Bedroom / Dining /
    Office & Study / Bespoke) with their index numerals, staggered in with masked line rises.
  - Right column (desktop) or behind the type (mobile): **the category's real photograph
    crossfades on hover/focus of each name.** Hovering "Bedroom" swaps in the royal bed. This
    is the "menu with images" and it is the single most premium thing a nav can do.
  - Footer of the overlay: address, phone, socials, and the one WhatsApp CTA.
  - Each name scrolls to that card in S4 and closes the overlay.
- Keyboard: real `<button>`s, focus trap, Escape closes, `aria-expanded`, body scroll locked
  via Lenis `stop()`/`start()` (never by mutating overflow, which would fight Lenis).
- No JS: the overlay markup renders as a plain, visible anchor list in the footer region so the
  category links still work. The chrome is progressive enhancement, never a requirement.

### S2 — Brand line (½ viewport)
Ivory background — the first colour change, "the room lights come on". Two sentences, one
full-bleed real showroom photo with slight CSS parallax.

### S3 — Bespoke: "Designed. Crafted. Customized." — **THE MOMENT** (pinned ~300vh)

The sofa returns, pinned, and moves through three states as the visitor scrolls:

| Progress | State | What the visitor sees | Word |
|---|---|---|---|
| 0.00–0.33 | **Designed** | The sofa as a glowing blueprint: wireframe edge lines on black, thin brass measurement lines and dimension labels ("2400 mm") fading in | `Designed.` |
| 0.33–0.66 | **Crafted** | A horizontal "craft plane" sweeps bottom→top. Below it the sofa is solid wood/fabric PBR; above it still blueprint. Fine sawdust-like particles drift at the plane edge (≤ 300, high tier only) | `Crafted.` |
| 0.66–1.00 | **Customized** | Sofa fully material. Three fabric swatches slide in. Tapping one crossfades the cushion material and shifts the page `--accent` | `Customized.` |

Ends on the CTA, carrying the swatch choice into the WhatsApp text.

> **Why this beats the original explode idea:** it needs **one single mesh**. No splitting, no
> Blender, no dependency on a Meshy feature that does not do what we need. It is also a stronger
> story — an explode says "here are the parts", this says "watch it get made for you".

If a part-split mesh does materialise (§3.4), add a fourth micro-beat: parts drift apart 10% and
settle. **Optional flourish only — never a dependency.**

### S4 — Collections (editorial strip)
Five cards: `Living · Bedroom · Dining · Office & Study · Bespoke`. Real photos (Gemini-cleaned),
one word each, thin serif numeral 01–05.
- **Desktop:** pinned horizontal scroll (GSAP `xPercent` scrub).
- **Mobile:** vertical stack with CSS `animation-timeline: view()` fade-up. **No carousel library.**
- **3D card presence (Saadman's request, 2026-09-01):** each card enters with a perspective
  rotation (CSS `perspective` + `rotateY` ~14° → 0, soft cast shadow deepening as it settles)
  and the photo inside parallaxes at 0.9× with a slow scale from 1.06 → 1. Feels like physical
  panels turning to face you. Pure CSS transforms scrubbed by ScrollTrigger: zero extra weight,
  works in the FB in-app browser. NOT actual per-category GLB models (see v2 list: weight/credit
  cost would break the budget).
- Strip ends with a quiet secondary link, Awwwards-style: `View the full collection` + a bold
  arrow-up-right icon (Phosphor bold), underlined text link → their Facebook page. Styled as a
  text link, never as a button, so the single WhatsApp CTA stays unchallenged.
- Each card's dominant material sets `--accent` while in view.

### S5 — "Step Into Our Showroom" (bonus, lazy)
Full-bleed Gaussian splat of the Agrabad showroom. Drag to look around: **yaw ±60°, pitch ±20°,
no walking** — keeps it from feeling like a game and hides capture edges.
Overlay: address + "Get directions" (Maps link, secondary style).
**Fallback chain:** no capture → self-hosted muted 8 s clip from their YouTube (≤ 2 MB) → still photo.

### S6 — "See It in Your Room" (AR)
Ivory section. `<model-viewer>` of the sofa with a soft shadow; one button, "View in your room".
On desktop the button becomes a **QR code** of the current URL with an `#ar` hash (rendered as
inline SVG — no library over 5 KB).

### S7 — Proof (expanded 2026-09-01: real faces)
The people section. Order, on ink:
1. **The MD moment:** his quote in large serif italic beside his REAL portrait, treated
   editorially: duotone (Heaven Ink shadows, ivory highlights, a whisper of brass rim light),
   inside a tall arch-shaped mask (an arch reads as furniture/doorway, and echoes the carved
   frames they sell). Placard under it: `ABUL KALAM BHUIYAN · FOUNDER · EST. 2020`. If the real
   signature arrives from WhatsApp, it overlaps the portrait's lower corner in brass.
2. **The hands behind Heaven:** the team group photo, full-bleed strip, same duotone grade,
   specimen caption `THE IN-HOUSE TEAM · AGRABAD WORKSHOP`. This turns the "skilled in-house
   craftsmanship" trust point from a claim into a photograph.
3. Milestones timeline 2020 → 2026 (the Golden Thread becomes its rule) + trust specimen chips.

### Racdox (hackathon organizer) placement — decided
A client's landing page should read as a real client page, so Racdox lives primarily in the
**README** (credits + thanks) and the **screen recording** (opening/closing caption with
#racdox_hackathon). On the page itself: ONE quiet specimen line in the footer bottom row,
`BUILT FOR THE RACDOX HACKATHON 2026 · #RACDOX_HACKATHON` linking to racdox.com/hackathon.
Tasteful credit, zero competition with the client's story.

### S8 — Footer / final CTA
`Ready to design around you?` + CTA. Address, `tel:` link, email, monochrome social icons.
Attribution line: *"3D model generated with Meshy AI from Heaven Furniture Mart photography."*
Sticky mobile WhatsApp pill (brass on black) appears after S1 and **hides while S3 is pinned**.

---

# PART 2.5 — SCROLL CHOREOGRAPHY (locked 2026-09-01)

Saadman asked for creative scroll behaviour — "glued" screens, movement in more than one
direction. The choreography below gives every transition a distinct move while keeping ONE
signature thread: **the sofa never leaves.** A single fixed canvas persists from S1 to S3, so as
the visitor scrolls, the same sofa travels, turns and transforms — the page feels like one
continuous camera move through a studio, not a stack of slides.

| Beat | Move | Direction / mechanic |
|---|---|---|
| S0 → S1 | Preloader brass line completes → wordmark letters release upward, sofa fades in under the spotlight | vertical, SplitText masked lines |
| S1 hero scroll-out | Headline drifts up at 0.6× scroll speed (parallax); sofa yaws ~20° and recedes slightly — it *stays on stage* | scrub |
| S1 → S2 | **Ivory curtain**: the S2 ivory panel slides up OVER the dark stage ("the room lights come on") | vertical overlap, `clip-path` inset scrub |
| S2 | Showroom photo parallax at 0.85×; the oversized serif word slides horizontally 10vw across it (Æbele move) | horizontal drift inside vertical scroll |
| S2 → S3 | Curtain reverses — dark swallows the page, the sofa is still there, now centre stage | vertical overlap |
| **S3 bespoke** | **THE GLUE.** Section pins for ~300vh. Scroll drives: blueprint glow-in → craft plane sweeps bottom→top → swatches dock slides in. The three words swap with vertical masked rolls | pinned, scrub: 1 |
| S3 → S4 | Accent colour carries: whatever swatch is active tints the S4 entrance | colour tween |
| **S4 collections** | **Horizontal gallery**: section pins, vertical scroll/finger-drag translates the 5 cards LEFT (deskop 70vw cards, mobile 82vw). Numerals 01–05 count in the corner. Works identically with touch — ScrollTrigger scrub converts vertical gesture to horizontal travel | pinned horizontal |
| S4 → S5 | **Aperture**: the showroom reveals through an expanding rounded mask from centre (walking through a doorway) | `clip-path` scale scrub |
| S5 | Inside the splat/video: slow auto-drift + drag to look. Overlay text pinned to bottom | free look |
| S6 AR | Calm beat on ivory — simple fade-up (`animation-timeline: view()`), deliberate rest after two pinned sections | vertical, CSS-only |
| S7 proof | Quote reveals line-by-line (masked rises); the timeline's vertical rule DRAWS itself as you pass; years tick in | scrub |
| S8 footer | Final CTA breathes a slow brass glow halo; sticky pill morphs into the footer CTA | subtle loop |

## The signature: THE GOLDEN THREAD

One continuous 1px gold line travels the entire page, drawn by scroll. It is the page's soul
and the craft metaphor (upholstery thread, stitching):

```
preloader     the thread IS the progress bar, left to right
S1 hero       it settles as the baseline under the headline
S1 → S3       it runs down the page edge as a scroll spine, drawing as you go
S3 designed   it becomes the glowing measurement lines around the blueprint sofa
S3 crafted    it traces the craft plane's edge during the sweep
S4            it underlines each collection card as the card enters
S7            it becomes the vertical timeline rule, 2020 to 2026
S8            it closes the loop: underlines the final CTA, ends in the gold triangle
```

Implementation: per-section SVG paths with `stroke-dashoffset` scrubbed by ScrollTrigger,
visually continuous across section boundaries. Cheap (no canvas), poetic, and utterly
memorable: judges scroll twice just to watch the line travel. On reduced motion the line is
simply fully drawn, static.

**Rules:** max two pinned sections (S3, S4) — pinning is a spice, not the meal. Every pinned
mechanic has a reduced-motion / low-tier fallback: plain vertical stack, no pin (§4.10). All
scrub values `scrub: 1` for weight; durations inside pins follow the 0.6–1.2 s feel.

---

# PART 3 — ASSET PIPELINE WITHOUT BLENDER

```
 Real Heaven photos (Facebook / Instagram / YouTube frames)
        │
        ▼
 [ Reve — app.reve.com ]                    browser only
   remove clutter → relight → upscale → Remix one grade across all
        │
        ├──► /public/img/*.webp                    Collections, S2 photo
        └──► 4 clean sofa views (front / 45L / 45R / rear)
                    │
                    ▼
          [ Meshy — meshy.ai ]                     browser only
            Image to 3D (multi-view) → Remesh 30–40k → PBR textures
            Export GLB (web) + USDZ (iOS AR)
                    │
                    ▼
          [ npx @gltf-transform/cli ]              terminal only
                    │
                    ▼
            /public/models/sofa.glb   ≤ 1.5 MB
            /public/models/sofa.usdz
```

## 3.1 Photos — Reve
Goal: **12–16 photos that look like one photographer shot them in one afternoon.**
1. Download from Facebook/Instagram at max resolution.
2. Reve **Edit** → Spotlight-select clutter (price tags, cables, people, reflections) → remove. Upscale to 2K–4K.
3. Pick the single best photo as the **grade reference**. Use **Remix** to transfer its grade to every other photo.
4. Produce the 4 sofa views for Meshy. **Reject any view where the sofa's proportions drift** — Meshy will fuse mismatched views into a mess.
5. Export WebP q80 at 480 / 960 / 1600, plus AVIF where cheap.

## 3.1b Image tooling — Reve vs Gemini (Saadman has paid Gemini)

Saadman has a **paid Gemini plan**, which includes **Nano Banana Pro (Gemini 3 Pro Image)** —
multi-reference generation/editing (up to 14 reference images), strong subject consistency,
up to 4K output. That covers the same ground as Reve, sometimes better:

| Task | First choice | Why |
|---|---|---|
| Clutter removal, relight, background | Either — try Gemini first (already paid) | Both do prompt-based edits; Gemini is 4K-capable. |
| One consistent grade across 12–16 photos | Reve Remix, else Gemini with the reference photo attached | Remix is purpose-built for grade transfer. |
| **The 4 sofa views for Meshy** | **Gemini (Nano Banana Pro)** | Multi-reference consistency is exactly this job: feed 2–3 real photos of the sofa, ask for front / 45L / 45R / rear on plain grey. Reject any view where proportions drift. |
| Upscale hero poster to 4K | Gemini | Native high-res output. |

**Hard rules, whichever tool:** the output must still be the *real* Heaven sofa — AI touch-up is
explicitly allowed by the brief, AI *invention* of furniture they don't sell is not. Never
generate a "better" sofa; never fabricate showroom shots. Note every AI-edited image in ASSETS.md.
SynthID watermarking on Gemini output is invisible and fine.

## 3.1c Design mockups — Claude Design (optional, Day 5–6)

Before coding the real sections, the S1–S8 layouts can be drafted as a **Claude Design canvas**
(multi-artboard visual mockup published as an artifact): one 390px artboard per section, using
the real copy from Part 10 and the token palette. Saadman can tweak spacing/type visually, then
the agreed artboards become the CSS-module implementations. Cheap way to lock taste before code.
Optional — skip if Day 5 is tight.

## 3.2 Sofa 3D — Meshy
- **Image to 3D → Multi-view** with the 4 Reve views. Symmetry ON, quad mesh OFF,
  target ≈ 30–40k tris, PBR textures ON.
- Iterate until the silhouette matches the photo. **Reject if arms/legs are fused or the back is hollow.**
- Export **GLB** (base colour, roughness, metallic, normal) and **USDZ** for iOS AR.
- **Do not plan around Auto Split** — see §0.2.

## 3.3 Optimise — gltf-transform (no Blender)
```bash
npx @gltf-transform/cli inspect sofa.glb
npx @gltf-transform/cli resize sofa.glb s1.glb --width 1024 --height 1024
npx @gltf-transform/cli optimize s1.glb sofa.opt.glb \
    --compress draco --texture-compress ktx2 --simplify false
npx @gltf-transform/cli inspect sofa.opt.glb        # target <= 1.5 MB
```
Fabric needs a clean base colour; roughness can be 512, normal 1024.
Keep a separate copy for `<model-viewer>` AR — and remember Quick Look needs the USDZ, exported from Meshy.

## 3.4 Optional part split — STRETCH, Day 8+ only
3D AI Studio's segmentation tool takes a single-mesh GLB and separates it into parts you can
download individually; recombine with named nodes via
`npx @gltf-transform/cli merge frame.glb cushion.glb legs.glb sofa-parts.glb`.
**Only if Day 8 has slack. Nothing in the page depends on it.**

## 3.5 Showroom splat — Luma / Polycam / Scaniverse → Spark
Capture: slow walk, phone at chest height, landscape, 60–90 s, overlap every angle, no fast pans,
lights on, no people. Process → `.ply` or `.spz`, crop to the interior, delete floaters,
target `.spz` ≤ 15 MB.
**Gate: no capture by Day 8 → drop the splat, ship the video.** Zero judging impact.

## 3.6 Hero poster
In Lab 12, screenshot the live canvas (`gl.domElement.toDataURL()`) at 1600×2000 (mobile) and
2400×1350 (desktop) → WebP. **The poster then matches the 3D frame exactly**, which is what makes
the canvas fade-in invisible.

---

# PART 4 — TECHNICAL ARCHITECTURE (Next.js 16 + React Three Fiber)

## 4.1 Repo layout

```
heaven-mart/
├─ public/
│  ├─ img/          hero-poster.webp, collections/*.webp, showroom.webp
│  ├─ models/       sofa.glb, sofa.ar.glb, sofa.usdz
│  ├─ splats/       showroom.spz                     (stretch)
│  └─ video/        showroom-fallback.webm
└─ src/
   ├─ app/
   │  ├─ layout.tsx          next/font, metadata, <SmoothScroll> (ReactLenis root)
   │  ├─ page.tsx            SERVER COMPONENT — every section, all copy, all SEO
   │  ├─ globals.css         tokens: --ink --ivory --accent, type scale, reduced-motion
   │  └─ labs/               throwaway learning routes, noindex, deleted before submission
   ├─ components/
   │  ├─ sections/           Hero Brand Bespoke Collections Showroom Ar Proof Footer (.tsx + .module.css)
   │  ├─ three/
   │  │  ├─ SceneLoader.tsx  'use client' + dynamic(..., { ssr:false }) + poster fallback
   │  │  ├─ StageCanvas.tsx  the ONE <Canvas>, position: fixed, drei <View> targets
   │  │  ├─ Sofa.tsx         useGLTF + material registry + swatch state
   │  │  ├─ Blueprint.tsx    EdgesGeometry + LineSegments brass wireframe
   │  │  ├─ CraftPlane.tsx   clipping-plane sweep + edge particles
   │  │  └─ HeroIdle.tsx     sway + light breathing
   │  └─ ui/                 Preloader CtaWhatsApp Swatches StickyCta Cursor QrCode
   ├─ content/
   │  └─ copy.ts             EVERY string on the page, in one file (see Part 10)
   └─ lib/
      ├─ whatsapp.ts         builds the wa.me URL + prefilled text from the swatch choice
      ├─ device.ts           tier detection, reduced-motion, WebGL2 capability check
      └─ useAccent.ts        ScrollTrigger-driven --accent scrubbing
```

## 4.2 The server/client boundary — the pattern every 3D section reuses

`three` reads `window` at import time, so the `<Canvas>` must never be server-rendered.
**`next/dynamic` with `{ ssr: false }` throws inside a Server Component** in the App Router, so
the call has to live in a Client Component:

```
app/page.tsx              SERVER — all copy, all SEO. Complete with JavaScript disabled.
  └─ SceneLoader.tsx      'use client' — dynamic(() => import('./StageCanvas'), { ssr: false })
        └─ StageCanvas    'use client' — <Canvas>, meshes, GSAP timelines
```

**The `loading:` slot of that dynamic import renders the poster.** The no-WebGL fallback and the
loading state are therefore the same code path — the fallback is free and cannot rot.

## 4.3 One canvas, two sections — drei `<View>`

S1 (hero) and S3 (bespoke) show the same sofa. **Never create two WebGL contexts.**
One `<Canvas>` lives at layout level, `position: fixed`, `pointer-events: none`, behind the DOM.
`drei`'s `<View track={ref}>` renders a portion of that single canvas into a DOM element's
rectangle — the R3F-native answer to a shared fixed canvas. DOM sections scroll over it normally.

`<Canvas>` config for this project:
```tsx
<Canvas
  eventSource={document.body}
  dpr={[1, tier === 'high' ? 2 : 1.5]}
  gl={{ antialias: tier !== 'low', localClippingEnabled: true }}
  camera={{ fov: 35, position: [0, 0.9, 4.2] }}
  frameloop="demand"          // render on demand; see 4.7
/>
```
`localClippingEnabled` is what makes §4.4's craft plane possible — set it once, here.

## 4.4 S3 implementation — Designed → Crafted → Customized (single mesh)

```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#bespoke', start: 'top top', end: '+=300%',
      pin: true, scrub: 1, invalidateOnRefresh: true,
    },
  })
  tl.to(state, { blueprint: 1, duration: 1 }, 0)            // 0.00–0.33  Designed
    .to(state, { planeY: sofaHeight, duration: 1 }, 1)      // 0.33–0.66  Crafted
    .from('.swatch', { y: 24, opacity: 0, stagger: 0.1 }, 2.2) // 0.66–1.00 Customized
}, { scope: container })
```

- **Blueprint look** — two objects on the same geometry: the real `MeshPhysicalMaterial`, and a
  `LineSegments` built from `new THREE.EdgesGeometry(geometry, 30)` with a brass
  `LineBasicMaterial`. `state.blueprint` drives the real material's opacity up and the edges'
  opacity down. **Cheaper and far more predictable than a custom shader.**
- **Craft plane** — a `THREE.Plane` in `material.clippingPlanes`: the real material is clipped
  *above* `planeY`, the blueprint edges *below* it. Tweening `planeY` produces the sweep.
  Needs `gl.localClippingEnabled = true` (set in §4.3). **Verified as a mature WebGL2 feature —
  this is a direct benefit of dropping WebGPU.**
  *Fallback if it misbehaves:* an `alphaMap` gradient whose offset is tweened. Universally cheap.
- **Particles** — one `Points` object, ≤ 300 vertices near `planeY`, slight upward drift in
  `useFrame`, opacity keyed to the Crafted phase. **High tier only.**
- **Dimension lines** — an SVG overlay positioned by `Vector3.project()` of three model anchor
  points, updated on scroll and resize, animated with `stroke-dashoffset`. Reads as "designed",
  costs almost nothing, and needs no GSAP plugin.
- **Swatch → material** — a registry `{ ivory, teal, walnut } → { color, roughness, sheen }`.
  On tap: `gsap.to(material.color, { r, g, b, duration: 0.8 })` plus
  `gsap.to(document.documentElement, { '--accent': hex })`. The choice is React state and feeds
  `lib/whatsapp.ts`.

## 4.5 Hero implementation
- Camera ≈ 35 mm equivalent. Sofa fills 55% of height on mobile — compute from the bounding box
  on every resize (`fitCameraToObject`), never hard-code a position.
- Lights: warm key `SpotLight` (~2700 K), cool low-intensity rim `DirectionalLight`,
  `<Environment preset="…">` at ~0.3 intensity for PBR reflections.
  **Shadows only on high tier**, 1024 map, PCF soft.
- Floor: large dark plane, roughness 0.6, plus a faded radial-gradient div under the canvas.
- Idle: `sofa.rotation.y` ±0.035 rad over 6 s yoyo; key intensity ±8% over 4 s.
- Pointer parallax (desktop only): lerp the camera target by pointer offset × 0.05.

## 4.6 Dynamic accent
`globals.css` holds `--accent: #C8A96A`. Each section carries `data-accent="…"`. One ScrollTrigger
per section, `onEnter` / `onEnterBack` → `gsap.to(root, { '--accent': value, duration: 0.6 })`.
Buttons, cursor, swatch ring, dimension lines and the sticky pill all read `var(--accent)`.
Desktop-only custom cursor: 12 px ring, `mix-blend-mode: difference`, grows on CTA hover, hidden on touch.

## 4.7 Boot sequence (performance-critical)
1. **Server-rendered HTML is a complete page**: all copy, `next/image` with `srcset`, the hero
   poster, and every CTA link. **No JavaScript required to be a finished landing page.**
2. `lib/device.ts` decides the tier — `high` (WebGL2 + ≥ 4 cores + ≥ 4 GB) / `mid` / `low`.
3. Fonts via `next/font` — self-hosted, `display: swap`, preloaded, `size-adjust` fallback to kill CLS.
4. `requestIdleCallback` → mount `<ReactLenis root>` + ScrollTrigger + accent scrubbing.
5. Hero enters view → the `SceneLoader` dynamic chunk loads → GLB loads → canvas fades over the
   poster. **On `low` tier, Three.js is never downloaded at all** — the hero stays a poster with CSS parallax.
6. `frameloop="demand"` — R3F renders only when something invalidates. ScrollTrigger's `onUpdate`
   calls `invalidate()`. The hero idle runs a capped loop only while the tab is visible.
7. S5 (Spark) and S6 (`model-viewer`) are separate lazy chunks, loaded within 1.5 viewports.

## 4.8 Showroom splat (Spark)
Spark targets WebGL2; create its own small renderer on demand for that section and dispose it on
exit. Custom drag-to-look with clamped yaw/pitch, inertia via GSAP `quickTo`. No zoom, no pan.
Cap `maxSplats` by tier; fetch the `.spz` only within 1.5 viewports; `dispose()` past 2 viewports.
`navigator.deviceMemory < 4` or tier `low` → skip entirely, show the video.

## 4.9 AR (`<model-viewer>`)
```html
<model-viewer src="/models/sofa.ar.glb" ios-src="/models/sofa.usdz"
  ar ar-modes="scene-viewer quick-look webxr" ar-scale="fixed"
  camera-controls disable-zoom shadow-intensity="1"
  poster="/img/sofa-poster.webp" alt="Heaven bespoke sofa"></model-viewer>
```
In Next this is a web component: import it client-side only and add a TS declaration for the
custom element. **The model must be real-world scale in metres** — Meshy exports arbitrary scale,
so set it with `gltf-transform` or a parent node and verify ~2.4 m in model-viewer's dimension overlay.
Desktop shows an inline-SVG QR of the current URL with an `#ar` hash.

## 4.10 Fallback matrix — *a feature is not done until its row works*

| Missing | Hero | Bespoke (S3) | Showroom | AR |
|---|---|---|---|---|
| WebGL2 | poster + CSS parallax | 3 posters crossfade (blueprint / craft / final) | video | model-viewer poster |
| Reduced motion | poster | 3 static posters, no pin | video paused, play button | static |
| Low tier | poster | 3 posters | video | poster + button |
| No splat capture | — | — | video | — |
| JS off | poster + copy + CTA | copy + CTA | photo | photo |

---

# PART 5 — PERFORMANCE PLAN

**Budgets**
- Total JS ≤ 300 KB gz. Three chunk ≤ 180 KB gz (tree-shaken + loaders). GSAP core + ScrollTrigger ≈ 25 KB. Lenis 4 KB. Spark and model-viewer lazy.
- **LCP = the hero poster** `<img fetchpriority="high">`, ≤ 120 KB WebP, via `next/image` with `priority`.
- Hero GLB ≤ 1.5 MB Draco + KTX2. Splat `.spz` ≤ 15 MB, lazy.
- ≤ 100 draw calls. 60 fps on Saadman's Android.

**Targets** — Lighthouse mobile ≥ 90 Performance, ≥ 95 Accessibility / Best Practices / SEO.
LCP < 2.5 s on 4G; hero interactive < 3 s.

**Degradation order** when the real device misses 60 fps in S3:
`particles → shadows → antialias → pixelRatio → skip 3D entirely`. In that order, no improvising.

`npm run audit` runs Lighthouse. Day 9 and after every performance change.

---

# PART 6 — CURRICULUM (12 labs)

Labs live as routes: `src/app/labs/NN-name/page.tsx`. One `npm run dev`. Deleted before submission.

**Session shape:** (a) 3-min concept story in Bangla → (b) small code → (c) he runs it →
(d) one "make it yours" tweak → (e) 2–3 check questions → (f) commit → (g) PROGRESS.md.

**Time-box: any lab over 2.5 h → stop, record the gap in PROGRESS.md, move on.** Come back only if Day 9 has slack.

| Lab | Builds | Becomes (Part 4 module) |
|---|---|---|
| **01** ✅ | `<Canvas>`, mesh, geometry vs material, lights, `dpr`, the `ssr:false` wrapper | §4.2 SceneLoader |
| **02** | `useGLTF` + `<Suspense>` + `<Environment>` + 3-point lighting + tone mapping | §4.5 Hero lighting |
| **03** | `useGSAP()`, timelines, stagger, ease, SplitText on the serif headline | S0 preloader, S1 headline |
| **04** | Lenis + ScrollTrigger: `trigger/start/end`, `pin`, `scrub: 1`, `markers` | §4.4 pin, §4.6 accent |
| **05** ⭐ | Scroll-driven 3D: GSAP mutates a plain object, `useFrame` reads it, `invalidate()` | §4.4 timeline, §4.7 frameloop |
| **06** ⭐ | **Blueprint + craft plane** — `EdgesGeometry`/`LineSegments`, opacity crossfade, `clippingPlanes` sweep. *(Replaces the old explode lab — see §0.2)* | §4.4 Blueprint + CraftPlane |
| **07** | Material swap + `--accent` tweening from ScrollTrigger; fabric sheen | §4.4 swatches, §4.6 accent |
| **08** | **Asset day, no code** — Reve → Meshy → gltf-transform. **Record the screen.** | §3 |
| **09** | `<model-viewer>` in React, Scene Viewer vs Quick Look, real-world scale | §4.9 |
| **10** | Spark `SplatMesh`, lazy init, dispose — **STRETCH** | §4.8 |
| **11** | `animation-timeline: view()` reveals + `prefers-reduced-motion` | §4.10 |
| **12** | Tier detection, poster capture, bundle analyser, Lighthouse | §4.7, §5 |

---

# PART 7 — DAY BY DAY (deadline TBC — confirm in the WhatsApp group)

| Day | Date | Build | Learn | Assets |
|---|---|---|---|---|
| 1 | Sep 1 | Phase 0 scaffold ✅, repo ✅, `content/copy.ts` | **Lab 01** ✅, 02 | Download all Heaven photos. **Post the WhatsApp questions (§12).** |
| 2 | Sep 2 | — | Lab 03, 04 | Reve: clean + grade 12 photos; produce the 4 sofa views |
| 3 | Sep 3 | — | **Lab 05** | Meshy multi-view → GLB v1 → gltf-transform |
| 4 | Sep 4 | — | **Lab 06**, 07 | Meshy iteration if the silhouette is off; USDZ export |
| 5 | Sep 5 | **Static skeleton: all copy, tokens, footer, CTA — page complete without JS** | Lab 09, 11 | Hero poster placeholder |
| 6 | Sep 6 | S0 preloader + S1 hero + accent system | — | Hero poster render from the real scene |
| 7 | Sep 7 | **S3 bespoke + swatches + WhatsApp prefill** | Lab 10 if the splat arrived | Splat processing |
| 8 | Sep 8 | S4 collections + S7 proof + S5 showroom + S6 AR | Lab 12 | **Decide: splat or video** |
| 9 | Sep 9 | Performance + real device + a11y + README/ASSETS | — | — |
| 10 | Sep 10 | Record, deploy, submit | — | — |

**Day 5 is the hard gate:** the page must be complete and shippable without JavaScript by then.
Everything after Day 5 is enhancement, and enhancements get cut in this order:
`splat (Lab 10) → particles → CSS scroll reveals (Lab 11) → custom cursor → AR`.

---

# PART 8 — SCREEN RECORDING SCRIPT (≤ 3 min)

| Time | Shot |
|---|---|
| 0:00–0:10 | Phone. Black hero, sofa idling. Caption: "Heaven Furniture Mart — bespoke furniture, Chattogram." |
| 0:10–0:40 | **The money shot.** Scroll S3 slowly: blueprint → craft sweep → tap "Deep Teal Velvet" → accent shifts → tap CTA → WhatsApp opens pre-filled. |
| 0:40–1:00 | Collections strip, proof, timeline — fast. |
| 1:00–1:20 | AR: point the phone at a real room, sofa appears at real scale. |
| 1:20–1:40 | Showroom splat, drag to look around (or the video fallback). |
| 1:40–2:20 | Process montage: Facebook photo → Reve cleanup/grade → Meshy multi-view → GLB in the browser → gltf-transform size before/after. |
| 2:20–2:45 | Desktop pass: horizontal collections, cursor, accent changes. |
| 2:45–3:00 | Lighthouse mobile score + "Built with Next.js, Three.js, GSAP, Spark, model-viewer" + `#racdox_hackathon`. |

OBS on desktop + the Android screen recorder; edit in CapCut or DaVinci. Music no louder than −18 dB.
Captions in English (the client is English-facing), with a Bangla intro line for the BD group post.

---

# PART 9 — RISK REGISTER

| Risk | Likelihood | Mitigation |
|---|---|---|
| Meshy sofa geometry poor (fused arms, hollow back) | Medium | Better Reve views (plain bg, seat-height camera); try 2 different sofas; pick the simplest silhouette. Worst case: a CC0 sofa GLB re-textured to Heaven's fabric — **disclosed in ASSETS.md**. |
| Clipping planes misbehave | **Low** (was Medium under WebGPU) | Lab 06 verifies early. Fallback: `alphaMap` gradient sweep. |
| No showroom video from the client | High | Video fallback already planned; the splat is a bonus. |
| Splat too heavy on mobile | Medium | Tier gate + splat cap + `.spz`; desktop-only if needed. |
| iOS AR fails (USDZ, untestable — no iPhone) | High | Test if any iPhone is reachable. Otherwise ship the USDZ, record on Android, and **state the limitation in the README**. |
| Scope creep | **Highest** | Day 5 gate: complete without JS. Cut order is fixed (Part 7). |
| Deadline earlier than assumed | Medium | Confirm Day 1. Day 9 is the "ship anyway" day. |
| Licensing on AI assets | Low | ASSETS.md credits Meshy (CC BY 4.0 on free tier) and Reve. **Confirm Reve's free-tier commercial terms before submitting.** |
| Learning time exceeds estimates | Medium | 2.5 h lab time-box. Labs 10 and 11 are droppable without touching the page. |

---

# PART 10 — COPY & PROMPT LIBRARY

> Every string below goes in `src/content/copy.ts` — one file, so a copy review is one diff.

### Page copy (English, final)
| Slot | Text |
|---|---|
| Eyebrow | `Bespoke furniture & interior styling · Chattogram` |
| H1 | `Furniture, Crafted Around You.` |
| Sub | `Designed. Crafted. Customized.` |
| CTA | `Get a Free Design Consultation` |
| Brand (S2) | `Heaven Furniture Mart designs and crafts furniture around the way you live — built to your space, your size, your taste. From our studio and showroom in Agrabad, Chattogram.` |
| S3 words | `Designed.` / `Crafted.` / `Customized.` |
| S3 micro-lines | `Every piece starts with your room and your measurements.` / `Premium wood. In-house craftsmanship.` / `Your fabric, your finish, your colour.` |
| Swatches | `Ivory Bouclé` · `Deep Teal Velvet` · `Walnut Leather` |
| Showroom | `Step into our showroom` / `Agrabad Access Road, Chattogram` |
| AR | `See it in your room` / `Point your phone at your living room. See exactly how it fits before we build it.` |
| Footer | `Ready to design around you?` |

### WhatsApp prefill
```
https://wa.me/8801960481983?text=Hi%20Heaven%2C%20I%27d%20like%20a%20free%20design%20consultation%20for%20a%20bespoke%20sofa%20in%20{SWATCH}.%20My%20space%20is%20
```
Build it in `lib/whatsapp.ts` with `encodeURIComponent` — never hand-encode.

### Reve prompts
- **Clean-up:** "Remove the price tag and the cable on the floor. Keep everything else identical."
- **Grade transfer (Remix):** "Apply the colour grading, warmth and contrast of the reference image. Keep composition and subject unchanged."
- **Sofa views:** "The same sofa, unchanged design and proportions, on a plain mid-grey seamless studio background, soft diffuse light, no floor shadow, camera at seat height, [straight-on front view | 45-degree left view | 45-degree right view | direct rear view]."
- **Relight a flat photo:** "Add a single warm key light from the upper left, deepen shadows, keep textures crisp."

### ASSETS.md template
```
# Assets & credits
- Photography: Heaven Furniture Mart (Facebook/Instagram), edited with Reve (cleanup, grade).
- Sofa 3D: generated with Meshy AI (Image to 3D, multi-view) from Heaven photography.
  Licence: <fill from account — free tier is CC BY 4.0, attribution required>.
- Showroom capture: <Luma / Polycam> from client video, or YouTube clip fallback.
- Fonts: <names + licences>.
- Libraries: Next.js, React Three Fiber, Three.js, GSAP, Lenis, Spark, model-viewer, gltf-transform.
```

---

# PART 11 — HOW CLAUDE CODE USES THIS DOC

- **Phase 1 labs:** when a lab maps to a Part 4 module, explain the concept in Bangla, build the
  lab version, then say in one line how it becomes the real module.
- **Phase 2:** build `src/` in the order of Part 7, reusing only what Saadman already understands
  from the labs. If a needed technique was skipped, run a 20-minute mini-lab first.
- **Always keep §4.10 true.** A feature is not "done" until its fallback row works.
- **Never invent client facts** beyond `CLAUDE.md` §2. Missing information → ask the WhatsApp group.
- Update `PROGRESS.md` every session, including which asset states changed (GLB, splat, photos).

---

# PART 12 — OPEN QUESTIONS FOR THE WHATSAPP GROUP

1. Exact submission deadline — **date and time**?
2. Submission format — GitHub repo link, live URL, video, or all three?
3. Is a slow 1–2 minute walkthrough video of the Agrabad showroom available? *(needed for the splat — gate is Day 8)*
4. Any higher-resolution product photography than what is on Facebook / Instagram?
5. Is there an official logo file (transparent SVG / PNG)?

---

# PART 13 — V2 IDEAS PARKING LOT (post-freeze; only if Day 9 has slack)

Ideas noted after the design freeze. None of these block the ship.

1. Per-category 3D models from Meshy (a bed, a dining set) rotating on scroll inside S4 cards.
   Cost: Meshy credits + optimization time per model, plus ~1 MB page weight each; breaks the
   1.5 MB budget and the FB in-app browser path. The CSS perspective cards deliver the feel for
   free; real GLBs only if everything else ships early.
2. Fake-3D parallax from single photos (depth-map layers) for collection cards.
3. Extra landing sub-page (full collections gallery) linked from the S4 text link.
