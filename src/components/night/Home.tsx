import { ar, brand, deck, night, showroom } from '@/content/copy'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { VideoEmbed } from '@/components/ui/VideoEmbed'
import { ArModal } from '@/components/deck/ArModal'
import { MapPin } from '@/components/ui/Icons'
import { mapsUrl } from '@/lib/whatsapp'
import { Words } from './Words'
import { Narrator, ChapterTag } from './Narrator'
import s from './night.module.css'

/**
 * CHAPTER 6 · TAKE IT HOME. "Take it home."
 *
 * Two things side by side: the AR card - the piece the visitor just dyed,
 * standing in their own room through the phone's camera (the fabric choice
 * carries through: the story paying off) - and the showroom film in a 16:9
 * frame that opens from its middle. Address, directions and the phone
 * beneath. The map's last room but one lights.
 */
export function Home() {
  const h = night.home
  return (
    <section id="home" className={s.home} data-chapter="home" aria-label="See it in your room and visit the showroom">
      <div className={s.inner}>
        <div data-reveal="words" data-stagger style={{ display: 'grid', gap: '1rem' }}>
          <ChapterTag id="home" />
          <Words lines={h.title} className={s.title} />
          <Narrator id="home" />
        </div>

        <div className={s.homeGrid}>
          <div className={s.arCard} data-reveal="rise">
            <div className={s.arCardBody}>
              <span className={s.cardKey}>{h.arCard.key}</span>
              <p className={s.lede}>{h.arCard.line}</p>
              <span className={s.quiet}>{ar.support}</span>
            </div>
            <div className={s.arCardArt} aria-hidden="true">
              <Photo name="hero-sofa-01-frontal" alt="" sizes="(min-width: 861px) 30vw, 80vw" low />
            </div>
            <div className={s.row}>
              <ArModal inline label={h.arCard.button} />
            </div>
          </div>

          <div>
            <div className={s.film} data-reveal="shutter">
              <VideoEmbed
                title="Heaven Furniture Mart · virtual showroom tour, Agrabad, Chattogram"
                sound={h.film.sound}
              >
                {hasPhoto(deck.showroom.photo) && (
                  <Photo
                    name={deck.showroom.photo}
                    alt="Sofas on display inside the Heaven Furniture Mart showroom on Agrabad Access Road, Chattogram."
                    sizes="(min-width: 861px) 60vw, 100vw"
                    low
                  />
                )}
              </VideoEmbed>
            </div>
            <div className={s.filmMeta} data-reveal="rise">
              <span className={s.cardKey}>{h.film.key}</span>
              <span className={s.quiet}>{brand.address}</span>
              <a className={s.quiet} href={mapsUrl()} target="_blank" rel="noopener noreferrer">
                <MapPin /> {showroom.directions}
              </a>
              <a className={s.quiet} href={`tel:${brand.phoneTel}`}>
                {brand.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
