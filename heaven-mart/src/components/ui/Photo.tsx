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

/** Is this photo available yet? Lets a section choose its layout, not just
    its image: a card with no photo should look composed, not empty. */
export function hasPhoto(name: string): boolean {
  return name in photos
}
