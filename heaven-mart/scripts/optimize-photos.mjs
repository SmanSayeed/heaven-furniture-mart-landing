/**
 * Photo pipeline: assets-raw/photos/{graded,originals}  ->  public/img
 *
 * Run:  npm run photos
 *
 * Reads every Gemini/Reve-cleaned photo, emits three WebP widths plus a tiny
 * base64 LQIP for next/image's blurDataURL, and writes a manifest the page
 * imports. Originals never enter git (assets-raw is ignored); only the
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
const OUT = join(ROOT, 'public', 'img')
const MANIFEST = join(ROOT, 'src', 'content', 'photos.generated.ts')

const WIDTHS = [480, 960, 1600]
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
async function resolveSources() {
  const graded = new Map((await collect(GRADED)).map((rel) => [key(rel), join(GRADED, rel)]))
  const originals = new Map((await collect(ORIGINALS)).map((rel) => [key(rel), join(ORIGINALS, rel)]))
  const out = []
  for (const [slug, path] of originals) {
    out.push({ slug, path: graded.get(slug) ?? path, graded: graded.has(slug) })
  }
  /* a graded photo with no original is still a photo we want */
  for (const [slug, path] of graded) {
    if (!originals.has(slug)) out.push({ slug, path, graded: true })
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

    for (const width of WIDTHS) {
      // never upscale: a 1024px original stays 1024px
      const target = Math.min(width, meta.width ?? width)
      await image
        .clone()
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(join(OUT, `${slug}-${width}.webp`))
    }

    // 16px LQIP inlined as the blur placeholder (keeps CLS at zero)
    const lqip = await image.clone().resize({ width: 16 }).webp({ quality: 40 }).toBuffer()

    manifest[slug] = {
      src: `/img/${slug}-1600.webp`,
      srcSet: WIDTHS.map((w) => `/img/${slug}-${w}.webp ${w}w`).join(', '),
      width: meta.width ?? 0,
      height: meta.height ?? 0,
      blurDataURL: `data:image/webp;base64,${lqip.toString('base64')}`,
    }

    const { size } = await stat(join(OUT, `${slug}-1600.webp`))
    console.log(
      `  ${graded ? 'graded  ' : 'original'} ${slug}  ->  3 widths, 1600w = ${(size / 1024).toFixed(0)} KB`,
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
