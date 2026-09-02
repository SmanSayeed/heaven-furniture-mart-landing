import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Inter_Tight, Geist_Mono, Fraunces } from 'next/font/google'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import './globals.css'

/* Type system, v3 "MONOLITH" (PLAN Part 1.5 v3): the premium comes from the
   SETTING (enormous sizes, negative tracking, tight leading), not from an
   exotic face. Apple's SF Pro cannot be licensed for the web; Inter Tight is
   its closest legal relative. All self-hosted through next/font. */
const display = Inter_Tight({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-display',
})

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-sans',
})

const mono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
})

/* the one serif left on the page: the MD's quote, so the client brief's
   "elegant serif" intent still appears somewhere real */
const quote = Fraunces({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-quote',
})

/* The share card is the FIRST thing most visitors see: this page's traffic
   arrives from Facebook posts and WhatsApp links, where the card is the
   whole advertisement. metadataBase makes every OG url absolute, which is
   what Facebook's scraper requires; it reads the deployment's own origin so
   preview builds advertise themselves rather than production. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://heaven-furniture-mart.vercel.app')

const description =
  'Bespoke furniture and interior styling in Chattogram. Custom sofas, beds, dining and office pieces, built around your space.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Heaven Furniture Mart · Designed. Crafted. Customized.',
  description,
  openGraph: {
    title: 'Heaven Furniture Mart · Furniture, Crafted Around You.',
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
      className={`${display.variable} ${sans.variable} ${mono.variable} ${quote.variable}`}
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
      {/* SmoothScroll is the only client code at layout level: Lenis + the
          GSAP ticker handshake. The layout itself stays a Server Component. */}
      <body suppressHydrationWarning>
        <SmoothScroll>{children}</SmoothScroll>
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
