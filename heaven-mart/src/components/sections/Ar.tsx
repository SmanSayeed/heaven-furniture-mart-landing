import { ar } from '@/content/copy'
import { ArViewer } from '@/components/ui/ArViewer'
import s from './sections.module.css'

/* S6. "See it in your room". The section itself stays a Server Component: it
   renders the placard and hands the panel to ArViewer, which is the only part
   that needs to be a client island. */
export function Ar() {
  return (
    <section
      id="ar"
      className={`light section ${s.ar}`}
      data-grid
      aria-label="Augmented reality preview"
      data-accent="#B8956A"
    >
      <span className="ghost-num" aria-hidden="true">{ar.index}</span>
      <div className={s.placard}>
        <span className="index">{ar.index}</span>
        <h2 className="section-title">{ar.title}</h2>
        <p className="placard-line">{ar.line}</p>
      </div>

      {/* the client island: a photograph and a button until pressed, then the
          real viewer. Nothing about model-viewer is downloaded before that. */}
      <div className={s.arMedia}>
        <ArViewer />
      </div>
    </section>
  )
}
