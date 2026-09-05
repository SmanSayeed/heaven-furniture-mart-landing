import type { Metadata } from 'next'
import Link from 'next/link'
import { aboutPage, brand, catalogue, proof, showroom, whatsappMessages } from '@/content/copy'
import { CatalogueChrome } from '@/components/catalogue/CatalogueChrome'
import { CatalogueMotion } from '@/components/motion/CatalogueMotion'
import { Footer } from '@/components/sections/Footer'
import { Cta } from '@/components/ui/Cta'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { MapPin } from '@/components/ui/Icons'
import { mapsUrl } from '@/lib/whatsapp'
import s from '@/components/catalogue/catalogue.module.css'

export const metadata: Metadata = {
  title: 'About · Heaven Furniture Mart',
  description:
    'Heaven Furniture Mart: a bespoke furniture studio in Agrabad, Chattogram, founded in 2020 by Abul Kalam Bhuiyan. Custom sofas, beds, dining sets and office pieces, built in-house.',
  alternates: { canonical: '/about' },
}

/**
 * /about — who is behind the work.
 *
 * Everything on this page already exists somewhere in the story: the MD and
 * his sentence on Sheet 03, the milestones under his quote, the showroom on
 * Sheet 06. That is deliberate, not lazy. An about page is not where new
 * facts live; it is where a customer who has decided to CHECK UP ON the
 * business finds everything in one calm place — the founder, the dates, the
 * address, the memberships. Diligence reads differently from storytelling:
 * flat, scannable, no theatre. So this page has none.
 */
export default function AboutRoute() {
  return (
    <main className={s.page}>
      <CatalogueChrome current="/about" />

      <section className={`light section sheet-grid ${s.indexHead}`}>
        <div data-col="1-4">
          <p className="specimen" data-cat-fade>
            {aboutPage.eyebrow}
          </p>
          <h1 className="section-title">{aboutPage.title}</h1>
          <p className={s.lead} data-cat-fade>
            {aboutPage.lead}
          </p>
          <p className="specimen" data-cat-fade>
            {aboutPage.founded.toUpperCase()}
          </p>
        </div>
        <div className={s.indexAction} data-col="5-6" data-cat-fade>
          <Cta label={aboutPage.cta} message={whatsappMessages.default} lead={false} />
        </div>
      </section>

      {/* the founder: his sentence, verbatim from the brief, beside his work */}
      <section className={`light section sheet-grid ${s.stepGrid}`} aria-label={proof.quoteBy}>
        <div className={s.stepCard} data-col="1-3" data-cat-card>
          <blockquote className={s.aboutQuote}>
            &ldquo;{proof.quote}&rdquo;
            <span className={s.aboutBy}>
              <span className="placard-title">{proof.quoteBy}</span>
              <span className="specimen">{proof.quoteRole.toUpperCase()} · EST. 2020</span>
            </span>
          </blockquote>
        </div>

        <div className={s.stepCard} data-col="4-6" data-cat-card>
          {hasPhoto('living-01-beige-set') && (
            <figure className={`panel panel-land ${s.processPlate}`}>
              <PrintPhoto
                name="living-01-beige-set"
                alt="A living room set built by Heaven Furniture Mart."
                sizes="(min-width: 900px) 46vw, 92vw"
                kenBurns
              />
              <CropMarks />
              <figcaption className={`specimen ${s.plateCaption}`}>
                {proof.workCaption}
              </figcaption>
            </figure>
          )}
        </div>

        {/* the record: five dated facts, nothing decorated */}
        <div className={s.stepCard} data-col="1-3" data-cat-card>
          <span className="specimen">MILESTONES</span>
          <ul className={s.mileList}>
            {proof.milestones.map((m) => (
              <li key={m.year} className={s.mileRow}>
                <span className={s.mileYear}>{m.year}</span>
                <span className="placard-line">{m.event}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* the premises and the range, side by side with the record */}
        <div className={s.stepCard} data-col="4-6" data-cat-card>
          <span className="specimen">{aboutPage.showroomTitle.toUpperCase()}</span>
          <p className={s.stepLine}>{aboutPage.showroomLine}</p>
          <p className="placard-line">{brand.address}</p>
          <div className="specimen-row">
            {showroom.specimens.map((sp) => (
              <span key={sp} className="specimen">
                {sp}
              </span>
            ))}
          </div>
          <a className="textlink" href={mapsUrl()} target="_blank" rel="noopener noreferrer">
            <MapPin />
            {showroom.directions}
          </a>

          <span className="specimen" style={{ marginTop: '1.25rem' }}>
            {aboutPage.rangeTitle.toUpperCase()}
          </span>
          <ul className={s.rangeRow}>
            {catalogue.categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/collections/${cat.slug}`} className="chip">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`dark section sheet-grid ${s.note}`} data-grid>
        <div data-col="2-5">
          <h2 className="section-title">{catalogue.bespokeNote.title}</h2>
          <p className={s.lead}>{catalogue.bespokeNote.line}</p>
          <Cta label={catalogue.bespokeNote.cta} message={whatsappMessages.default} />
        </div>
      </section>

      <Footer />
      <CatalogueMotion />
    </main>
  )
}
