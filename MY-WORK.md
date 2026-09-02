# MY-WORK.md — Saadman's creative-tool playbook

Everything here is work only Saadman can do: Gemini, Meshy, Reve, his phone, his screen
recorder. No code, no deploy (dropped 2026-09-02: the submission is a screen recording only).
The build session handles every file once it lands.

Base folder: `l:\projects\hackathons\racdox hackathon\assets-raw\`
About 60 minutes of hands-on work, plus Meshy's generation wait.

## Facts already measured — do not re-litigate these
- Gemini's image output **caps at 1024 px**. "Upscale to 4K" is a no-op. Do not spend retries on it.
- On the first pass Gemini removed the burned-in ad overlays by **cropping**, not repainting
  (1024x1024 in, 1024x625 out). The fix is an explicit "keep the original 1:1 framing" line.
- `graded/hero-sofa-01-frontal.jpeg` is **done and accepted** at a true 1024x1024. Never redo it.
- The page is monochrome; the photos and the 3D piece carry **all** of its colour. So the one
  thing an AI pass must never do is shift the furniture's colours.

## Order (and why)
Steps 1 and 2 come first because Meshy's chain is the longest — it generates while you do 3 and 4.

| # | Step | Tool | Time |
|---|---|---|---|
| 1 | Four sofa views | Gemini | 10 min |
| 2 | Photo to 3D | Meshy | 20 min (mostly waiting) |
| 3 | Facebook hunt + clean | Facebook + Gemini | 10 min |
| 4 | Top-3 photo redo | Gemini | 7 min |
| 5 | Grade transfer (OPTIONAL) | Reve Remix | 10 min |
| 6 | Phone check | your Android | 5 min |
| 7 | Screen recording | OBS / phone | 15 min |

---

## STEP 1 · Gemini — four views of the hero sofa (10 min)

Attach `assets-raw/photos/graded/hero-sofa-01-frontal.jpeg` (the accepted clean one).
Run four times; change ONLY the bracketed words on the last line.

```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
[straight-on front view]
```

Other three: `[45 degree left view]` · `[45 degree right view]` · `[direct rear view]`

Save exactly as:
```
assets-raw/sofa-views/front.png
assets-raw/sofa-views/left45.png
assets-raw/sofa-views/right45.png
assets-raw/sofa-views/rear.png
```

**Gate — consistency beats beauty.** Put the four side by side. Arm height, leg shape and the
curve of the back must match across all four. These images feed a 3D reconstructor: it averages
them, so a mismatched view does not make the model prettier or uglier, it makes it *wrong*.
Regenerate any view that drifts. Two failed attempts on one view: keep the closest and move on.

---

## STEP 2 · Meshy — photo to 3D (20 min, mostly waiting)

1. meshy.ai, sign in, choose **Image to 3D**, switch the input to **Multi-view**.
2. Drop the four files into their matching slots (front / left / right / back).
3. Settings: newest model available, **Symmetry ON**, **quad mesh OFF**,
   **polycount 30k-40k**, **PBR textures ON**.
   (Meshy's UI moves around; match the intent if a label differs.)
4. Generate, then judge the result against the real photograph. **Reject** if the arms or legs
   are fused into the body, the back is hollow, or the silhouette is visibly not this sofa.
   If it fails twice, the views are the problem, not Meshy — redo Step 1 rather than re-rolling.
5. Export **twice**:
   - **GLB** with PBR textures → `assets-raw/models/sofa.glb`
   - **USDZ** → `assets-raw/models/sofa.usdz`
6. Copy the licence line shown on your Meshy plan; the build session needs it for ASSETS.md.

**About the USDZ: you cannot test it.** USDZ is Apple's format — it is what lets an iPhone place
the sofa in a real room. You are on Android, where AR runs from the GLB instead. Export the USDZ
anyway for the iPhone judges, and do not waste time trying to open it on your phone.

**Why this is worth 20 minutes:** the page draws real dimension lines around the 3D piece from
its measured bounding box. With a Meshy scan of Heaven's actual sofa, the site states Heaven's
real furniture at its real proportions instead of a licensed stand-in — and the CC-BY placeholder
credit comes out of the footer.

If time remains, repeat once for the royal bed or the damask chair. The hero shows three pieces
and each real scan replaces one placeholder.

---

## STEP 3 · Facebook hunt, then clean in Gemini (10 min)

From facebook.com/HeavenFurnitureMart albums, largest size available:

| Save as | What |
|---|---|
| `assets-raw/logo/logo.png` | the official logo (transparent PNG or SVG preferred; the group said one exists) |
| `assets-raw/photos/people/md-portrait.jpg` | MD Abul Kalam Bhuiyan's portrait, front-facing and clean |
| `assets-raw/photos/people/team-01.jpg` | the team group photo |
| `assets-raw/photos/originals/showroom-01.jpg` | the widest interior showroom shot you can find |

The MD portrait is the page's credibility moment: it sits beside his quote, grayscale at rest,
colouring on touch. Prefer a clean front-facing frame over a flattering but cluttered one.

`showroom-01` matters more than it looks — with no walkthrough video, Sheet 05 is a slow pan
across this single photograph, so pick the one with the most room visible in it.

If any of these carry the burned-in ad overlay, clean them with the Step 4 prompt.

---

## STEP 4 · Gemini — redo the three cropped photos (7 min)

Only these three; they are the ones shown large:
```
living-03-wood-set.jpg    living-02-blue-pair.jpg    bedroom-01-royal-bed.jpg
```
Take them from `originals/`, save back into `graded/` under the SAME filename.

```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall, ceiling and floor naturally
in the areas where the text and logo used to be, matching the existing
room. Do not change the [sofa and its carved golden frame], its fabric,
colors or proportions. Keep the whole room visible exactly as in the input.
```
Swap the bracketed words for what that photo actually shows (the bed and its headboard, the
dining table and chairs, and so on).

**Gates — retry if any fails:** output is **1024x1024, not cropped** · carving identical ·
cushion count unchanged · **colours unchanged** · no smudging where the text used to be.

**Stop rule:** if Gemini still crops after two attempts, ship the cropped versions. They are
clean and usable, just tighter. Do not burn the deadline on this.

If all three come back at a true 1:1, the same prompt is worth running on the other six:
`living-01-beige-set` `dining-01-cream` `dining-02-peach`
`office-storage-01-black-cabinet` `bespoke-chairs-01` `detail-01-blue-sofa`

---

## STEP 5 · Reve Remix — one consistent grade (OPTIONAL, only if 1-4 finish early)

The ten photos were shot on different days under different lights: some warm, some cool, some
flat. On a monochrome page where the photographs are the only colour, that inconsistency is
visible and reads as amateur. Reve Remix can pull the others toward one reference photo's grade.

Use `graded/hero-sofa-01-frontal.jpeg` as the reference. Match **exposure and white balance
only**. Do not let it restyle anything — the furniture's real colours are the point, and a
"nicer" grade that invents a colour is worse than an honest inconsistent one.

**Licence caution before you use it:** `ASSETS.md` records that **Reve's free-tier commercial
terms are unconfirmed**. This entry is for a real client and the prize is working with their tech
team, so check Reve's terms first. If they are unclear, skip this step — it is the most droppable
item on this list.

---

## STEP 6 · Phone check (5 min) — do not skip this one

Same WiFi as the PC, phone browser, `http://<pc-ip>:3000` (the build session gives the IP).

Check: scroll feel · the hero piece spins with a finger AND the page still scrolls vertically ·
every WhatsApp button opens a chat with the message already written · nothing cramped or
overlapping · text readable without zooming.

**Why this is not optional:** the pinned sheets come back black in headless screenshots — a known
compositing artifact, already investigated and ruled out as a page bug. BLUEPRINT section 8 says
it outright: your eyes are the only trustworthy check for those sheets. Skip this and nobody has
actually seen the page.

---

## STEP 7 · Screen recording (15 min) — this IS the submission

Landscape. 40-70 seconds. Recording the local site.

- **Press F11 for fullscreen first.** A visible `localhost:3000` in the URL bar reads as
  unfinished work to a judge.
- **Scroll slowly and deliberately.** The page is scroll-choreographed; fast scrolling destroys
  every effect it has.
- Pause on: the hero piece being dragged and spun · the lights coming on · the blueprint drawing
  itself · a fabric swatch changing the sofa · the AR moment if it runs on your device.
- No music needed. Do a silent practice take and watch it back before recording the real one.
- Caption names the brand and carries `#racdox_hackathon`.

---

## Reporting back
After each step, tell the build session in plain words: "step 1 done, 4 views in sofa-views" or
"meshy done, sofa.glb and sofa.usdz saved". It verifies the files, runs `npm run photos` and
gltf-transform, and wires everything in. Do not run git yourself.
