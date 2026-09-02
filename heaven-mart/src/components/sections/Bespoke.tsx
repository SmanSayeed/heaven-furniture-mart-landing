import { bespoke, whatsappMessages } from '@/content/copy'
import { Cta } from '@/components/ui/Cta'
import { SwatchDock } from '@/components/ui/SwatchDock'
import { InspectHint } from '@/components/ui/InspectHint'
import { CropMarks } from '@/components/ui/CropMarks'
import { DimensionLine } from '@/components/ui/DimensionLine'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import s from './sections.module.css'

/**
 * SHEET 04 · "THE DRAFTING TABLE" — yours is drawn.
 *
 * THE moment: a piece is drawn in blueprint, swept into real material, then
 * handed to the visitor to re-finish in their own fabric. Designed. Crafted.
 * Customized. — the client's own three words, staged literally.
 *
 * Map (BLUEPRINT SS4): the three steps on [1-2], the A-LAND stage on [3-6],
 * dimension lines on the panel's edges, swatches and the CTA beneath the
 * steps. Mobile pins with the stage on top, because the object is the story.
 *
 * THE FIX THAT MATTERS: the dimension text used to live INSIDE the stage,
 * where it floated over the model and read as a bug. Annotations are layer 5
 * and objects are layer 4, so they now hang off the panel's edges the way
 * dimensions do on a real drawing, and the overlap is impossible rather than
 * merely avoided.
 *
 * This file stays a Server Component and its static layout IS the no-JS /
 * low-tier / reduced-motion fallback. The interactive layers attach through
 * hooks: data-stage-bespoke (drei View target), data-step (pinned word
 * highlighting), data-bespoke-cta (swatch-aware WhatsApp link), and the
 * SwatchDock island.
 */
export function Bespoke() {
  return (
    <section
      id="bespoke"
      className={`dark section sheet-grid ${s.bespoke}`}
      data-grid
      aria-label="Bespoke process"
    >
      <div className={s.bespokeCol} data-col="1-2">
        <BeatCaption no="04" />

        <div className={s.steps}>
          {bespoke.steps.map((step) => (
            <div key={step.word} className={s.step} data-step>
              {/* data-dim: PageMotion scrubs this from its contrast floor to
                  full as the pinned sequence reaches its phase */}
              <h2 className={s.stepWord} data-dim>{step.word}</h2>
              <p className="placard-line">{step.line}</p>
            </div>
          ))}
        </div>

        <SwatchDock swatches={bespoke.swatches} />

        <div className={s.bespokeCta} data-bespoke-cta>
          <Cta label={bespoke.cta} message={whatsappMessages.default} />
          {/* the same offer in plain steps, for the visitor who wants the
              practical version before starting a conversation */}
          <a className={`specimen ${s.bespokeHow}`} href={bespoke.howHref}>
            {bespoke.how.toUpperCase()} →
          </a>
        </div>
      </div>

      {/* the stage column: the 3D view tracks the panel's rect, the drawn
          dimensions sit outside it, and the inspect affordance appears
          beneath only once the 3D has actually armed 360 mode */}
      <div className={s.bespokeStageCol} data-col="3-6">
        <div
          className={`panel panel-land ${s.bespokeStage}`}
          aria-hidden="true"
          data-stage-bespoke
        >
          <CropMarks />
        </div>
        {/* measured off the model at load, in millimetres, or absent */}
        <DimensionLine stage="bespoke" axis="w" />
        <div className="specimen-row">
          {bespoke.dimensions.map((d) => (
            <span key={d} className="specimen">{d}</span>
          ))}
        </div>
        <InspectHint />
      </div>

      <SheetBlock no="04" />
    </section>
  )
}
