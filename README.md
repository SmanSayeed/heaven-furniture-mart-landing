# Heaven Furniture Mart — landing page

**A Night at Heaven.** A one-page site for a bespoke furniture studio, told as a walk
through the showroom at night: the visitor is handed a light, the rooms come on one by one,
a piece is drawn to their measurements and built in front of them in 3D (its real
dimensions read off the mesh, never typed), they choose its fabric, turn it, place it in
their own room in AR, and are asked one question. Seven chapters, seven different motions,
a floor-plan map that lights as you go. Each chapter is one component in
`src/components/night/`, driven by the single orchestrator in
`src/components/motion/NightMotion.tsx`.

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

The design law lives in the code that enforces it: the type scale, the column grid and
the two grounds are all tokens at the top of `src/app/globals.css`, and every rule that
depends on one reads it from there rather than restating it.

## The story

Seven chapters, one route, told in `src/content/copy.ts` as `night.chapters` - the chapter
tags, the narrator lines and the map all read from the same array, so the wayfinding cannot
disagree with itself.

```
01 The floodlit room   the power is out; you have a light   (pinned: flood -> iris -> slide -> zoom, then the lights go out)
02 The studio          through the fabric                   (paper; the founding line draws itself under a brass dot)
03 The floor           walk the floor                       (pinned rail past the glass wall; snap track on phones)
04 The drafting table  yours is drawn                       (pinned: blueprint -> craft -> your fabric, real mm off the mesh)
05 The maker           the man who builds it                (portrait, his own sentence, the lights dip once)
06 Take it home        take it home                         (AR in your room, the showroom film, the address)
07 Your room           tell us your room                    (the one ask, on WhatsApp)
```

THE GLASS WALL is chapter 3: five plates of different proportions, hung at different heights
and angles so they cross the screen on a diagonal, the whole wall behind glass and in black
and white. The one under the pointer - or, with no pointer, the one the scroll has brought to
the middle - slides its pane away and comes up in colour. A brass ring follows the mouse and
becomes a VIEW disc over a plate.

Beyond the landing page: `/collections` (the five rooms as the same wall) and
`/collections/[slug]` (one room, its real pieces as framed plates, each opening a sheet whose
one action names the piece). The header's "Rooms" is a mega menu on wide screens and a
full-screen sheet behind a burger on phones; the floor plan in the corner is also a menu.
Frames and menu titles are plain links, and the photograph flies into the page it opens
through a cross-document view transition.

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
the footer no longer carries a CC-BY credit. Fonts: Inter Tight only, self-hosted through
`next/font` (SIL Open Font License); body copy is set in the visitor's own system sans.

---

Built for the Racdox Hackathon 2026 · `#racdox_hackathon`
