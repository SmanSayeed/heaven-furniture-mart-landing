/**
 * Photo pipeline: assets-raw/photos/{graded,originals}  ->  public/img
 *
 * Run:  npm run photos
 *
 * Reads every Gemini/Reve-cleaned photo, emits WebP widths up to the source's
 * own width plus a tiny base64 LQIP, and writes a manifest the page imports. Originals never enter git (assets-raw is ignored); only the
 * optimised output is committed.
 *
 * Idempotent: re-run it whenever new graded photos land.
 */
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises'
import { join, parse, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const RAW = join(ROOT, '..', 'assets-raw', 'photos')
const GRADED = join(RAW, 'graded')
const ORIGINALS = join(RAW, 'originals')
/* Folders directly under photos/ that are neither graded/ nor originals/ are
   sources too. This exists because ASSETS.md and the asset hand-off both tell
   Saadman to drop people shots in `assets-raw/photos/people/`, and the
   pipeline only ever looked inside graded/ and originals/ - so the MD's
   portrait sat on disk, ignored, while the page rendered the sheet without
   him. Files that arrive pre-cut (a background-removed PNG) have nothing to
   grade, so requiring them to sit in `originals/` was ceremony with no
   payoff. */
const LOOSE_SKIP = new Set(['graded', 'originals'])
const OUT = join(ROOT, 'public', 'img')
const MANIFEST = join(ROOT, 'src', 'content', 'photos.generated.ts')

/*
  THE WIDTHS ARE DESCRIPTIVE, NOT ASPIRATIONAL.

  This used to be [480, 960, 1600] with `withoutEnlargement`, which sounds
  careful and was in fact a lie to the browser: every source photograph tops
  out at 1024 px (BLUEPRINT 2.4b - it is Gemini's output ceiling and the
  client has nothing larger), so the file written as `-1600.webp` was 1024 px
  wide while the srcset advertised it as `1600w`. A high-DPR phone would pick
  that candidate expecting 1600 px of detail, pay for the largest file on the
  page, and receive 1024 px anyway.

  So each photo now emits tiers up to its OWN width and labels every candidate
  with the width it really is. The browser gets to make a correct decision,
  and nothing is downloaded on the promise of detail that does not exist.
*/
const TIERS = [480, 768, 1024, 1600]
/* which photograph becomes the hero's defocused backdrop (see below) */
const HERO_BACKDROP_FROM = 'hero-sofa-01-frontal'
const QUALITY = 80
const EXT = /\.(jpe?g|png|webp)$/i

/** Recursively collect image files, keeping any sub-folder (e.g. people/). */
async function collect(dir, base = '') {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return [] // graded/ does not exist yet
  }
  const files = []
  for (const entry of entries) {
    const rel = join(base, entry.name)
    if (entry.isDirectory()) files.push(...(await collect(join(dir, entry.name), rel)))
    else if (EXT.test(entry.name)) files.push(rel)
  }
  return files
}

/**
 * Graded wins, original stands in.
 *
 * The graded folder holds Gemini-cleaned versions of the same filenames. It
 * was a hard gate before: no graded photo meant no photo at all, and the page
 * shipped grey placeholder panels while ten real Heaven photographs sat one
 * folder away. Now each photo resolves independently, so the page always has
 * the client's real photography and every graded file that lands upgrades
 * exactly one slot, with no code change and no all-or-nothing wait.
 */
async function collectLoose() {
  let entries
  try {
    entries = await readdir(RAW, { withFileTypes: true })
  } catch {
    return []
  }
  const out = []
  for (const entry of entries) {
    if (!entry.isDirectory() || LOOSE_SKIP.has(entry.name)) continue
    for (const rel of await collect(join(RAW, entry.name), entry.name)) {
      out.push(rel)
    }
  }
  return out
}

async function resolveSources() {
  const graded = new Map((await collect(GRADED)).map((rel) => [key(rel), join(GRADED, rel)]))
  const originals = new Map((await collect(ORIGINALS)).map((rel) => [key(rel), join(ORIGINALS, rel)]))
  const loose = new Map((await collectLoose()).map((rel) => [key(rel), join(RAW, rel)]))
  const out = []
  for (const [slug, path] of originals) {
    out.push({ slug, path: graded.get(slug) ?? path, graded: graded.has(slug) })
  }
  /* a graded photo with no original is still a photo we want */
  for (const [slug, path] of graded) {
    if (!originals.has(slug)) out.push({ slug, path, graded: true })
  }
  /* and so is a loose one, unless graded/ or originals/ already claimed the
     same slug - those two are the curated path and win */
  for (const [slug, path] of loose) {
    if (!originals.has(slug) && !graded.has(slug)) out.push({ slug, path, graded: false })
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug))
}

/** folder + filename -> manifest key, e.g. people/md.jpg -> people-md */
function key(rel) {
  const { dir, name } = parse(rel)
  /* both separators: node's join gives backslashes on Windows */
  return dir ? `${dir.replace(/[\\/]/g, '-')}-${name}` : name
}

async function main() {
  const files = await resolveSources()
  if (files.length === 0) {
    console.log(`No photos found in ${relative(ROOT, RAW)}. Nothing to do.`)
    console.log('Drop photos in originals/ or graded/ (see SAADMAN-TASKS.md) and re-run.')
    return
  }

  await mkdir(OUT, { recursive: true })
  const manifest = {}

  for (const { slug, path: input, graded } of files) {
    const image = sharp(input, { failOn: 'error' })
    const meta = await image.metadata()

    /* every tier at or below the source width, plus the source width itself
       as the top candidate. Deduplicated, so a 1024 px source emits 480, 768
       and 1024 and never pretends to a fourth. */
    const source = meta.width ?? TIERS[TIERS.length - 1]
    const widths = [...new Set([...TIERS.filter((w) => w < source), source])]

    for (const width of widths) {
      await image
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(join(OUT, `${slug}-${width}.webp`))
    }
    const top = widths[widths.length - 1]

    /*
      A CUT-OUT GETS NO BLUR PLACEHOLDER.

      The LQIP rides as the element's own CSS background so the blur-up costs
      no JavaScript - which is exactly right for a photograph that fills its
      box, and exactly wrong for one with a transparent background. A 16px
      blur of a cut-out portrait is a skin-coloured smear, and it would sit
      BEHIND the finished image forever, visible through every transparent
      pixel: the man would be standing in front of a blurry ghost of himself.

      So alpha sources get an empty blurDataURL and Photo.tsx omits the
      background entirely. There is nothing to blur up to; a cut-out has no
      box to reserve visually, only the dimensions, which are still emitted.
    */
    const alpha = meta.hasAlpha === true
    const lqip = alpha
      ? null
      : await image.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()

    manifest[slug] = {
      src: `/img/${slug}-${top}.webp`,
      srcSet: widths.map((w) => `/img/${slug}-${w}.webp ${w}w`).join(', '),
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      blurDataURL: lqip ? `data:image/webp;base64,${lqip.toString('base64')}` : '',
      /* published so a component can choose its LAYOUT, not just its src: a
         cut-out belongs standing free on the sheet, never inside a panel with
         object-fit cover, which would crop the subject's head off */
      alpha,
    }

    const { size } = await stat(join(OUT, `${slug}-${top}.webp`))
    console.log(
      `  ${graded ? 'graded  ' : 'original'} ${slug}  ->  ${widths.length} widths, ` +
        `${top}w = ${(size / 1024).toFixed(0)} KB`,
    )
  }

  /*
    ---- the hero backdrop ----
    The hero's photograph is not read as a picture; it is the room the piece
    stands in. Cover-fitting a landscape frame into a portrait phone zooms it
    two-fold, and at that magnification an upholstery pattern competes with
    the 3D piece and with the headline. So the backdrop is defocused.

    Baked here rather than applied as a CSS filter, deliberately: a
    full-viewport blur(20px) is re-rasterised on every parallax frame, which
    is exactly the kind of cost a phone cannot afford during the hero's
    scroll. Baked, it costs nothing at runtime and compresses to a fraction
    of the sharp original, which makes it a better LCP element as well.
  */
  const heroSource = files.find((f) => f.slug === HERO_BACKDROP_FROM)
  if (heroSource) {
    const out = join(OUT, 'hero-backdrop.webp')
    await sharp(heroSource.path)
      .resize({ width: 1280 })
      .blur(22)
      .modulate({ brightness: 0.62, saturation: 0.78 })
      .webp({ quality: 72 })
      .toFile(out)
    const lqip = await sharp(heroSource.path).resize({ width: 16 }).blur(2).webp({ quality: 40 }).toBuffer()
    const meta = await sharp(out).metadata()
    manifest['hero-backdrop'] = {
      src: '/img/hero-backdrop.webp',
      srcSet: '/img/hero-backdrop.webp 1280w',
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      blurDataURL: `data:image/webp;base64,${lqip.toString('base64')}`,
    }
    const { size } = await stat(out)
    console.log(`  backdrop hero-backdrop  ->  1 width, ${(size / 1024).toFixed(0)} KB`)
  }

  const body = `/* GENERATED by scripts/optimize-photos.mjs. Do not edit by hand. */
export const photos = ${JSON.stringify(manifest, null, 2)} as const

export type PhotoKey = keyof typeof photos
`
  await writeFile(MANIFEST, body, 'utf8')
  console.log(`\n${files.length} photos processed. Manifest: ${relative(ROOT, MANIFEST)}`)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
