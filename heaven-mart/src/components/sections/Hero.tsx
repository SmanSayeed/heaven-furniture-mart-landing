import { hero } from '@/content/copy'
import { Cta } from '@/components/ui/Cta'
import { ArHook } from '@/components/ui/ArHook'
import { Turntable } from '@/components/ui/Turntable'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { heroBlurDataUrl } from '@/content/hero-blur.generated'
import s from './sections.module.css'

/* The one place the hero photograph is named. A real Heaven room, defocused
   at build time (see optimize-photos.mjs) so it reads as the room the piece
   stands in rather than as a second subject competing with it. If the
   pipeline has not produced it (a fresh clone with no assets-raw), the
   generated atmospheric plate stands in and nothing else changes. */
const HERO_PHOTO = 'hero-backdrop'

/**
 * S1 "The Turntable" (PLAN S1b, revised). Four layers, all server-rendered,
 * complete with JavaScript disabled:
 *   0 the room  - full-bleed photograph + ink scrim (this is the LCP element)
 *   1 the piece - the plinth the 3D furniture stands and spins on
 *   2 the type  - eyebrow, statement, tagline, the single CTA
 *   3 the hook  - the AR invitation pill
 *
 * The earlier version framed the 3D in a bordered "vitrine" panel. It read as
 * a broken image for as long as the model took to arrive, and on desktop the
 * statement overlapped it; both are gone. The piece now stands in light, and
 * the layout is a real two-column grid from 900px so nothing can overlap at
 * any width.
 *
 * PageMotion adds the scroll choreography (the hold, the piece changes, the
 * exit); every initial state it needs is set from JS, so this markup is the
 * finished page without it.
 */
export function Hero() {
  return (
    <header className={`dark ${s.hero}`} data-accent="#C8A96A" data-grid>
      {/* ---- layer 0: the room ---- */}
      <div className={s.heroPhotoWrap} aria-hidden="true" data-hero-photo>
        {hasPhoto(HERO_PHOTO) ? (
          <Photo name={HERO_PHOTO} alt="" priority sizes="100vw" className={s.heroPhoto} />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- same
             reasoning as Photo.tsx; this is the generated fallback plate */
          <img
            src="/img/hero-room-placeholder.webp"
            alt=""
            className={s.heroPhoto}
            style={{ backgroundImage: `url(${heroBlurDataUrl})`, backgroundSize: 'cover' }}
          />
        )}
      </div>
      {/* the scrim carries text contrast: opaque at the top, clearing at the
          bottom so the vitrine's glow reads against the room */}
      <div className={s.heroScrim} aria-hidden="true" data-hero-scrim />

      {/* ---- layer 2 (chrome): wordmark. The Index nav mounts over this. ---- */}
      <div className={s.heroTop}>
        {/* the stylized "HE(triangle)VEN" letters are aria-hidden and the
            real name lives in an sr-only span: an aria-label that differs
            from the visible letters fails label-content-name-mismatch */}
        <a href="#" className={s.wordmark}>
          <span className="sr-only">Heaven Furniture Mart</span>
          <span aria-hidden="true">
            HE<span className="tri" />VEN
            <span className={s.wordmarkSub}>FURNITURE MART</span>
          </span>
        </a>
        {/* No location chip here. The Index nav pill is fixed to this corner
            and the two collided; the location already appears in the eyebrow,
            the hero specimen row, the showroom section and the footer. */}
      </div>

      {/* ---- layer 1: the turntable ----
          The piece itself, grabbable and spinnable, changing as the hero is
          scrolled. Not a framed panel: an object standing in light. */}
      <Turntable />

      {/* ---- layer 2: the type ---- */}
      <div className={s.heroMain}>
        <p className="specimen" data-hero-fade>
          {/* one line at 390px, full category line from 480px up */}
          <span className="only-narrow">{hero.eyebrowShort}</span>
          <span className="only-wide">{hero.eyebrow}</span>
        </p>
        {/* one gradient keyword max per statement (globals.css .grad-word) */}
        <h1 className="statement" data-hero-statement>
          Furniture, <span className="grad-word">Crafted</span> Around You.
        </h1>
        {/* the golden thread's start: a short brass rule PageMotion draws
            left-to-right once the headline lands. Static (fully drawn) no-JS. */}
        <span className={s.heroRule} aria-hidden="true" data-hero-rule />
        <p className={s.heroSub} data-hero-fade>{hero.sub}</p>
        <div className={s.heroCtaRow} data-hero-fade>
          <Cta label={hero.cta} shortLabel={hero.ctaShort} />
        </div>
        {/* ---- layer 3: the AR hook ---- */}
        <div data-hero-fade>
          <ArHook />
        </div>
      </div>

      <div className={s.heroBottom}>
        <span className={s.scrollHint}>
          <span className="tri" aria-hidden="true" />
          <span className="specimen">SCROLL</span>
        </span>
        <div className={`specimen-row ${s.heroSpecimens}`}>
          {hero.specimens.map((sp) => (
            <span key={sp} className="specimen">{sp}</span>
          ))}
        </div>
      </div>
    </header>
  )
}
