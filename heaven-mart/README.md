# Heaven Furniture Mart — landing page

**Drawn to Measure.** A one-page site for a bespoke furniture studio, built so that the
page *is* a technical drawing of itself: every element sits on a measured column grid, the
grid is drawn on screen in light, and the piece in the hero carries its own real dimensions,
read off the 3D model at load rather than typed by anyone.

Built for the [Racdox Hackathon 2026](https://www.racdox.com/hackathon) for
**Heaven Furniture Mart**, Agrabad Access Road, Chattogram.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

Node 20+. No backend, no database, no environment variables required — it deploys as a
fully static export to any host.

| script | what it does |
|---|---|
| `npm run dev` | dev server (Turbopack) |
| `npm run build` | production build; type-checks as part of the build |
| `npm run crop` | `assets-raw/photos/originals` → `graded`: removes burned-in ad overlays |
| `npm run photos` | graded-else-originals → WebP widths + LQIP + `src/content/photos.generated.ts` |
| `npm run placeholder` | regenerates the hero fallback plate |
| `npm run ar-models` | re-exports the AR sofa GLBs, one per fabric, from the same generator the page draws with |

Quality gates (both must be silent before anything ships):

```bash
npx tsc --noEmit
npx eslint src
```

`next lint` was removed in Next 16 — run ESLint directly.

## Optional environment

| variable | effect when unset |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Open Graph URLs fall back to the Vercel production URL |
| `NEXT_PUBLIC_META_PIXEL_ID` | **no pixel at all** — zero third-party bytes, zero requests |

The pixel id is validated as digits-only before it is interpolated into a script tag, so a
malformed or hostile value can never become markup.

---

## The design in one paragraph

The page owns no colour. Ink, paper, and white light — and the only things allowed to carry
hue are the ones that actually have it: the photographs, the 3D pieces, the fabric swatch
chips (they *are* material samples) and the client's own logo. That is the right hierarchy
for a furniture studio: the product is the only colourful thing in the room. Photographs
arrive in grayscale and turn colour as you scroll, which makes the arrival of Heaven's real
work the page's recurring event rather than a decoration.

Everything is measured. One 8px module, a six-column grid on desktop and three on mobile,
and exactly one panel ratio (√2, the A-series sheet). The drawn background grid and the
layout grid read the *same* two CSS custom properties, so a drawn line is a column line by
construction rather than by eye — verified by measurement, not by looking (34 of 35 placed
blocks land within 1.5px of a column boundary; the one exception is Sheet 02's photograph,
which bleeds off the page on purpose).

The full design law is in [`../BLUEPRINT.md`](../BLUEPRINT.md); the implementation notes,
traps and verification recipes are in [`../BUILD-GUIDE.md`](../BUILD-GUIDE.md).

## The story

Nine sheets, one route, told in `src/content/copy.ts` as a single `story` array that the
title blocks, the beat captions, the Index overlay and the sheet **count** all read from — so
the wayfinding cannot disagree with itself, and adding a sheet renumbers the whole set.

```
01 The Window          a piece waits, lit          (grabbable 3D turntable)
02 The Studio          the lights come on          (the loadshedding cut)
03 The Maker           in his own words            (portrait, quote, timeline as a dimension line)
04 The Drafting Table  yours is drawn              (blueprint -> craft -> customize)
05 The Range           walk the collections        (pinned horizontal rail)
06 The Showroom        step through. Agrabad.      (aperture + the cut)
07 Your Room           see it in your place        (press-to-load AR, in the chosen fabric)
08 The Hands           who builds it               (the team; absent until the photograph exists)
09 The Order           have yours drawn            (the last ask + the brief form)
```

The Maker sits third rather than seventh because "who is behind this" is a bespoke buyer's
second question, and the Hands sits immediately before the ask because the last thing a
visitor should see is the people who would do the work.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · CSS Modules and custom
properties (no utility framework) · GSAP 3 with ScrollTrigger and SplitText · Lenis ·
react-three-fiber + drei on three 0.185 · `@google/model-viewer` for AR, self-hosted.

**No 3D assets.** Every piece is generated from real furniture dimensions by
`src/components/three/piece-geometry.ts` — see the rule below and `ASSETS.md` §3a.

Every section is a **Server Component**. Motion, 3D and AR attach to them from client
islands through `data-*` hooks, so the page's markup is the page.

---

## The three rules this codebase actually runs on

**1. Every initial state is set from JavaScript, never from CSS.**
The CSS always describes the *finished* page: images printed and in full colour, the light
on, the timeline drawn, the thread complete. Motion code pushes things *back* to their
"before" state and then animates them forward. So with JavaScript disabled, under
`prefers-reduced-motion`, or if the motion layer throws, a visitor gets a complete page
rather than a blank one. Inverting this anywhere turns a broken script into a broken site.

**2. Nothing is promised that is not there.**
The dimension lines print the piece's own bounding box in millimetres, so they cannot lie —
and because the pieces are *built* from furniture dimensions rather than downloaded, "2100 MM"
under the hero is a width a workshop could cut to. No 3D means no dimension line, no grab
cursor and no "drag to spin" hint: an affordance may only exist once the thing it refers to
does. The Hands sheet does not render at all without its photograph, because an empty frame
captioned "the team" is a page admitting it has no team to show. The hero's captions stay at
*category* level; the page never names a product it cannot deliver.

**2b. The pieces are drawn, not downloaded.**
The turntable used to run on Khronos glTF sample assets — until a competing hackathon entry
shipped the identical model. Swapping in a different free asset would only have moved the
collision, so there is no asset: `piece-geometry.ts` generates a three-seat sofa, an armchair
and a settee from one parametric design language. It costs zero bytes, carries no attribution
obligation, is ready on the frame it is asked for (so a fast scroll can never find an empty
stage), and lets the fabric swatch reach the hero and the AR export as well as Sheet 04.
`npm run ar-models` runs the same generator through `GLTFExporter` to produce the AR files.

**3. Enhancements supervise themselves.**
Smooth scroll fails *closed* — Lenis consumes the wheel event, so anything that stops it
from running removes scrolling entirely. `SmoothScroll.tsx` therefore watches its own work:
a wheel gesture that can move the page but does not, within 700ms, tears the smoothing out
and hands scrolling back to the browser; if the wheel is still dead after that, it drives
the scroll by hand. Both levels are last resorts and a healthy page never runs a line of
them.

## Accessibility and fallbacks

Lighthouse **Accessibility 100 · Best Practices 100 · SEO 100**.

- Full keyboard path; the Index overlay is a real dialog with a focus trap and Escape.
- Contrast floors are computed, not guessed — the dimmed *start* of every dim-to-bright
  scrub still passes 4.5:1, because that is the state an audit snapshots.
- No WebGL, low-end device, Data Saver or a 2G/3G connection → no 3D at all, and the lit
  CSS stage is the finished look rather than an error state.
- No AR support → the section still ships, and the copy says plainly which devices can
  place a piece in a room and which get a 3D view.
- Reduced motion → not a single tween is created; the page is simply already finished.

**Performance is the honest trade.** Mobile Lighthouse Performance sits at ~48. First paint
is 1.1s, but the hero is a real WebGL scene, and parsing three.js on Lighthouse's 4x-throttled
mid-range phone costs several seconds of blocking time on its own — with the 3D disabled
entirely the same page scores 58, which is the ceiling for a build that also shows a brand
preloader. That gap is a deliberate trade, and it is stated rather than hidden.

What was fixed rather than excused: the 1.5 MB HDR environment map became a procedurally
generated one; **the 1.8 MB of GLB models and the 752 KB Draco decoder are gone entirely**,
replaced by geometry built in the browser; the image `srcset` now advertises the widths the
files actually are; and the 3D no longer loads on top of the headline. Visitors on Data Saver
or a slow connection get no preloader, no hero animation and no 3D — the page, finished,
immediately.

## The contact form has no backend, on purpose

Sheet 09's brief form composes the visitor's answers into a WhatsApp message and opens the
studio's own thread with it already typed. It cannot fail silently the way a POST behind a
"thanks, we'll be in touch" can; it is where this client already works; nothing is stored;
and there is no endpoint to rate-limit, no inbox to spam and no personal data at rest. With
JavaScript disabled the `<form action>` is still a working WhatsApp link.

If a real backend replaces it, the checklist it must satisfy first is written at the top of
`src/components/ui/ContactForm.tsx`: server-side validation and length caps, rate limiting by
IP and by phone, a honeypot plus a timing check, the WhatsApp path kept as the failure
fallback, the phone number never logged, HTTPS only, origin locked down.

## Assets and licences

Photographs are Heaven Furniture Mart's own, cleaned of burned-in ad overlays. **No
third-party 3D assets ship**: every piece is generated by `piece-geometry.ts`, which is why
the footer no longer carries a CC-BY credit. Full ledger: [`../ASSETS.md`](../ASSETS.md).

---

Built for the Racdox Hackathon 2026 · `#racdox_hackathon`
