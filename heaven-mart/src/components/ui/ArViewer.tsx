'use client'

import { useCallback, useEffect, useState } from 'react'
import { ar, hero } from '@/content/copy'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { ArGlyph } from '@/components/ui/Icons'
import s from '@/components/sections/sections.module.css'

/* Self-hosted, version-pinned. Google's CDN copy would be one third-party
   request and one more thing to be blocked inside the Facebook in-app
   browser, which is where most of this page's traffic arrives (PLAN 1.7). */
const MODEL_VIEWER_SRC = '/vendor/model-viewer-4.3.1.min.js'
const AR_MODEL = `/models/${hero.pieces[0].id}.glb`
const AR_POSTER = 'living-02-blue-pair'

type ModelViewerConstructor = { dracoDecoderLocation?: string }

type LoadState = 'idle' | 'loading' | 'ready' | 'failed'

/* one module load per page, however many times the button is pressed */
let loader: Promise<void> | null = null

function loadModelViewer(): Promise<void> {
  if (loader) return loader
  loader = new Promise<void>((resolve, reject) => {
    if (customElements.get('model-viewer')) return resolve()
    const script = document.createElement('script')
    script.type = 'module'
    script.src = MODEL_VIEWER_SRC
    script.onerror = () => reject(new Error('model-viewer failed to load'))
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
    .then(() => customElements.whenDefined('model-viewer'))
    .then((ctor) => {
      /* Our GLBs are Draco-compressed, and model-viewer's default decoder
         path is a Google CDN. Point it at the copy already in public/draco
         (the same decoder the main scene uses) so AR needs no third party
         either, and so it still works on a locked-down network. */
      const element = ctor as unknown as ModelViewerConstructor
      element.dracoDecoderLocation = '/draco/'
    })
  return loader
}

/**
 * S6. "See it in your room."
 *
 * The whole 1 MB of model-viewer loads ON PRESS and never before. That is the
 * entire performance story of this section: a visitor who scrolls past pays
 * nothing, a visitor who wants AR pays for it at the moment they ask. Until
 * then the panel is a real photograph, which is a finished composition rather
 * than a spinner.
 *
 * Honesty about the fallback ladder (PLAN Part 7): the AR button is rendered
 * by model-viewer itself and it appears only where the device can genuinely
 * start an AR session. Android Scene Viewer and WebXR headsets can, from the
 * GLB. iOS Quick Look needs a USDZ export, which we do not have yet (see
 * ASSETS.md), so on an iPhone this stays a 3D viewer you can turn with a
 * finger, and the line below says so rather than offering a dead button.
 */
export function ArViewer() {
  const [state, setState] = useState<LoadState>('idle')

  const start = useCallback(() => {
    if (state !== 'idle') return
    setState('loading')
    loadModelViewer().then(
      () => setState('ready'),
      () => setState('failed'),
    )
  }, [state])

  /* Once the visitor has asked for it, keep it: nothing here unmounts the
     element on scroll, because tearing down a WebGL viewer they are using
     would be worse than holding it. */
  useEffect(() => {
    if (state !== 'failed') return
    const id = window.setTimeout(() => setState('idle'), 4000)
    return () => window.clearTimeout(id)
  }, [state])

  return (
    <div className={s.arPanel}>
      {state === 'ready' ? (
        /* a custom element; its attribute contract is declared in
           src/types/model-viewer.d.ts */
        <model-viewer
          className={s.arModel}
          src={AR_MODEL}
          alt={ar.alt}
          ar
          ar-modes="webxr scene-viewer quick-look"
          /* furniture has to arrive at its real size or the preview lies */
          ar-scale="fixed"
          camera-controls
          /* same rule as the hero turntable: the page keeps vertical
             gestures, the viewer gets the horizontal ones */
          touch-action="pan-y"
          shadow-intensity="1"
          exposure="0.9"
          environment-image="/hdr/potsdamer_platz_1k.hdr"
          loading="eager"
        />
      ) : (
        <>
          <div className={`${hasPhoto(AR_POSTER) ? '' : 'ph'} ${s.arPoster}`}>
            <Photo
              name={AR_POSTER}
              alt=""
              sizes="(min-width: 900px) 55vw, 92vw"
            />
          </div>
          <button
            type="button"
            className={`btn ${s.arButton}`}
            onClick={start}
            disabled={state === 'loading'}
          >
            <ArGlyph />
            {state === 'loading' ? ar.loading : state === 'failed' ? ar.failed : ar.button}
          </button>
        </>
      )}
      <p className="specimen">{ar.support}</p>
    </div>
  )
}
