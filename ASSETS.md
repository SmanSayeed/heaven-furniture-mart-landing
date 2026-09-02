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
| `originals/*.jpg` (10 photos, 1024x1024, collected 2026-09-01) | Heaven Furniture Mart Facebook page (their own marketing posts; carry baked-in logo + campaign text overlays) | Gemini overlay removal (it CROPPED rather than repainted on most; a keep-framing redo of the top three is in flight) + `npm run crop` + `npm run photos`. **1024 px is the hard ceiling** - Gemini's output cap, and the client has nothing larger, so "upscale to 4K" is a no-op and the srcset now advertises 1024w truthfully. | © Heaven Furniture Mart; AI touch-up allowed per brief |
| `src/components/three/piece-geometry.ts` **(every 3D piece on the page)** | **written for this project**, generated from real furniture dimensions | none: it is code | **Ours.** No third-party licence, no attribution obligation, and nothing to download. See §3a. |
| `public/models/ar-sofa-*.glb` (3 files, 174 KB each) | exported from the generator above by `npm run ar-models` | `three`'s `GLTFExporter` under Node type-stripping | **Ours**, same as the generator |
| ~~`public/models/{sofa-velvet,chair-damask,sofa-leather,placeholder-chair}.glb`~~ **REMOVED 2026-09-02** | were Khronos glTF-Sample-Assets by Eric Chadwick, CC BY 4.0 / CC0 | deleted | The CC-BY attribution obligation is **discharged**: none of these models ship any more, so the footer line no longer credits Eric Chadwick. 1.8 MB of GLB left the page with them. |
| ~~`public/draco/*`~~ **REMOVED 2026-09-02** | was the Draco decoder from `three` | deleted | 752 KB. Nothing is Draco-compressed any more: the drawn pieces are built in the browser and the AR exports are plain glTF. |
| ~~`public/hdr/potsdamer_platz_1k.hdr`~~ **REMOVED 2026-09-02** | was Poly Haven via the `drei` mirror | replaced by `three`'s `RoomEnvironment`, generated in-process | n/a. It was 1.5 MB, a third of the page's weight, downloaded by every visitor on Chattogram mobile data to be sampled at 0.3 intensity. The procedural studio does the same job for zero bytes and no network dependency. `model-viewer` likewise uses its own `neutral` environment. |
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
`hero.pieces[].kind` is the join between the caption and a shape in
`src/components/three/piece-geometry.ts`. There is no file to join to any more.

### 3a. Why the pieces are drawn instead of downloaded (2026-09-02)

The turntable used to run on three Khronos glTF sample assets. They are
beautiful, free and correctly licensed, and they were the wrong choice for a
competition entry, for one reason that no amount of polish fixes: **a
competing entry in this same hackathon shipped the identical blue
`GlamVelvetSofa`.** It is the most-used free 3D sofa on the internet. A hero
object somebody else can also have is not a hero object.

Swapping in a different free asset would only have moved the collision. So
every piece is now generated from a parametric design language written for
this project — see the header comment in `piece-geometry.ts` for the design
rules. What that bought, beyond uniqueness:

| | before | after |
|---|---|---|
| 3D payload | 1.8 MB GLB + 752 KB Draco decoder | **0 bytes** |
| time to first piece | a download, a WASM decode, a Suspense boundary | ~1 ms, on the frame it is asked for |
| licence obligations | CC-BY attribution in the footer, permanently | none |
| dimension lines | whatever a scan happened to measure | **real furniture dimensions** (2100 mm is a width a workshop could cut to) |
| fabric swatch | Sheet 04 only, tinting an authored material | authored by us, so the hero and AR carry it too |

The pieces stay *placeholders in intent*: they are drawings of the kind of
piece Heaven makes, captioned at category level, never named as a specific
product. A Meshy scan of a real Heaven piece is still the goal, and dropping
one in is adding a url beside a `kind` — no copy and no layout changes.

### 3b. The AR exports

`npm run ar-models` runs the SAME generator through `three`'s `GLTFExporter`
under Node's type stripping, and writes one 174 KB GLB per fabric into
`public/models/`. Re-run it after any change to `piece-geometry.ts` or to
`bespoke.swatches`, and commit the result.

Three things that are easy to get wrong here and are already handled:

* **They must be real files, not a Blob built in the page.** Android falls
  through to Google's Scene Viewer, a separate app that fetches the model over
  the network; it cannot read a browser tab's `blob:` URL. WebXR would have
  worked and Scene Viewer would have failed silently.
* **One file per swatch**, because the visitor picks a fabric on Sheet 04 and
  presses "see it in your room" on Sheet 07. Arriving there to find the sofa
  back in ivory would undo the page's one promise.
* **Node has no `FileReader`**, which `GLTFExporter` uses to read its assembled
  Blob. The script shims it in nine lines from `Blob.arrayBuffer()`. Nothing
  about that shim reaches a browser.

Geometry is welded before export (`mergeVertices` in `roundedBox`): unwelded,
the same sofa exported at 804 KB. Nothing is Draco-compressed - a 174 KB plain
glTF beats 40 KB plus a 200 KB WASM decoder fetched over Chattogram mobile
data, and it keeps `model-viewer` off Google's CDN entirely.

**Still missing: USDZ.** Without it iPhones get a 3D viewer they can turn but
cannot place in a room, and `ar.support` says exactly that rather than offering
a dead button. `GLTFExporter` cannot produce USDZ; the options are Meshy's own
USDZ export (Task D) or Apple's Reality Converter on a Mac.
