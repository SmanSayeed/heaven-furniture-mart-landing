'use client'

import { useEffect, useRef, useState } from 'react'
import { prefersLightweight, prefersReducedMotion } from '@/lib/device'
import s from '@/components/ui/shared.module.css'

/**
 * THE TOUR — Heaven's own showroom walkthrough, embedded without paying for
 * it until it is worth paying for.
 *
 * WHY A FACADE AND NOT AN IFRAME.
 * A YouTube iframe is not a video; it is an application. Dropped on the page
 * it pulls roughly 600 KB–1 MB of third-party JavaScript, opens connections
 * to three hosts and writes cookies — on first paint, for every visitor,
 * including the ninety-odd percent who will never press play. This page's
 * whole budget is 300 KB of JS. One idle embed would have been triple that.
 *
 * THREE STATES, AND WHO GETS WHICH (client call, 2026-09-03: "can we make
 * this youtube video autoplay?"):
 *
 *   poster   the showroom photograph and a play ring. Zero bytes, zero
 *            requests, nothing has left the browser. This is what a phone
 *            gets, and it is what everyone gets before the section arrives.
 *   ambient  the film itself, MUTED and looping with no controls, started
 *            when the section is more than half on screen. Desktop only,
 *            and never for a visitor on Data Saver, a 2G/3G connection, a
 *            two-core machine or reduced motion — the same gate the rest of
 *            the page's motion lives behind. Muted is not a preference: no
 *            browser will autoplay sound, so an unmuted autoplay is simply
 *            a video that does not start.
 *   full     the real player, with sound and controls, on the visitor's own
 *            press — of the ring, or of "Watch with sound" over the film.
 *
 * A phone keeps the facade on purpose. The traffic this page is built for is
 * Facebook ads in Chattogram on mobile data; a megabyte of autoplaying video
 * nobody asked for is that visitor's money.
 *
 * WHY THE POSTER IS OUR PHOTOGRAPH, NOT YOUTUBE'S THUMBNAIL. Their thumbnail
 * is a title card — a wordmark, a script font and a pin graphic — competent
 * branding that belongs to a different design system than this page. Under
 * our own photograph the panel stays editorial, and the poster needs no
 * request to i.ytimg.com, so "zero third-party bytes before consent" is
 * literally true rather than nearly true.
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

/* looping needs `playlist` set to the same id; that is YouTube's API, not a
   trick. disablekb because an ambient film is not a control surface. */
const AMBIENT = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${VIDEO_ID}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0`
const FULL = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`

type Mode = 'poster' | 'ambient' | 'full'

export function VideoEmbed({
  title,
  children,
  sound,
}: {
  /** what the frame is, for screen readers and for the button's label */
  title: string
  /** the poster: whatever the section would have shown as a still */
  children: React.ReactNode
  /** the label on the button that turns the ambient film into the real one */
  sound?: string
}) {
  const [mode, setMode] = useState<Mode>('poster')
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (mode !== 'poster') return
    /* desktop only, and only for a visitor the page is already spending
       motion on */
    if (!window.matchMedia('(min-width: 900px)').matches) return
    if (prefersLightweight() || prefersReducedMotion()) return
    const el = host.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        setMode('ambient')
      },
      /* more than half of the panel on screen: the film starts when the
         visitor is looking at it, not when it clips the fold */
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [mode])

  return (
    <div className={s.videoHost} ref={host}>
      {mode === 'poster' ? (
        <>
          {children}
          <button
            type="button"
            className={s.videoPlay}
            onClick={() => setMode('full')}
            aria-label={`Play: ${title}`}
          >
            {/* two rings and a triangle: the outer one breathes, the inner
                one holds the glyph, and the whole control scales on hover.
                No image, no icon font, one element's worth of DOM. */}
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
      ) : (
        <>
          <iframe
            className={s.videoFrame}
            /* remounted (key) when the mode changes, so the player reloads
               with sound rather than being asked to unmute itself */
            key={mode}
            src={mode === 'ambient' ? AMBIENT : FULL}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          {mode === 'ambient' && sound && (
            <button type="button" className={s.videoSound} onClick={() => setMode('full')}>
              <span className={s.videoSoundGlyph} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
                  <path d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10" />
                </svg>
              </span>
              {sound}
            </button>
          )}
        </>
      )}
    </div>
  )
}
