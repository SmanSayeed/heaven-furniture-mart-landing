# TASKS.md — sprint board
_Thin execution checklist. The WHAT and WHY live in PLAN.md; this is only the WHO and WHEN._
_Design is FROZEN as of 2026-09-01 evening. New ideas go to PLAN.md Part 13, not here._

Owners: **C** = Claude builds · **S** = Saadman (manual work only he can do)

## Sprint 0 · Foundation — DONE ✅
- [x] C · Next 16 scaffold, deps, repo, PLAN/PROGRESS/ASSETS docs
- [x] C · Lab 01 first R3F scene, verified on Playwright
- [x] C · Design research (3 references), Midnight Studio + Golden Thread locked
- [x] S · 10 product photos collected from Facebook
- [x] C · Photos renamed, inventoried, mapped to sections

## Sprint 1 · Static skeleton (Day 1–2) — IN PROGRESS
Goal: the page is COMPLETE and shippable with JavaScript disabled.
- [x] C · globals.css: Heaven Ink tokens, text roles, buttons (+ Apple pass: pills, radius, grad-word)
- [x] C · layout.tsx: Fraunces + Archivo + IBM Plex Mono via next/font, metadata, JSON-LD
- [x] C · lib/whatsapp.ts + ui primitives (Cta, icons, StickyCta)
- [x] C · All 8 sections as server components with real copy (placeholder media panels)
- [x] C · Playwright pass at 390px (real phone check by S still pending)
- [x] S · WhatsApp group questions answered (2026-09-02) - see PROGRESS.md; deadline is 2-3 days
- [ ] S · Gemini cleanup of all 10 photos → `assets-raw/photos/graded/` (same filenames)
- [ ] S · Hunt: showroom wide shot, golden-room shot, blue bed shot, logo file, walkthrough video

## Sprint 2 · Motion layer (Day 2–3) — DONE (built Day 1!) ✅
- [x] C · Lenis smooth scroll + ScrollTrigger base + reduced-motion kill switch
- [x] C · Golden Thread v1 (hero rule → scroll spine → footer triangle tie-off)
- [x] C · SplitText hero headline, dim-to-bright placard reveals, ticker marquee, accent scrub
- [x] C · S4 perspective card entrances + desktop horizontal rail pin (containerAnimation)
- [ ] S · Gemini 4 sofa views → `assets-raw/sofa-views/` (front/left45/right45/rear)

## Sprint 3 · Hero 3D (Day 3–4) — DONE Day 1 ✅
- [x] C · Single fixed Canvas + two drei Views, CSS-stage fallback path, tier detection
- [x] C · Placeholder GLB staged: breathing spotlight, rim, contact shadow, idle sway
- [ ] S · Meshy: 4 views → GLB + USDZ export → `assets-raw/models/` (C gives click-by-click guide)

## Sprint 4 · Bespoke moment (Day 4–5) — CORE DONE Day 1 ✅
- [x] C · S3 pin + 3-phase timeline: blueprint edges → clip-plane sweep → swatch dock
- [x] C · Swatch → fabric material + --accent + WhatsApp prefill (live, verified)
- [ ] C · Golden Thread → measurement lines refinement (polish pass)
- [ ] C · Real sofa GLB swapped in via gltf-transform (≤ 1.5 MB) — WAITS ON S (Meshy)

## SUPERSEDED — see BUILD-GUIDE.md and SAADMAN-TASKS.md v2

The compressed board that stood here was written before the DRAWN TO MEASURE redesign
(BLUEPRINT.md / BUILD-GUIDE.md, branch `redesign/drawn-to-measure`) and it now contradicts it
in two places. Both are resolved in favour of the newer design, recorded in PROGRESS.md
2026-09-02 "v2 task list audited":

- pen-and-paper handmade layer: **dropped**, it fights the precise-drawing concept
- AR / USDZ: **back in scope**, time-boxed to whatever Meshy delivers

Authoritative going forward: **BUILD-GUIDE.md** for Claude's build order, **SAADMAN-TASKS.md**
for Saadman's manual work, **PROGRESS.md** for what is true right now. Do not maintain a third
board here; it is how the two boards drifted apart in the first place.

Ship target 2026-09-04. Submission = live URL + a public Facebook/LinkedIn post carrying the
video and that URL + the organizer's form filled with the post link.
