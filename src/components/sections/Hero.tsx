import { hero } from '@/content/copy'
import { Cta } from '@/components/ui/Cta'
import { ArHook } from '@/components/ui/ArHook'
import { Turntable, HeroReal } from '@/components/ui/Turntable'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import { FloodBeam } from '@/components/ui/FloodBeam'
import { heroBlurDataUrl } from '@/content/hero-blur.generated'
import s from './sections.module.css'

/* The one place the hero photograph is named. A real Heaven room, defocused
   at build time (see optimize-photos.mjs) so it reads as the room the piece
   stands in rather than as a second subject competing with it. If the
   pipeline has not produced it (a fresh clone with no assets-raw), the
   generated atmospheric plate stands in and nothing else changes. */
const HERO_PHOTO = 'hero-backdrop'

/**
 * SHEET 01 · "THE WINDOW" — the first beat of the story (BLUEPRINT SS0.5).
 *
 * A piece waits, lit, inside a drawn A-LAND panel on columns 4-6, with the
 * brand's own words on columns 1-3. Six layers, all server-rendered, all
 * complete with JavaScript disabled:
 *
 *   L0 ground   - the defocused room photograph + ink scrim (the LCP element)
 *   L1 grid     - the drawn column lines (data-grid)
 *   L2 type     - eyebrow, statement, tagline, the single CTA
 *   L3 panel    - the A-LAND stage the piece stands in
 *   L4 object   - the 3D piece (arrives later, into a finished composition)
 *   L5 notes    - dimension line, crop marks, title block, beat caption
 *
 * PageMotion adds the scroll choreography (the hold, the piece changes, the
 * exit); every initial state it needs is set from JS, so this markup is the
 * finished page without it.
 */
export function Hero() {
  return (
    <header id="sheet-01" className={`dark sheet-grid ${s.hero}`} data-grid>
      {/* ---- L0: the room ---- */}
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
          bottom so the stage's glow reads against the room */}
      <div className={s.heroScrim} aria-hidden="true" data-hero-scrim />

      {/* ---- L1: the light. One shaft, top left, 45 degrees. ---- */}
      <FloodBeam />

      {/* ---- L6 chrome: wordmark [1-2]. The Index nav mounts over this. ---- */}
      <div className={s.heroTop} data-col="1-2">
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
      </div>

      {/* ---- L2: the type, columns 1-3 ----
          Split from the actions on purpose. On a phone the reading order the
          blueprint asks for is promise, then piece, then act: the visitor
          meets the brand's sentence, meets the object it is about, and only
          then is asked for anything. Two blocks are what let the stage sit
          BETWEEN them at three columns and beside them at six. */}
      <div className={s.heroMain} data-col="1-2">
        <p className="specimen" data-hero-fade>
          {/* one line at 390px, full category line from 480px up */}
          <span className="only-narrow">{hero.eyebrowShort}</span>
          <span className="only-wide">{hero.eyebrow}</span>
        </p>
        {/* one lit keyword max per statement (globals.css .grad-word) */}
        <h1 className="statement" data-hero-statement>
          Built for the moment the <span className="grad-word">lights</span> come on.
        </h1>
        {/* the plot line's start: a short filament rule PageMotion draws
            left-to-right once the headline lands. Static (fully drawn) no-JS. */}
        <span className={s.heroRule} aria-hidden="true" data-hero-rule />
        <p className={s.heroSub} data-hero-fade>{hero.sub}</p>
      </div>

      {/* ---- L3/L4/L5: THE PAIR's first half - the drawing, columns 3-4 ---- */}
      <Turntable />

      {/* ---- the one action, and the one invitation ---- */}
      <div className={s.heroActions} data-col="1-2">
        <div className={s.heroCtaRow} data-hero-fade>
          <Cta label={hero.cta} shortLabel={hero.ctaShort} />
        </div>
        <div data-hero-fade>
          <ArHook />
        </div>
      </div>

      {/* ---- THE PAIR's second half: the real work, columns 5-6 ----
          AFTER the actions in the DOM, so a phone reads statement, drawing,
          CTA, then the photograph - the CTA never leaves the first viewport.
          The desktop grid places it beside the stage (see .heroReal). */}
      <HeroReal />

      {/* ---- the foot of the sheet ---- */}
      <div className={s.heroBottom} data-col="1-4">
        <span className={s.scrollHint}>
          <span className="tri" aria-hidden="true" />
          <span className="specimen">SCROLL</span>
        </span>
        {/* the story opens here, in the human voice, beside the cue that
            asks the visitor to begin it */}
        <BeatCaption no="01" />
        <div className={`specimen-row ${s.heroSpecimens}`}>
          {hero.specimens.map((sp) => (
            <span key={sp} className="specimen">{sp}</span>
          ))}
        </div>
      </div>

      <SheetBlock no="01" />
    </header>
  )
}
