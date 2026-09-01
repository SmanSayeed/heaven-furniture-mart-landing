import { showroom } from '@/content/copy'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { mapsUrl } from '@/lib/whatsapp'
import { MapPin } from '@/components/ui/Icons'
import s from './sections.module.css'

/* The widest real showroom frame we have. A walkthrough video or a Gaussian
   splat replaces it the day one is captured; the section does not change. */
const SHOWROOM_PHOTO = 'living-02-blue-pair'

/* S5. The Agrabad showroom. Sprint 6 fills the media panel with the Gaussian
   splat (stretch) or the walkthrough video; until then, an honest lit panel. */
export function Showroom() {
  return (
    <section
      className={`dark section ${s.showroom}`}
      aria-label="Showroom"
      data-accent="#C8A96A"
      data-grid
    >
      <span className="ghost-num" aria-hidden="true">{showroom.index}</span>
      <div>
        <span className="index">{showroom.index}</span>
        <h2 className="section-title">{showroom.title}</h2>
      </div>

      {/* data-aperture: PageMotion reveals this panel through an expanding
          rounded window as it enters (PLAN 2.5, S4 -> S5 "aperture") */}
      <div
        className={`${hasPhoto(SHOWROOM_PHOTO) ? '' : 'ph'} ${s.showroomMedia}`}
        data-aperture
      >
        <Photo
          name={SHOWROOM_PHOTO}
          alt="Sofas on display inside the Heaven Furniture Mart showroom on Agrabad Access Road, Chattogram."
          sizes="100vw"
        />
        {!hasPhoto(SHOWROOM_PHOTO) && (
          <span className="specimen">SHOWROOM CAPTURE · INCOMING</span>
        )}
      </div>

      <div className={s.showroomFoot}>
        <div className="specimen-row">
          {showroom.specimens.map((sp) => (
            <span key={sp} className="specimen">{sp}</span>
          ))}
        </div>
        <a className="textlink" href={mapsUrl()} target="_blank" rel="noopener noreferrer">
          <MapPin />
          {showroom.directions}
        </a>
      </div>
    </section>
  )
}
