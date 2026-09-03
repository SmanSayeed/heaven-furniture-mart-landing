import type { Metadata } from 'next'
import { processPage, whatsappMessages } from '@/content/copy'
import { CatalogueChrome } from '@/components/catalogue/CatalogueChrome'
import { CatalogueMotion } from '@/components/motion/CatalogueMotion'
import { Footer } from '@/components/sections/Footer'
import { Cta } from '@/components/ui/Cta'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import s from '@/components/catalogue/catalogue.module.css'

export const metadata: Metadata = {
  title: 'How It Works · Heaven Furniture Mart',
  description:
    'How bespoke furniture works at Heaven Furniture Mart, Chattogram: a free design consultation, a piece drawn to your measurements, built in-house, delivered and installed.',
  alternates: { canonical: '/process' },
}

/**
 * /process — the offer as four plain steps.
 *
 * WHY THIS PAGE EXISTS. The landing page tells the bespoke story in three
 * verbs (Designed. Crafted. Customized.) — which is positioning, and it
 * works. But a customer who is genuinely considering an order has practical
 * anxieties the story does not answer: does asking cost anything, what do I
 * have to decide, who actually builds it, what happens at my flat on
 * delivery day. Left unanswered, those anxieties do not turn into questions;
 * they turn into a closed tab. This page answers all four in one screenful.
 *
 * Every claim on it is a trust point taken verbatim from the client brief —
 * free consultation, built to your space, premium wood and in-house
 * craftsmanship, delivery and installation included, easy payment options.
 * Nothing is invented, because a process page a client cannot honour is
 * worse than no page at all.
 */
export default function ProcessRoute() {
  return (
    <main className={s.page}>
      <CatalogueChrome current="/process" />

      <section className={`light section sheet-grid ${s.indexHead}`}>
        <div data-col="1-4">
          <p className="specimen" data-cat-fade>
            {processPage.eyebrow}
          </p>
          <h1 className="section-title">{processPage.title}</h1>
          <p className={s.lead} data-cat-fade>
            {processPage.lead}
          </p>
        </div>
        <div className={s.indexAction} data-col="5-6" data-cat-fade>
          <Cta label={processPage.cta} message={whatsappMessages.default} lead={false} />
        </div>
      </section>

      <section className={`light section sheet-grid ${s.stepGrid}`} aria-label="The four steps">
        {processPage.steps.map((step, i) => (
          /* two-up, the same alternation the collections index uses: steps
             01 and 03 on the left, 02 and 04 on the right, so reading order
             walks the grid the way the eye already travels */
          <article
            key={step.num}
            className={s.stepCard}
            data-col={i % 2 === 0 ? '1-3' : '4-6'}
            data-cat-card
          >
            <span className="index">{step.num}</span>
            <h2 className={s.stepName}>{step.name}</h2>
            <p className={s.stepLine}>{step.line}</p>
            <div className="specimen-row">
              {step.specs.map((spec) => (
                <span key={spec} className="specimen">
                  {spec}
                </span>
              ))}
            </div>
          </article>
        ))}

        {/* the workshop's own work, full width under the steps: the proof
            that step 03 is a real room with real people in it */}
        {hasPhoto('living-03-wood-set') && (
          <figure className={`panel panel-land ${s.processPlate}`} data-col="1-6" data-cat-card>
            <PrintPhoto
              name="living-03-wood-set"
              alt="A full wooden living set built in-house by Heaven Furniture Mart."
              sizes="100vw"
              kenBurns
            />
            <CropMarks />
            <figcaption className={`specimen ${s.plateCaption}`}>
              {processPage.photoCaption}
            </figcaption>
          </figure>
        )}
      </section>

      <section className={`dark section sheet-grid ${s.note}`} data-grid>
        <div data-col="2-5">
          <h2 className="section-title">Step one costs nothing.</h2>
          <Cta label={processPage.cta} message={whatsappMessages.default} />
        </div>
      </section>

      <Footer />
      <CatalogueMotion />
    </main>
  )
}
