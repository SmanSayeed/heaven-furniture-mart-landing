import { brand, footer, siteNav } from '@/content/copy'
import { Wordmark } from '@/components/ui/Wordmark'
import s from './deck.module.css'

/** The foot of the deck: every contact fact from the brief, and nothing
    that competes with them. Static. */
export function DeckFooter() {
  return (
    <footer className={s.footer} id="contact">
      <div>
        <Wordmark className={s.brandFoot} />
        <p className={s.quiet} style={{ marginTop: '0.9rem' }}>
          {brand.tagline}
        </p>
      </div>
      <div>
        <span className={s.footerKey}>Visit</span>
        Agrabad Access Road
        <br />
        Chattogram, Bangladesh
      </div>
      <div>
        <span className={s.footerKey}>Talk</span>
        <a href={`tel:${brand.phoneTel}`}>{brand.phoneDisplay}</a>
        <br />
        <a href={`mailto:${brand.email}`}>{brand.email}</a>
      </div>
      <div>
        <span className={s.footerKey}>Follow</span>
        <a href={brand.social.facebook} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
        {' · '}
        <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        {' · '}
        <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer">
          YouTube
        </a>
        <br />
        {siteNav.map((item, i) => (
          <span key={item.href}>
            {i > 0 && ' · '}
            <a href={item.href}>{item.label}</a>
          </span>
        ))}
      </div>
      <div className={s.footerBottom}>
        <span>© 2026 {brand.name}</span>
        <a href={footer.hackathonUrl} target="_blank" rel="noopener noreferrer">
          {footer.hackathon} · {footer.hackathonTag}
        </a>
      </div>
    </footer>
  )
}
