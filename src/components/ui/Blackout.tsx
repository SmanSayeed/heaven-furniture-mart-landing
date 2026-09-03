import { hero } from '@/content/copy'

/**
 * THE BLACKOUT (CONCEPT-V2): the loadshedding beat's markup.
 *
 * Server-rendered, hidden by CSS (opacity 0, visibility hidden), and driven
 * entirely by PageMotion on the first visit: the hero lands, the room cuts
 * to black, one Bangla word - "the light will come" - appears, and the
 * power returns with a flicker. It lives at the page level rather than
 * inside the hero because it has to paint ABOVE the fixed WebGL canvas: a
 * cut that leaves the sofa lit is not a cut.
 *
 * aria-hidden: it is theatre, and the screen reader already has the page.
 */
export function Blackout() {
  return (
    <div className="blackout" aria-hidden="true" data-blackout>
      <span className="blackout-word" lang="bn" data-blackout-word>
        {hero.blackout.word}
      </span>
      <span className="specimen blackout-line" data-blackout-line>
        {hero.blackout.line.toUpperCase()}
      </span>
    </div>
  )
}
