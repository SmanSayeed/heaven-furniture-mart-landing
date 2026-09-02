import { story } from '@/content/copy'

type SheetNo = (typeof story)[number]['no']

function beatOf(no: SheetNo) {
  const i = story.findIndex((b) => b.no === no)
  return { beat: story[i], next: story[i + 1] }
}

/**
 * The title block every drawing sheet carries (BLUEPRINT SS2.7.1).
 *
 *   SHEET 04 · THE DRAFTING TABLE · 04/09 · NEXT: THE RANGE
 *
 * Two jobs at once, which is why it earns its place on a page this quiet:
 * it is the annotation that makes the "this page IS a technical drawing"
 * thesis literal, AND it is the wayfinding that keeps a scroll feeling like
 * a route with a destination. The NEXT line is the whole trick: a visitor is
 * never at the bottom of a section, they are always one sheet from the next
 * thing they were promised.
 *
 * Server Component; readable text, not decoration, so it is NOT aria-hidden.
 * Screen reader users get the same "where am I, what is next" that sighted
 * ones do, in six words.
 */
export function SheetBlock({ no, className }: { no: SheetNo; className?: string }) {
  const { beat, next } = beatOf(no)
  return (
    <div className={`sheet-block ${className ?? ''}`} data-col="5-6" data-sheet-block>
      {/* redundant with the NN/08 beside it, and the first thing to go when
          three columns cannot hold the whole block on one line */}
      <span className="specimen sheet-no">SHEET {beat.no}</span>
      <span className="specimen">{beat.beat.toUpperCase()}</span>
      {/* the set size is COUNTED, never typed: adding a sheet to `story`
          renumbers every title block on the page and cannot leave a stale
          "/08" behind on the one sheet someone forgot to edit */}
      <span className="specimen">
        {beat.no}/{String(story.length).padStart(2, '0')}
      </span>
      <span className="specimen sheet-next">
        {next ? `NEXT: ${next.beat.toUpperCase()}` : 'END OF SET'}
      </span>
    </div>
  )
}

/**
 * The sheet's head: its number and its one line of story, in the human voice
 * (Fraunces italic) against the drawing's machine voice (mono). The brief
 * asked for an elegant serif at the headlines; this is where it lives, on
 * every sheet, without turning the display type soft.
 */
export function BeatCaption({ no, className }: { no: SheetNo; className?: string }) {
  const { beat } = beatOf(no)
  return (
    <p className={`beat ${className ?? ''}`} data-beat-caption>
      <span className="specimen">{beat.no}</span>
      <span className="beat-caption">{beat.caption}</span>
    </p>
  )
}
