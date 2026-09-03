'use client'

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { getSwatch, onSwatch } from '@/lib/stage-state'
import { ar } from '@/content/copy'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { ArGlyph } from '@/components/ui/Icons'
import s from '@/components/ui/shared.module.css'

/* Self-hosted, version-pinned. Google's CDN copy would be one third-party
   request and one more thing to be blocked inside the Facebook in-app
   browser, which is where most of this page's traffic arrives (PLAN 1.7). */
const MODEL_VIEWER_SRC = '/vendor/model-viewer-4.3.1.min.js'
const AR_POSTER = 'living-02-blue-pair'

/**
 * THE PIECE THE VISITOR PLACES IS THE PIECE THE VISITOR CHOSE.
 *
 * Sheet 03 asks them to pick a fabric. Three sheets later this one offers to
 * put the sofa in their room — and it would quietly undo that whole promise
 * if the sofa arrived back in the default ivory. So the swatch store picks
 * the file, and `ar-sofa-<id>.glb` is written at build time by
 * scripts/export-ar-models.mjs from the SAME generator that draws the hero.
 *
 * These have to be real files rather than a blob built in the page, because
 * Android falls through to Google's Scene Viewer, a separate app that fetches
 * the model over the network and cannot read a tab's blob: URL.
 */
const arModelFor = (swatchId: string) => `/models/ar-sofa-${swatchId}.glb`

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
  }).then(() => {
    /* No decoder configuration any more: the exported pieces are plain glTF
       geometry, so model-viewer's Draco and KTX2 loaders — both of which
       default to a Google CDN and both of which are blocked often enough on
       a locked-down mobile network to matter — are never reached at all. */
    return customElements.whenDefined('model-viewer').then(() => undefined)
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

  /* the fabric chosen on Sheet 03. Server snapshot is the default swatch, so
     the markup is identical with and without JavaScript. */
  const swatch = useSyncExternalStore(onSwatch, getSwatch, getSwatch)

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
          /* key on the swatch: changing `src` on a live model-viewer is
             supported, but re-keying guarantees a clean load rather than
             relying on it, and the element is only ever mounted after a
             deliberate press */
          key={swatch.id}
          src={arModelFor(swatch.id)}
          alt={`${ar.alt} ${swatch.name}.`}
          ar
          ar-modes="webxr scene-viewer quick-look"
          /* furniture has to arrive at its real size or the preview lies */
          ar-scale="fixed"
          camera-controls
          /* same rule as the hero turntable: the page keeps vertical
             gestures, the viewer gets the horizontal ones */
          touch-action="pan-y"
          /*
            THE FRAMING IS OURS, NOT THE DEFAULT.

            model-viewer's own default is a head-on elevation at 75 degrees
            polar, which for a piece two and a half times wider than it is
            tall renders a grey rectangle — and until the visitor drags it,
            that rectangle is the entire first impression of the feature.
            These put it on the same three-quarter view the hero turntable
            uses, so the two stages agree about what this sofa looks like.

            The min/max clamps are the floor and the plan view: below 20
            degrees the camera is under the ground plane and the piece is
            lit from beneath by nothing; above 88 it is a top-down drawing,
            which Sheet 04 already is.

            THE 84% IS THE WHOLE FIX for the piece arriving as a stamp in
            the corner of a big empty panel. `auto` radius frames the model's
            bounding SPHERE inside the vertical field of view — correct for a
            cube, wasteful for a sofa, which is two and a half times wider
            than it is tall and therefore leaves most of a landscape frame
            empty on every side. A percentage is a percentage of that auto
            radius, so 84% simply walks the camera in until the piece fills
            the frame the way it does on the hero stage. The min and max keep
            a visitor's own zoom between "inside the upholstery" and "across
            the room". An explicit field-of-view used to be here and made it
            worse, because it fought the same auto framing it depended on.
          */
          camera-orbit="32deg 76deg 84%"
          min-camera-orbit="auto 20deg 55%"
          max-camera-orbit="auto 88deg 150%"
          disable-pan
          shadow-intensity="1"
          shadow-softness="0.8"
          exposure="0.9"
          /* model-viewer's own generated neutral studio, not a file. The
             1.5 MB HDR this used to point at is gone for the same reason the
             main scene stopped downloading one: it was a third of the page's
             weight, fetched over Chattogram mobile data, to light one sofa. */
          environment-image="neutral"
          loading="eager"
        />
      ) : (
        <>
          {/* the panel IS a viewfinder, so it wears a viewfinder's marks */}
          <div
            className={`${hasPhoto(AR_POSTER) ? '' : 'ph'} panel panel-land arch ${s.arPoster}`}
          >
            <PrintPhoto
              name={AR_POSTER}
              alt=""
              sizes="(min-width: 900px) 46vw, 92vw"
            />
            <CropMarks />
          </div>
          <button
            type="button"
            className={`btn btn-lead ${s.arButton}`}
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
