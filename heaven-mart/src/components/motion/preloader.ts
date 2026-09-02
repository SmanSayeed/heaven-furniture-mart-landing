import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersLightweight } from '@/lib/device'

/* ---------------------- S0 preloader (BLUEPRINT SS0) ----------------------

   Built imperatively, never as React markup: the overlay must not exist in
   the server HTML (the crawlable page and the LCP element stay exactly the
   plain document), must never appear for no-JS visitors, and is owned start
   to finish by GSAP. Client-only DOM created after hydration is the one
   shape that guarantees all three with zero hydration gymnastics.

   WHAT IT IS NOW. It used to be a wordmark and a progress rule — correct,
   brand-safe, and completely forgettable. A loading screen is the only
   moment on a page where a visitor has agreed to look at nothing else, and
   spending it on a logo wastes it.

   So the page now DRAWS ITS OWN SOFA while it loads. A front elevation, in
   line, struck stroke by stroke the way a drafter would lay one down —
   outline, arms, seat, seams, legs, then the dimension line beneath it with
   its real width called out. It states the entire thesis of the site before
   a single section has been seen: this is a studio that draws furniture to
   measure. Then the filament lights, and the sheet lifts off the page.

   The cost discipline is unchanged and non-negotiable: capped at 1.4s of
   wall clock, skipped by any gesture, shown once per session, and never
   shown at all on a slow connection or a weak device. The drawing is ~2 KB
   of inline SVG paths and no images. */

export function shouldShowPreloader(): boolean {
  /* A brand moment on a fast phone; a wall on a slow one. The overlay covers
     the headline for up to 1.4s of wall clock, and on a throttled device the
     hero intro that follows it adds another second before the page's one
     sentence is readable. Measured: 3.6s of LCP render delay, all of it this.
     A visitor on 3G in Chattogram gets the finished page instead. */
  if (prefersLightweight()) return false
  try {
    if (sessionStorage.getItem('hfm-preloaded') === '1') return false
    sessionStorage.setItem('hfm-preloaded', '1')
    return true
  } catch {
    /* storage blocked (private mode / in-app browser): show it anyway, it
       is capped and skippable */
    return true
  }
}

/**
 * The sofa, as a front elevation in line.
 *
 * Every coordinate is on a 20-unit module inside a 420x290 sheet, for the
 * same reason the page's layout is on an 8px one: a drawing whose numbers
 * are arbitrary looks drawn by a computer, and one whose numbers are regular
 * looks drawn by a drafter. Order matters — the array IS the drawing order,
 * and a drafter lays down the carcass before the detail.
 */
const SOFA_PARTS = [
  /* back, with the radiused top corners the real pieces have */
  'M72 152 L72 58 Q72 40 90 40 L330 40 Q348 40 348 58 L348 152',
  /* left arm */
  'M40 216 L40 114 Q40 96 58 96 L72 96 L72 216',
  /* right arm */
  'M380 216 L380 114 Q380 96 362 96 L348 96 L348 216',
  /* the seat, and the base rail under it */
  'M72 152 L348 152 L348 186 L72 186 Z',
  'M40 186 L380 186 L380 216 L40 216 Z',
  /* two seams: three cushions across, which is what makes it read as a sofa
     rather than as a bench */
  'M164 152 L164 186',
  'M256 152 L256 186',
  /* four splayed legs */
  'M58 216 L52 244',
  'M96 216 L93 242',
  'M324 216 L327 242',
  'M362 216 L368 244',
] as const

/* the dimension line, drawn last and separately: it is the annotation layer,
   not the object, and on this page those are never the same stroke */
const SOFA_DIMENSION = [
  'M40 262 L380 262',
  'M40 254 L40 270',
  'M380 254 L380 270',
] as const

const SVG_NS = 'http://www.w3.org/2000/svg'

function buildDrawing(): { svg: SVGSVGElement; strokes: SVGPathElement[] } {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 420 290')
  svg.setAttribute('class', 'preloader-draw')
  svg.setAttribute('aria-hidden', 'true')

  const strokes: SVGPathElement[] = []
  const add = (d: string, cls: string) => {
    const path = document.createElementNS(SVG_NS, 'path')
    path.setAttribute('d', d)
    path.setAttribute('class', cls)
    svg.appendChild(path)
    strokes.push(path)
  }

  SOFA_PARTS.forEach((d) => add(d, 'preloader-stroke'))
  SOFA_DIMENSION.forEach((d) => add(d, 'preloader-stroke preloader-stroke-dim'))

  /* the callout. 2100 mm is the sofa's real modelled width (piece-geometry
     PIECE_SPECS.sofa), so the loading screen and the hero are quoting the
     same piece — the number is not a decoration picked to look technical. */
  const label = document.createElementNS(SVG_NS, 'text')
  label.setAttribute('x', '210')
  label.setAttribute('y', '253')
  label.setAttribute('class', 'preloader-dimtext')
  label.textContent = '2100 MM'
  svg.appendChild(label)

  return { svg, strokes }
}

/** Runs the S0 sequence and calls onDone as the curtain clears (the hero
    intro fires from there, so the two can never race). Returns a cleanup. */
export function runPreloader(onDone: () => void): () => void {
  const overlay = document.createElement('div')
  overlay.className = 'preloader'
  overlay.setAttribute('aria-hidden', 'true')

  const { svg, strokes } = buildDrawing()

  const word = document.createElement('span')
  word.className = 'preloader-word'
  word.textContent = 'Heaven'
  /* the line is the first thing drawn to measure on a page about drawing to
     measure, so it gets its dimension the way every other line here does */
  const line = document.createElement('span')
  line.className = 'preloader-line'
  const sub = document.createElement('span')
  sub.className = 'specimen preloader-sub'
  sub.textContent = 'ONE PIECE, DRAWN FOR YOU'
  overlay.append(svg, word, line, sub)
  document.body.appendChild(overlay)

  /* THE DRAW. stroke-dashoffset from each path's OWN measured length, not a
     shared constant: the paths differ by a factor of thirty (a leg is 28
     units, the base rail is 740), and a single dasharray would have made the
     long ones crawl while the short ones snapped. Measured per path, every
     stroke takes the same TIME, which is what makes it look like one hand
     drawing rather than eleven animations firing. */
  strokes.forEach((path) => {
    const len = path.getTotalLength()
    path.style.strokeDasharray = `${len}`
    path.style.strokeDashoffset = `${len}`
  })

  const intro = gsap.timeline()
  intro
    .to(strokes, {
      strokeDashoffset: 0,
      duration: 0.42,
      ease: 'power2.inOut',
      stagger: 0.055,
    })
    /* THE FILAMENT: the finished drawing is switched on. This is the same
       "the lights come on" beat the page uses on Sheet 02, stated once
       before the page begins so that the visitor recognises it later. */
    .to(
      svg,
      { '--draw-glow': 1, duration: 0.5, ease: 'power2.out' },
      '-=0.25',
    )

  /* the wordmark letter-spaces in under the drawing */
  const split = SplitText.create(word, { type: 'chars' })
  gsap
    .timeline()
    .from(
      split.chars,
      { autoAlpha: 0, yPercent: 40, duration: 0.5, ease: 'power2.out', stagger: 0.04 },
      0.35,
    )
    .fromTo(
      word,
      { letterSpacing: '0.05em' },
      { letterSpacing: '0.32em', duration: 1.1, ease: 'power3.out' },
      0.35,
    )

  /* the brass line doubles as the progress bar; its base duration IS the
     hard cap, so slow assets can never hold the page hostage */
  const lineTween = gsap.to(line, { scaleX: 1, duration: 1.4, ease: 'none' })

  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    removeSkips()
    capCall.kill()
    lineTween.kill()
    gsap
      .timeline()
      .to(line, { scaleX: 1, duration: 0.18, ease: 'power1.out' })
      /* whatever the draw had left, complete it before the sheet lifts: a
         half-drawn sofa sliding off the top would look like an interruption */
      .to(strokes, { strokeDashoffset: 0, duration: 0.2, ease: 'power2.out' }, 0)
      .to(svg, { '--draw-glow': 1, duration: 0.2 }, 0)
      .to(overlay, { yPercent: -100, duration: 0.72, ease: 'power3.inOut' }, '+=0.08')
      /* hero intro starts while the curtain is still clearing: the masked
         lines rise into view as the ink lifts */
      .call(onDone, undefined, '-=0.34')
      .call(() => {
        split.revert()
        overlay.remove()
      })
  }

  /* real-ish progress: fonts + full load finish it early, but never under
     a 1.05s hold: a sub-second flash of the overlay reads as a glitch, not
     a brand moment, and the drawing needs that long to be a drawing. The
     1.4s cap is absolute and a skip is always instant. */
  const startedAt = performance.now()
  const capCall = gsap.delayedCall(1.4, finish)
  let minCall: gsap.core.Tween | null = null
  const loaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((res) => window.addEventListener('load', () => res(), { once: true }))
  Promise.all([document.fonts.ready, loaded]).then(() => {
    const remain = Math.max(0, 1050 - (performance.now() - startedAt))
    minCall = gsap.delayedCall(remain / 1000, finish)
  })

  /* skippable: any input gesture completes it instantly */
  const skip = () => finish()
  const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
  skipEvents.forEach((ev) => window.addEventListener(ev, skip, { passive: true }))
  const removeSkips = () => skipEvents.forEach((ev) => window.removeEventListener(ev, skip))

  return () => {
    finished = true
    removeSkips()
    capCall.kill()
    minCall?.kill()
    lineTween.kill()
    intro.kill()
    split.revert()
    overlay.remove()
  }
}
