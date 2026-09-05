import { brand, catalogue, deck, night } from '@/content/copy'
import { Header } from '@/components/deck/Header'
import { DeckFooter } from '@/components/deck/DeckFooter'
import { PiecePlate } from '@/components/deck/PieceModal'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { ArrowRight, WhatsApp } from '@/components/ui/Icons'
import { StickyCta } from '@/components/ui/StickyCta'
import { whatsappUrl } from '@/lib/whatsapp'
import { Wall } from './Wall'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'
import { plural } from '@/lib/plural'

type Category = (typeof catalogue.categories)[number]

/**
 * A ROOM PAGE (/collections/[slug]), in the night system (PLAN-V6 PART
 * B5): the "cool animated page" the wall's frames open onto.
 *
 * Dark ground, the chapter-style heading, the room's cover in the same
 * mat-and-brass frame it wore on the wall (`view-transition-name` carries
 * the photograph across on browsers with cross-document view transitions),
 * then the pieces as framed plates in a masonry of two sizes. The plates
 * PRINT IN one after another on the page's own first paint (CSS
 * @starting-style, staggered by --i): no motion script on this route at
 * all, and nothing hidden for a visitor without JavaScript. Each plate
 * opens the piece in a sheet with the one CTA naming it.
 *
 * "Next room" walks to the next category; "Back to the floor" returns to
 * the landing page's wall. No prices anywhere: the offer is bespoke.
 */
export function Room({ cat, next }: { cat: Category; next: Category }) {
  const r = night.roomPage
  const count = plural(cat.pieces.length, r.piece, r.pieces)
  const nav = night.nav
  return (
    <main className={s.room} id="top">
      <Header nav={nav} counter={false} home="/" solid />

      <section className={s.roomHead}>
        <div className={s.inner}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full navigation on purpose: the cross-document view transition (globals.css) needs one */}
          <a href="/#floor" className={`${s.quiet} ${s.roomBack} ${s.enter}`}>
            <ArrowRight className={s.flip} /> {r.back}
          </a>
          <div className={s.roomHeadGrid}>
            <div className={s.roomIntro}>
              <span className={`${s.eyebrow} ${s.enter}`} style={{ '--i': 0 } as React.CSSProperties}>
                {cat.num} · {cat.name} · {count} · {r.built}
              </span>
              <h1 className={`${s.title} ${s.enter}`} style={{ '--i': 1 } as React.CSSProperties}>
                {cat.name}
              </h1>
              <p className={`${s.narr} ${s.enter}`} style={{ '--i': 2 } as React.CSSProperties}>
                {cat.lead}
              </p>
              <div className={`${s.row} ${s.enter}`} style={{ '--i': 3 } as React.CSSProperties}>
                <a
                  className={`${d.pill} ${d.pillBrass}`}
                  href={whatsappUrl(deck.roomMessage(cat.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsApp />
                  {deck.cta} · {cat.name}
                </a>
                <a className={s.quiet} href={`tel:${brand.phoneTel}`}>
                  {brand.phoneDisplay}
                </a>
              </div>
            </div>
            <div className={`${s.roomPlate} ${s.enter}`} style={{ '--i': 1 } as React.CSSProperties}>
              <span className={s.mat}>
                <span className={s.frameImg}>
                  {hasPhoto(cat.cover) && (
                    <Photo
                      name={cat.cover}
                      alt={`${cat.name} furniture by Heaven Furniture Mart.`}
                      sizes="(min-width: 900px) 40vw, 92vw"
                      priority
                    />
                  )}
                </span>
                <CropMarks />
              </span>
              <span className={s.plaque} aria-hidden="true">
                {cat.num} · {cat.name}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className={s.roomPieces} aria-label={`${cat.name} pieces`}>
        <div className={`${s.inner} ${s.masonry}`}>
          {cat.pieces.map((piece, i) => (
            <PiecePlate key={piece.img} cat={cat} piece={piece} index={i} wide={i % 4 === 0 || i % 4 === 3} />
          ))}
        </div>
      </section>

      <section className={s.roomNote}>
        <div className={`${s.inner} ${s.roomNoteGrid}`}>
          <div>
            <h2 className={s.title} style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)' }}>
              {catalogue.bespokeNote.title}
            </h2>
            <p className={s.lede} style={{ marginTop: '0.9rem' }}>
              {catalogue.bespokeNote.line}
            </p>
            <div className={s.row} style={{ marginTop: '1.4rem' }}>
              <a className={`${d.pill} ${d.pillBrass}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsApp />
                {catalogue.bespokeNote.cta}
              </a>
            </div>
          </div>
          <div className={s.roomNext}>
            <a href={`/collections/${next.slug}`} className={s.roomNextLink}>
              <span className={s.eyebrow}>
                {r.next} · {next.num}
              </span>
              <span className={s.roomNextName}>
                {next.name} <ArrowRight />
              </span>
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full navigation on purpose: the cross-document view transition (globals.css) needs one */}
            <a href="/collections" className={s.quiet}>
              {r.all}
            </a>
          </div>
        </div>
      </section>

      <DeckFooter />
      <StickyCta always />
    </main>
  )
}

/** /collections: the five rooms as the gallery wall, full width */
export function RoomsIndex() {
  const r = night.roomPage
  return (
    <main className={s.room} id="top">
      <Header nav={night.nav} counter={false} home="/" solid />
      <section className={s.roomHead}>
        <div className={s.inner}>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full navigation on purpose: the cross-document view transition (globals.css) needs one */}
          <a href="/#floor" className={`${s.quiet} ${s.roomBack} ${s.enter}`}>
            <ArrowRight className={s.flip} /> {r.back}
          </a>
          <div className={s.roomIntro}>
            <span className={`${s.eyebrow} ${s.enter}`} style={{ '--i': 0 } as React.CSSProperties}>
              {catalogue.index.eyebrow}
            </span>
            <h1 className={`${s.title} ${s.enter}`} style={{ '--i': 1 } as React.CSSProperties}>
              {r.indexTitle[0]}
              <br />
              {r.indexTitle[1]}
            </h1>
            <p className={`${s.narr} ${s.enter}`} style={{ '--i': 2 } as React.CSSProperties}>
              {r.indexLine}
            </p>
          </div>
        </div>
      </section>
      <section className={`${s.roomPieces} ${s.enter}`} style={{ '--i': 3 } as React.CSSProperties} aria-label="The rooms">
        <Wall mode="grid" />
      </section>
      <section className={s.roomNote}>
        <div className={`${s.inner} ${s.roomNoteGrid}`}>
          <div>
            <h2 className={s.title} style={{ fontSize: 'clamp(1.75rem, 3.6vw, 3rem)' }}>
              {catalogue.bespokeNote.title}
            </h2>
            <p className={s.lede} style={{ marginTop: '0.9rem' }}>
              {catalogue.bespokeNote.line}
            </p>
            <div className={s.row} style={{ marginTop: '1.4rem' }}>
              <a className={`${d.pill} ${d.pillBrass}`} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <WhatsApp />
                {catalogue.bespokeNote.cta}
              </a>
            </div>
          </div>
          <p className={s.quiet}>{brand.address}</p>
        </div>
      </section>
      <DeckFooter />
      <StickyCta always />
    </main>
  )
}
