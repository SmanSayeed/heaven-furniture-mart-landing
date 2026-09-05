import type { NextConfig } from 'next'

/*
  SECURITY HEADERS.

  There is no backend, no secret, no session and no personal data at rest on
  this site: the quote builder composes a WhatsApp message in the visitor's
  own browser and opens their own thread. So this is hardening rather than
  repair - but the QA pass found the production response carrying only Vary,
  Cache-Control, ETag and X-Powered-By, and "no attack surface" is not a
  reason to ship a page that any site may frame, sniff or ask for a camera
  through.

  Permissions-Policy earns its place here specifically: the AR feature runs
  model-viewer, which asks for camera and xr-spatial-tracking. Without a
  policy, anything embedded in this document could ask for them too.

  ON 'unsafe-inline'. Next's own bootstrap and the inlined CSS below are both
  inline, and the alternative - per-request nonces - needs middleware on
  every response, which would turn a fully static site into a rendered one.
  For a page with no authenticated state and no user-supplied HTML anywhere
  (verified: no dangerouslySetInnerHTML outside the escaped JSON-LD block, no
  eval, no innerHTML), the exchange is the wrong way round. If that ever
  changes, this is the line to revisit first.
*/
/*
  'unsafe-eval', IN DEVELOPMENT ONLY.

  React's dev build uses eval() to reconstruct call stacks across
  environments, and Turbopack's HMR runtime evaluates modules the same way.
  With the policy below applied in `next dev`, the browser refused all of
  it and the entire client bundle died silently on localhost - no
  hydration, no Lenis, no GSAP, no 3D. Nothing was wrong with the page; the
  header was killing it.

  React never uses eval in production, so the shipped policy stays strict.
  This is the one place the two differ, and it is deliberate: a dev-only
  relaxation that cannot reach a deployment.
*/
const dev = process.env.NODE_ENV !== 'production'

const pixel = process.env.NEXT_PUBLIC_META_PIXEL_ID
const fbScript = pixel ? ' https://connect.facebook.net' : ''
const fbImg = pixel ? ' https://www.facebook.com' : ''
const fbConnect = pixel ? ' https://www.facebook.com https://connect.facebook.net' : ''

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}${fbScript}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${fbImg}`,
  "font-src 'self'",
  `connect-src 'self'${fbConnect}`,
  /* the showroom film. It is the only third party the page ever embeds, and
     it is the no-cookie host. */
  'frame-src https://www.youtube-nocookie.com',
  'media-src \'self\' blob:',
  "worker-src 'self' blob:",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  /* the one place a form may post to is the visitor's own WhatsApp */
  "form-action 'self' https://wa.me",
  'upgrade-insecure-requests',
].join('; ')

const nextConfig: NextConfig = {
  /* X-Powered-By announced the stack for nothing in return */
  poweredByHeader: false,
  experimental: {
    /* CSS in the <head> as <style>, not as <link>. The deck's whole
       stylesheet is ~18 KB gzipped, and on a 150 ms-RTT mobile link each
       render-blocking <link> cost ~900 ms before the first paint (Lighthouse,
       2026-09-03: FCP 2.7 s with three of them). First-time visitors from a
       Facebook ad are this page's entire audience; the cache argument for
       external CSS does not apply to them. */
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=(), payment=(), xr-spatial-tracking=(self)',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
}

export default nextConfig
