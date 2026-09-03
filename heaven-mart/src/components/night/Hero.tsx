import { night } from '@/content/copy'
import { Photo } from '@/components/ui/Photo'
import { Torch } from '@/components/ui/Torch'
import { WhatsApp } from '@/components/ui/Icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { Words } from './Words'
import { Proof } from './Proof'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'

/**
 * CHAPTER 1 · THE FLOODLIT ROOM.
 *
 * Server Component, and the LCP: the headline, the tagline and the one CTA
 * are in the HTML and nothing touches them before paint. Around them:
 *
 *   views    - three photographs of Heaven's own rooms. View 1 is the only
 *              one visible without JS; NightMotion reveals 2 and 3 into
 *              their hidden poses and scrubs them in (iris, then slide).
 *   night    - the darkness, lifting on load (CSS, compositor-only)
 *   beam     - THE FLOODLIGHT, top-left, 45 degrees, sweeping once on load;
 *              NightMotion widens it as the visitor scrolls the room lit
 *   torch    - on a pointer device the cursor carries a pool of warm light
 *   out      - the room going dark at the end of the pin, so the studio's
 *              paper arrives as a hard cut rather than a cross-fade
 *
 * The scroll script lives in NightMotion; this file is the finished room.
 */
export function Hero() {
  const h = night.hero
  const last = h.views[h.views.length - 1]
  return (
    <section
      id="room"
      className={s.hero}
      data-chapter="room"
      data-hero
      aria-label="Heaven Furniture Mart"
      style={{ '--focal': last.focal } as React.CSSProperties}
    >
      <div className={s.views} data-views>
        {h.views.map((v, i) => (
          <div
            key={v.photo}
            className={s.view}
            data-view={i}
            style={{ '--focal': v.focal } as React.CSSProperties}
          >
            <Photo
              name={v.photo}
              alt={i === 0 ? v.alt : ''}
              sizes="100vw"
              priority={i === 0}
              eager={i > 0}
              low={i > 0}
              className={s.viewImg}
            />
          </div>
        ))}
      </div>
      <div className={s.scrim} data-hero-scrim aria-hidden="true" />
      <div className={s.night} aria-hidden="true" />
      <span className={s.beam} data-beam aria-hidden="true">
        <span className={s.beamShaft} />
      </span>
      <div className={s.vignette} data-vignette aria-hidden="true" />
      <Torch />

      <div className={s.heroText} data-hero-text>
        <span className={s.eyebrow}>
          <span className="only-narrow">{h.tagShort}</span>
          <span className="only-wide">{h.tag}</span>
        </span>
        <Words as="h1" lines={h.headline} className={`${s.title} ${s.titleHero}`} />
        <p className={s.sub}>{h.sub}</p>
        <div className={s.row}>
          <a
            className={`${d.pill} ${d.pillBrass}`}
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsApp />
            Request a Quote
          </a>
          <span className={s.quiet}>Free design consultation</span>
        </div>
        {/* 2026-09-03: the narrator line ("The power is out. You have a
            light.") left the hero. It was atmosphere in the one place a
            first-time visitor is asking a question, and it left a gap under
            the CTA on phones. `Proof` answers instead — who draws it, who
            builds it, who delivers it — and the blackout concept keeps its
            own beat further down the page. */}
        <Proof />
      </div>

      <div className={s.counter} data-hero-counter aria-hidden="true">
        <span data-hero-now>1</span> / {h.views.length}
      </div>
      <div className={s.cue} data-cue aria-hidden="true">
        <span className={s.cueLine} />
        {h.cue}
      </div>
    </section>
  )
}
