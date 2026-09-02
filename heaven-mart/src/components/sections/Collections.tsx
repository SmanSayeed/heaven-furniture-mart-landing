import Link from 'next/link'
import { catalogue, collections } from '@/content/copy'
import { ArrowRight, ArrowUpRight } from '@/components/ui/Icons'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import s from './sections.module.css'

/**
 * SHEET 05 · "THE RANGE" — walk the collections.
 *
 * Each card is exactly two columns wide (BLUEPRINT SS4), its media an A-PORT
 * plate, its number and name on the baseline beneath. Five cards, five
 * categories, no prices and no "add to cart": this is a studio's range, not
 * a shop's inventory, and the only action on the page is still the one CTA.
 *
 * From 900px PageMotion turns the track into a pinned horizontal rail and
 * the cards print as they arrive; below it, and with JS off, the same cards
 * stack vertically with A-LAND media, because a portrait plate at full phone
 * width is taller than the screen and cannot be scanned.
 */
export function Collections() {
  return (
    <section
      id="collections"
      className={`light section sheet-grid ${s.collections}`}
      aria-label="Collections"
    >
      <div data-col="1-3">
        <BeatCaption no="05" />
        <h2 className="section-title">{collections.title}</h2>
      </div>

      {/* data-cards: on >= 900px PageMotion adds the isRail class and scrubs
          this track horizontally inside the pinned section; the grid below
          stays the no-JS and mobile truth */}
      <div className={s.cards} data-cards data-col="1-6">
        {collections.items.map((item, i) => (
          /* id + data-card-index: the Index nav scrolls to a specific
             category, including inside the desktop horizontal rail */
          <article
            key={item.num}
            id={`collection-${item.num}`}
            className={s.card}
            data-card
            data-card-index={item.num}
          >
            <div
              className={`${hasPhoto(item.img) ? '' : 'ph'} panel ${s.cardMedia}`}
              data-card-media
            >
              {/* alt names the category, because that is what the picture is
                  evidence of; the card's own heading repeats the name for
                  sighted readers, so this is not a duplicate announcement */}
              <PrintPhoto
                name={item.img}
                alt={`${item.name} furniture by Heaven Furniture Mart.`}
                sizes="(min-width: 900px) 34vw, 92vw"
                kenBurns
              />
              {!hasPhoto(item.img) && (
                <span className="specimen">{item.img.toUpperCase()} · INCOMING</span>
              )}
            </div>
            <div className={s.cardHead}>
              {/* THE CARD IS A DOOR NOW. Until this route existed the rail
                  was a slideshow: five photographs a visitor could look at
                  and nothing they could do. Each name goes to that room's
                  own page, where Heaven's real work in it is listed with a
                  way to ask about any single piece. */}
              <h3 className={s.cardName}>
                <Link href={`/collections/${catalogue.categories[i].slug}`} className={s.cardLink}>
                  {item.name}
                  <ArrowRight />
                </Link>
              </h3>
              <span className="index">{item.num}</span>
            </div>
            <p className="specimen">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className={s.collectionsFoot} data-col="1-2">
        {/* was a link off to Facebook, which sent a visitor who wanted to
            see more OUT of the site. It goes to the catalogue now; Heaven's
            socials are still in the footer, where leaving is the point. */}
        <Link className="textlink" href="/collections">
          View the full collection
          <ArrowUpRight />
        </Link>
      </div>

      <SheetBlock no="05" />
    </section>
  )
}
