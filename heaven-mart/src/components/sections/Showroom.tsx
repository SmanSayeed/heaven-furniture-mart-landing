import { showroom } from '@/content/copy'
import { FocusLight } from '@/components/ui/FocusLight'
import { CropMarks } from '@/components/ui/CropMarks'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import { hasPhoto } from '@/components/ui/Photo'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { mapsUrl } from '@/lib/whatsapp'
import { MapPin } from '@/components/ui/Icons'
import { brand } from '@/content/copy'
import s from './sections.module.css'

/* The poster frame. THERE IS A WALKTHROUGH AFTER ALL: Heaven publish their
   own virtual tour of the Agrabad showroom on YouTube, which is better than
   anything a capture visit could have produced and is unarguably theirs.
   The still stays as the panel's resting state and the film plays into it
   (VideoEmbed) — the doorway still opens, the room still prints, and now
   stepping through actually leads somewhere. */
const SHOWROOM_PHOTO = 'living-02-blue-pair'

/**
 * SHEET 06 · "THE SHOWROOM" — step through. Agrabad.
 *
 * One full-width A-LAND panel [1-6] and nothing else competing with it. Two
 * effects stack here and only here, because they are the same gesture told
 * twice: the aperture opens like a door, and inside it the loadshedding cut
 * brings the room's light back up. The address sits on the baseline beneath,
 * with the one link that is not the CTA: directions.
 */
export function Showroom() {
  return (
    <section
      id="sheet-06"
      className={`dark section sheet-grid room ${s.showroom}`}
      aria-label="Showroom"
      data-grid
    >
      <div data-col="1-3">
        <BeatCaption no="06" />
        <h2 className="section-title">{showroom.title}</h2>
      </div>

      {/* data-aperture: PageMotion reveals this panel through an expanding
          window as it enters - stepping through a doorway (BLUEPRINT SS4).

          FOUR COLUMNS, NOT SIX. Full width, the film was the entire sheet
          and the visit details hung underneath it like a caption nobody
          reads. A customer deciding whether to come needs the film and the
          address AT THE SAME TIME - the tour answers "is it worth going",
          the placard answers "then how do I go" - so they now share the
          sheet the way every other panel-and-placard pair here does. */}
      <div
        className={`${hasPhoto(SHOWROOM_PHOTO) ? '' : 'ph'} panel panel-land ${s.showroomMedia}`}
        data-aperture
        data-col="1-4"
        data-kenburns
      >
        <VideoEmbed title="Heaven Furniture Mart · virtual showroom tour, Agrabad, Chattogram">
          <FocusLight
            name={SHOWROOM_PHOTO}
            alt="Sofas on display inside the Heaven Furniture Mart showroom on Agrabad Access Road, Chattogram."
            sizes="(min-width: 900px) 62vw, 100vw"
            focusY="42%"
          />
          {!hasPhoto(SHOWROOM_PHOTO) && (
            <span className="specimen">SHOWROOM CAPTURE · INCOMING</span>
          )}
        </VideoEmbed>
        <CropMarks />
      </div>

      {/* the visit placard: everything needed to actually come, beside the
          reason to. On mobile it flows under the film, which is the same
          order the old full-width layout told the story in. */}
      <div className={s.showroomSide} data-col="5-6">
        <p className={s.showroomLine} data-dim>
          {showroom.line}
        </p>
        <div className="specimen-row">
          {showroom.specimens.map((sp) => (
            <span key={sp} className="specimen">{sp}</span>
          ))}
        </div>
        <a className="textlink" href={mapsUrl()} target="_blank" rel="noopener noreferrer">
          <MapPin />
          {showroom.directions}
        </a>
        <a className="textlink" href={`tel:${brand.phoneTel}`}>
          {showroom.call}
        </a>
      </div>

      <SheetBlock no="06" />
    </section>
  )
}
