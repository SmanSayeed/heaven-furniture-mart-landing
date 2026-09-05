import { deck } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from '@/components/ui/Icons'
import { Wordmark } from '@/components/ui/Wordmark'
import { MegaMenu } from './MegaMenu'
import s from './deck.module.css'

/**
 * The page's only chrome: wordmark, the rooms mega menu + three anchors
 * (wide screens; a burger and a full-screen sheet on phones), and the one
 * CTA. Fixed, transparent over the hero, solid once the page is scrolling
 * (NightMotion toggles the class; `solid` renders it from the server on
 * the room pages, which have no hero to be transparent over).
 *
 * Server Component: every link is a real anchor, so the page is navigable
 * before a byte of JavaScript arrives. The menu is the one client island.
 */
export function Header({
  nav = deck.nav,
  counter = true,
  home = '',
  solid = false,
}: {
  nav?: readonly { label: string; href: string }[]
  /** the plate counter; PLAN-V6 replaces it with the map */
  counter?: boolean
  /** '' on the landing page, '/' on any other route: prefixes the anchors */
  home?: string
  solid?: boolean
}) {
  return (
    <>
      <header className={`${s.hdr} ${solid ? s.hdrSolid : ''}`} data-header>
        <a href={home || '#top'} className={s.brand}>
          <Wordmark />
        </a>
        <MegaMenu nav={nav} home={home} />
        {/* NOT the hero's pill. The hero's CTA is the page's loud one -
            filled brass, at the end of a sentence. The chrome's is quiet
            until it is wanted: a hairline brass plate that fills from the
            baseline on hover, with the two ticks a placed plate carries
            everywhere else on this page. */}
        <a
          className={s.hdrAction}
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={s.hdrActionFill} aria-hidden="true" />
          <WhatsApp />
          <span className={s.hdrActionText}>{deck.cta}</span>
        </a>
      </header>
      {counter && (
        <div className={s.counter} aria-hidden="true">
          <span data-counter-now>01</span> — {String(deck.total).padStart(2, '0')}
        </div>
      )}
    </>
  )
}
