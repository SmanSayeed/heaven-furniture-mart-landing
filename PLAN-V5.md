# PLAN V5 — "THE SLIDES" (Sørenrose mechanic, Apple type, our photographs)

> Status: PLAN + interactive prototype, awaiting Saadman's go (2026-09-03).
> Supersedes PLAN-V3 (rejected: "looks like other submissions" — it was a cleaner
> brochure, and the competitors are brochures). Keeps the current engine
> (Next 16 + GSAP + Lenis + R3F), replaces the section structure.

## What the references actually do (measured with Playwright, 2026-09-03)
- **sorenrose.com** — SuisseIntl 400 at ~65px; page height = 1 viewport: a GSAP-driven
  full-screen slide deck (12 videos). Each slide: giant two-line title bottom-left,
  tiny "● FURNITURE" tag, "● VIEW" pill right, counter "04 – 04". Almost no copy.
- **arteriorshome.com** — Montserrat, Tailwind snap sliders, standard e-com grid. Its
  value for us is tone (quiet, white, product-first), not structure.
- **apple.com/macbook-pro** — SF Pro Display, tight tracking (-0.03em), bold, short lines.

## The structure
Nine full-screen plates. Each plate is a real photograph of Heaven's work with one
caption in Apple-sized type. Scrolling makes the NEXT plate rise over the last (sticky
stack) — native scroll, no hijack, identical on phone. One CTA everywhere.

| # | Plate | Photograph | Type on it | Control |
|---|---|---|---|---|
| 01 | Welcome (hero) | evening showroom (D5) | tag · "Furnished to you." · tagline · CTA | — |
| 02 | Living Room | living-01-beige-set | tag · title · one line | VIEW → modal |
| 03 | Bedroom | bedroom-01-royal-bed | same | VIEW → modal |
| 04 | Dining | dining-01-cream | same | VIEW → modal |
| 05 | Office & Study | office-storage-01-black-cabinet | same | VIEW → modal |
| 06 | Bespoke (the ONE 3D) | R3F royal canapé, drawing → velvet | three words · one line · swatches · CTA | "See it in your room" → AR modal |
| 07 | The Maker | people-owner-heaven-furniture | MD quote (short form) · name · trust line | — |
| 08 | Showroom | video facade poster | title · one line · Maps | Play the tour |
| 09 | Your room | quiet dark plate | "Ready to design around you?" · CTA | CTA → quote builder modal |
| — | Footer | — | address · phone · email · socials | — |

Hero has NO 3D and NO AR button. The counter (01 — 09) and a fixed header
(wordmark · Collections/Bespoke/Showroom/Contact · Quote pill) are the only chrome.

## Type
Display: **Inter Tight** 600, -0.035em, 44 → 112px (self-hosted via next/font; the
Apple look without SF Pro's licence). Body: Inter 400/500. No serif anywhere.
Uppercase tags at 11px / .18em with a brass dot.

## Motion (GSAP + ScrollTrigger; four verbs stay)
- Plate enters: scale 1.06 → 1 over 1.6s (transform only). Text RISEs, stagger .08.
- The hero "lights come on" once on load: plate brightness .12 → 1 over 1.4s.
- Bespoke: scrolling into the slide sweeps the drawing into velvet (existing
  bespokeProgress scrub); swatches recolour the fabric; nothing pinned longer than the
  slide itself.
- Maker: a single DIM beat as the plate arrives (Blackout layer reused, once).
- Modals: backdrop .3s, panel rises 24px + scale .98 → 1, content mounts on open, focus
  trapped, Lenis stopped, hash-synced.
- Reduced motion: every plate static and fully lit.

## Performance & paint (gates)
- 9 photographs at 1600w webp ≤ 180 KB each; hero preloaded, fetchpriority=high; all
  others lazy with width/height (CLS 0). Sticky plates paint on the compositor.
- JS < 200 KB gz before the 3D chunk; 3D chunk only when slide 06 is one viewport away;
  model-viewer on click only. YouTube facade unchanged.
- Lighthouse mobile ≥ 90 / 95 / 95 / 95. Real-phone check (Saadman's Android) per plate.

## Build order (from the current codebase)
1. New `Deck` layout: page.tsx renders nine `<Plate>` sections + Footer; header + counter.
2. Hero plate (no 3D), category plates (Photo full-bleed), shared `<Modal>`.
3. Bespoke plate: existing R3F bespoke View retargeted to the plate's stage rect;
   swatches; AR modal (existing ArViewer inside Modal).
4. Maker, Showroom (VideoEmbed), Quote (ContactForm → quote builder modal).
5. PageMotion rewritten (~150 lines) for the deck; delete Turntable/Bulb/Torch/
   FloodBeam/IndexNav/Ticker/Team/CropMarks/DimensionLine/SheetBlock usage.
6. Perf pass, mobile pass, Lighthouse, recording.
