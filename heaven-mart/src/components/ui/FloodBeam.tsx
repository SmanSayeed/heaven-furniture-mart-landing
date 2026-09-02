import s from '@/components/sections/sections.module.css'

/**
 * THE FLOODLIGHT (BLUEPRINT SS5.7) — one beam, one law.
 *
 * THE ONE LIGHT LAW: every sheet on this page has exactly one light source,
 * always from the top left at 45 degrees. Every glow blooms toward the
 * bottom right, every shadow falls there, and every beam enters from the top
 * left. One consistent direction is what makes a monochrome page read as a
 * LIT SPACE rather than as a collection of effects, and it is why the beam
 * never changes direction per sheet - only its behaviour does.
 *
 * The beam is a soft-edged shaft of white, exactly two columns wide (the
 * grid holds even the light), rotated to the page's only allowed angle, and
 * composited with mix-blend-mode: screen so it adds light rather than
 * painting a grey band.
 *
 * Trimmed to the cheap 80% for the deadline (BUILD-GUIDE 5.0): the beam is
 * STATIC on the sheets that carry it, and what moves is the switchover - a
 * dark sheet's light arrives 120ms after the sheet does, like a breaker
 * being flipped room to room. The scrubbed panning version is stretch work.
 *
 * CSS default: present and fully lit, so reduced motion and no-JS get a lit
 * room rather than a dark one.
 */
export function FloodBeam({ wide = false }: { wide?: boolean }) {
  return (
    <span
      className={`${s.floodBeam} ${wide ? s.floodBeamQuote : ''}`}
      aria-hidden="true"
      data-beam
    />
  )
}
