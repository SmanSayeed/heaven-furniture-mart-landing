import Link from 'next/link'
import type { Metadata } from 'next'
import { brand, night, siteNav } from '@/content/copy'
import { Header } from '@/components/deck/Header'
import { DeckFooter } from '@/components/deck/DeckFooter'
import { WhatsApp, ArrowRight } from '@/components/ui/Icons'
import { whatsappUrl } from '@/lib/whatsapp'
import d from '@/components/deck/deck.module.css'
import s from './not-found.module.css'

export const metadata: Metadata = {
  title: `Not found · ${brand.name}`,
  robots: { index: false, follow: true },
}

/**
 * 404.
 *
 * What stood here was Next's own: "404 · This page could not be found." in
 * black on white, no header, no footer, no way back. Beside a page that has
 * spent every other screen arguing that this is a studio rather than a
 * shop, that one screen said the opposite - and a mistyped URL or a stale
 * Facebook link is a real way to arrive.
 *
 * So it is the same room as the rest: the ink, the drawn sheet, the one
 * CTA. It offers the four things a lost visitor might have been looking
 * for, and it does NOT apologise at length - a wrong address is not an
 * event worth a paragraph.
 *
 * `noindex, follow`: a crawler should not keep this, but should follow the
 * routes out of it.
 */
export default function NotFound() {
  return (
    <main className={s.page} id="top">
      <Header nav={night.nav} counter={false} home="/" solid />

      <section className={s.body}>
        <span className={s.code} aria-hidden="true">
          404
        </span>
        <h1 className={s.title}>This one was never drawn.</h1>
        <p className={s.line}>
          The page you asked for is not here. Everything Heaven makes is, though.
        </p>

        <nav className={s.routes} aria-label="Where to go instead">
          <Link className={s.route} href="/">
            <span className={s.routeKey}>01</span>
            <span className={s.routeName}>The floor</span>
            <span className={s.routeLead}>Five rooms, every piece to your measurements.</span>
            <span className={s.routeGo} aria-hidden="true">
              <ArrowRight />
            </span>
          </Link>
          {siteNav.map((item, i) => (
            <Link key={item.href} className={s.route} href={item.href}>
              <span className={s.routeKey}>{String(i + 2).padStart(2, '0')}</span>
              <span className={s.routeName}>{item.label}</span>
              <span className={s.routeGo} aria-hidden="true">
                <ArrowRight />
              </span>
            </Link>
          ))}
        </nav>

        <div className={s.act}>
          <a
            className={`${d.pill} ${d.pillBrass}`}
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsApp />
            Request a Quote
          </a>
          <span className={s.quiet}>Free design consultation</span>
        </div>
      </section>

      <DeckFooter />
    </main>
  )
}
