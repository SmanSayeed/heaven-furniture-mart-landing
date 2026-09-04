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
 *   say      - and three MESSAGES, one per view, in one cell. The words
 *              change with the room they are standing in; views 2 and 3
 *              used to arrive with nothing to read.
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
        {/* ONE CELL, THREE MESSAGES. The photographs change twice as the
            hero is scrolled; the words change with them (NightMotion moves
            `data-on`). Message 1 is the h1 and the LCP and is lit in the
            server HTML, so with no JS the hero is simply the first message,
            finished. 2 and 3 are a visual continuation of copy the studio
            chapter states in full, so they are not headings. */}
        <div className={s.heroSay} data-hero-say>
          {h.messages.map((msg, i) => (
            <div
              key={msg.headline.join(' ')}
              className={s.heroMsg}
              data-hero-msg
              data-on={i === 0 ? '' : undefined}
              {...(i > 0 ? { 'aria-hidden': true as const } : {})}
            >
              {i === 0 ? (
                <Words as="h1" lines={msg.headline} className={`${s.title} ${s.titleHero}`} />
              ) : (
                <p className={`${s.title} ${s.titleHero}`}>
                  {msg.headline.map((line) => (
                    <span key={line} className={s.heroLine}>
                      {line}
                    </span>
                  ))}
                </p>
              )}
              <p className={s.sub}>{msg.sub}</p>
            </div>
          ))}
        </div>
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
