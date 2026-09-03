import { brand, night } from '@/content/copy'
import { QuoteModal } from '@/components/deck/QuoteModal'
import { Words } from './Words'
import { Narrator, ChapterTag } from './Narrator'
import s from './night.module.css'

/**
 * CHAPTER 7 · YOUR ROOM. "Tell us your room."
 *
 * The one question. Three steps in the quote builder and WhatsApp opens
 * with the message written. The floodlight comes back wide: the page ends
 * lit, in the same light that opened it.
 */
export function Ask() {
  const a = night.ask
  return (
    <section id="ask" className={s.ask} data-chapter="ask" aria-label="Request a quote">
      <span className={s.beamWide} data-reveal="beam" aria-hidden="true" />
      <div className={s.askText} data-reveal="words" data-stagger>
        <ChapterTag id="ask" />
        <Words lines={a.title} className={s.title} />
        <Narrator id="ask" />
        <p className={s.lede} data-reveal="blur">
          {a.line}
        </p>
        <div className={s.row} data-reveal="rise">
          <QuoteModal />
          <a className={s.quiet} href={`tel:${brand.phoneTel}`}>
            or call {brand.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  )
}
