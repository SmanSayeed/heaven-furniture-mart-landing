/**
 * Overlay crop: assets-raw/photos/originals  ->  assets-raw/photos/graded
 *
 * Run:  npm run crop
 *
 * WHY THIS EXISTS
 * Every photograph collected from Heaven's Facebook page is an ad graphic,
 * not a product shot: their logo is burned into the top left, a "CRAFTED for
 * LUXURY LIVING" headline across the top, and an address / handle bar across
 * the bottom. Dropping those into this page would put a second logo and
 * somebody else's ad copy inside our layout, which is exactly the crowded,
 * marketplace look the brief tells us to avoid.
 *
 * The furniture always sits in the middle band, so a crop removes all three
 * overlays and keeps the subject. Cropping is explicitly allowed by the
 * brief, and unlike a paint-out it invents nothing: every pixel that survives
 * is Heaven's own photograph, untouched.
 *
 * Output goes to graded/, which optimize-photos.mjs already prefers over
 * originals/. So a Gemini-cleaned file dropped in with the same name silently
 * wins over this crop, and nothing has to be rewired.
 *
 * TUNING
 * `top` and `bottom` are fractions of image height to remove. The defaults
 * clear the overlays on every current photo; per-file entries below exist
 * where a piece of furniture reached into the default band and would have
 * been beheaded. Values were set by inspecting the output, not guessed.
 */
import { readdir, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, parse } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'assets-raw', 'photos', 'originals')
const OUT = join(ROOT, 'assets-raw', 'photos', 'graded')

/** clears the logo, the headline and the contact bar on a 1:1 ad graphic */
const DEFAULT_CROP = { top: 0.27, bottom: 0.12 }

/* Not every photograph the client sends is an ad. The second batch
   (2026-09-04) is mostly straight showroom and product photography with
   nothing burned in, and cropping a quarter off the top of a clean photo
   beheads the piece for no reason. Named explicitly rather than guessed at:
   a file is only left whole because it was looked at. */
const NO_CROP = { top: 0, bottom: 0 }

/** per-file overrides, keyed by filename without extension */
const CROPS = {
  /* 0.22 left the headline visible over the wall; the headboard survives 0.32 */
  'bedroom-01-royal-bed': { top: 0.32, bottom: 0.12 },
  /* chairs on a plain ground, headline low: needs the full default top */
  'bespoke-chairs-01': { top: 0.3, bottom: 0.13 },
  /* the carved crest of the sofa reaches to a quarter height */
  'living-02-blue-pair': { top: 0.25, bottom: 0.12 },
  /* the headline runs down the right side of this one, so it needs the
     deepest top crop of the set; the cabinet still clears it */
  'office-storage-01-black-cabinet': { top: 0.33, bottom: 0.12 },

  /* ---- second batch, 2026-09-04 ----
     Photographs with nothing burned in. Showroom and product shots: the
     piece fills the frame and there is no overlay to remove. */
  'living-04-gold-armchairs': NO_CROP,
  'living-05-carved-armchair': NO_CROP,
  'living-06-black-console': NO_CROP,
  'living-09-mirrored-console': NO_CROP,
  'living-10-blue-set': NO_CROP,
  'living-11-green-set': NO_CROP,
  'living-12-yellow-curve': NO_CROP,
  'living-13-striped-armchair': NO_CROP,
  'dining-03-glass-top': NO_CROP,
  'dining-04-gold-round': NO_CROP,
  'office-02-conference': NO_CROP,
  'office-03-executive-desk': NO_CROP,
  'office-04-director-desk': NO_CROP,
  'bespoke-02-swing-black': NO_CROP,
  'bespoke-03-swing-cream': NO_CROP,
  /* the two HD interiors the client added for the hero slideshow: full-bleed
     photography, nothing burned in, and cropping them would only throw away
     the height the hero wants */
  'hero-room-01-palace': NO_CROP,
  'hero-room-02-leather-chair': NO_CROP,
  'office-05-conference-hd': NO_CROP,

  /* ...and the ones that ARE ads. A "MEGA SALE" roundel or a CRAFTED FOR
     LUXURY LIVING band is the crowded, marketplace look the brief tells us
     to avoid, and it puts a second Heaven logo inside our own layout. Every
     value below was set by looking at the result, not by guessing: the
     dressing table's mirror and the display cabinet's cornice both reach
     higher into the frame than the default allows for. */
  'bedroom-02-green-velvet': { top: 0.34, bottom: 0.13 },
  'bedroom-03-carved-teal': { top: 0.32, bottom: 0.13 },
  'bedroom-04-dressing-table': { top: 0.3, bottom: 0.1 },
  'living-07-gold-display': { top: 0.31, bottom: 0.12 },
  'living-08-black-sideboard': { top: 0.24, bottom: 0.12 },
  'living-14-cream-set': { top: 0.26, bottom: 0.13 },
  'living-15-carved-pair': { top: 0.26, bottom: 0.12 },
  'dining-05-white-set': { top: 0.29, bottom: 0.1 },
}

const EXT = /\.(jpe?g|png|webp)$/i

async function main() {
  let files
  try {
    files = (await readdir(SRC)).filter((f) => EXT.test(f))
  } catch {
    console.log('No originals/ folder. Nothing to crop.')
    return
  }
  if (files.length === 0) {
    console.log('No photos in originals/. Nothing to crop.')
    return
  }

  await mkdir(OUT, { recursive: true })

  for (const file of files) {
    const { name } = parse(file)
    /* A real (Gemini-cleaned) graded file beats this crop, whatever its
       extension. Without this guard a re-run would write <name>.jpg next to
       a cleaned <name>.jpeg, and optimize-photos keys on the extensionless
       name, so the crop would silently win. Never overwrite a clean. */
    if (['.jpg', '.jpeg', '.png', '.webp'].some((ext) => ext !== parse(file).ext.toLowerCase() && existsSync(join(OUT, name + ext)))) {
      console.log(`  KEEP  ${name}: a cleaned graded file already exists, crop skipped`)
      continue
    }
    const { top, bottom } = CROPS[name] ?? DEFAULT_CROP
    const image = sharp(join(SRC, file), { failOn: 'error' })
    const meta = await image.metadata()
    const height = meta.height ?? 0
    const width = meta.width ?? 0
    const y = Math.round(height * top)
    const h = Math.round(height * (1 - top - bottom))
    if (h <= 0 || width <= 0) {
      console.warn(`  SKIP ${file}: crop leaves nothing`)
      continue
    }

    await image
      .extract({ left: 0, top: y, width, height: h })
      /* re-encoded as JPEG at high quality because this folder is a source
         folder: optimize-photos.mjs does the real compression afterwards */
      .jpeg({ quality: 94 })
      .toFile(join(OUT, `${name}.jpg`))

    console.log(`  ${name}  ${width}x${height}  ->  ${width}x${h}`)
  }

  console.log(`\n${files.length} photos cropped into assets-raw/photos/graded.`)
  console.log('Now run: npm run photos')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
