# PLAN V3 — "THE SHOWROOM, QUIETLY LIT"

> Status: PLAN, awaiting Saadman's approval before any code moves (2026-09-02).
> Why a V3: the working tree is clever, not clean. Judges score luxury, brand-in-seconds,
> mobile, ONE CTA, fast. Every section below is redesigned against those five lines and
> against one customer question. Backup of the current state is Saadman's own.

---

## 0. The laws (every section obeys all of them)

1. **One idea per viewport.** A section answers ONE customer question, in ≤ 2 type sizes
   plus a specimen line. If a second idea appears, it becomes a modal or is cut.
2. **The photograph is the luxury.** Real Heaven photos, large, uncropped by clutter. No
   drawn grids, crop marks, dimension lines, title blocks, tickers or specimen rows on the
   customer-facing sections. Those were the "drawing office" idea; it is retired.
3. **Motion has four verbs, and only four** (GSAP + ScrollTrigger, `once: true`):
   - RISE — text: y 24→0, opacity 0→1, `expo.out`, 0.9s, stagger 0.08
   - UNVEIL — images: `clip-path: inset(100% 0 0 0)` → `inset(0)`, `power3.out`, 1.1s
   - DRAW — brass hairlines: scaleX 0→1 from the left, 0.8s
   - DIM — the ONE theatrical beat (Proof): lights dip for 0.6s, return over 1.2s
   No bounce, no elastic, no parallax stacks, no pins except Bespoke on desktop.
   `prefers-reduced-motion` → everything static and fully lit.
4. **One CTA everywhere: "Request a Quote."** WhatsApp deep link with a composed message.
   Mobile sticky pill + header pill + hero + after Bespoke + Quote section + footer.
   Nothing else is a button. "See it in your room" is a text link inside Bespoke only.
5. **One 3D section (Bespoke).** Nothing 3D in the hero. AR lives inside Bespoke as a
   modal. R3F chunk loads only when Bespoke is within one viewport.
6. **Paint & performance are features.** LCP = hero photo (`fetchpriority=high`, preload,
   ≤ 180 KB webp/avif at 1600w). Total JS < 200 KB gz before the 3D chunk. Only
   `transform`/`opacity`/`clip-path` animate. `content-visibility: auto` below the fold.
   Every `<img>` has width/height (CLS 0). No `filter`/`mix-blend-mode` on large layers.
   Lighthouse mobile ≥ 90 / 95 / 95 / 95 is a gate, not a wish.
7. **Palette = the brief's, restrained.** Charcoal-teal ground `#0F1A1B`, ivory `#F4F0E8`,
   brass hairlines `#C2A063` at ≤ 3 places per viewport, deep brown text on ivory.
   Type: Cormorant Garamond (display, 600) + Inter (body). Whitespace scale 8 / 16 / 32 /
   64 / 128 px; section padding 128 desktop / 64 mobile.

---

## 1. Section by section (new order — the brief's own list)

| # | Section | Customer question it answers | Ground |
|---|---|---|---|
| 1 | Hero | Who are you, where, what do you do, what do I press? | photo + charcoal |
| 2 | Studio (brand intro) | Are you a real studio or a shop? | ivory |
| 3 | Why Heaven | Why trust you with my money? | ivory |
| 4 | Collections | Do you make what I need? | ivory, photo plates |
| 5 | Bespoke (the 3D) | Will it fit MY room? | charcoal |
| 6 | The Maker (proof) | Who is behind this? Since when? | charcoal → ivory |
| 7 | Showroom | Can I go and touch it? | ivory |
| 8 | Quote | How do I start? | charcoal |
| 9 | Footer | How do I reach you? | charcoal |

Cut: Ticker (marketplace-y), the AR section (folded into Bespoke), Team (no team photo
exists — folds into The Maker when one does), Torch, FloodBeam, Bulb, IndexNav's index
overlay (replaced by a plain header), the hero turntable/arrows/dimension/crop marks.

### 1. HERO — "the room, lit"
- Full-bleed real showroom photograph (best evening shot from D5; until then the current
  hero backdrop, IN COLOUR, not crushed). Charcoal scrim 55% → 20% bottom-to-top so the
  type sits on dark and the room stays readable.
- Content, left-aligned, columns 1-7 of 12: wordmark (real logo when it arrives) ·
  eyebrow "BESPOKE FURNITURE & INTERIOR STYLING · AGRABAD, CHATTOGRAM" · headline (2
  lines, Cormorant, 88px desktop / 44px mobile) · tagline "Designed. Crafted. Customized."
  · ONE CTA "Request a Quote" · under it one specimen line "Free design consultation ·
  Delivery & installation included".
- Motion (the only "light" idea that survives in the hero, and it is invisible as a
  technique): the photo loads at brightness .35 and warms to 1 over 1.2s while the
  headline RISEs word-group by word-group. That IS "the lights come on". Scroll: photo
  translateY 8% (one tween, scrubbed), nothing else.
- Header: transparent → charcoal on scroll (one class toggle). Wordmark left, 4 anchor
  links centre (desktop only), "Request a Quote" pill right. Mobile: wordmark + pill.
- Mobile 390×844: eyebrow, headline, tagline, CTA all inside the first 700px. Verified.
- Perf: the photo is the LCP; preloaded; no JS needed for the first paint.

### 2. STUDIO — brand intro
- Ivory. Two sentences max (the brief's own positioning) beside one tall photograph
  (A-portrait 2:3), 5/7 split. Quote-style large first line, sans body.
- Motion: RISE on text, UNVEIL on the photo. Nothing else.

### 3. WHY HEAVEN — the seven trust points
- Ivory. A single two-column list, each point one line, brass hairline above each,
  small serif numeral 01-07. No cards, no icons, no boxes.
- Motion: DRAW the hairlines in sequence (stagger 0.06), RISE the lines.

### 4. COLLECTIONS — five plates + animated modal
- Editorial grid: Living (large, 7/12) · Bedroom (5/12) / Dining · Office (6/12 each) /
  Bespoke (full width, short, with its own line "Anything built to your space"). Every
  plate: photo, category name (serif 32), one line of what they make, "See pieces →" text.
- Click → **THE MODAL** (one shared `<Modal>` built on `<dialog>`): backdrop fades (0.3s),
  the panel scales from the clicked plate's rect (FLIP, `transform` only) into a centred
  sheet; inside: category title, 3-6 photos in a horizontal scroll-snap strip, "What we
  make" list, the CTA prefilled for that category. Escape / backdrop / × close; focus
  trapped; body scroll locked (Lenis stop); `#collections/living-room` in the URL so
  back-button closes it. Photos in the modal load only on open.
- Motion in section: plates UNVEIL as they enter; hover on pointer devices: photo scale
  1→1.03 over 0.8s, nothing on touch.

### 5. BESPOKE — the ONE 3D section (kept from the current build, simplified)
- Charcoal. Left: "Designed. Crafted. Customized." as three stacked serif words, each with
  its one line. Right: the royal canapé stage (existing R3F view), blueprint → velvet sweep
  scrubbed by scroll on desktop (pinned, one viewport), simple scrub without pin on mobile.
  Three fabric swatches under the stage (existing store). Under that, one text link:
  "See it in your room →" which opens the AR viewer IN THE MODAL (model-viewer, loads on
  click — the existing ArViewer inside the shared Modal). CTA below.
- What is cut from the current version: the drawn dimension line, crop marks, specimen
  rows, the bulb, the sheet block, the swatch dock chrome. The piece, the words, the
  swatches, the link, the CTA.
- Perf: R3F chunk loads when the section is one viewport away; low tier gets the
  rendered poster (existing fallback). Nothing 3D above the fold anywhere.

### 6. THE MAKER — social proof
- Charcoal. MD portrait (the keyed JPEG, large, left 5/12), verbatim quote (serif 32, right),
  name + title, then "Trusted by hundreds of happy homeowners" as the specimen line.
  Below: milestones as ONE horizontal brass hairline with five dots and years (2020 · 2021
  · 2024-25 · 2025 · 2026); on mobile the same line runs vertically.
- Motion: **DIM** — the one theatrical beat on the whole page. When the section enters,
  the page ground dips to near-black for 0.6s (the existing Blackout layer, reused) and
  comes back over 1.2s with the portrait UNVEILing as the light returns. Loadshedding,
  once, quietly. Reduced motion: no dip. Then DRAW the timeline.

### 7. SHOWROOM
- Ivory. The YouTube facade (existing, zero bytes before click) 8/12, beside it the
  address block: "Agrabad Access Road, Chattogram", "Large physical showroom", opening
  line (ONLY if the WhatsApp group confirms hours — otherwise omit), map link, phone.
- Motion: UNVEIL the video plate, RISE the address.

### 8. QUOTE — the CTA section + quote builder modal
- Charcoal. Headline "Ready to design around you?" (existing), one paragraph, the CTA.
- The CTA on this section opens the **quote builder modal** (3 steps, each one screen,
  slides left with `transform`): 1) What are you looking for? (5 category tiles) 2) Your
  space (room type + rough size, optional photo later) 3) Name + phone → "Send on
  WhatsApp" composes the message and opens wa.me; the same payload POSTs to Saadman's
  backend when it exists (fetch, best-effort, never blocks the WhatsApp open). Everywhere
  else the CTA is the plain WhatsApp link (no modal) — one click, zero friction.
- Security (backend, when built): server-side validation, rate limit, no secrets in the
  client, HTTPS only, no PII in logs. Checklist ships with the feature.

### 9. FOOTER
- Charcoal. Address, phone, email, three socials, the four pages, organizer credit line,
  the tagline. Static.

### Cross-cutting: sticky elements
- Mobile: StickyCta pill (existing) stays. SocialDock stays but quieter (brass ring only).
- Desktop: header pill is the sticky CTA; no dock fan on desktop.

---

## 2. Motion system implementation (one file)
`src/components/motion/PageMotion.tsx` is rewritten to ~150 lines: a `reveal()` helper that
maps `[data-rise]`, `[data-unveil]`, `[data-draw]` to the three verbs with `ScrollTrigger.batch`
(`once: true`, start `top 85%`), the hero warm-up timeline, the hero photo scrub, the Bespoke
pin/scrub (desktop) or scrub (mobile), the Proof DIM beat, and the header class toggle.
`gsap.matchMedia` for `(prefers-reduced-motion: no-preference)` and `(min-width: 900px)`.
Lenis stays. Nothing else animates.

## 3. Modal system (one component)
`src/components/ui/Modal.tsx`: `<dialog>` + GSAP open/close timelines, focus trap, scroll
lock (Lenis `stop()`/`start()`), hash sync, `aria-labelledby`, close on Escape/backdrop.
Three consumers: CollectionsModal, ArModal, QuoteModal. Content mounts on open only.

## 4. Performance & paint gates (checked before "done")
- Lighthouse mobile (throttled) ≥ 90 perf, ≥ 95 a11y/BP/SEO — on `/` and `/collections`.
- LCP < 2.5s on simulated 4G; CLS 0; INP < 200ms (modal open included).
- JS: main route < 200 KB gz without 3D; 3D chunk < 350 KB gz; model-viewer on click only.
- Images: hero ≤ 180 KB, plates ≤ 120 KB at their rendered size; all with dimensions.
- `content-visibility: auto; contain-intrinsic-size` on sections 3-9.
- Verified on Saadman's Android over LAN before any section is called done.

## 5. Order of work (3 days)
- Day 1: approve this plan → header + hero + motion system + Modal + Studio + Why → verify
  hero at 390×844 and 1440×900 → Lighthouse baseline.
- Day 2: Collections + modal, Bespoke fold-in (AR modal), Maker (DIM), Showroom, Quote modal.
- Day 3: perf pass, real-phone pass, copy pass with Saadman's D3 headline and D5 photos,
  screen recording, submission.

## 6. What Saadman decides (from CONCEPT-V2 D-sheet, still open)
- D3 headline (the current "Built for the moment the lights come on." is the placeholder).
- D5 photos: hero evening shot, five category plates, 3-6 per category for the modals.
- Real logo file. Showroom hours (ask the group; otherwise omitted).
