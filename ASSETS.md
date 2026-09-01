# ASSETS.md — hand-off workflow + licence ledger

## 1. How Saadman hands assets to Claude

Drop everything into **`assets-raw/`** at the repo root. It is **git-ignored** (originals stay
out of git; only optimised output is committed to `heaven-mart/public/`). Claude watches this
folder, processes with `sharp`/`gltf-transform`, and moves optimised files into `public/`.

```
assets-raw/
├─ photos/
│  ├─ originals/        every Heaven photo you download from FB/Insta/YouTube, as-is.
│  │                    Name: <category>-<nn>.jpg  (living-01.jpg, showroom-03.jpg,
│  │                    bedroom-02.jpg, dining-01.jpg, office-01.jpg, hero-sofa-01.jpg)
│  └─ graded/           the same photos after Reve/Gemini cleanup + one consistent grade.
│                       KEEP THE SAME FILENAME as its original.
├─ sofa-views/          exactly 4 files for Meshy: front.png, left45.png, right45.png, rear.png
│                       (plain grey bg, seat-height camera, same proportions in all 4)
├─ models/              Meshy exports: sofa.glb (PBR) and sofa.usdz (iOS AR), unoptimised.
├─ logo/                logo.svg or logo.png (transparent) if the client provides one.
└─ video/               showroom walkthrough clip(s) for the splat / fallback, any format.
```

**Minimum quality bar:** photos ≥ 1600 px on the long edge (bigger is better — we downscale,
never upscale in-page). Originals blurry/tiny → note it, Claude will say if it is usable.

**After dropping files, just say what you added** ("photos/originals এ ৮টা ছবি দিছি") — Claude
inventories, checks resolution, and queues the processing step.

## 2. What Claude produces from them (committed to git)

```
heaven-mart/public/
├─ img/                 WebP q80 at 480/960/1600 + hero poster (≤ 120 KB)
├─ models/              sofa.glb (Draco+KTX2, ≤ 1.5 MB), sofa.ar.glb, sofa.usdz
├─ splats/              showroom.spz (≤ 15 MB) — stretch
└─ video/               showroom-fallback.webm (≤ 2 MB, 8 s, muted)
```

## 3. Licence / credit ledger (fill as assets arrive)

| Asset | Source | Tool(s) used | Licence / credit |
|---|---|---|---|
| `originals/*.jpg` (10 photos, 1024x1024, collected 2026-09-01) | Heaven Furniture Mart Facebook page (their own marketing posts; carry baked-in logo + campaign text overlays) | pending: Gemini (Nano Banana Pro) overlay removal + upscale | © Heaven Furniture Mart; AI touch-up allowed per brief |
| `public/models/placeholder-chair.glb` **(TEMPORARY)** | Khronos glTF-Sample-Assets, "Sheen Chair" | `@gltf-transform/cli optimize` (Draco + WebP): 4.13 MB → 570 KB | © 2020 Wayfair LLC, **CC0 1.0 Universal** (public domain). Model by Eric Chadwick. **Must be replaced by the Meshy sofa before submission**; if it ever ships, this row stays and the footer credits it. |
| `public/hdr/potsdamer_platz_1k.hdr` | Poly Haven, via the `drei` assets mirror (self-hosted to remove the runtime CDN dependency) | none | **CC0** (Poly Haven) |
| `public/draco/*` | Draco decoder shipped inside `three` (`examples/jsm/libs/draco/gltf/`) | copied, self-hosted | **Apache 2.0**, Google |
| Fonts: Fraunces, Archivo, IBM Plex Mono | Google Fonts, self-hosted by `next/font` | none | **SIL Open Font License 1.1** |
| Icons (7 glyphs, inlined SVG) | Phosphor Icons | hand-inlined, only the glyphs used | **MIT** |

## 4. Credit lines that must ship (footer + README)

- `3D model generated with Meshy AI from Heaven Furniture Mart photography.` — required if the
  Meshy free tier is used (outputs are CC BY 4.0, attribution required).
- Photography © Heaven Furniture Mart (Facebook/Instagram), AI touch-up with Reve / Gemini
  (Nano Banana Pro) — every edited image listed in §3.
- Confirm Reve free-tier commercial terms before submission.

## 5. Rules

- Real Heaven photos over stock, always. AI **touch-up** is allowed by the brief; AI
  **invention** of furniture they do not sell is not.
- Never commit anything into `assets-raw/` (it is ignored) and never commit an unoptimised
  original into `public/`.

---

## 3D models — turntable pieces (S1 "The Turntable")

**TEMPORARY.** These are stand-ins so the hero is a real, spinnable 3D object today.
They must be replaced by Meshy scans of Heaven's own pieces before submission
(`SAADMAN-TASKS.md` Task 6). Nothing but the filename has to change: `copy.ts`
`hero.pieces[].id` is the join between the caption and `public/models/<id>.glb`.

| File | Source | Licence | Credit | Size |
|---|---|---|---|---|
| `public/models/sofa-velvet.glb` | Khronos glTF-Sample-Assets `GlamVelvetSofa` | **CC-BY-4.0** | Eric Chadwick, © 2021 Wayfair, LLC | 411 KB |
| `public/models/chair-damask.glb` | Khronos glTF-Sample-Assets `ChairDamaskPurplegold` | **CC-BY-4.0** | Eric Chadwick, © 2021 Wayfair | 363 KB |
| `public/models/sofa-leather.glb` | Khronos glTF-Sample-Assets `SheenWoodLeatherSofa` | **CC-BY-4.0** (improvements) + CC0-1.0 (original) | Eric Chadwick, © 2024 Darmstadt Graphics Group GmbH; original Fran Calvente, public domain | 1.04 MB |

CC-BY-4.0 **requires attribution**, which is why the footer carries
"3D placeholder models by Eric Chadwick, CC BY 4.0." That line is not decoration:
removing it while these models ship would breach the licence. When the Meshy
models land, swap the models AND the line together.

Optimised with:

```
npx @gltf-transform/cli optimize <in>.glb <out>.glb \
  --compress draco --texture-compress webp --texture-size 1024 --simplify false
```

`--simplify false` on purpose: decimation on upholstery produced visible faceting
on the arms. Draco plus WebP textures already gets each piece under budget.
