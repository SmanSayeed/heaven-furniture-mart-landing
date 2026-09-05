import { brand, contact, footer, nav, night, siteNav } from '@/content/copy'
import { Cta } from '@/components/ui/Cta'
import { ContactForm } from '@/components/ui/ContactForm'
import { FacebookLogo, InstagramLogo, YoutubeLogo } from '@/components/ui/Icons'
import { SheetBlock, BeatCaption } from '@/components/ui/SheetBlock'
import s from './footer.module.css'

/**
 * SHEET 09 · "THE ORDER" — have yours drawn.
 *
 * The last ask, centred on columns 2-5 so it sits on the page's axis and
 * nothing flanks it, then every contact fact from the brief as three two-
 * column blocks. The plot line that has been drawing itself down the left
 * gutter since Sheet 01 ties off here.
 *
 * The index of chapters doubles as the no-JS route map: the Index overlay
 * is progressive enhancement, so the whole story has to exist as plain
 * anchors somewhere in the server HTML. It is useful with JS too, which is
 * why it is a real list rather than something hidden from sighted readers.
 *
 * IT READS `night.chapters`, and that is the whole point. It used to read
 * `story` - the nine beats of the V5 design - and every one of its nine
 * links was dead: they pointed at /#sheet-01 ... /#sheet-09, /#bespoke,
 * /#collections and /#ar, and the landing page has carried seven entirely
 * different ids since V6 (room, studio, floor, table, maker, home, ask).
 * A visitor clicking any of them was dropped at the top of the home page,
 * under labels for chapters that no longer exist. Reading the same array
 * the page itself is built from is what makes that impossible to repeat.
 */
export function Footer() {
  return (
    <footer id="sheet-09" className={`dark section sheet-grid room ${s.footer}`}>
      <div className={s.footerHead} data-col="2-5">
        <BeatCaption no="09" />
        <h2 className="section-title">{footer.headline}</h2>
        <Cta label={footer.cta} />
      </div>

      {/* THE BRIEF, under the button rather than instead of it. The one-tap
          WhatsApp link stays the primary route because it is the fastest one
          on a phone; this is for the visitor who would rather say what they
          want before they say hello. Same destination, same conversation. */}
      <div className={s.contactPanel} data-col="2-5">
        <span className="specimen">{contact.eyebrow}</span>
        <h3 className={s.contactTitle}>{contact.title}</h3>
        <ContactForm />
      </div>

      <hr className="rule" data-col="1-6" />

      <nav className={s.footerIndex} aria-label={nav.footerHeading} data-col="1-6">
        <span className="specimen">{nav.footerHeading.toUpperCase()}</span>
        <ul className={s.footerIndexList}>
          {night.chapters.map((chapter) => (
            <li key={chapter.id}>
              {/* rooted (`/#...`), not bare (`#...`): this footer is shared
                  by every page of the site, and a bare fragment on /contact
                  pointed at nothing. Rooted, it goes home AND scrolls. */}
              <a href={`/#${chapter.id}`} className={s.footerIndexLink}>
                <span className="index">{chapter.no}</span>
                {chapter.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* THE SITE'S PAGES, beside the story's sheets. The contents list above
          maps the landing page; this row maps the business - collections,
          process, about, contact - so every page of the site is reachable
          from the bottom of every other one. */}
      <nav className={s.footerPages} aria-label="Pages" data-col="1-6">
        <span className="specimen">PAGES</span>
        <ul className={s.footerPagesList}>
          {siteNav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className={s.footerIndexLink}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <hr className="rule" data-col="1-6" />

      <div className={s.contactBlock} data-col="1-2">
        <span className="specimen">VISIT</span>
        <p className={s.contactBig}>{brand.address}</p>
      </div>
      <div className={s.contactBlock} data-col="3-4">
        <span className="specimen">TALK</span>
        <p className={s.contactBig}>
          <a href={`tel:${brand.phoneTel}`}>{brand.phoneDisplay}</a>
        </p>
        <p className="placard-line">
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </p>
      </div>
      <div className={s.contactBlock} data-col="5-6">
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

      {/* the colophon: this sheet's title block is the real one */}
      <div className={s.footerBottom} data-col="1-4">
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

      <SheetBlock no="09" />
    </footer>
  )
}
