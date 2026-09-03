# PLAN V6 — "A NIGHT AT HEAVEN" (2026-09-03, evening)

> Status: PROPOSED. Replaces the PLAN-V5 deck mechanic (nine sticky plates all rising from
> the bottom). Saadman's brief for this revision, in order, verbatim:
> 1. "on scroll all coming from top to bottom - no i do not want this way"
> 2. "previously we had one section with 3d sofa skeleton on scroll it was getting shaped -
>    i want that section, some sections will be like horizontal slider changing one by one
>    on scroll - all sections no need to be full screens - take some sections from previous
>    - hero section … apply floodlight and some aesthetic feature for hero on scroll show
>    next view with on scroll doing some different animations, not changing sections only"
> 3. "use GSAP - add something zooming in on scroll and go to next section - add at least
>    one 3d objects feature that you built previously"
> 4. "all similar type transition makes it boring - in a awwwards winning website - there
>    must be something story like feature - users feels he is in an adventure - but
>    hackathon features friendly - plan this way - there can be lot of pages"
>
> Kept from V5: the type (Inter Tight), the `<dialog>` modal system (rooms, AR, quote
> builder), header/footer, the copy, the photo pipeline, the performance discipline
> (inversion law, idle mounting, one canvas). Thrown away: the one mechanic.

---

## 0. The story (this is the product)

**One night, the visitor walks through Heaven.** The power is out on Agrabad Access Road.
They are handed a light. They find the furniture in the dark, the lights come back room by
room, they walk the floor, they reach the drafting table where a piece is drawn to their
measurements and built in front of them, they choose its fabric, they meet the man who
makes it, they take the piece home into their own room, and they are asked one question:
*what is your room?*

Seven chapters. In every chapter the visitor DOES one thing (holds the light, walks,
pushes through the fabric, chooses the fabric, turns the piece, places it at home, tells us
the room). That agency is what "adventure" means on a landing page, and it is what none of
the four competing entries has — they are all read, none are *done*.

It is still ONE page (the brief scores a landing page, and the judges' criterion 4 is one
clear action). "A lot of pages" is honoured as a lot of **chapters** on one scroll, plus
the sub-pages that already exist (/collections, /process, /about, /contact) linked from the
footer and the room modals.

### The three story devices (cheap, and nobody else has them)

1. **THE MAP** — a floor plan of the showroom, drawn in one-pixel lines, fixed bottom-left
   (desktop) / a 28px strip above the sticky pill (mobile). Seven rooms. The room you are in
   is lit; the rooms you have passed stay lit; a small brass dot is *you*. It replaces the
   "01 — 09" counter. It is the adventure's inventory screen: the visitor always knows
   where they are and how much is left. SVG, ~80 lines, `data-room` attributes toggled by
   ScrollTrigger. No numbers, no fabricated rooms: the seven are this page's chapters.
2. **THE NARRATOR** — one short line in the second person opens each chapter, set small,
   in brass, typed on (mask reveal, not a typewriter): *"The power is out. You have a
   light."* / *"Walk the floor."* / *"Through the fabric."* / *"Yours is drawn."* /
   *"The man who builds it."* / *"Take it home."* / *"Tell us your room."* Seven lines,
   thirty words. English; D2 gives the one Bangla word if Saadman wants it on the map.
3. **THE LIGHT** — one source, top-left, 45° (the backup's One Light Law). It is the
   through-line: it sweeps in chapter 1, it is *held* by the cursor (Torch), it dips when
   the maker arrives, and it comes back wide at the ask. The visitor ends where they
   started: in a lit room, now knowing whose it is.

**Grammar rule (the fix for "all similar transitions"):** no two adjacent chapters share a
motion verb, no two chapters share a height, and every chapter has a different *kind* of
transition into the next (cut, portal, travel, unpin, draw, dim, open).

---

## 1. The chapters in one table

| Ch | Name · narrator line | Height | Ground | What the visitor DOES | Motion verb (GSAP) | Transition OUT | From |
|---|---|---|---|---|---|---|---|
| 1 | **The floodlit room** · "The power is out. You have a light." | 100vh, pinned 250vh | ink + real photo | holds the light (Torch), scrolls the room lit, sees 3 views | FLOOD → IRIS → SLIDE | **ZOOM PORTAL** through the fabric into ch.2 | FloodBeam, Torch, hero slider (backup) · portal new |
| 2 | **The studio** · "Through the fabric." | ~70vh | ivory paper | reads who Heaven is; 3 trust cards; the founding line | PRINT: mask lines, the 2020→2026 line draws | hard CUT to dark (paper ends, the floor begins) | Brand.tsx, Proof, CropMarks (backup) |
| 3 | **The floor** · "Walk the floor." | 100vh pinned (≥900) · auto (mobile) | ink | walks sideways past five rooms, opens any | RAIL: horizontal travel, panels turn to face you | the 5th card (Bespoke) is a drawn outline; the rail UNPINS into the drafting table | PageMotion rail + Collections (backup), CollectionModal (V5) |
| 4 | **The drafting table** · "Yours is drawn." | 100vh, pinned 300vh | ink, drawn grid | chooses the fabric, turns the piece 360, reads its real mm | SWEEP: blueprint draws → wood & velvet sweep up → re-dye → inspect | UNPIN; the piece stays on the canvas as ch.5 slides over | Bespoke.tsx, StageCanvas, SwatchDock, DimensionLine, InspectHint (backup) |
| 5 | **The maker** · "The man who builds it." | ~75vh | ink | meets him: portrait, his sentence, the milestones | DIM: the lights dip once; timeline draws | fade | Maker (V5) + Proof timeline (backup) |
| 6 | **Take it home** · "Take it home." | ~80vh | ink | places the piece in their own room (AR), watches the showroom film | SHUTTER: the film frame opens from its middle; the AR card lifts | OPEN into the wide light | ArModal, Showroom, VideoEmbed (V5) |
| 7 | **Your room** · "Tell us your room." | 100vh centred | ink, wide floodlight | answers three questions → WhatsApp | RISE + the beam returns wide | footer | QuoteModal (V5), FloodBeam wide (backup) |

Adjacent verbs: FLOOD/ZOOM → PRINT → RAIL → SWEEP → DIM → SHUTTER → RISE. No repeats.
Transitions out: portal · cut · unpin-into · unpin-over · fade · open · end. No repeats.
Heights: 250 · 70 · 100/auto · 300 · 75 · 80 · 100. No repeats.
Pins: 3 desktop (1, 3, 4), 2 mobile (1, 4). Everything scrubbed is transform, opacity or
clip-path.

---

## 2. Chapter by chapter

### Ch.1 · THE FLOODLIT ROOM (pinned, 250vh)

**At rest (server HTML, the LCP):** eyebrow "Bespoke furniture · Chattogram", headline (D3
placeholder "Furnished to you."), tagline, the one WhatsApp CTA, view counter "1 / 3", the
narrator line, the scroll cue. View 1 behind, dark.

**The light (backup):** `FloodBeam` sweeps once on load (CSS keyframe 2.2 s) — darkness, a
beam finds the furniture, the room stays half-lit. `Torch` on `(pointer: fine)`: a 640px
warm pool rides the cursor at opacity .35. No bulb (rejected 09-02).

**Scroll script (one timeline, `scrub: 0.8`):**

| progress | beat | how |
|---|---|---|
| 0 → .22 | the room FLOODS: scrim .78 → .25, beam scaleX 1 → 2.6, headline parallax | opacity, transform |
| .22 → .48 | VIEW 2 by IRIS from the beam's origin: `circle(0 at 12% 8%)` → `circle(150%)`; counter 1→2 | clip-path |
| .48 → .66 | VIEW 3 SLIDES in from the right, view 2 slides 30% left beneath it; counter 2→3 | transform |
| .66 → 1 | **THE ZOOM PORTAL** (below) | transform + clip-path |

**Mobile:** same script; 3:4 crops; per-photo focal point in copy.ts; no Torch, yes sweep.
**Photos:** `living-03-wood-set` (view 1; D5 evening shot when it lands), `living-02-blue-pair`,
`bespoke-chairs-01`. View 1 eager/high; views 2–3 eager/low.
**Fallbacks:** no JS / reduced motion → view 1 lit, static, no pin.

### The zoom portal (the new signature; used once)

```
progress .66 → 1
┌──────────────────────────────────────────┐
│ view 3   scale 1 → 2.6                    │  transform-origin: var(--focal)  (the cushion)
│                                           │
│            ┌───────────┐                  │  .portal: fixed, ivory, above the hero,
│            │ THE STUDIO│ ← ch.2's own      │  carries ch.2's first heading
│            │  opens    │   first heading   │  clip-path inset(46% 34% 46% 34% round 6px)
│            └───────────┘                  │            → inset(0)
│ text y -40, opacity → 0 · vignette → .6   │
└──────────────────────────────────────────┘
progress 1: pin ends, ch.2's top == viewport top, portal unmounted (identical to ch.2)
```
Compositor-only; scrubbed, so scrolling back pulls you out of the fabric again. Reduced
motion: no portal. It repeats nowhere: one portal is a signature, two is a trick.

### Ch.2 · THE STUDIO (ivory, ~70vh)

The first LIGHT chapter, so arriving through the portal is itself the reveal. Cols 1–6: the
brand paragraph (3 sentences from the brief) + the MD's sentence as a pull quote with crop
marks. Cols 8–12: three drawn trust cards — Free design consultation · Built to your space,
not mass-produced · Delivery & installation included. Beneath: one drawn line **2020 →
2026** with the milestones as ticks (founded · Agrabad showroom 2021 · furniture fair
2024–25 · Chamber 2025 · BFIOA 2026 — all from the brief). **Motion:** lines mask-reveal,
the line draws itself (`stroke-dashoffset`, scrubbed). Mobile: stacked, timeline vertical.
**Transition out:** a hard cut — the paper ends on a rule, the dark floor begins. After a
portal, a cut is the contrast.

### Ch.3 · THE FLOOR (rail; pinned ≥900px, snap carousel below)

Five cards: Living · Bedroom · Dining · Office & Study · **Bespoke — anything**. Card = 3:4
photo, number, name, one line, VIEW → CollectionModal. The 5th card is a drawn outline of
a sofa (no photo): its VIEW scrolls to ch.4. **Desktop:** pin at `top top`, track travels
`-(scrollWidth − offsetWidth)`, `scrub: 1` (the backup's measured rail); cards turn to
face you (`rotateY 14 → 0`, opacity .4 → 1, `containerAnimation`); a hairline fills with
travel; the map lights each room as its card passes centre. **Mobile:** not pinned —
`scroll-snap-type: x mandatory`, 82vw cards, dots from `scrollLeft`, a swipe hint. A
pinned rail under a thumb fights vertical momentum; snap is what phones already know.
**No-JS:** the stacked grid.

### Ch.4 · THE DRAFTING TABLE — the 3D chapter (pinned, 300vh) — RESTORED

Desktop: three steps on cols 1–3 (Designed / Crafted / Customized, lit as the scrub
passes), the stage on cols 4–12 with DimensionLines off its edges printing the REAL mm
from the mesh, swatches + CTA under the steps, "See it in your room" beside the stage.
Mobile: stage on top (52vh), steps beneath, pinned the same.

`bespokeProgress` 0 → 1 (`scrub: 1`), `bespokeArrival` once at `top 85%`:
- 0 → .30 **Designed** — blueprint edges draw (opacity .45 → 1), grid brightens, step 1 lit
- .30 → .70 **Crafted** — the clip plane sweeps bottom → top; wood and velvet under the wire
- .70 → .98 **Customized** — opaque path, swatches wake; a tap re-dyes the piece + the CTA
- ≥ .98 **360 inspect** arms (azimuth free, polar clamped), the 12° nudge, the hint line

**Exit:** unpin; the piece stays on the fixed canvas (z 4) and ch.5 slides over it.
**Fallbacks:** low tier / no WebGL / no JS → lit CSS stage + the sofa poster, steps static,
swatches still rewrite the CTA.

### Ch.5 · THE MAKER (~75vh)

Portrait (keyed JPEG until the cut-out PNG), his sentence, name · role · Est. 2020, the
milestones as a small drawn timeline. **Motion:** the DIM beat (the lights dip once as he
arrives, kept), words out of a blur. No pin.

### Ch.6 · TAKE IT HOME (~80vh)

Two things side by side (stacked on mobile): the **AR card** — the piece you just dyed,
"See it in your room" → `<model-viewer>` with the swatch's GLB (the fabric choice carries
through: that is the story paying off) — and the **showroom film** in a 16:9 frame that
opens from its middle (shutter), play → the youtube-nocookie facade; address · directions ·
phone beneath. The map's last room lights.

### Ch.7 · YOUR ROOM (100vh centred)

"Ready to design around you?", the 3-step quote builder (kept: room → size → name/phone →
WhatsApp with the message written), "or call". The FloodBeam returns WIDE; the page ends
lit. Footer beneath.

---

## 3. Performance plan (budgets unchanged)

- LCP = the hero TEXT, server HTML, untouched before paint. Darkness and the sweep are CSS
  on the photo layer only.
- GSAP + ScrollTrigger + Lenis mount on idle after first paint (`requestIdleCallback`, 1.5 s
  cap): a pinned hero cannot wait for a gesture. One chunk, ~45 KB gz.
- three.js mounts when ch.4 is 1.5 screens away (kept). One canvas. Low tier never mounts.
- Images: view 1 eager/high, views 2–3 eager/low, rest lazy/low. Regenerate at 1600w.
- Pins are the only layout work and happen once per refresh. The map is one SVG with
  attribute toggles.
- Gates: tsc · eslint · build · Playwright at 1440/390/360 (pins release where they should,
  overflow 0, positions) · Lighthouse mobile ≥ 85, desktop ≥ 95 · real phone.

---

## 4. What comes back from the backup

| Backup file | Chapter | Change |
|---|---|---|
| `ui/FloodBeam.tsx` + `.floodBeam*` CSS | 1, 7 | CSS → shared.module.css; add the load sweep |
| `ui/Torch.tsx` | 1 | as-is, opacity .35 |
| `sections/Hero.tsx` slider (commit 2c89a56) | 1 | rewrite as `deck/Hero.tsx`: three views + focal points + portal |
| `sections/Brand.tsx`, `Proof.tsx` | 2, 5 | structures + the timeline; deck tokens |
| `ui/CropMarks.tsx` | 2, 4 | as-is |
| `PageMotion.tsx` S4 rail block (838–880) | 3 | → `motion/RailMotion.tsx` |
| `sections/Collections.tsx` cards | 3 | keep markup; add the drawn 5th card |
| `sections/Bespoke.tsx`, `ui/SwatchDock.tsx`, `ui/DimensionLine.tsx`, `ui/InspectHint.tsx` | 4 | restore; StageCanvas already carries sweep + inspect |
| `PageMotion.tsx` S3 pin block (397–520) | 4 | → `motion/BespokeMotion.tsx` |
| V5 `deck/Modal*`, `QuoteModal`, `ArModal`, `CollectionModal`, `Header`, `DeckFooter` | all | keep; the counter becomes the map |
| V5 `DeckMotion` | — | retire; split into HeroMotion / RailMotion / BespokeMotion / SheetMotion |
| new | all | `deck/Map.tsx` (the floor plan), `deck/Narrator.tsx` (one line), the portal |

---

## 5. Build order (3 days, gated)

**Day 1 (09-04):** ch.1 (flood, torch, 3 views, portal) + ch.2 (paper, timeline) + the map
+ the narrator. Gates + phone.
**Day 2 (09-05):** ch.3 rail (desktop pin, mobile snap) + ch.4 drafting table restored
(steps, sweep, swatches, inspect, dimension lines). Gates + phone.
**Day 3 (09-06):** ch.5–7, the AR carry-through, whole-page pass at 1440/390/360,
Lighthouse, README, screen recording, deploy. Buffer for D3/D5/logo/portrait.

---

## 6. Decisions for Saadman (four, fast)

- **D-A · Hero views:** wood set → blue pair → bespoke chairs, in that order? (Or the
  evening showroom shot as view 1 when it lands.)
- **D-B · Rooms on mobile:** snap carousel (recommended) or a pinned rail like desktop?
- **D-C · The portal's focal point:** into the sofa's fabric (recommended) or into a doorway?
- **D-D · The map:** floor plan (recommended) or a simpler vertical "chapter" rail?

Answer these and the build starts with chapter 1.


---

# PART B — REVISION 2 (Saadman's screenshot review, 2026-09-03 late)

> Verbatim: "these sections seems not ok - i am missing previous version 3d sofa bed
> objects and the skeleton to shaped sofa object section … in Ar section modal mouse
> scroll not working. in some sections titles are hidden - in timeline - add some
> animated gsap good idea that feels cool - the categories sections are not looking cool
> - seems normal - use some different type image cool hover and frames. when I click menu
> showroom - screen gets white looks like broken. other menus not working, I want a mega
> menu with big menu titles, with images, onclick any category opens a detail cool
> animated page for products views from where can view all products, also at top menu in
> categories menu click opens megamenu … make it easy for customers."

## B1. Bugs seen in the screenshots (fix first, in this order)

| # | Symptom (screenshot) | Cause | Fix |
|---|---|---|---|
| 1 | Hero's zoomed photo sits over the studio; studio title under it | the `margin-top: -100svh` hand-off overlaps the un-pinned hero with the studio and the z toggle is not enough | **Drop the overlap.** Keep the portal (fixed, opaque) visible from progress 1 until `#studio` reaches `top top` (second ScrollTrigger hides it on enter, shows on leaveBack). The hero scrolls away UNDER the paper. Shorten the hero pin to `+=200%` so the total dwell is unchanged. Remove `html[data-night] .studio { margin-top }` and `.studio { z-index }`. |
| 2 | Studio shows only the title; paragraph, cards and timeline invisible | `data-wait` reveals keyed to ScrollTrigger positions that the overlap confused; nothing removed them | Reveal system → **IntersectionObserver** (`rootMargin: 0 0 -18% 0`, once), independent of pins. Plus a mount-time sweep: anything already inside the viewport is revealed immediately. |
| 3 | Floor title's first line cut by the studio's paper | `.studio { z-index: 1 }` paints over the pinned (fixed) floor | goes with #1 (no z-index on the studio) |
| 4 | AR modal: mouse wheel does not scroll the sheet | Lenis is stopped while a modal is open and prevents wheel everywhere; the sheet needs an exemption | `data-lenis-prevent` on `.modalBody` (and the dialog); model-viewer keeps its own wheel for zoom |
| 5 | "Showroom" nav → white screen; other anchors do nothing | native hash jump lands inside pin-spacer territory; Lenis and ScrollTrigger disagree about where `#home` is | **Nav goes through the scroller**: intercept header/footer anchor clicks; target = the section's ScrollTrigger `start` when it is pinned, else its offsetTop; `lenis.scrollTo(y)` on desktop, `window.scrollTo({top:y, behavior:'smooth'})` on phones; `history.replaceState` for the hash. |
| 6 | Titles hidden elsewhere | same as #2 | same as #2 |

## B2. Bring back the 3D objects (the previous version's turntable)

The backup's hero carried THREE generated pieces (sofa, bed, chair: `hero.pieces`,
`piece-geometry.ts`) on a drag-to-turn turntable with a piece switcher. StageCanvas STILL
renders that view when an element `[data-stage-hero]` exists, so restoring it is a
chapter, not a rebuild.

**New chapter 3 · "The pieces" (pinned ~200vh) between the studio and the floor**
- narrator: "Turn it."
- the turntable: sofa → bed → chair, one at a time, each yawing a quarter turn as the
  scroll passes it (`heroProgress` + `setHeroPiece`), drag to spin (Turntable.tsx, kept
  from the backup), the piece's real mm printed under it (Dimension, stage 'hero'),
  three small piece tabs (Sofa · Bed · Chair) that also switch it
- desktop: piece on the right two-thirds, caption left; phone: piece on top, tabs beneath
- the drafting table (ch.5 now) keeps the skeleton → sofa sweep; the two chapters answer
  different questions: "what do you build" (turntable) and "how is mine built" (table)
- fallbacks unchanged: low tier gets the three photographs on a snap track

Map gains a room; chapters renumber 1–8. Heights stay all-different (250 pin · 70 · 200
pin · 100/auto · 300 pin · 75 · 80 · 100).

## B3. The categories chapter: a gallery wall, not a row of cards

Replace the five equal cards with a **gallery wall**: framed plates of different sizes
hung at different heights, walked past on the rail.
- five frames: 3:4, 1:1, 4:5, 3:4, and the drawn bespoke outline; alternating vertical
  offsets (0 / 8vh / 3vh / 10vh / 5vh) so the eye moves
- each frame: an ivory mat (12px) + a 1px brass frame + crop marks; the photograph
  inside sits 4% larger than the mat and drifts on hover
- hover (pointer): the frame tilts 4° toward the pointer (one `pointermove` per card,
  transform only), a light pools on it, the name slides up out of a mask and the VIEW
  pill appears
- click on the frame = open (already wired through data-view-pill)
- phone: same frames in the snap track, mats included, no tilt

## B4. The timeline (studio): a GSAP moment, not a line

- the 2020 → 2026 line draws itself (kept) and a brass dot travels its length as the
  visitor scrolls, lighting each year's tick as it passes (one scrubbed timeline)
- each milestone's text arrives from a 20px slide + blur exactly when the dot reaches
  its tick (same timeline, scrub 0.6 over `top 80%` → `top 30%`)
- the year numbers count up from 2020 (gsap `snap` on `textContent`) as the dot arrives —
  the one place numbers move on the page

## B5. The mega menu + category pages (the customer path)

**Header "Rooms" → mega menu** (desktop hover/click, phone tap):
- a full-width panel drops from the header (`clip-path` inset, 0.5 s): five big titles
  (Living Room · Bedroom · Dining · Office & Study · Bespoke) in the display face, each
  with its photograph; hovering a title swaps the panel's large image (crossfade)
- sixth item: "All pieces" → /collections
- phone: the wordmark row gains a burger; the menu is a full-screen sheet (the same
  `<dialog>` system as the modals, hash-synced so Back closes it) listing the five rooms
  as image tiles + the four anchors + the WhatsApp CTA
- one component: `deck/MegaMenu.tsx` (client), copy from `catalogue.categories`

**Category page `/collections/[slug]` (exists; redesigned in the night system):**
- dark ground, chapter-style heading ("01 · Living Room", narrator "Sofas, built to the
  wall they stand against."), the pieces as framed plates in a masonry of two sizes
- entrance: the plates print in one after another (clip-path wipe, 60 ms stagger) — the
  "cool animated page"; each plate opens the piece in the existing modal (photo, specs,
  CTA naming the piece) — `enquiry` message already exists in copy.ts
- "Next room →" at the foot walks to the next category; "Back to the floor" returns to
  `/#floor`
- `/collections` index: the five rooms as the gallery wall again, full width

**Page transition:** the View Transitions API (`document.startViewTransition`) where
available (Chrome/Edge/Safari 18) with a 0.4 s crossfade + the frame's
`view-transition-name` so the clicked photograph flies into the page's hero plate;
elsewhere a plain navigation (Next Link). No library.

## B6. Order of work (one day, gated)

1. B1 bugs 1–6 (hand-off, reveals, modal wheel, nav scroller) — 2 h
2. B2 the pieces chapter (restore turntable) — 2 h
3. B5 mega menu + phone menu — 2 h
4. B3 gallery wall + B4 timeline — 2 h
5. B5 category pages + transition — 2 h
6. Gates (tsc · eslint · build · Playwright desktop/phone with a real wheel · Lighthouse)
   + PROGRESS.md

Everything stays on one landing page; the category pages are the "lot of pages"
Saadman allowed, and they exist already as routes.

## B7. Status (2026-09-03, end of the PART B session)

All of B1-B5 built and verified (see PROGRESS.md, same date). Deviations
from the plan above, each on purpose:

- B1 #1: the portal's visibility is not toggled by two callbacks but
  recomputed as a pure function of the scroll (hero pin progress >= .68 AND
  the studio not yet at the top) on the hero timeline's onUpdate and on the
  studio trigger's onEnter / onLeaveBack / onRefresh. Two callbacks lost a
  race against the scrubbed timeline on a nav jump.
- B2: five pieces, not three - the previous build already drew one per room
  (royal sofa, bed, dining set, desk, armchair) and the floor has five
  frames, so the turntable shows the same five. Pinned on phones too
  (innerHeight >= 560), the stage above the tabs.
- B3: the frame is the LINK to the room page (the customer path) and the pill
  beneath is the quick look; the hover name-mask became "Open the room"
  rising from the foot of the glass, with the room's name always printed on
  a brass plaque under the frame - a customer should not have to hover to
  learn what a picture is.
- B5 page transition: CROSS-DOCUMENT view transitions (`@view-transition
  { navigation: auto }`, plain `<a>` navigations) instead of
  `document.startViewTransition` around a client-side push. Zero JS, works
  for the prerendered static pages, and Next's client router never has to be
  awaited. The room pages' entrance is CSS `@starting-style`, so they carry
  no motion script at all.
- The header on the room pages is the deck Header (solid, anchors prefixed
  with `/`), not CatalogueChrome; /about, /process and /contact still use
  CatalogueChrome and are untouched.


---

# PART C - THE LIVE REVIEW (2026-09-03, evening)

Saadman clicked through the build and sent ten notes. What changed, and why:

| # | His note | What was actually wrong | What it is now |
|---|---|---|---|
| 1 | "when i click on contact or any menu, it makes the website white ... scroll not working" | THE PORTAL. A fixed ivory sheet carrying the studio's heading, opened by the hero's zoom; any jump past the hero could leave it standing, and a full-screen opaque fixed element is a white broken page | **Deleted.** The hero ends on `lightsOut`, an ink overlay INSIDE the hero: the room goes dark and the studio's paper is a hard cut. Nothing full-screen outlives its own section any more |
| 2 | "I have seen the 3d categories sections you added - remove that section" | - | the turntable chapter, its two components, its copy and its motion are gone; seven chapters again |
| 3 | "categories not looking cool ... glassy, black white to focused one colorful, bigger images, mouse view cursor, diagonal crossing" | the wall was five equal cards in a row | **THE GLASS WALL**: five plates, different ratios, hung at different heights and angles so they cross on a diagonal and overlap; the whole wall behind glass and in black and white; the plate under the pointer (or, with no pointer, the one the scroll brings to the middle) slides its pane away and comes up in colour; a brass ring cursor that becomes a VIEW disc over a plate |
| 4 | "Change top Request a quote button ... must not match hero" | it was the hero's pill | a hairline brass plate with corner ticks that fills from its baseline on hover, label turning to ink |
| 5 | "can we make these sections clickable and redirect" (the map) | the map was decorative | every room is a link to its chapter through the nav scroller, on a fine pointer only |
| 6 | "take away texts from the face" / "add gaps from image to top section" | `.inner .makerText` on one element: `.inner` centres what it holds, so narrowing the column walked it onto his face | the column sits inside the centred inner, capped at 46%, with an ink gradient holding the left; 20px clearance measured. On a phone he is a block at the top with 88px of air under him. The chapter opens on a hairline and ~390px of silence |
| 7 | "we have the timeline here, why need again above owners face" | the milestones were printed twice | the maker keeps his sentence and his name; the studio's founding line is the one timeline |
| 8 | (the founding line showed 2024 twice) | a scrubbed count-up prints years that never happened | the years are printed; the dot, the ticks and the slide carry the motion |
| 9 | "where is that skeleton 3d sofa gone? i want that" / "in mobile view that skeleton sofa not showing" | StageLoader's rootMargin had been cut 150% -> 60% for the turntable chapter's sake | 150% again - with the only stage four chapters down it cannot fire during the page's own load. Verified at 1440 and 390 |
| 10 | "can we make this youtube video autoplay?" | the film waited for a press | muted, looping, no controls, desktop only, once the panel is 55% on screen, with "Watch with sound" over it. A phone keeps the zero-byte facade |

Two more found while fixing those: the sticky WhatsApp pill never appeared on
a room page (the layout sets `html[data-hero-view=1]` for every route and only
the motion layer removes it), and the bespoke plate's "See it drawn" pointed
at `#table` from `/collections`, where no such section exists.

**The AR viewer, answered:** `model-viewer`, self-hosted, loaded only on
press. Android with ARCore places the piece in the room at true size; an
iPhone gets a 3D view until a USDZ export exists (`ios-src`); a desktop gets
3D. The modal is usable at 390px (345x491 in an 844-tall viewport).
