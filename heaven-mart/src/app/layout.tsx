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

export const metadata: Metadata = {
  title: 'Heaven Furniture Mart · Designed. Crafted. Customized.',
  description:
    'Bespoke furniture and interior styling in Chattogram. Custom sofas, beds, dining and office pieces, built around your space.',
  openGraph: {
    title: 'Heaven Furniture Mart',
    description: 'Furniture, Crafted Around You. Bespoke furniture studio, Agrabad, Chattogram.',
    type: 'website',
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
