import s from '@/components/ui/shared.module.css'

/**
 * Registration / crop marks at a panel's four corners (BLUEPRINT SS2.7.3).
 *
 * Two 1px strokes per corner, 90 degrees apart, sitting a hair inside the
 * panel edge. On a printed sheet these tell the trimmer where the image
 * ends; here they do the same job for the eye, and they are the cheapest
 * possible way to say "this rectangle was placed deliberately" rather than
 * "this rectangle is where a picture happened to go".
 *
 * Pure decoration, absolutely positioned, no layout cost, aria-hidden.
 * Used only on stage and viewfinder panels — the annotation budget is three
 * kinds per viewport (SS2.7) and restraint is the point.
 */
export function CropMarks() {
  return (
    <span className={s.cropMarks} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  )
}
