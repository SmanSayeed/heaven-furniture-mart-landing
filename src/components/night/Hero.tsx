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
 * Server Component, and the LCP: the headline, the tagline and the one CTA
 * are in the HTML and nothing touches them before paint. Around them:
 *
 *   views    - three photographs of Heaven's own rooms. View 1 is the only
 *              one visible without JS; NightMotion reveals 2 and 3 into
 *              their hidden poses and scrubs them in (iris, then slide).
 *   reel     - and inside VIEW 1 ONLY, four photographs that cross-fade on
 *              their own clock, each drifting slowly closer. The hero is
 *              moving before anybody scrolls; the scroll choreography above
 *              is untouched by it.
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
            {/* ONE PHOTOGRAPH PER ROOM, AND THE SCROLL MOVES THEM.

                Room one used to hold a four-frame reel that cross-faded on
                its own clock, on top of the light arriving and a sheet
                sliding off. Three animations were competing for the first
                three seconds (client: "avoid double animations - lighting
                and slided option at very first not looking good"), so the
                landing is still now: the room is simply lit, and NOTHING
                moves until the visitor scrolls. */}
            <Photo
              name={v.photo}
              tall={v.tall}
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
      {/* THE ROOM IS ALREADY LIT. The darkness lifting, the colour arriving
          and the dust sheet sliding off were three separate one-shot
          animations on first paint, running while the reel was already
          cross-fading underneath them. All four are gone: the light in this
          room now only answers the scroll (the beam widens, the scrim
          clears), which is the one thing the visitor is driving. */}
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
        {/* ONE CELL, THREE MESSAGES: one title and one line per room, and
            nothing else. The three-row proof strip and the marks line that
            used to sit under the CTA are gone (client: "remove texts and
            keep it cleaner - keep one title, one sub title in each
            sections"); the studio chapter states those three facts in full,
            with the detail behind its buttons.

            EACH ONE ARRIVES FROM THE SIDE ITS ROOM ARRIVES FROM. Room 2
            blooms out of the beam's origin at the top left, so its words
            come in from the left; room 3 slides in from the right edge, so
            its words follow it in from the right. The words and the
            photograph read as one movement rather than two.

            Message 1 is the h1 and the LCP and is lit in the server HTML,
            so with no JS the hero is simply the first message, finished.
            2 and 3 continue the same copy visually, so they are not
            headings. */}
        <div className={s.heroSay} data-hero-say>
          {h.messages.map((msg, i) => (
            <div
              key={msg.headline.join(' ')}
              className={s.heroMsg}
              data-hero-msg
              data-on={i === 0 ? '' : undefined}
              style={
                {
                  '--from-x': i === 1 ? '-4.5rem' : i === 2 ? '4.5rem' : '0rem',
                  '--from-y': i === 0 ? '1.1rem' : '0rem',
                } as React.CSSProperties
              }
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
              {/* THE CTA TRAVELS WITH THE ROOM (client: "hero each sections
                  should have CTA buttons"). It is the same one action, said
                  again in each room rather than parked once underneath them:
                  a visitor who is convinced by room three should not have to
                  look for the button that belonged to room one. */}
              <div className={s.row}>
                <a
                  className={`${d.pill} ${d.pillBrass}`}
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={i === 0 ? 0 : -1}
                >
                  <WhatsApp />
                  Request a Quote
                </a>
                <span className={s.quiet}>Free design consultation</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={s.counter} data-hero-counter aria-hidden="true">
        <span data-hero-now>1</span> / {h.views.length}
      </div>
      <div className={s.cue} data-cue aria-hidden="true">
        <span className={s.cueLine} />
        {h.cue}
      </div>
      {/* the last beat of the pin: the room goes dark inside the hero, so the
          studio's paper arrives as a hard cut rather than a cross-fade.
          `.lightsOut` and the tween that drives it have both been here since
          PART B; the element itself never was, so the tween was addressing
          nothing and the cut never happened. */}
      <div className={s.lightsOut} data-lights-out aria-hidden="true" />
    </section>
  )
}
