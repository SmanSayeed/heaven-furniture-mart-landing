# SAADMAN-TASKS.md — manual asset work, self-contained guide (v2, "DRAWN TO MEASURE")

> **For any Claude/assistant reading this:** you are guiding Saadman Sayeed through the
> manual asset tasks for a hackathon landing page (Heaven Furniture Mart, bespoke luxury
> furniture, Agrabad, Chattogram, Bangladesh). Speak to him in **Bangla** (friendly,
> "tumi"), tech terms stay English, guide **one step at a time**, wait for him to finish
> each step before the next.
>
> **Design context you need (v2 — this changed):** the page is a black-and-white
> "technical drawing" design called DRAWN TO MEASURE (design law: `BLUEPRINT.md`; build
> spec: `BUILD-GUIDE.md`). The PAGE is monochrome; the PHOTOS and 3D pieces are the only
> colourful things on it, and they bloom from grayscale to colour on scroll. So when
> cleaning photos: **never let the AI shift the furniture's colours** — the photos carry
> ALL the colour of the whole site.
>
> Folder for everything: `l:\projects\hackathons\racdox hackathon\assets-raw\`
> Hard rules: never invent furniture the client does not sell (AI touch-up of real photos
> allowed, AI invention is not) · keep EXACT filenames as instructed · carved details must
> never change · report each finished task back to the main Claude Code session.
>
> **Nothing here hard-blocks the build anymore** (cropped versions of every photo are
> already live). Every file Saadman delivers UPGRADES one slot automatically. Do tasks in
> this order anyway — it is sorted by value-per-minute.

---

## TASK 1 · WhatsApp group — **DONE 2026-09-02**, answers recorded

All six questions are answered; do not re-ask. Full detail in PROGRESS.md.

| # | Question | Answer |
|---|---|---|
| 1 | Deadline | **2-3 days** (target ship 2026-09-04). Exact clock time never given. |
| 2 | Submission | **Live URL** + video posted publicly on **Facebook or LinkedIn** + fill the organizer's form with that post link. |
| 3 | Showroom walkthrough video | **None exists**, and a showroom visit is not possible. Sheet 05 ships stills-only (slow Ken Burns pan on a real photo). |
| 4 | Higher-resolution photos | **No.** The ten Facebook originals are everything we get. |
| 5 | Official logo file | **Yes, available** — still to be collected into `assets-raw/logo/`. |
| 6 | MD's signature image | **No.** |

**Consequence for Sheet 07 ("The man who signs it"):** there is no signature and we will not
fabricate one. DECISION (Saadman, 2026-09-02): keep the sheet, drop the signature. The MD's
quote and portrait carry it, closed by a typeset attribution set as a technical-drawing title
block (`ABUL KALAM BHUIYAN / MANAGING DIRECTOR / EST. 2020`). The sheet title must be renamed
so it no longer promises a signature.

## TASK 2 · Gemini photo cleans — **RUN ONCE, RESULT MEASURED, NEEDS A TARGETED REDO**

**What actually happened (2026-09-02).** Saadman ran the v1 prompt on all ten photos. The
overlays are gone and the furniture survived intact, but two prompt assumptions were WRONG
and are now measured facts:

1. **"Upscale to 4K" does nothing.** Every one of the ten came back at **1024 px wide**.
   Gemini's image output caps there. **1024 px is our hard source ceiling** — the design and
   the `WIDTHS = [480, 960, 1600]` pipeline must be built knowing the 1600 tier is an
   enlargement, not real detail. Delete this sentence from the prompt; it only wastes a retry.
2. **Gemini removed the text by CROPPING, not by repainting.** Originals are 1024x1024;
   nine of the ten graded files came back **1024x625** — it zoomed in until the overlay fell
   outside the frame. `living-01-beige-set` lost the wall panelling, the chandelier, the
   flower vase, the framed painting and the top edge of the sofa. That is the room context,
   and the room context IS the "luxury interior studio" the brief scores first.
   Only `hero-sofa-01-frontal` survived at a true 1:1 and it is excellent — accepted.

**The fix is one added sentence.** Use this prompt, not the v1 one:

```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall, ceiling and floor naturally
in the areas where the text and logo used to be, matching the existing
room. Do not change the [sofa and its carved golden frame], its fabric,
colors or proportions. Keep the whole room visible exactly as in the input.
```

**Scope (Saadman's decision, 2026-09-02): redo the TOP 3 ONLY, then reassess.**
```
living-03-wood-set.jpg    living-02-blue-pair.jpg    bedroom-01-royal-bed.jpg
```
These three carry the sheets where a photo is shown large. Roughly 7 minutes. If the output
comes back a true 1024x1024 with the room intact, do the remaining six the same way; if
Gemini crops again despite the instruction, stop and ship the cropped versions — they are
clean and usable, just tighter.

**Quality gates (retry if ANY fails):** output is **1024x1024, not cropped** · carving pattern
IDENTICAL · cushion count unchanged · **colours unchanged** (the page is monochrome; the photos
carry ALL of its colour) · no smudges where the text used to be.

Save into `assets-raw/photos/graded/` under the SAME filename. Then tell the main session so it
runs `npm run photos`. `hero-sofa-01-frontal` is DONE — do not touch it again.

**Housekeeping:** `graded/old-hero-sofa-01-frontal.jpg` is a stray earlier attempt. The pipeline
keys on the filename, so it currently registers as an eleventh photo. Delete it (asked).
`graded/hero-sofa-01-frontal.jpeg` keeping the `.jpeg` extension is fine — `key()` in
`optimize-photos.mjs` strips the extension, so no rename is needed.

## TASK 3 · Gemini: 4 views of the hero sofa for Meshy (~10 min)

Attach the CLEANED `assets-raw/photos/graded/hero-sofa-01-frontal.jpeg` (verified good). Run 4 times, changing only
the bracketed words:

```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
[straight-on front view] / [45 degree left view] / [45 degree right view] / [direct rear view]
```

Save EXACTLY as:
```
assets-raw/sofa-views/front.png     assets-raw/sofa-views/left45.png
assets-raw/sofa-views/right45.png   assets-raw/sofa-views/rear.png
```
Reject any view whose proportions drift from the front (arm height, leg shape, back
curve). Consistency beats beauty: these four feed a 3D generator; mismatched views make
a broken model.

## TASK 4 · Meshy: photo → 3D (~20 min) — after Task 3

Why this matters doubly now: the page draws REAL dimension lines around the 3D piece
from its measured bounding box. A Meshy scan of Heaven's actual sofa means the site
displays Heaven's actual furniture at its actual proportions — the strongest possible
"drawn to measure" proof. It also replaces three CC-BY placeholder models AND their
required credit line in the footer.

1. meshy.ai → **Image to 3D** → **Multi-view** input.
2. Upload the 4 files from `assets-raw/sofa-views/` into their marked slots.
3. Settings: newest model, Symmetry ON, quad mesh OFF, polycount 30k–40k, PBR ON.
4. Judge against the photo: reject fused arms/legs, hollow back, wrong silhouette;
   redo Task 3 views if needed.
5. Export twice:
   - **GLB** (PBR textures) → `assets-raw/models/sofa.glb`
   - **USDZ** → `assets-raw/models/sofa.usdz`  ← **this one unlocks iPhone AR**
     (without USDZ, iPhones get a 3D viewer but no camera placement)
6. Note your Meshy plan's licence line for ASSETS.md.

If time allows, repeat for ONE more piece (the royal bed or the damask chair) — the hero
turntable shows three pieces and every real one replaces a placeholder.

## TASK 5 · Facebook hunt, round 2 (~10 min)

From facebook.com/HeavenFurnitureMart albums, max size, into
`assets-raw/photos/originals/`:
- widest INTERIOR showroom shot → `showroom-01.jpg` (Sheet 05's room)
- golden/palace full-room set → `bespoke-golden-room-01.jpg`
- blue bed with gold throw → `bedroom-02-blue-gold.jpg`
- MD Abul Kalam Bhuiyan's portrait, largest → `assets-raw/photos/people/md-portrait.jpg`
- team group photo → `assets-raw/photos/people/team-01.jpg`
  (Sheet 07: the portrait sits grayscale next to his quote and colours on touch - it needs a
  clean, front-facing file. Clean overlays with the Task 2 prompt if present. There is NO
  signature to sit under it; a typeset title block closes the sheet instead.)
- logo, largest (profile picture) → `assets-raw/logo/logo.png`
- (REMOVED: there is no walkthrough video on the page and none is coming - see Task 1 answer 3)

## TASK 6 · Showroom video — **CANCELLED** (Saadman, 2026-09-02)

No walkthrough video exists and a showroom visit is not possible inside the 2-3 day window.
Sheet 05 ships stills-only: a slow Ken Burns pan over the widest real showroom photograph,
which is exactly the kind of restrained motion the design already calls for. Nothing here is
blocked; do not keep this task open.

## TASK 7 · Phone check (2 min, whenever asked)

Same WiFi as the PC → phone browser → `http://<pc-ip>:3000` (the main session gives the
exact IP). Check: scroll feel · the hero piece spins with a finger AND the page still
scrolls vertically · every WhatsApp button opens a prefilled chat · nothing cramped.
Report anything broken.

---

## Removed from v1, deliberately
- **The pen-and-paper "handmade layer" task is dropped.** The v1 design wanted wobbly
  hand-drawn marks; the v2 design's human signature is the opposite: machine-precise
  technical drawing (drawn dimension lines, title blocks, the plotter print). Hand
  wobble now would fight the concept. The MD's real signature (Task 1, question 6) is
  the one human-hand mark that stays.

## When each task is done
Tell the main Claude Code session ("task 2 done", "task 1 answers: ..."). It verifies
files, runs pipelines (`npm run photos`, gltf-transform for models), wires everything,
and updates PROGRESS.md. Never commit anything yourself from this side.
