/**
 * <model-viewer> is a custom element, so React has no type for it. This is the
 * exact attribute surface this project uses, and nothing more: a narrow
 * declaration is the point, because it is also the documentation of which
 * model-viewer features the page depends on.
 *
 * Bundle: public/vendor/model-viewer-4.3.1.min.js (Apache 2.0, self-hosted).
 */
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

interface ModelViewerAttributes
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  src?: string
  alt?: string
  poster?: string
  /** iOS Quick Look source. Absent until a USDZ export exists (ASSETS.md). */
  'ios-src'?: string
  ar?: boolean
  'ar-modes'?: string
  /** 'fixed' keeps furniture at real-world size, which is the whole point */
  'ar-scale'?: 'auto' | 'fixed'
  'camera-controls'?: boolean
  'touch-action'?: string
  'shadow-intensity'?: string
  exposure?: string
  'environment-image'?: string
  loading?: 'auto' | 'lazy' | 'eager'
}

/* React 19 removed the global JSX namespace; the intrinsic element list now
   lives on the react module itself, so that is what gets augmented. */
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': ModelViewerAttributes
    }
  }
}
