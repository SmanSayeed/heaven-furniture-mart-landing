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

## TASK 1 · WhatsApp group (~5 min) — **DO FIRST: the deadline caps everything**

Join: https://chat.whatsapp.com/FTk1VXPtsG8J3yJSiTHmZy — paste (Bangla is fine there):

```
আসসালামু আলাইকুম! Heaven Furniture Mart-এর ল্যান্ডিং পেজ নিয়ে কয়েকটা প্রশ্ন:
1. Submission-এর exact deadline কবে, কয়টায়?
2. কী কী জমা দিতে হবে - GitHub repo link, live URL, নাকি শুধু video?
3. Agrabad showroom-এর ভিতরের ১-২ মিনিটের ধীরগতির walkthrough video কি পাওয়া যাবে?
4. Facebook/Instagram-এর চেয়ে ভালো resolution-এর product ছবি কি শেয়ার করা সম্ভব?
5. Official logo file (transparent PNG বা SVG) কি দেওয়া যাবে?
6. Managing Director স্যারের হাতের signature-এর একটা ছবি কি পাওয়া সম্ভব? ওনার quote-এর নিচে ব্যবহার করতে চাই।
```

Record every answer (especially the deadline) and report back so PROGRESS.md is updated.
(The signature matters: the page's Sheet 07 is literally titled "The man who signs it.")

## TASK 2 · Gemini: clean ALL 10 photos (~25 min)

Tool: gemini.google.com, image mode (paid plan → Nano Banana Pro quality).
Every collected photo is a Facebook ad graphic (logo + "CRAFTED for LUXURY LIVING" +
address bar burned in). The build currently uses auto-CROPPED versions; a Gemini clean
of the FULL frame is better (more image survives). One photo at a time:

1. Attach the file from `assets-raw/photos/originals/`.
2. Prompt (adjust only the furniture words in the middle sentence per photo):

```
Remove all overlaid text, the logo graphic, and the address bar from this
photo. Reconstruct the background naturally where they were. Do not change
the [sofa and its carved golden frame], fabric, colors, or proportions in
any way. Keep the room exactly as it is. Upscale to 4K with clean sharp
detail. The result must look like an original untouched photograph.
```

3. Quality gates (retry if ANY fails): carving pattern IDENTICAL · cushion count
   unchanged · **colours unchanged** (the site depends on true colours) · no smudges
   where text was.
4. Save to `assets-raw/photos/graded/` with the SAME filename. Files:

```
hero-sofa-01-frontal.jpg   living-01-beige-set.jpg   living-02-blue-pair.jpg
living-03-wood-set.jpg     bedroom-01-royal-bed.jpg  dining-01-cream.jpg
dining-02-peach.jpg        office-storage-01-black-cabinet.jpg
bespoke-chairs-01.jpg      detail-01-blue-sofa.jpg
```

Then tell the main session: it runs `npm run photos` and every slot upgrades.
Priority order if short on time: `hero-sofa-01-frontal`, `living-03-wood-set`,
`living-02-blue-pair` (these carry Sheets 01/02/05 — the two "loadshedding light"
moments), then the five collection-card photos.

## TASK 3 · Gemini: 4 views of the hero sofa for Meshy (~10 min)

Attach the CLEANED `hero-sofa-01-frontal.jpg` from Task 2. Run 4 times, changing only
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
  (Sheet 07: the portrait sits grayscale next to his quote and colours on touch — it
  needs a clean, front-facing file. Clean overlays with the Task 2 prompt if present.)
- logo, largest (profile picture) → `assets-raw/logo/logo.png`
- any showroom walkthrough VIDEO (download or URL) → `assets-raw/video/`

## TASK 6 · Showroom video (~15 min, if the group/page has none)

If Task 1's group provides a video, done. Otherwise, if a showroom visit is possible:
phone HORIZONTAL, walk SLOWLY (half normal walking speed), one continuous 40–60s pass
down the main aisle, no talking, lights on, avoid windows behind you. Save to
`assets-raw/video/showroom-walk.mp4`. This becomes Sheet 05's living background
(the build compresses it; do not edit or add music).

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
