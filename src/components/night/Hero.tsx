import { night } from '@/content/copy'
import { Photo } from '@/components/ui/Photo'
import { Torch } from '@/components/ui/Torch'
import { WhatsApp } from '@/components/ui/Icons'
import { whatsappUrl } from '@/lib/whatsapp'
import { Words } from './Words'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'

/**
 * CHAPTER 1 · THE FLOODLIT ROOM.
 *
 * Server Component, and the LCP: the first slide's headline, its line and
 * the one CTA are in the HTML and nothing touches them before paint.
 *
 *   slides   - FIVE rooms on a six-second reel. Each drifts slowly closer
 *              while it holds the screen, then dissolves into the next.
 *              NightMotion drives it on its own clock; the page does not
 *              have to be scrolled for the hero to be doing something,
 *              which on a Facebook ad click is the whole first impression.
 *              Slide 1 is the only one the server marks lit, so with no
 *              JavaScript the hero is simply the first room, finished.
 *   night    - the darkness, lifting on load (CSS, compositor-only)
 *   beam     - THE FLOODLIGHT, top-left, 45 degrees, sweeping once on load;
 *              NightMotion widens it as the visitor scrolls the room lit
 *   torch    - on a pointer device the cursor carries a pool of warm light
 *   out      - the room going dark at the end of the pin, so the studio's
 *              paper arrives as a hard cut rather than a cross-fade
 *
 * ONE LINE AT A TIME. The three-row proof strip and the marks line used to
 * sit under the CTA; on a 390px screen that was six blocks of type over a
 * photograph (client: "looking messy", "take away these 3 lines ... to look
 * minimal"). The rooms say those things now, one per slide, at headline
 * size, and the studio chapter still states all three together with the
 * detail behind its buttons.
 *
 * The scroll script lives in NightMotion; this file is the finished room.
 */
export function Hero() {
  const h = night.hero
  const last = h.slides[h.slides.length - 1]
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
        {h.slides.map((v, i) => (
          <div
            key={v.photo}
            className={s.view}
            data-view={i}
            data-on={i === 0 ? '' : undefined}
            style={{ '--focal': v.focal } as React.CSSProperties}
          >
            <Photo
              name={v.photo}
              alt={i === 0 ? v.alt : ''}
              sizes="100vw"
              priority={i === 0}
              eager={i === 1}
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

        {/* one cell, five messages: the block is as tall as its tallest
            message, so the CTA under it never moves as the reel turns */}
        <div className={s.heroSay} data-hero-say>
          {h.slides.map((v, i) => (
            <div
              key={v.photo}
              className={s.heroMsg}
              data-hero-msg
              data-on={i === 0 ? '' : undefined}
              {...(i > 0 ? { 'aria-hidden': true as const } : {})}
            >
              {i === 0 ? (
                <Words as="h1" lines={v.headline} className={`${s.title} ${s.titleHero}`} />
              ) : (
                <p className={`${s.title} ${s.titleHero}`}>
                  {v.headline.map((line) => (
                    <span key={line} className={s.heroLine}>
                      {line}
                    </span>
                  ))}
                </p>
              )}
              <p className={s.sub}>{v.sub}</p>
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
      </div>

      {/* the reel's own position: five ticks, the live one filling as its
          room holds the screen. A progress bar, not a control - there is
          nothing here to operate. */}
      <div className={s.reel} data-reel aria-hidden="true">
        {h.slides.map((v) => (
          <span key={v.photo} className={s.reelTick}>
            <i />
          </span>
        ))}
      </div>

      <div className={s.counter} data-hero-counter aria-hidden="true">
        <span data-hero-now>1</span> / {h.slides.length}
      </div>
      <div className={s.cue} data-cue aria-hidden="true">
        <span className={s.cueLine} />
        {h.cue}
      </div>
      <div className={s.lightsOut} data-lights-out aria-hidden="true" />
    </section>
  )
}
