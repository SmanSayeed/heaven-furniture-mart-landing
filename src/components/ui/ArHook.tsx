import { arHook } from '@/content/copy'
import s from '@/components/sections/sections.module.css'

/**
 * S1c "The AR hook": the hero's AR invitation (PLAN S1c).
 *
 * Deliberately NOT the AR session. Mounting model-viewer above the fold
 * would cost a permission prompt and a heavy bundle in the first viewport,
 * which is exactly the LCP and ad-funnel path we protect. This is pure
 * promise: an inline SVG viewfinder whose four brackets breathe in CSS, and
 * a plain anchor to S6 where the real session lives. Zero JS, so it works
 * with JavaScript disabled like every other link on the page.
 *
 * The brackets are the same drawn-measurement motif as the S3 dimension
 * marks: one visual language saying "we can place this in your space".
 */
export function ArHook() {
  return (
    <a className={s.arHook} href="#ar">
      <span className={s.arHookGlyph} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {/* four corner brackets: the viewfinder */}
          <path d="M3 8.5V4.5A1.5 1.5 0 0 1 4.5 3h4" className={s.arBracket} />
          <path d="M21 8.5V4.5A1.5 1.5 0 0 0 19.5 3h-4" className={s.arBracket} />
          <path d="M3 15.5v4A1.5 1.5 0 0 0 4.5 21h4" className={s.arBracket} />
          <path d="M21 15.5v4a1.5 1.5 0 0 1-1.5 1.5h-4" className={s.arBracket} />
          {/* the thing being placed, pulsing at the centre */}
          <circle cx="12" cy="12" r="2.25" className={s.arPulse} />
        </svg>
      </span>
      <span className={s.arHookText}>
        <span className={s.arHookLabel}>{arHook.label}</span>
        <span className="specimen">{arHook.specimen}</span>
      </span>
    </a>
  )
}
