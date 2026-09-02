import Link from 'next/link'
import { brand, catalogue, siteNav } from '@/content/copy'
import { ArrowRight } from '@/components/ui/Icons'
import s from './catalogue.module.css'

/**
 * The bar every inner page wears.
 *
 * The landing page has no header at all - it is one continuous route and a
 * nav bar would be a second thing competing with the story. These pages are
 * different: a visitor arrives here from a specific piece and needs to know
 * where they are and how to get anywhere else, which is exactly what a
 * header is for.
 *
 * IT CARRIES THE SITE NAV NOW. With one page ("/collections") a back link
 * was the whole map; with five, a visitor on /process who wants /contact had
 * no route that did not pass through the landing page's nine-sheet scroll.
 * Four links make this a site rather than a landing page with satellites -
 * which is also the difference between a hackathon demo and the business
 * website the client would actually keep.
 *
 * `current` marks the page the visitor is on. It renders as plain text, not
 * a link: a link to the page you are standing on is a small lie, and the
 * unlinked name doubles as the "you are here" mark.
 *
 * `next/link` rather than <a>: these are the only in-site navigations on the
 * whole build, so this is the one place prefetch earns its keep. Hovering a
 * label has the page ready before the click lands.
 */
export function CatalogueChrome({
  back,
  current,
}: {
  back?: { href: string; label: string }
  current?: string
}) {
  return (
    <header className={s.chrome}>
      <Link href="/" className={s.chromeBrand}>
        <span className="sr-only">{catalogue.backToHome}</span>
        {/* the letters get their OWN row span: the outer span is a flex
            COLUMN, and bare text nodes in a flex container become anonymous
            items - which stacked HE, the triangle and VEN vertically and
            printed the wordmark as a ransom note */}
        <span aria-hidden="true">
          <span className={s.chromeBrandRow}>
            HE<span className="tri" />VEN
          </span>
          <span className={s.chromeBrandSub}>FURNITURE MART</span>
        </span>
      </Link>

      <nav className={s.chromeNav} aria-label="Site">
        {siteNav.map((item) =>
          item.href === current ? (
            <span key={item.href} className={s.chromeNavHere} aria-current="page">
              {item.label.toUpperCase()}
            </span>
          ) : (
            <Link key={item.href} href={item.href} className={s.chromeNavLink}>
              {item.label.toUpperCase()}
            </Link>
          ),
        )}
      </nav>

      <div className={s.chromeRight}>
        {back && (
          <Link href={back.href} className={`specimen ${s.chromeBack}`}>
            <ArrowRight className={s.chromeBackGlyph} />
            {back.label.toUpperCase()}
          </Link>
        )}
        <a className="specimen" href={`tel:${brand.phoneTel}`}>
          {brand.phoneDisplay}
        </a>
      </div>
    </header>
  )
}
