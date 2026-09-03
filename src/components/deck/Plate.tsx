import { Photo, hasPhoto } from '@/components/ui/Photo'
import s from './deck.module.css'

/**
 * How a plate's photograph ARRIVES (deck.module.css `[data-enter]`). Every
 * variant is a transform or a clip-path on the media layer, so all of them
 * composite; none touches layout.
 *   rise     - settles from scale 1.06 (the default)
 *   wipe-r   - revealed left to right
 *   wipe-l   - revealed right to left
 *   iris     - blooms from a point near the centre
 *   shutter  - opens from the horizontal middle
 *   zoom     - settles from scale 1.25, out of shadow
 *   tilt     - lies back in perspective and stands up
 */
export type Enter = 'rise' | 'wipe-r' | 'wipe-l' | 'iris' | 'shutter' | 'zoom' | 'tilt'

/** How the title's WORDS arrive (`[data-text]`): out of a line mask, out of
    a blur, or sliding in from a side. */
export type TextEnter = 'mask' | 'blur' | 'slide-l' | 'slide-r'

/** Where the caption stands (`[data-side]`): bottom-left (the default),
    bottom-right, bottom-centre, or dead centre of the plate. */
export type Side = 'left' | 'right' | 'center' | 'middle'

/**
 * One plate of the deck (PLAN-V5): a full-screen photograph with a caption.
 *
 * Server Component. The photograph is the plate; the caption is bottom-left
 * in Apple-sized type; anything positioned elsewhere (the VIEW pill, the 3D
 * stage box, the maker's portrait) comes in through `aside`.
 *
 * `z` is load-bearing - see deck.module.css. Plates before the bespoke plate
 * are 1, the bespoke plate is 2, plates after it are 5, and the fixed WebGL
 * canvas sits at 4 between them.
 *
 * `enter` / `text` pick the entrance. Nine plates arriving the same way read
 * as a slideshow; nine plates each arriving in their own way read as a
 * sequence somebody directed. The CSS default is always the FINISHED plate:
 * DeckMotion stamps data-wait from JavaScript and removes it as the plate
 * crosses 60% of the viewport, so no-JS and reduced-motion see every plate
 * complete.
 */
export function Plate({
  id,
  index,
  z,
  photo,
  alt,
  priority = false,
  quiet = false,
  enter = 'rise',
  text = 'mask',
  side = 'left',
  no,
  aside,
  children,
  label,
}: {
  id: string
  /** 1-based position, printed by the counter */
  index: number
  z: number
  photo?: string
  alt?: string
  priority?: boolean
  /** no photograph: the plate's own ground is the picture */
  quiet?: boolean
  enter?: Enter
  text?: TextEnter
  side?: Side
  /** the chapter number, printed outlined at the size of the plate */
  no?: string
  aside?: React.ReactNode
  children: React.ReactNode
  /** accessible name for the region */
  label: string
}) {
  const hasImg = !!photo && hasPhoto(photo)
  return (
    <section
      id={id}
      className={`${s.plate} ${quiet || !hasImg ? s.plateQuiet : ''}`}
      style={{ zIndex: z }}
      data-plate={index}
      data-enter={enter}
      data-text={text}
      data-side={side}
      aria-label={label}
    >
      {photo && hasImg && (
        <div className={s.plateMedia} data-plate-media>
          <Photo
            name={photo}
            alt={alt ?? ''}
            sizes="100vw"
            priority={priority}
            low={!priority}
            className={s.plateImg}
          />
        </div>
      )}
      {/* the ground: what a pointer lands on when it is over the photograph
          and not the caption. DeckMotion reads it for the cursor ring and
          the click-to-view. */}
      <div className={s.scrim} aria-hidden="true" data-plate-ground />
      {/* the stack's shadow: DeckMotion darkens this as the NEXT plate rises
          over this one, so a covered plate recedes instead of being cut */}
      <div className={s.shade} aria-hidden="true" data-plate-shade />
      {no && (
        <span className={s.no} aria-hidden="true">
          {no}
        </span>
      )}
      {aside}
      <div className={s.text}>{children}</div>
    </section>
  )
}

/**
 * A dimension line under a title:
 *
 *   |———————— to your wall ————————|
 *
 * The rules grow out from the label as the plate arrives (deck.module.css
 * `.measure`). It carries no number on purpose: the only numbers this site
 * prints are measured off the 3D piece, never typed. What it carries is the
 * brand's one sentence, drawn.
 */
export function Measure({ label }: { label: string }) {
  return (
    <span className={s.measure} aria-hidden="true">
      <b />
      <i />
      <em>{label}</em>
      <i />
      <b />
    </span>
  )
}

/**
 * A title whose words can arrive one after another. Each line is a mask
 * (overflow hidden) and each word carries its index in `--i`, which the CSS
 * turns into a stagger - the staggerChildren idea, with no library and no
 * per-frame JavaScript.
 */
export function PlateTitle({
  lines,
  as: Tag = 'h2',
  className = '',
}: {
  lines: readonly string[]
  as?: 'h1' | 'h2'
  className?: string
}) {
  let i = 0
  return (
    <Tag className={`${s.title} ${className}`}>
      {lines
        .filter((line) => line.length > 0)
        .map((line, li) => (
          <span key={li} className={s.line}>
            {line.split(' ').map((word, wi) => (
              <span key={wi} className={s.w} style={{ '--i': i++ } as React.CSSProperties}>
                {word}
                {wi < line.split(' ').length - 1 ? ' ' : ''}
              </span>
            ))}
          </span>
        ))}
    </Tag>
  )
}
