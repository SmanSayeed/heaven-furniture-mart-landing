import { team } from '@/content/copy'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import { CropMarks } from '@/components/ui/CropMarks'
import s from './sections.module.css'

/* assets-raw/photos/people/team-01.jpg, once it has been through
   `npm run photos`. Until then the sheet does not render at all — see below,
   this is the one section on the page allowed to disappear. */
const TEAM_PHOTO = 'people-team-01'

/**
 * SHEET 08 · "THE HANDS" — who builds it.
 *
 * Placed immediately before the ask, deliberately. Every other sheet has been
 * about a piece; this one is about the people who would make it, and it is
 * the last thing a visitor sees before being invited to start a conversation.
 * The brief's differentiator is "skilled in-house craftsmanship", and until
 * now the page asserted that in a chip rather than showing it.
 *
 * FOUR WORDS OF COPY, and that is the whole design. A group photograph needs
 * no explanation; anything written across it would be the page narrating its
 * own picture. One big line, two specimens, the plate.
 *
 * THE ONE SHEET ALLOWED TO NOT EXIST. Everywhere else a missing photograph
 * leaves a drawn placeholder frame, because the surrounding composition needs
 * the shape. Here the photograph IS the section: an empty frame captioned
 * "the team" would be a page admitting it has no team to show, which is worse
 * than the sheet simply not being in the set. The title block counts sheets
 * from `story`, so the numbering stays correct either way.
 */
export function Team() {
  if (!hasPhoto(TEAM_PHOTO)) return null

  return (
    <section
      id="sheet-08"
      className={`light section sheet-grid ${s.team}`}
      aria-label="The Heaven Furniture Mart team"
    >
      <div className={s.teamHead} data-col="1-3">
        <BeatCaption no="08" />
        <h2 className="section-title">{team.title}</h2>
        <p className="placard-line">{team.line}</p>
        <div className="specimen-row">
          {team.specimens.map((sp) => (
            <span key={sp} className="specimen">{sp}</span>
          ))}
        </div>
      </div>

      <figure className={`panel panel-land ${s.teamPhoto}`} data-col="1-6">
        <PrintPhoto
          name={TEAM_PHOTO}
          alt="The Heaven Furniture Mart craftsmen and team at the Agrabad workshop."
          sizes="(min-width: 900px) 92vw, 100vw"
          kenBurns
        />
        <CropMarks />
        <figcaption className={`specimen ${s.teamCaption}`}>{team.caption}</figcaption>
      </figure>

      <SheetBlock no="08" />
    </section>
  )
}
