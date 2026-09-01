import { bespoke } from '@/content/copy'
import { Cta } from '@/components/ui/Cta'
import { whatsappMessages } from '@/content/copy'
import { SwatchDock } from '@/components/ui/SwatchDock'
import { InspectHint } from '@/components/ui/InspectHint'
import s from './sections.module.css'

/* S3. THE moment. This file stays a Server Component and its static layout
   IS the no-JS / low-tier / reduced-motion fallback. The interactive layers
   attach through hooks: data-stage-bespoke (drei View target), data-step
   (pinned word highlighting), data-bespoke-cta (swatch-aware WhatsApp link),
   and the SwatchDock island. */
export function Bespoke() {
  return (
    <section
      id="bespoke"
      className={`dark section ${s.bespoke}`}
      data-grid
      aria-label="Bespoke process"
      data-accent="#C8A96A"
    >
      <div>
        <span className="ghost-num" aria-hidden="true">{bespoke.index}</span>
        <span className="index">{bespoke.index}</span>

        <div className={s.steps}>
          {bespoke.steps.map((step) => (
            <div key={step.word} className={s.step} data-step>
              {/* data-dim: PageMotion scrubs this from 0.25 to full as it
                  crosses the viewport middle (Apple-style dim-to-bright) */}
              <h2 className={s.stepWord} data-dim>{step.word}</h2>
              <p className="placard-line">{step.line}</p>
            </div>
          ))}
        </div>

        <SwatchDock swatches={bespoke.swatches} />

        <div className={s.bespokeCta} style={{ marginTop: '2rem' }} data-bespoke-cta>
          <Cta label={bespoke.cta} message={whatsappMessages.default} />
        </div>
      </div>

      {/* the vitrine column: the 3D view tracks the stage rect, and the
          inspect affordance sits beneath it (client-only, and only once the
          3D has actually armed 360 mode) */}
      <div className={s.bespokeStageCol}>
        <div className={`${s.bespokeStage}`} aria-hidden="true" data-stage-bespoke>
          <div
            className="specimen-row"
            style={{ flexDirection: 'column', alignItems: 'center', gap: '0.9rem' }}
          >
            {bespoke.dimensions.map((d) => (
              <span key={d} className="specimen">{d}</span>
            ))}
          </div>
        </div>
        <InspectHint />
      </div>
    </section>
  )
}
