# GEMINI-PROMPTS.md — every Gemini prompt, copy-paste ready

Tool: gemini.google.com, image mode (paid plan = Nano Banana Pro quality).
Each prompt was written after looking at that specific photograph, so the furniture is named
correctly. Do not swap the descriptions between photos — naming the wrong object is how an AI
decides it is allowed to redraw the right one.

**Two rules that apply to every prompt below**
1. Do not add "upscale to 4K". Measured: Gemini's output caps at 1024 px. It wastes a retry.
2. Colour fidelity is the one thing that must never drift. The page is monochrome; these photos
   carry all of its colour, and the swatch/AR moments claim to show Heaven's real materials.

**Universal quality gates — retry if any fails**
- output is **1024x1024**, not cropped or reframed
- carved detail identical to the original (AI loves to reinvent carvings — check the crest first)
- cushion / chair / drawer counts unchanged
- colours unchanged
- no smudging or ghosting where the overlay text used to be

---

# PART 1 · The four sofa views (do these first — they feed Meshy)

Attach: `assets-raw/photos/graded/hero-sofa-01-frontal.jpeg` (the accepted clean file)
Run four times. The only difference is the last line.

### 1.1 → save as `assets-raw/sofa-views/front.png`
```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
straight-on front view
```

### 1.2 → save as `assets-raw/sofa-views/left45.png`
```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
45 degree left view
```

### 1.3 → save as `assets-raw/sofa-views/right45.png`
```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
45 degree right view
```

### 1.4 → save as `assets-raw/sofa-views/rear.png`
```
Using this exact sofa with unchanged design, carving, colors and
proportions, generate it on a plain mid-grey seamless studio background,
soft diffuse lighting, no floor shadow, camera at seat height,
direct rear view
```

**Gate for Part 1 is different from the others.** Lay the four side by side. Arm height, leg
shape and the curve of the back must match across all four. A 3D reconstructor averages these
views, so a drifting view does not make the model uglier — it makes it *wrong*. Regenerate any
view that disagrees with the front. Two failures on one view: keep the closest and move on.

---

# PART 2 · The three cropped photos, redone (highest value — shown large)

Attach the file from `assets-raw/photos/originals/`, save into `assets-raw/photos/graded/`
under the **same filename**.

### 2.1 `living-03-wood-set.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall panelling, the framed
painting, the wall sconce and the ceiling naturally in the areas where the
text and logo used to be, matching the existing room. Do not change the
dark wood sofa set with cream upholstery, its carved crest rails and
turned legs, the wooden glass-top coffee table with the fretwork panel, or
the round marble side table - keep their fabric, colors and proportions
exactly. Keep the whole room visible exactly as in the input.
```

### 2.2 `living-02-blue-pair.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall, the framed painting, the
chandelier and the palm behind naturally in the areas where the text and
logo used to be, matching the existing room. Do not change the blue and
gold sofa set, its gilded carved frame, the blue floral embroidered back
panel, the brocade seat pattern or the tufted sides - keep their fabric,
colors and proportions exactly. Keep the whole room visible exactly as in
the input.
```

### 2.3 `bedroom-01-royal-bed.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall panelling, the framed
artwork and the potted palm naturally in the areas where the text and logo
used to be, matching the existing room. Do not change the carved dark wood
bed, its gold leaf carvings, the teal velvet headboard panel, the carved
footboard or the printed bedsheet - keep their colors and proportions
exactly. Keep the whole room visible exactly as in the input.
```

**Stop rule for Part 2.** If Gemini still crops after two attempts on a photo, keep the cropped
version already in `graded/` and move on. They are clean and usable, just tighter. Do not spend
the deadline here.

---

# PART 3 · The remaining six (only if Part 2 came back at a true 1:1)

Same structure. Attach from `originals/`, save to `graded/` under the same filename.

### 3.1 `living-01-beige-set.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall panelling, the framed
artwork, the chandelier and the flower arrangement naturally in the areas
where the text and logo used to be, matching the existing room. Do not
change the beige tufted sofa, the two matching armchairs, the patterned
cushions or the gold oval glass-top coffee table - keep their fabric,
colors and proportions exactly. Keep the whole room visible exactly as in
the input.
```

### 3.2 `dining-01-cream.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall panelling, the framed
painting, the crystal sconce and the white flower arrangement naturally in
the areas where the text and logo used to be, matching the existing room.
Do not change the cream and gold dining table, its carved apron and cabriole
legs, the marble tabletop, or the oval-back chairs with their floral
embroidered backs and stud trim - keep the chair count, fabric, colors and
proportions exactly. Keep the whole room visible exactly as in the input.
```

### 3.3 `dining-02-peach.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall, the framed artwork, the
crystal chandelier, the table lamp and the curtain naturally in the areas
where the text and logo used to be, matching the existing room. Do not
change the dark wood dining table with the marble top, or the peach quilted
velvet chairs with their carved dark wood crests - keep the chair count,
fabric, colors and proportions exactly. Keep the whole room visible exactly
as in the input.
```

### 3.4 `office-storage-01-black-cabinet.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall panelling, the framed
painting and the table lamp naturally in the areas where the text and logo
used to be, matching the existing room. Do not change the black cabinet,
its two drawers, its two doors, the slim brass handles, the open display
shelves or the objects on them - keep their colors and proportions exactly.
Keep the whole room visible exactly as in the input.
```

### 3.5 `bespoke-chairs-01.jpg`
```
Remove all overlaid text and the logo graphic from this photo. KEEP THE
ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not zoom in, do not
reframe. Reconstruct the plain studio wall naturally in the areas where the
text and logo used to be, matching the existing gradient and shadow. Do not
change the pair of carved dark wood armchairs, their pierced carved crests,
the striped cream upholstery, or the round glass-top table between them -
keep their colors and proportions exactly. Keep the whole scene visible
exactly as in the input.
```

### 3.6 `detail-01-blue-sofa.jpg`
```
Remove all overlaid text, the logo graphic and the address bar from this
photo. KEEP THE ORIGINAL SQUARE 1:1 FRAMING EXACTLY - do not crop, do not
zoom in, do not reframe. Reconstruct the wall panelling, the framed artwork
and the potted palm naturally in the areas where the text and logo used to
be, matching the existing room. Do not change the navy blue and gold sofa,
its gilded carved frame, the floral embroidered back panel, the velvet
cushions or the stud trim - keep their fabric, colors and proportions
exactly. Keep the whole room visible exactly as in the input.
```

---

# PART 4 · The new Facebook photos (only after you have downloaded them)

### 4.1 `showroom-01.jpg` — the widest interior showroom shot
Save the cleaned file to `assets-raw/photos/originals/showroom-01.jpg` (it has no graded twin yet).
```
Remove all overlaid text, the logo graphic and any address or handle bar
from this photograph of a furniture showroom. KEEP THE ORIGINAL FRAMING
EXACTLY - do not crop, do not zoom in, do not reframe. Reconstruct the
walls, ceiling and floor naturally in the areas where the text and logo
used to be, matching the existing room. Do not change, add, remove or
rearrange any piece of furniture in the room, and do not change the
lighting or the colors. Keep the entire room visible exactly as in the
input.
```
Why the extra "do not add or remove furniture" clause: this is the widest room shot and it will
be shown as a slow pan across the whole frame, so an invented chair in a corner would be visible
and would be a false claim about a real showroom.

### 4.2 `md-portrait.jpg` — the Managing Director's portrait
Save to `assets-raw/photos/people/md-portrait.jpg`.
**Only run this if the portrait actually carries an overlay.** If it is already clean, do not put
it through Gemini at all.
```
Remove only the overlaid graphic text, logo and address bar from this
photograph. Do not alter the person in any way: keep his face, facial
features, expression, skin tone, hair, glasses and clothing exactly as they
are. Do not retouch, smooth, slim, age, lighten or beautify him. KEEP THE
ORIGINAL FRAMING EXACTLY - do not crop or zoom. Reconstruct only the
background area where the text used to be, matching the existing
background.
```
This is a real person and a real client's Managing Director. Editing his face would be both a
factual misrepresentation and a discourtesy, so the prompt forbids it explicitly. If Gemini
changes his face at all, discard the result and use the original with the overlay.

### 4.3 `team-01.jpg` — the team group photo
Same prompt as 4.2 (it also protects every face in the frame).
Save to `assets-raw/photos/people/team-01.jpg`.

### 4.4 The logo — try NOT to use Gemini
Download the real logo file first: Facebook page profile picture at full size, or ask in the
WhatsApp group for the PNG/SVG (they confirmed one exists). A redrawn logo is a wrong logo.

Only if no clean file can be obtained, and only as a last resort:
```
Isolate the Heaven Furniture Mart logo from this image exactly as it is.
Remove the background completely and output a transparent PNG. Do not
redraw, re-letter, re-space, straighten or restyle any part of the logo,
and do not change its colors. Reproduce the existing artwork pixel for
pixel, only removing the background behind it.
```
Then check the letterforms and the gold "A" against the real logo before using it. If anything
differs, do not ship it — a wrong logo on a client's own brand page is the single most damaging
mistake available here.

---

## Save-path quick reference

```
assets-raw/sofa-views/front.png              Part 1.1
assets-raw/sofa-views/left45.png             Part 1.2
assets-raw/sofa-views/right45.png            Part 1.3
assets-raw/sofa-views/rear.png               Part 1.4

assets-raw/photos/graded/living-03-wood-set.jpg              Part 2.1
assets-raw/photos/graded/living-02-blue-pair.jpg             Part 2.2
assets-raw/photos/graded/bedroom-01-royal-bed.jpg            Part 2.3
assets-raw/photos/graded/living-01-beige-set.jpg             Part 3.1
assets-raw/photos/graded/dining-01-cream.jpg                 Part 3.2
assets-raw/photos/graded/dining-02-peach.jpg                 Part 3.3
assets-raw/photos/graded/office-storage-01-black-cabinet.jpg Part 3.4
assets-raw/photos/graded/bespoke-chairs-01.jpg               Part 3.5
assets-raw/photos/graded/detail-01-blue-sofa.jpg             Part 3.6

assets-raw/photos/originals/showroom-01.jpg  Part 4.1
assets-raw/photos/people/md-portrait.jpg     Part 4.2
assets-raw/photos/people/team-01.jpg         Part 4.3
assets-raw/logo/logo.png                     Part 4.4 (download, do not generate)
```

`hero-sofa-01-frontal` is already done and accepted. Never run it again.
