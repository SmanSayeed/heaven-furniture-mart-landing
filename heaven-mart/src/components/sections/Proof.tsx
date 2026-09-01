import { proof } from '@/content/copy'
import s from './sections.module.css'

/* S7. Proof: the MD's words staged as artwork (the page's only long text),
   the 2020→2026 timeline, and trust points as specimen chips. */
export function Proof() {
  return (
    <section className={`dark section ${s.proof}`} aria-label="About the company" data-accent="#C8A96A">
      {/* data-dim wraps ONLY the quote text: dimming the whole blockquote
          would multiply into the footer's 0.62-opacity specimen (the role
          line) and push it far below the 4.5:1 contrast floor */}
      <blockquote className={s.quote}>
        <span data-dim>
          <span className={s.quoteMark} aria-hidden="true">“</span>
          {proof.quote}
        </span>
        <footer className={s.quoteBy}>
          <span className="placard-title">{proof.quoteBy}</span>
          <span className="specimen">{proof.quoteRole}</span>
        </footer>
      </blockquote>

      <div className={s.proofSide}>
        <ul className={s.timeline}>
          {proof.milestones.map((m) => (
            <li key={m.year} className={s.timeRow}>
              <span className={s.timeYear}>{m.year}</span>
              <span className="placard-line">{m.event}</span>
            </li>
          ))}
        </ul>

        <div className={s.trust}>
          {proof.trust.map((t) => (
            <span key={t} className="chip">
              <span className="tri" aria-hidden="true" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
