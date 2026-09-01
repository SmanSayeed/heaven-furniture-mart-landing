# SAADMAN-TASKS.md — manual asset work, self-contained guide

> **For any Claude/assistant reading this:** you are guiding Saadman Sayeed through the manual
> asset tasks for a hackathon landing page (Heaven Furniture Mart, bespoke furniture,
> Chattogram, Bangladesh). Speak to him in **Bangla** (friendly, "tumi"), keep tech terms in
> English, guide **one step at a time** and wait for him to finish each before the next.
> Full project context lives in `PLAN.md` and `CLAUDE.md` in this folder, but this file is
> self-sufficient for the tasks below. Do the tasks IN ORDER; Task 1 blocks everything else.
>
> Folder for everything: `l:\projects\hackathons\racdox hackathon\assets-raw\`
> Hard rules: never invent furniture the client does not sell (AI touch-up of their real
> photos is allowed, AI invention is not) · keep exact filenames as instructed · photos must
> stay believable, carved details must never change.

---

## TASK 1 · Gemini: clean the hero sofa photo (~5 min) — **DO FIRST, BLOCKS EVERYTHING**

Tool: gemini.google.com, image mode (paid plan → Nano Banana Pro quality).

1. Attach: `assets-raw/photos/originals/hero-sofa-01-frontal.jpg` (grey/gold classic sofa, straight-on view).
2. Paste this prompt exactly:

```
Remove all overlaid text, the logo graphic, and the address bar from this
photo. Reconstruct the background naturally where they were. Do not change
the sofa, its carved golden frame, fabric, colors, or proportions in any
way. Keep the room exactly as it is. Upscale to 4K with clean sharp detail.
The result must look like an original untouched photograph.
```

3. Quality check before accepting (retry if any fails):
   - carved wood pattern is IDENTICAL to the original (AI loves to reinvent carvings)
   - cushion count unchanged
   - no smudges/ghosting where the text used to be
4. Save as: `assets-raw/photos/graded/hero-sofa-01-frontal.jpg` (same name, `graded` folder).

## TASK 2 · Gemini: 4 views of that sofa for Meshy (~10 min)

Attach the CLEANED file from Task 1. Run 4 times, changing only the bracketed view words:

```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
[straight-on front view] / [45 degree left view] / [45 degree right view] / [direct rear view]
```

Save as (exact names):
```
assets-raw/sofa-views/front.png
assets-raw/sofa-views/left45.png
assets-raw/sofa-views/right45.png
assets-raw/sofa-views/rear.png
```
Reject any view where proportions drift from the front view (arm height, leg shape, back
curve must match across all four). Consistency matters more than beauty here — these four
images feed a 3D generator; mismatched views produce a broken model.

## TASK 3 · Gemini: clean the remaining 9 photos (~20 min)

Same prompt as Task 1 (adjust the middle sentence to name the furniture in that photo).
Files, one by one, from `originals/` → save to `graded/` with the SAME filename:

```
living-01-beige-set.jpg      living-02-blue-pair.jpg     living-03-wood-set.jpg
bedroom-01-royal-bed.jpg     dining-01-cream.jpg         dining-02-peach.jpg
office-storage-01-black-cabinet.jpg   bespoke-chairs-01.jpg   detail-01-blue-sofa.jpg
```

## TASK 4 · Pen and paper: the human layer (~30 min, no AI anywhere)

White paper, black pen, daylight, phone camera. Draw/write each on its own sheet:

1. A loose freehand outline sketch of the hero sofa (look at the photo, trace by eye;
   imperfect wobbly lines are exactly what we want).
2. Carpenter-style measurement marks: arrows + rough handwritten "2400", "430".
3. Six short handwritten phrases, each on its own line:
   `your size` · `solid wood` · `hand stitched` · `for your home` · `আপনার জন্য` · one squiggly underline stroke
4. Photograph each sheet straight-on, save into: `assets-raw/handmade/`
   (names: `sketch-sofa.jpg`, `marks-measure.jpg`, `word-your-size.jpg`, `word-solid-wood.jpg`,
   `word-hand-stitched.jpg`, `word-for-your-home.jpg`, `word-bangla.jpg`, `underline.jpg`)
5. Optional Gemini pass per photo: "Remove the paper background completely, keep only the pen
   strokes, output as a transparent PNG, do not redraw or smooth the strokes."

Why: these hand marks get animated into the page (they draw themselves on scroll). They are
the one thing no other AI-built entry will have — a real human hand.

## TASK 5 · WhatsApp group (~5 min)

Join: https://chat.whatsapp.com/FTk1VXPtsG8J3yJSiTHmZy
Paste-ready message (Bangla is fine in this group):

```
আসসালামু আলাইকুম! Heaven Furniture Mart-এর ল্যান্ডিং পেজ নিয়ে কয়েকটা প্রশ্ন:
1. Submission-এর exact deadline কবে, কয়টায়?
2. কী কী জমা দিতে হবে - GitHub repo link, live URL, নাকি শুধু video?
3. Agrabad showroom-এর ভিতরের ১-২ মিনিটের ধীরগতির walkthrough video কি পাওয়া যাবে?
4. Facebook/Instagram-এর চেয়ে ভালো resolution-এর product ছবি কি শেয়ার করা সম্ভব?
5. Official logo file (transparent PNG বা SVG) কি দেওয়া যাবে?
6. Managing Director স্যারের হাতের signature-এর একটা ছবি কি পাওয়া সম্ভব? ওনার quote-এর নিচে ব্যবহার করতে চাই।
```

Record every answer (especially the deadline) and report it back to the main Claude Code
session so PROGRESS.md gets updated.

## TASK 6 · Facebook photo hunt, round 2 (~10 min)

From facebook.com/HeavenFurnitureMart photo albums, download at max size into
`assets-raw/photos/originals/`:
- the widest INTERIOR showroom shot available (walls + floor + many pieces) → `showroom-01.jpg`
- the golden/palace full-room set shot → `bespoke-golden-room-01.jpg`
- the blue bed with the gold throw → `bedroom-02-blue-gold.jpg`
- any real showroom walkthrough VIDEO (download or note its URL) → `assets-raw/video/`
- their logo (profile picture, largest size) → `assets-raw/logo/logo.png`
- the OWNER's (MD Abul Kalam Bhuiyan) portrait photo, largest size → `assets-raw/photos/people/md-portrait.jpg`
- the TEAM group photo → `assets-raw/photos/people/team-01.jpg`
  (both get an editorial duotone treatment on the page: quote + real founder face + real team
  = the strongest credibility moment. Clean them with the Task 1 prompt if they carry overlays.)

## TASK 7 · Meshy: photo → 3D sofa (~20 min) — only after Task 2 is done

1. meshy.ai → sign in → **Image to 3D** → switch to **Multi-view** input.
2. Upload the 4 files from `assets-raw/sofa-views/` in their marked slots (front/left/right/back).
3. Settings: latest model (Meshy 7 or newest), Symmetry ON, quad mesh OFF, target polycount
   30k–40k, PBR textures ON.
4. Generate. Judge the result against the photo: reject if arms/legs are fused, back is
   hollow, or the silhouette is wrong. Re-run with better views if needed (Task 2 redo).
5. When acceptable: Remesh to ~30–40k if needed, then EXPORT twice:
   - **GLB** (with PBR textures) → `assets-raw/models/sofa.glb`
   - **USDZ** → `assets-raw/models/sofa.usdz`
6. Note the licence line shown on your Meshy account/plan for ASSETS.md attribution.

## TASK 8 · Phone check (2 min, anytime)

Same WiFi as the PC → phone browser → `http://192.168.0.100:3000`
Scroll the whole page, tap the WhatsApp buttons (a prefilled chat must open). Report anything
that feels broken or cramped.

---

## When each task is done
Tell the main Claude Code session what was completed ("task 1 done", "task 5 answers: ...").
It verifies the files, runs the optimization pipeline, and wires everything into the page.
