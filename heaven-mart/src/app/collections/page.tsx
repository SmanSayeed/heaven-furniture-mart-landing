import type { Metadata } from 'next'
import Link from 'next/link'
import { brand, catalogue, whatsappMessages } from '@/content/copy'
import { CatalogueChrome } from '@/components/catalogue/CatalogueChrome'
import { CatalogueMotion } from '@/components/motion/CatalogueMotion'
import { Footer } from '@/components/sections/Footer'
import { Cta } from '@/components/ui/Cta'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { ArrowRight } from '@/components/ui/Icons'
import s from '@/components/catalogue/catalogue.module.css'

export const metadata: Metadata = {
  title: 'Collections · Heaven Furniture Mart',
  description:
    'Living room, bedroom, dining, office and bespoke furniture by Heaven Furniture Mart, Agrabad, Chattogram. Every piece built to your measurements.',
  alternates: { canonical: '/collections' },
}

/**
 * /collections — the index.
 *
 * DELIBERATELY NO 3D, and no smooth-scroll hijack of its own. The landing
 * page earns its WebGL because the piece IS the story there; here the visitor
 * has arrived to look at real photographs of real work, and the fastest
 * possible route from tap to picture is the whole job. This page ships zero
 * three.js, zero model-viewer and zero GSAP timeline beyond the entrances.
 *
 * Every card is a real Heaven photograph. There are no prices, because the
 * offer is bespoke and a price here would be a fiction.
 */
export default function CollectionsIndex() {
  return (
    <main className={s.page}>
      <CatalogueChrome />

      <section className={`light section sheet-grid ${s.indexHead}`}>
        <div data-col="1-4">
          <p className="specimen" data-cat-fade>
            {catalogue.index.eyebrow}
          </p>
          <h1 className="section-title">{catalogue.index.title}</h1>
          <p className={s.lead} data-cat-fade>
            {catalogue.index.lead}
          </p>
        </div>
        <div className={s.indexAction} data-col="5-6" data-cat-fade>
          <Cta label={catalogue.index.cta} message={whatsappMessages.default} lead={false} />
        </div>
      </section>

      <section className={`light section sheet-grid ${s.grid}`} aria-label="Collections">
        {catalogue.categories.map((cat, i) => (
          /* alternating columns, so the cards sit TWO UP on desktop. Every
             card on `1-3` put them in the same half of the grid and stacked
             them down the left with three empty columns beside — the drawn
             grid was right there proving it. The odd count means the last
             card sits alone on the left, which is correct: five is odd, and
             a stretched final card would break the column measure. */
          <article
            key={cat.slug}
            className={s.catCard}
            data-col={i % 2 === 0 ? '1-3' : '4-6'}
            data-cat-card
          >
            <Link href={`/collections/${cat.slug}`} className={s.catLink}>
              <span
                className={`${hasPhoto(cat.cover) ? '' : 'ph'} panel panel-land ${s.catMedia}`}
                data-card-media
              >
                <PrintPhoto
                  name={cat.cover}
                  alt={`${cat.name} furniture by Heaven Furniture Mart.`}
                  sizes="(min-width: 900px) 46vw, 92vw"
                  kenBurns
                />
                <CropMarks />
              </span>
              <span className={s.catHead}>
                <span className="index">{cat.num}</span>
                <span className={s.catName}>{cat.name}</span>
                <ArrowRight className={s.catArrow} />
              </span>
              <span className="placard-line">{cat.lead}</span>
              <span className="specimen">
                {cat.pieces.length} {cat.pieces.length === 1 ? 'PIECE' : 'PIECES'} SHOWN
              </span>
            </Link>
          </article>
        ))}
      </section>

      <section className={`dark section sheet-grid ${s.note}`} data-grid>
        <div data-col="2-5">
          <h2 className="section-title">{catalogue.bespokeNote.title}</h2>
          <p className={s.lead}>{catalogue.bespokeNote.line}</p>
          <Cta label={catalogue.bespokeNote.cta} message={whatsappMessages.default} />
          <p className="specimen">{brand.address.toUpperCase()}</p>
        </div>
      </section>

      <Footer />
      <CatalogueMotion />
    </main>
  )
}
