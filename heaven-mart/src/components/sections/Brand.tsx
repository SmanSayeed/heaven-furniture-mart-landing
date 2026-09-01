import { intro, ticker } from '@/content/copy'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import s from './sections.module.css'

/* The photograph that carries S2: a full Heaven room, their own wood set. */
const BRAND_PHOTO = 'living-03-wood-set'

/* S2. The "room lights come on": first ivory section. A placard cluster, not a
   paragraph (PLAN Part 1.6). Photo panel awaits the graded showroom shot. */
export function Brand() {
  return (
    /* data-curtain: PageMotion pins the hero under this section so it slides
       up OVER the dark stage ("the room lights come on", PLAN 2.5) */
    <section
      className={`light section ${s.brand}`}
      aria-label="About Heaven Furniture Mart"
      data-accent="#C8A96A"
      data-curtain
    >
      <span className="ghost-num" aria-hidden="true">{intro.index}</span>

      <div className={s.placard}>
        <span className="index">{intro.index}</span>
        <h2 className="placard-title">{intro.title}</h2>
        <p className="placard-line">{intro.line}</p>
        <div className="specimen-row">
          {intro.specimens.map((sp) => (
            <span key={sp} className="specimen">{sp}</span>
          ))}
        </div>
      </div>

      <figure className={`${hasPhoto(BRAND_PHOTO) ? '' : 'ph'} ${s.brandPhoto}`}>
        <Photo
          name={BRAND_PHOTO}
          alt="A Heaven Furniture Mart living room set in solid wood, styled in the Agrabad showroom."
          sizes="(min-width: 900px) 58vw, 100vw"
        />
        <figcaption className={`specimen ${s.brandPhotoCaption}`}>
          AGRABAD SHOWROOM · CHATTOGRAM
        </figcaption>
      </figure>
    </section>
  )
}

/* The single ticker strip between S2 and S3. PageMotion turns it into an
   infinite leftward marquee; without JS it stands still, which is fine.
   Ten copies so the strip outruns even a 4K viewport plus one loop period,
   the marquee never shows its right edge, and the static fallback is full. */
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
