import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter_Tight } from 'next/font/google'
import { SmoothScrollIdle } from '@/components/motion/SmoothScrollIdle'
import { siteUrl } from '@/lib/site'
import './globals.css'

/* Type system, THE SLIDES (PLAN-V5): the Apple look, licensed. SF Pro
   Display cannot be self-hosted; Inter Tight is the same idea - a grotesk
   drawn tight for display sizes - and at 600 with -0.035em tracking it sets
   the plate titles the way the MacBook page sets its headlines. The four
   competing entries all chose Cormorant or Playfair; a sans on a luxury
   furniture page is itself the differentiator. All self-hosted via next/font. */
const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})

/* NO BODY WEBFONT. Body copy, tags and buttons set in the visitor's own
   system sans (SF on Apple, Segoe on Windows, Roboto on Android) - the same
   call apple.com makes. Inter and Geist Mono were 54 KB of preloaded woff2
   competing with the hero photograph for the first two seconds, to render
   twelve-pixel captions nobody could tell apart. --font-sans and --font-mono
   are left undeclared on purpose: every rule that reads them falls through
   to its system stack. */

/* The share card is the FIRST thing most visitors see: this page's traffic
   arrives from Facebook posts and WhatsApp links, where the card is the
   whole advertisement. metadataBase makes every OG url absolute, which is
   what Facebook's scraper requires; it reads the deployment's own origin so
   preview builds advertise themselves rather than production. */
const description =
  'Bespoke furniture and interior styling in Chattogram. Custom sofas, beds, dining and office pieces, built around your space.'

/*
  THEME-COLOR IS A DESIGN DECISION, not an SEO box.

  Without it Android Chrome paints its address bar white and the page under
  it is near-black, so the first thing a visitor from a Facebook ad sees is
  a white band above a dark page - the join reads as a rendering fault
  before they have read a word. This is the ink the hero opens on.
*/
export const viewport: Viewport = {
  themeColor: '#0B0C0C',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Heaven Furniture Mart · Designed. Crafted. Customized.',
  description,
  /* the landing page. Every other route sets its own; without one, a link
     carrying a Facebook click id (/?fbclid=...) is a separate page to a
     crawler, and this page's traffic arrives almost entirely that way. */
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Heaven Furniture Mart · Furnished to you.',
    description,
    type: 'website',
    siteName: 'Heaven Furniture Mart',
    locale: 'en_US',
    url: '/',
    images: [
      {
        url: '/og/card.png',
        width: 1200,
        height: 630,
        alt: 'Heaven Furniture Mart. Furniture, Crafted Around You. A bespoke sofa drawn to measure.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heaven Furniture Mart · Furniture, Crafted Around You.',
    description,
    images: ['/og/card.png'],
  },
}

/* Meta Pixel (PLAN Part 1.7): their team runs FB ads into this page, so the
   pixel is env-pluggable without touching code. Unset (the default) renders
   NOTHING: zero third-party bytes, zero requests. The id is validated as
   digits-only before it is interpolated into the script, so a malformed or
   hostile env value can never become markup. */
const rawPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
const metaPixelId = rawPixelId && /^\d+$/.test(rawPixelId) ? rawPixelId : undefined

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={display.variable}
      /* The sticky WhatsApp pill hides while the hero is on screen, because
         the hero has its own CTA and two calls to action in one viewport is
         the one thing this page may not do. The flag STARTS here, in the
         server HTML, rather than being set by PageMotion after hydration:
         set from JS it flickered on first paint, and with JavaScript
         disabled it never appeared at all, so a no-JS visitor met the pill
         sitting on top of the hero's own button. PageMotion removes it when
         Sheet 02 arrives; without JS it simply stays, and those visitors
         still have eight in-page CTAs. */
      data-hero-view="1"
    >
      {/*
        suppressHydrationWarning: browser extensions (Grammarly etc.) inject
        attributes into <body> before React hydrates. Scope: this element only,
        one level deep. Never use it to hide a real mismatch of our own.
      */}
      {/* the layout stays a Server Component; smooth scrolling is a null-
          rendering island that loads Lenis on idle, on desktops only */}
      <body suppressHydrationWarning>
        {/* BYPASS BLOCKS. The page is 13,000 px tall on a phone and the
            header and its menu hold thirteen focusable elements, which a
            keyboard or screen-reader visitor had to walk past on arrival
            and again after every menu close. Visually hidden until it takes
            focus, then it is the first thing on the page. */}
        <a href="#top" className="skip">
          Skip to content
        </a>
        {children}
        <SmoothScrollIdle />
        {metaPixelId && (
          <>
            {/* standard Meta Pixel bootstrap; afterInteractive keeps it off
                the critical path and out of the pre-hydration HTML parse */}
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
            </Script>
            <noscript>
              {/* the no-JS ad-attribution path FB documents; only exists when
                  the pixel id is configured */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  )
}
