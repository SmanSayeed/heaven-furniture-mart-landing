/**
 * HERO WINDOWS: assets-raw/hd  ->  assets-raw/photos/graded
 *
 * Run:  npm run hero        (then: npm run photos)
 *
 * WHY THIS EXISTS
 * The client's Gemini restorations arrive SQUARE (2048x2048) or 3:4. The
 * hero needs a wide frame on a desktop and an upright one on a phone, so
 * a window has to be cut out of the square - and WHERE that window sits
 * decides what the visitor sees in the first second.
 *
 * It was cut by hand once, at 62% down the frame, and 62% of a room
 * photograph is the floor: the desktop hero opened on a close-up of the
 * coffee table with the sofas sliced off above it (client: "why isn't it
 * adjusted image in hero section, all the chairs are hidden"). A number
 * that decides the LCP should not live in a shell command that ran once,
 * so it lives here, named, with the reason next to it.
 *
 * `top` is the window's top edge as a fraction of the SOURCE height, not
 * of the leftover travel - so it reads directly off the photograph: 0.08
 * means "start 8% down". Every value below was set by looking at the
 * result, not guessed.
 *
 * Nothing is invented and nothing is stretched: every pixel that survives
 * is the client's own restoration of Heaven's own photograph.
 */
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const HD = join(ROOT, 'assets-raw', 'hd')
const OUT = join(ROOT, 'assets-raw', 'photos', 'graded')

const WINDOWS = [
  {
    /* CH.1 view 1, the LCP. The three sofas sit between 14% and 48% of
       the square and the carved crests reach to 14%, so the window opens
       at 8% to leave the crests some wall above them. It closes just
       under the coffee table, which is the piece nearest the camera and
       the one that can afford to be cut. */
    src: 'hero-1-1.jpeg',
    out: 'living-03-wood-set.jpg',
    ratio: 16 / 9,
    top: 0.08,
  },
  {
    /* CH.1 view 2. The far chairs' carved crests are the highest thing in
       the set at 24%; the near chairs run off the bottom of the square
       anyway, so the window is placed to keep the crests rather than the
       feet - a dining set reads from its backs. */
    src: 'her-2.jpeg',
    out: 'dining-02-peach.jpg',
    ratio: 16 / 9,
    top: 0.2,
  },
  {
    /* CH.1 view 3. Two chairs and a glass table on a plain ground, the
       pair centred: the middle band holds the whole subject. */
    src: 'Gemini_Generated_Image_fr3rgpfr3rgpfr3r.jpeg',
    out: 'bespoke-chairs-01.jpg',
    ratio: 16 / 9,
    top: 0.215,
  },
  {
    /* CH.1 view 1, SECOND REEL FRAME. The same panelled room the hero
       opens on, stepped back: the sconces, the full set and the marble.
       The window starts at 26% so the wall lights survive - they are the
       thing that makes it read as the same room rather than another one. */
    src: 'Gemini_Generated_Image_e7yk2ne7yk2ne7yk.jpeg',
    out: 'hero-room-03-panelled.jpg',
    ratio: 16 / 9,
    top: 0.26,
  },
  {
    src: 'Gemini_Generated_Image_e7yk2ne7yk2ne7yk.jpeg',
    out: 'hero-room-03-panelled-tall.jpg',
    ratio: 3 / 4,
    top: 0,
  },
  /* ---- THE PHONE'S FRAMES ----
     View 1's was generated at 3:4 to order, so its "window" is the whole
     file. Views 2 and 3 are cut from the same squares as above: a 3:4
     window out of a 1:1 is the full height and a slice off each side, so
     the phone loses width rather than the piece. */
  {
    src: 'hero-mobile-3-4.jpeg',
    out: 'living-03-wood-set-tall.jpg',
    ratio: 3 / 4,
    top: 0,
  },
  {
    src: 'her-2.jpeg',
    out: 'dining-02-peach-tall.jpg',
    ratio: 3 / 4,
    top: 0.06,
  },
  {
    src: 'Gemini_Generated_Image_fr3rgpfr3rgpfr3r.jpeg',
    out: 'bespoke-chairs-01-tall.jpg',
    ratio: 3 / 4,
    top: 0.06,
  },
]

async function main() {
  await mkdir(OUT, { recursive: true })

  for (const w of WINDOWS) {
    const image = sharp(join(HD, w.src), { failOn: 'error' })
    const meta = await image.metadata()
    const sw = meta.width ?? 0
    const sh = meta.height ?? 0
    if (!sw || !sh) {
      console.warn(`  SKIP ${w.src}: unreadable`)
      continue
    }

    /* the widest window of this shape the source can give, then clamped so
       it never runs off the bottom edge */
    let width = sw
    let height = Math.round(width / w.ratio)
    if (height > sh) {
      height = sh
      width = Math.round(height * w.ratio)
    }
    const top = Math.min(Math.round(sh * w.top), sh - height)
    const left = Math.round((sw - width) / 2)

    await image
      .extract({ left, top, width, height })
      /* a source folder: optimize-photos.mjs does the real compression */
      .jpeg({ quality: 94 })
      .toFile(join(OUT, w.out))

    console.log(`  ${w.out}  ${sw}x${sh} -> ${width}x${height} at y=${top}`)
  }

  console.log(`\n${WINDOWS.length} hero windows written into assets-raw/photos/graded.`)
  console.log('Now run: npm run photos')
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
