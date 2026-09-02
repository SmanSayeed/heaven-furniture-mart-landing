import { photos } from '@/content/photos.generated'
import s from '@/components/sections/sections.module.css'

type PhotoName = keyof typeof photos

/**
 * A photograph from the pipeline (`npm run photos`).
 *
 * A plain <img srcset> rather than next/image, on purpose:
 *
 *  - the three widths and the LQIP already exist as build output, so putting
 *    an image optimiser in front of them would re-encode work that is done;
 *  - it makes the page host-agnostic. Nothing about this deployment needs a
 *    Node server, which matters for a page the client's own team will host;
 *  - the blur-up costs no JavaScript: the LQIP rides as the element's own
 *    background, and the real photo simply paints over it.
 *
 * `width`/`height` are the source pixel dimensions, so the browser reserves
 * the right box before a byte of image arrives. That is what keeps CLS at 0.
 *
 * Unknown name returns null so callers can fall back to their own panel: the
 * page must never render a broken image because a photo has not landed yet.
 */
export function Photo({
  name,
  alt,
  sizes = '100vw',
  className,
  priority = false,
}: {
  name: PhotoName | (string & {})
  alt: string
  sizes?: string
  className?: string
  priority?: boolean
}) {
  const photo = photos[name as PhotoName]
  if (!photo) return null

  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       deliberate, and explained in the doc comment above: the widths and the
       LQIP are build output, so next/image would re-encode finished work and
       tie the deployment to an image optimiser. */
    <img
      className={`${s.photo} ${className ?? ''}`}
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      width={photo.width}
      height={photo.height}
      alt={alt}
      /* the one photo above the fold is eager; every other one waits until
         it is worth downloading */
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      style={{ backgroundImage: `url(${photo.blurDataURL})` }}
    />
  )
}

/**
 * THE PLOTTER PRINT (BLUEPRINT SS5.5) — the page's ONE image entrance.
 *
 * The page is a technical drawing, so its images do not fade in: they PRINT.
 * A 1px filament sweeps down the panel like a plotter head, the photograph
 * appears behind it, and then colour blooms in out of grayscale. That second
 * act is the point of the whole monochrome design: the page owns no hue, so
 * the moment a photograph turns colour is the moment Heaven's actual work
 * arrives on screen.
 *
 * One signature, repeated everywhere. Five different entrances would be a
 * template; one entrance used eight times is a style.
 *
 * THE INVERSION THAT MATTERS: the CSS default here is the FINISHED state -
 * printed, full colour, no sweep. PageMotion adds `.is-unprinted` from JS and
 * takes it away on scroll. So no-JS, reduced-motion and any failure of the
 * motion layer all land on a complete photograph, never a blank panel. Every
 * initial state on this page is set from JavaScript, and this is the rule's
 * most load-bearing instance.
 *
 * No per-frame JS: ScrollTrigger toggles two classes and CSS transitions do
 * all the easing.
 */
export function PrintPhoto({
  name,
  alt,
  sizes = '100vw',
  className,
  kenBurns = false,
}: {
  name: PhotoName | (string & {})
  alt: string
  sizes?: string
  className?: string
  /** slow scrubbed scale 1 -> 1.06 so the photo is never a dead rectangle */
  kenBurns?: boolean
}) {
  if (!hasPhoto(name)) return null
  return (
    <span
      className={`${s.printFrame} ${className ?? ''}`}
      data-print
      {...(kenBurns ? { 'data-kenburns': '' } : {})}
    >
      <Photo name={name} alt={alt} sizes={sizes} className={s.printImg} />
      {/* the plotter head: a lit filament with a bloom, one pass, top to
          bottom. It is a wrapper so translateY(100%) means "the height of
          the panel" without anyone having to measure the panel. */}
      <span className={s.sweep} aria-hidden="true">
        <i />
      </span>
    </span>
  )
}

/** Is this photo available yet? Lets a section choose its layout, not just
    its image: a card with no photo should look composed, not empty. */
export function hasPhoto(name: string): boolean {
  return name in photos
}

/**
 * Does this photo carry a real alpha channel?
 *
 * The pipeline records it (optimize-photos.mjs reads `meta.hasAlpha`), and
 * one section genuinely needs to know: the Maker sheet stages the MD as a
 * cut-out standing free on the page, which is only honest if the background
 * is actually gone. Hand it a JPEG and the same markup renders a grey
 * rectangle hovering in a dark room.
 *
 * So the sheet asks, and picks its own treatment. Supply a cut-out PNG and
 * he stands free; supply a studio JPEG and the backdrop is masked away
 * instead. Either file works, neither needs a code change.
 */
export function photoHasAlpha(name: string): boolean {
  /* the backdrop entry predates the flag and has no `alpha` key at all, so
     this reads through a widened view rather than the literal union */
  const entry = (photos as Record<string, { alpha?: boolean } | undefined>)[name]
  return entry?.alpha === true
}
