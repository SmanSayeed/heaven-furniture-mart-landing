import { collections, brand } from '@/content/copy'
import { ArrowUpRight } from '@/components/ui/Icons'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import s from './sections.module.css'

/* S4. Editorial collection cards. Sprint 1: vertical placard cards with
   placeholder media (graded photos swap in at Sprint 5). Sprint 2 adds the
   perspective entrances and the desktop horizontal pin. */
export function Collections() {
  return (
    /* section-level accent for now; Sprint 4+ can hand this to per-card
       accents from copy.ts once the horizontal pin lands */
    <section
      id="collections"
      className={`light section ${s.collections}`}
      aria-label="Collections"
      data-accent="#7A8F8A"
    >
      <span className="ghost-num" aria-hidden="true">{collections.index}</span>
      <div>
        <span className="index">{collections.index}</span>
        <h2 className="section-title">{collections.title}</h2>
      </div>

      {/* data-cards: on >= 900px PageMotion adds the isRail class and scrubs
          this track horizontally inside the pinned section; the grid below
          stays the no-JS and mobile truth */}
      <div className={s.cards} data-cards>
        {collections.items.map((item) => (
          /* id + data-card-index: the Index nav scrolls to a specific
             category, including inside the desktop horizontal rail */
          <article
            key={item.num}
            id={`collection-${item.num}`}
            className={s.card}
            data-card
            data-card-index={item.num}
          >
            <div className={`${hasPhoto(item.img) ? '' : 'ph'} ${s.cardMedia}`}>
              {/* alt names the category, because that is what the picture is
                  evidence of; the card's own heading repeats the name for
                  sighted readers, so this is not a duplicate announcement */}
              <Photo
                name={item.img}
                alt={`${item.name} furniture by Heaven Furniture Mart.`}
                sizes="(min-width: 900px) 44vw, 92vw"
              />
              {!hasPhoto(item.img) && (
                <span className="specimen">{item.img.toUpperCase()} · INCOMING</span>
              )}
            </div>
            <div className={s.cardHead}>
              <h3 className={s.cardName}>{item.name}</h3>
              <span className="index">{item.num}</span>
            </div>
            <p className="specimen">{item.detail}</p>
          </article>
        ))}
      </div>

      <div className={s.collectionsFoot}>
        <a
          className="textlink"
          href={brand.social.facebook}
          target="_blank"
          rel="noopener noreferrer"
        >
          View the full collection
          <ArrowUpRight />
        </a>
      </div>
    </section>
  )
}
