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
const SRC = join(ROOT, '..', 'assets-raw', 'photos', 'originals')
const OUT = join(ROOT, '..', 'assets-raw', 'photos', 'graded')

/** clears the logo, the headline and the contact bar on a 1:1 ad graphic */
const DEFAULT_CROP = { top: 0.27, bottom: 0.12 }

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
