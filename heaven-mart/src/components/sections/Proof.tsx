import { proof } from '@/content/copy'
import { Photo, PrintPhoto, hasPhoto, photoHasAlpha } from '@/components/ui/Photo'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import { FloodBeam } from '@/components/ui/FloodBeam'
import s from './sections.module.css'

/* Both land in assets-raw/photos/people/ and pass through `npm run photos`.
   Until they do, hasPhoto is false and each block simply does not render —
   the sheet stays a finished composition rather than showing two empty
   frames, which is the same contract every other photograph here honours.

   WHICH PORTRAIT ARRIVED IS A QUESTION THE SHEET ASKS, not one it assumes.
   The first supply was a background-removed PNG; the second was the full
   studio JPEG on a flat light-grey seamless, which is the file the MD's
   office actually has. Both are legitimate and they want opposite treatment,
   so the sheet reads `alpha` off the manifest and stages accordingly. See
   the block further down. */
const MD_PORTRAIT = 'people-owner-heaven-furniture'
const MD_IS_CUTOUT = photoHasAlpha(MD_PORTRAIT)
/* his own work standing beside him: a real Heaven room, not a stock plate */
const MD_WORK = 'living-01-beige-set'

/**
 * SHEET 03 · "THE MAKER" — in his own words.
 *
 * MOVED UP FROM SHEET 07. A first-time visitor's second question, straight
 * after "what is this", is "who is behind it", and on a page selling bespoke
 * work that is not decoration — it is the credibility the entire offer rests
 * on. Seventh out of nine, most visitors never reached it.
 *
 * Three things, no more: his face, his sentence, and the company measured as
 * a dimension line. The seven trust chips that used to hang under the quote
 * are gone; six of them were already on Sheet 02, one scroll earlier.
 *
 * Map: quote on [1-3], his portrait and his own work stacked on [4-6], the
 * timeline beneath the words. No drawn grid on this sheet — lines through
 * prose read as graph paper, and a grid means "an object is being placed
 * here". This sheet places words.
 */
export function Proof() {
  return (
    <section
      id="sheet-03"
      className={`dark section sheet-grid room ${s.proof}`}
      aria-label="Abul Kalam Bhuiyan, Managing Director"
    >
      {/* the static shaft: the quote sits inside it, and the portrait stands
          half in light and half in shadow along the 45 */}
      <FloodBeam wide />

      <div className={s.proofMain} data-col="1-3">
        <BeatCaption no="03" />
        <h2 className="section-title">{proof.title}</h2>

        {/* data-dim wraps ONLY the quote text: dimming the whole blockquote
            would multiply into the 0.62-opacity specimen (the role line) and
            push it far below the 4.5:1 contrast floor */}
        <blockquote className={s.quote}>
          <span data-dim>
            <span className={s.quoteMark} aria-hidden="true">&ldquo;</span>
            {proof.quote}
          </span>
          <footer className={s.quoteBy}>
            <span className="placard-title">{proof.quoteBy}</span>
            <span className="specimen">{proof.quoteRole}</span>
          </footer>
        </blockquote>

        {/* THE TIMELINE AS A DIMENSION LINE: one measured rule, years as
            ticks. PageMotion draws it from the top on scroll; the CSS default
            is fully drawn, so no-JS and reduced motion see the finished
            measurement. */}
        <div className={s.timeline}>
          <span className={s.timelineRule} aria-hidden="true" data-timeline-rule />
          <ul className={s.timeList}>
            {proof.milestones.map((m) => (
              <li key={m.year} className={s.timeRow}>
                <span className={s.timeTick} aria-hidden="true" />
                <span className={s.timeYear}>{m.year}</span>
                <span className="placard-line">{m.event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.proofSide} data-col="4-6">
        {/*
          THE MAN STANDS ON THE SHEET. He is not in a frame.

          The portrait is a cut-out - the background is genuinely gone - and
          putting a cut-out inside a `panel` with object-fit: cover would have
          been the reflexive move and the wrong one twice over: the panel
          would crop a head-and-shoulders bust at the neck, and a framed
          photograph of a man is a portrait ON a page, while a cut-out
          standing free is a man IN the room the page is describing.

          So he is staged the way every other object on this site is: lit from
          the top left, standing in a pool of light, with a drawn rule under
          his feet and his own dimension called out beside him. The page
          measures its furniture; here it measures its founder, which is the
          one joke this very serious page allows itself and is also, exactly,
          the thesis - everything Heaven makes is drawn to a measure.

          `data-md` is the hook for the arrival: PageMotion strikes the light
          on and lifts him in. `Photo` rather than `PrintPhoto` because the
          plotter sweep is a rectangle wiping down a plate, and there is no
          plate here.

          WHEN THE FILE IS A JPEG (`data-keyed`), the same staging still
          holds, because a flat seamless backdrop can be REMOVED IN CSS
          rather than in Photoshop: a radial mask eats the corners of the
          frame, and the grade takes the remaining grey down until it is the
          sheet's own black. It is not a true alpha cut — a hard edge behind
          a shoulder will survive it — but on a studio seamless it gets most
          of the way there for zero bytes and no destructive edit to the
          client's only portrait of their founder.
        */}
        {hasPhoto(MD_PORTRAIT) && (
          <figure className={s.mdStage} data-md data-keyed={MD_IS_CUTOUT ? undefined : ''}>
            <span className={s.mdGlow} aria-hidden="true" />
            <Photo
              name={MD_PORTRAIT}
              alt={`${proof.quoteBy}, ${proof.quoteRole} of Heaven Furniture Mart.`}
              sizes="(min-width: 900px) 26vw, 62vw"
              className={s.mdCutout}
            />
            <span className={s.mdFloor} aria-hidden="true" />
            <figcaption className={s.mdPlate}>
              <span className={s.mdRule} aria-hidden="true" />
              <span className="placard-title">{proof.quoteBy}</span>
              <span className="specimen">{proof.quoteRole.toUpperCase()} · EST. 2020</span>
            </figcaption>
          </figure>
        )}

        {/* the work, beside the man: a founder's portrait alone is a claim,
            a founder beside a room he built is evidence */}
        {hasPhoto(MD_WORK) && (
          <figure className={`panel panel-land ${s.proofWork}`}>
            <PrintPhoto
              name={MD_WORK}
              alt="A living room set built by Heaven Furniture Mart, in the Agrabad showroom."
              sizes="(min-width: 900px) 30vw, 92vw"
              kenBurns
            />
            <figcaption className="specimen">{proof.workCaption}</figcaption>
          </figure>
        )}
      </div>

      <SheetBlock no="03" />
    </section>
  )
}
