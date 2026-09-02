'use client'

import { useState } from 'react'
import s from '@/components/sections/sections.module.css'

/**
 * THE TOUR — Heaven's own showroom walkthrough, embedded without paying for
 * it until somebody actually wants it.
 *
 * WHY A FACADE AND NOT AN IFRAME.
 * A YouTube iframe is not a video; it is an application. Dropped on the page
 * it pulls roughly 600 KB–1 MB of third-party JavaScript, opens connections
 * to three hosts and writes cookies — on first paint, for every visitor,
 * including the ninety-odd percent who will never press play. This page's
 * whole budget is 300 KB of JS. One idle embed would have been triple that.
 *
 * So the panel shows the showroom PHOTOGRAPH with a play control over it, and
 * the iframe is created only on the click. Until then the cost is zero bytes
 * and zero requests, and no data whatsoever has left the visitor's browser.
 * After the click it is the real player, in place, autoplaying.
 *
 * WHY THE POSTER IS OUR PHOTOGRAPH, NOT YOUTUBE'S THUMBNAIL. Their thumbnail
 * is a title card — a wordmark, a script font and a pin graphic — and it is
 * competent branding that belongs to a different design system than this
 * page. Under our own photograph the panel stays editorial and the play ring
 * is the only thing announcing that there is a film here. It also means the
 * poster needs no request to i.ytimg.com, so the "zero third-party bytes
 * before consent" claim above is literally true rather than nearly true.
 *
 * SECURITY, since this is the page's only third-party frame:
 *   · youtube-nocookie.com — no tracking cookie is set until play
 *   · the id is a module constant; nothing about this frame is built from
 *     user input, so there is no injection surface to sanitise
 *   · `allow` is the minimum the player needs. No camera, no microphone,
 *     no geolocation, no fullscreen-by-default beyond allowFullScreen
 *   · strict-origin-when-cross-origin, so the full URL never leaks
 *   · no `sandbox`: the player requires allow-scripts AND allow-same-origin,
 *     and a cross-origin frame granted both is exactly as isolated as one
 *     with no sandbox attribute at all — writing it would be theatre
 */

/** the film: Heaven Furniture Mart's own virtual showroom tour */
const VIDEO_ID = 'qEwoJWbXSTs'

export function VideoEmbed({
  title,
  children,
}: {
  /** what the frame is, for screen readers and for the button's label */
  title: string
  /** the poster: whatever the section would have shown as a still */
  children: React.ReactNode
}) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        className={s.videoFrame}
        src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    )
  }

  return (
    <>
      {children}
      <button
        type="button"
        className={s.videoPlay}
        onClick={() => setPlaying(true)}
        aria-label={`Play: ${title}`}
      >
        {/* two rings and a triangle: the outer one breathes, the inner one
            holds the glyph, and the whole control scales on hover. No image,
            no icon font, one element's worth of DOM. */}
        <span className={s.videoPulse} aria-hidden="true" />
        <span className={s.videoDisc} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 6.5v11l9-5.5-9-5.5Z" />
          </svg>
        </span>
        <span className={s.videoLabel} aria-hidden="true">
          Watch the tour
        </span>
      </button>
    </>
  )
}
