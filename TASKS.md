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
- [ ] S · WhatsApp group join + the 5 questions (**deadline answer needed!**)
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

## Sprint 5 · Real assets in (Day 5–6)
- [ ] C · sharp pipeline: graded photos → WebP 480/960/1600 → next/image everywhere
- [ ] C · S2 brand photo, S4 card photos, S7 polish, footer, hero poster from live scene

## Sprint 6 · Bonus layers (Day 6–7)
- [ ] C · S6 AR: model-viewer standalone bundle, QR on desktop; S test on Android
- [ ] C · S5 showroom: splat if capture arrived, else video fallback, else photo
- [ ] S · Any showroom walkthrough video handed over

## Sprint 7 · Performance + polish (Day 8–9)
- [ ] C · Lighthouse mobile ≥ 90 / a11y ≥ 95, LCP < 2.5s, degradation ladder applied
- [ ] C · FB in-app browser sanity, UTM passthrough, pixel env hook, README funnel paragraph
- [ ] S · Full real-phone pass (scroll feel, tap targets, WhatsApp opens correctly)

## Sprint 8 · Ship (Day 9–10)
- [ ] C · Vercel deploy, labs removed, ASSETS.md final, README final
- [ ] S · Screen recording per PLAN Part 8 script, post with #racdox_hackathon, submit

## Standing rule
Every sprint ends with: build passes, Playwright 390px screenshot reviewed, PROGRESS.md updated,
commit pushed (with Saadman's git permission).
