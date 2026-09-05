# HANDOVER — 2026-09-05

For whoever picks this up next. Read `CLAUDE.md` first (it is the law), then
this. `PLAN.md` holds the design and stack decisions; this file holds what a
day of debugging cost and must not be paid for twice.

---

## 1. Where the work is

- Branch `main`, HEAD **`6649828`**, pushed, working tree clean.
- Repo: `github.com/SmanSayeed/heaven-furniture-mart-landing`
- Gates, all green at HEAD: `npx tsc --noEmit`, `npx eslint src --max-warnings 0`, `npm run build`.

This session's commits, newest first:

| | |
|---|---|
| `6649828` | canonical fallback pointed at somebody else's domain |
| `c34baec` | hero reel in room one; the drafting stage could collapse to 2px |
| `aa184b3` | never two ScrollTriggers on one pinned element |
| `0f0ebe1` | ghost sofa; products became a grid; room plates re-cut to 5:4 |
| `81f3815` | hero crop was on the floor; measurement order (`ScrollTrigger.sort`) |
| `1980bbd` | the client's HD photographs |

---

## 2. THE BLOCKER — the deploy is invisible, and it is not a code problem

The build ships. **Nobody can open it.**

```
GitHub deployments → 2026-09-05 13:29:36Z   success   c34baec
  → heaven-furniture-mart-landing-4aw30s04a-smansayeeds-projects.vercel.app
```

That URL, in a real browser, serves **"Log in to Vercel"**. The project has
**Deployment Protection** switched on. A hackathon judge following the
submitted link gets a login wall, not the page.

**Saadman has to do this himself** (no dashboard access from here):

1. Vercel → project `heaven-furniture-mart-landing` → Settings →
   **Deployment Protection** → Vercel Authentication → **Disabled**.
2. Settings → **Domains** → report the production domain. Nothing here knows it.

### Two domains that are NOT this project

Checked today, in a browser, and traced through `git log -S`:

| domain | `<h1>` it serves | in this repo's history? |
|---|---|---|
| `heaven-furniture-mart.vercel.app` | "Made for the way you live." | no |
| `heaven-furniture-mart-landing.vercel.app` | "Furniture, crafted around you." | no |

Neither headline has ever existed here. They are other people's sites —
probably the competitor deploys listed in `docs/CONCEPT-V2.md`. `site.ts`
used to guess the first one as its `metadataBase` fallback, which would have
signed every canonical, the sitemap and robots.txt with a stranger's domain.
Fixed in `6649828`; the fallback is `localhost` now and `NEXT_PUBLIC_SITE_URL`
is documented in `.env.example`.

### Reading deploy state without the dashboard

```bash
gh api repos/SmanSayeed/heaven-furniture-mart-landing/deployments \
  --jq '.[0:5][] | "\(.created_at)  \(.environment)  \(.ref[0:8])"'

ID=$(gh api repos/SmanSayeed/heaven-furniture-mart-landing/deployments --jq '.[0].id')
gh api repos/SmanSayeed/heaven-furniture-mart-landing/deployments/$ID/statuses \
  --jq '.[] | "\(.state)  \(.environment_url)"'
```

`gh` is authenticated as SmanSayeed. `vercel` CLI is installed but not
logged in.

---

## 3. HOW TO VERIFY — and the trap that wasted the most time

**Playwright MCP has not connected all session.** A local copy is installed
(`playwright@1.59.1`, added with `--no-save`, plus `npx playwright install
chromium`). Two harness scripts live in `scripts/qa/`.

### Verify against a production build. Never the dev server.

```bash
npm run build
npx next start -p 3210
node scripts/qa/sweep.mjs ./shots          # three viewports, whole page
node scripts/qa/reel.mjs  ./shots          # the hero reel over one cycle
```

Turbopack's HMR does **not** tear ScrollTrigger's pins down cleanly. A dev
tab left open across a few edits shows pinned sections frozen hundreds of
pixels off-screen: black gaps between chapters, a floor that never arrives,
a stage two pixels tall. **Several hours went into chasing those as real
bugs.** The same commit under `next start` was clean every time.

The client was watching `localhost:3000` while it was being edited, which is
why "the whole website is broken" arrived four times. **Tell him to use the
deployed URL or a `next start` build, never the dev server, while work is in
progress.**

Software WebGL is needed for the 3D to render headless:

```js
chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
```

Killing port 3210 on Windows: `pkill -f` does not match. Use PowerShell:

```powershell
Get-NetTCPConnection -LocalPort 3210 -State Listen |
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

And **stop the server before rebuilding** — a stale `next start` keeps
serving the old build and every measurement lies. That happened once and
cost a full wrong diagnosis.

Do not poll a Vercel URL with a curl loop: forty requests tripped
`X-Vercel-Mitigated: challenge` and every later request 403'd. Harmless, it
clears itself, but the readings in between are worthless.

---

## 4. Traps found this session — each one cost real time

1. **`ScrollTrigger.refresh()` recalculates in CREATION order.** The motion
   layer builds chapters across several animation frames (`later()` in
   `NightMotion.tsx`), so they are created out of document order, and a
   chapter measured before the pin above it existed landed **1388px early** —
   the products strip finished travelling before it reached the screen; the
   studio's icons animated above the fold. Fixed with `remeasure()` =
   `ScrollTrigger.sort()` then `refresh()`. **Keep the sort.**

2. **Never two ScrollTriggers on one pinned element.** A long pin with a
   shorter travel inside it was tried, so the scrub could settle before the
   chapter let go. The pin then resolved against the other trigger's numbers
   and the rooms section froze **1730px below the viewport** — a solid black
   screen between the hero and the rooms. If a scrub finishes late, fix the
   scrub (`1` → `0.3`), not the structure.

3. **Stopping an R3F frameloop does not clear the canvas.** The last frame
   stays painted, and that canvas is `position: fixed`, full-viewport,
   `z-index: 4`. The sofa froze where it was and rode the rest of the page,
   over the showroom video and the footer. Fixed by fading the canvas
   wrapper on the same `near` condition that stops the loop
   (`StageCanvas.tsx`).

4. **`align-content` is not `align-items`.** `.tableGrid` sets
   `align-items: center`; stacked and pinned on a phone, the stage's column
   sized to its own content (36px) inside a 414px row, so `height: 100%` on
   the stage resolved to **2px**. The drei View scissored the sofa into that
   sliver and the drawing had already unmounted — the chapter was three
   words lighting up over nothing. Both the stage and its column now have
   floors so it cannot recur silently.

5. **`1fr` is never smaller than its content.** Any grid row that has to let
   a child scroll needs `minmax(0, 1fr)` and the child needs `min-height: 0`.
   This bit the rooms drawer (last links under the viewport, unscrollable).

6. **The photographs are landscape; the plates were not.** Every room
   photograph Heaven has published is 1.64–1.82 wide, and the wall's plate
   was 3:4 upright, so `object-fit: cover` showed **41% of each frame** and
   then upscaled that slice from a 1024px source. Both "too zoomed" and "not
   clear" were the same bug. The plate is 5:4 now and its height yields to
   its width (`--wall-w`, `--wall-h`) so it never runs off a phone.

7. **The hero crop.** The 16:9 window was cut from the client's square
   restoration at 62% down the frame, and 62% of a room photograph is the
   floor. Windows now live in `scripts/hero-windows.mjs`, named, with the
   reason beside each number.

8. `.line` (the headline mask) needed `0.16em` of descender room; at `0.06em`
   a "y" was cut flat.

---

## 5. Decisions the client has already made — do not re-open

- **Products (`Signature`) is a static grid. No scroll effect at all.** It
  was a horizontal rail three times — pinned, drifting, pinned and slowed —
  and he rejected every one: *"how can a customer check that product"*,
  *"first product image is hidden and customer can never see that — make it
  normal without any onscroll effect"*. There is no motion code behind that
  chapter now. **Leave it alone.**
- **Rooms (`Floor`) keeps its pinned rail.** The contrast is the point: the
  wall is the showroom you are walked through, the grid is the shelf you
  pick from.
- **Hero room one is a two-frame CSS reel** with a mild zoom — pure CSS, no
  JS, no GSAP, no scroll input, so it cannot disturb the scroll story. Frame
  1 carries a negative animation-delay so the LCP is lit on the first
  painted frame; do not "tidy" that away.
- The header carries a gradient scrim so the white wordmark reads on the
  ivory chapters.
- One CTA (WhatsApp), no prices, no cart. Real Heaven photographs only.

---

## 6. Asset pipeline

```
assets-raw/hd/*.jpeg          the client's Gemini restorations (2048², 3:4)
  → npm run hero              cuts named windows          (scripts/hero-windows.mjs)
assets-raw/photos/originals/  everything else, ad overlays burned in
  → npm run crop              removes the overlays        (scripts/crop-overlays.mjs)
assets-raw/photos/graded/     the source of truth; graded beats originals
  → npm run photos            → public/img + src/content/photos.generated.ts
```

`crop-overlays.mjs` carries a `HERO_OWNED` skip list — without it a routine
`npm run crop` silently replaces a 2048px restoration with a crop of the
1024px ad graphic, under the same filename.

---

## 7. What is still open

**Needs Saadman**
- Turn Deployment Protection off; report the production domain (§2).
- Check the page on his own Android over LAN.
- The screen recording and the hackathon submission.

**Needs a session**
- Verify the live deployment end to end once it is reachable.
- A real Lighthouse mobile run. Budgets in `CLAUDE.md` §4; nothing has been
  measured with Lighthouse since the last three commits.
- **Audit item L**: `hero.proof`, `hero.marks`, `intro`, `team` and `arHook`
  in `src/content/copy.ts` are no longer rendered but still contain
  fabricated claims ("Eight-Seat Dining Set", "Royal Canapé Sofa"). Dead
  copy, but it is fabricated client fact sitting in the repo — delete it.
- **Audit item H**: about 25 photograph-dependent specs on the signature and
  room cards ("PIPED EDGE", "GLASS TOP", "ROUND MIRROR") need one human pass
  against the actual photographs. Nobody has looked at them one by one.
- `deck.module.css` still has a comment referring to the deleted
  `sections.module.css`.
- The mobile sweep reports 2 frames with no chapter covering the middle of
  the screen. Almost certainly a section boundary, but it has not been
  looked at.
- `living-02-blue-pair` has no HD restoration; it is no longer a hero view
  but is still used on the collections page.

---

## 8. House rules that bite

- **Reply to Saadman in Bangla.** Code, comments, docs and commit messages
  in English. This is in `CLAUDE.md` and it is not optional.
- **Git**: pushing and merging on this repo is authorised. Destructive
  operations (`reset --hard`, `push --force`, branch deletes, rebasing
  pushed commits) still need to be asked for, every time.
- Never `git add -A` while a background agent is mid-write — it swept an
  unfinished file into a commit once.
- Never invent client facts beyond `CLAUDE.md` §2. If something is missing,
  he asks the hackathon WhatsApp group.
