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
| _(none yet)_ | | | |

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
