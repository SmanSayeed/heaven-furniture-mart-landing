import { bespoke, night } from '@/content/copy'
import { CropMarks } from '@/components/ui/CropMarks'
import { WhatsApp } from '@/components/ui/Icons'
import { Swatches } from '@/components/deck/Swatches'
import { ArModal } from '@/components/deck/ArModal'
import { whatsappUrl } from '@/lib/whatsapp'
import { Narrator, ChapterTag } from './Narrator'
import { Dimension, Inspect, StagePoster } from './Stage'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'

/**
 * CHAPTER 4 · THE DRAFTING TABLE. "Yours is drawn." The 3D chapter.
 *
 * Three steps on the left - Designed / Crafted / Customized, the client's
 * own words - lit one by one as the pinned scroll passes them; the stage on
 * the right, which the page's one WebGL canvas tracks. The piece is drawn
 * in blueprint lines, swept up into wood and velvet, re-dyed by the
 * swatches, and then handed over to turn a full 360. The dimension line
 * prints the piece's real millimetres off the mesh.
 *
 * Server Component: the static layout IS the no-JS / low-tier / reduced-
 * motion truth (poster in the stage, three steps lit, swatches that still
 * rewrite the CTA). NightMotion pins it and scrubs bespokeProgress.
 */
export function Table() {
  const t = night.table
  return (
    <section id="table" className={s.table} data-chapter="table" aria-label="Bespoke">
      <div className={`${s.inner} ${s.tableGrid}`}>
        <div className={s.tableCol}>
          <div data-reveal="words" data-stagger style={{ display: 'grid', gap: '0.9rem' }}>
            <ChapterTag id="table" />
            <Narrator id="table" />
          </div>

          <div className={s.steps} data-steps>
            {bespoke.steps.map((step) => (
              <div key={step.word} className={s.step} data-step>
                <h3 className={s.stepWord}>{step.word}</h3>
                <p className={s.stepLine}>{step.line}</p>
              </div>
            ))}
          </div>

          <div className={s.fabric} data-swatch-dock>
            <span className={s.fabricKey}>{t.fabric}</span>
            <Swatches swatches={bespoke.swatches} />
          </div>

          <div className={s.row}>
            <a
              className={`${d.pill} ${d.pillBrass}`}
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              data-bespoke-cta
            >
              <WhatsApp />
              {bespoke.cta}
            </a>
            <ArModal inline label={t.ar} />
          </div>
        </div>

        <div className={s.stageCol}>
          {/* the rect the drei View tracks; the poster is the no-3D truth
              and unmounts the moment the piece is on screen */}
          <div className={s.stage} data-stage-bespoke aria-hidden="true">
            <CropMarks />
            <StagePoster />
          </div>
          <Dimension fallback={bespoke.dimensions[0]} />
          <div className={s.specs}>
            {bespoke.dimensions.slice(1).map((sp) => (
              <span key={sp}>{sp}</span>
            ))}
            <span>{t.measured}</span>
          </div>
          <Inspect />
        </div>
      </div>
    </section>
  )
}
