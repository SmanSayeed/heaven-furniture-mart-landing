import { intro, ticker } from '@/content/copy'
import { FocusLight } from '@/components/ui/FocusLight'
import { hasPhoto } from '@/components/ui/Photo'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import s from './sections.module.css'

/* The photograph that carries Sheet 02: a full Heaven room, their own wood
   set. It is the page's first real look at the work, which is why it gets
   the loadshedding cut rather than a plotter print: this is the beat where
   the lights come on. */
const BRAND_PHOTO = 'living-03-wood-set'

/**
 * SHEET 02 · "THE STUDIO" — the lights come on.
 *
 * Map (BLUEPRINT SS4): placard [1-2], trust row [1-2], photograph A-PORT
 * [3-6] beginning on column 3's line and bleeding off the right edge of the
 * page. The 2+4 split is asymmetric on purpose (Müller-Brockmann): a 3+3
 * would read as a comparison, and this sheet is not comparing anything - it
 * is a quiet column of words beside a room you can walk into.
 *
 * Mobile inverts the order: the photograph arrives first, full bleed, then
 * the words. On a phone the picture IS the headline.
 */
export function Brand() {
  return (
    /* data-curtain: PageMotion pins the hero under this section so it slides
       up OVER the dark stage ("the room lights come on", PLAN 2.5) */
    <section
      id="sheet-02"
      className={`light section sheet-grid room ${s.brand}`}
      aria-label="About Heaven Furniture Mart"
      data-curtain
    >
      <div className={s.placard} data-col="1-2">
        <BeatCaption no="02" />
        <h2 className="section-title">{intro.title}</h2>
        <p className="placard-line">{intro.line}</p>

        {/* The specimen row that stood here repeated EST. 2020 and AGRABAD
            from the hero one screen above, and a fact restated a scroll later
            reinforces nothing. Gone; the trust row below is the sheet's
            second thing to read, and its only one. */}
        {/* the fast read: four reasons, scannable in two seconds, two
            scrolls into the page rather than six */}
        <ul className={s.trustRow}>
          {intro.trustFast.map((t) => (
            <li key={t} className="chip">
              <span className="tri" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <figure
        className={`${hasPhoto(BRAND_PHOTO) ? '' : 'ph'} panel ${s.brandPhoto}`}
        data-col="3-6"
      >
        <FocusLight
          name={BRAND_PHOTO}
          alt="A Heaven Furniture Mart living room set in solid wood, styled in the Agrabad showroom."
          sizes="(min-width: 900px) 62vw, 100vw"
          focusY="38%"
        />
        <figcaption className={`specimen ${s.brandPhotoCaption}`}>
          AGRABAD SHOWROOM · CHATTOGRAM
        </figcaption>
      </figure>

      <SheetBlock no="02" />
    </section>
  )
}

/* The single ticker strip between Sheet 02 and Sheet 03. PageMotion turns it
   into an infinite leftward marquee; without JS it stands still, which is
   fine. Ten copies so the strip outruns even a 4K viewport plus one loop
   period, the marquee never shows its right edge, and the static fallback is
   full. It is the tagline itself, "Designed. Crafted. Customized.", running
   as a measured band between two sheets. */
export function Ticker() {
  return (
    <div className={`dark ${s.ticker}`} aria-hidden="true">
      <div className={s.tickerInner} data-ticker>
        {Array.from({ length: 10 }, () => [...ticker]).flat().map((word, idx) => (
          <span key={`${word}-${idx}`}>
            {word}. <i>▲</i>
          </span>
        ))}
      </div>
    </div>
  )
}
