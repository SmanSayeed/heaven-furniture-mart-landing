import { brand, footer, nav, collections } from '@/content/copy'
import { Cta } from '@/components/ui/Cta'
import { FacebookLogo, InstagramLogo, YoutubeLogo } from '@/components/ui/Icons'
import s from './sections.module.css'

/* S8. Last ask + every contact fact from the brief + the Meshy attribution. */
export function Footer() {
  return (
    <footer className={`dark section ${s.footer}`} data-accent="#C8A96A">
      <h2 className="section-title">{footer.headline}</h2>
      <Cta label={footer.cta} />

      <hr className="rule" />

      {/* The Index nav's no-JS path (PLAN S1d): the overlay is progressive
          enhancement, so the category links must also exist as plain, always
          visible anchors. Useful with JS too, which is why it is not hidden. */}
      <nav className={s.footerIndex} aria-label={nav.footerHeading}>
        <span className="specimen">{nav.footerHeading.toUpperCase()}</span>
        <ul className={s.footerIndexList}>
          {collections.items.map((item) => (
            <li key={item.num}>
              <a href={`#collection-${item.num}`} className={s.footerIndexLink}>
                <span className="index">{item.num}</span>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="rule" />

      <div className={s.footerContact}>
        <div className={s.contactBlock}>
          <span className="specimen">VISIT</span>
          <p className={s.contactBig}>{brand.address}</p>
        </div>
        <div className={s.contactBlock}>
          <span className="specimen">TALK</span>
          <p className={s.contactBig}>
            <a href={`tel:${brand.phoneTel}`}>{brand.phoneDisplay}</a>
          </p>
          <p className="placard-line">
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </p>
        </div>
        <div className={s.contactBlock}>
          <span className="specimen">FOLLOW</span>
          <div className={s.socials}>
            <a href={brand.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookLogo />
            </a>
            <a href={brand.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramLogo />
            </a>
            <a href={brand.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <YoutubeLogo />
            </a>
          </div>
        </div>
      </div>

      <div className={s.footerBottom}>
        <span className="specimen">© 2026 {brand.name.toUpperCase()}</span>
        <span className="specimen">{footer.attribution.toUpperCase()}</span>
        <a
          className="specimen"
          href={footer.hackathonUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {footer.hackathon.toUpperCase()} · {footer.hackathonTag.toUpperCase()}
        </a>
      </div>
    </footer>
  )
}
