import { ar } from '@/content/copy'
import { ArViewer } from '@/components/ui/ArViewer'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import s from './sections.module.css'

/**
 * SHEET 07 · "YOUR ROOM" — see it in your place.
 *
 * The mirror of Sheet 02 (BLUEPRINT SS4): there the panel was on the right
 * and the words on the left; here the viewfinder takes columns 1-4 and the
 * placard 5-6. Mirroring the same split rather than inventing a new one is
 * what makes a page of eight different layouts still read as one document.
 *
 * The section stays a Server Component: it renders the placard and hands the
 * panel to ArViewer, which is the only part that needs to be a client island
 * and the only part that ever downloads model-viewer.
 */
export function Ar() {
  return (
    <section
      id="ar"
      className={`light section sheet-grid ${s.ar}`}
      data-grid
      aria-label="Augmented reality preview"
    >
      {/* the client island: a photograph and a button until pressed, then the
          real viewer. Nothing about model-viewer is downloaded before that. */}
      <div className={s.arMedia} data-col="1-4">
        <ArViewer />
      </div>

      <div className={s.placard} data-col="5-6">
        <BeatCaption no="07" />
        <h2 className="section-title">{ar.title}</h2>
        <p className="placard-line">{ar.line}</p>
      </div>

      <SheetBlock no="07" />
    </section>
  )
}
