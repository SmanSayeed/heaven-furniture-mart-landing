import type { CSSProperties } from 'react'
import { Photo, hasPhoto } from './Photo'
import s from '@/components/sections/sections.module.css'

/**
 * THE LOADSHEDDING CUT (BLUEPRINT SS5.6).
 *
 * The most Chattogram-true lighting effect there is: the current goes, the
 * room sits grey, and then the light COMES BACK - first a pool around the
 * bulb, then the whole room. Every visitor Heaven's Facebook ads reach knows
 * that exact moment in their body, and the page stages it on the two
 * room-scale photographs (Sheet 02's studio, Sheet 05's showroom).
 *
 * The geometry is not arbitrary: the focus point is a grid intersection (the
 * panel's centre column at 1/3 height by default, the same rule-of-thirds
 * anchor the 3D horizon uses), and the lit radius is scrubbed by scroll from
 * a bulb's pool to the whole room.
 *
 *   inside r:  full colour, brightness 1.06
 *   outside:   grayscale(1) brightness(0.68) - the loadshedding zone
 *
 * Implementation: two stacked copies of the SAME file (one network fetch;
 * the browser serves the second from cache), the top one clipped by
 * `clip-path: circle(var(--focus-r) at ...)`. clip-path circles interpolate
 * natively and stay on the compositor, so the scrub writes exactly one custom
 * property per frame and touches no layout. The lit layer's drop-shadow rides
 * the clipped silhouette, which gives the light a real bulb's rim for free.
 *
 * Same inversion as PrintPhoto: the CSS default is 120% - fully lit, full
 * colour, the finished room. JS sets it DOWN to 12% before it scrubs back up,
 * so no-JS and reduced-motion visitors get a room with the lights on.
 */
export function FocusLight({
  name,
  alt,
  sizes = '100vw',
  className,
  focusX = '50%',
  focusY = '33%',
}: {
  name: string
  alt: string
  sizes?: string
  className?: string
  focusX?: string
  focusY?: string
}) {
  if (!hasPhoto(name)) return null

  return (
    <span
      className={`${s.focus} ${className ?? ''}`}
      data-focus
      style={{ '--focus-x': focusX, '--focus-y': focusY } as CSSProperties}
    >
      {/* the dark room. This copy carries the alt text: it is the one that
          is always present, at any radius, in every fallback path. */}
      <Photo name={name} alt={alt} sizes={sizes} className={s.focusBase} />
      {/* the lit room, clipped to the pool of light. Decorative: it is the
          same photograph, and announcing it twice would be noise. */}
      <span className={s.focusLit} aria-hidden="true" data-focus-lit>
        <Photo name={name} alt="" sizes={sizes} className={s.focusTop} />
      </span>
    </span>
  )
}
