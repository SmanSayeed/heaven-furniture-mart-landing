import type { Metadata } from 'next'
import { brand, contactPage, showroom, whatsappMessages } from '@/content/copy'
import { CatalogueChrome } from '@/components/catalogue/CatalogueChrome'
import { CatalogueMotion } from '@/components/motion/CatalogueMotion'
import { Footer } from '@/components/sections/Footer'
import { ContactForm } from '@/components/ui/ContactForm'
import { whatsappUrl, mapsUrl } from '@/lib/whatsapp'
import s from '@/components/catalogue/catalogue.module.css'

export const metadata: Metadata = {
  title: 'Contact · Heaven Furniture Mart',
  description:
    'Contact Heaven Furniture Mart, Agrabad Access Road, Chattogram. WhatsApp, phone, email, or visit the showroom for a free design consultation.',
  alternates: { canonical: '/contact' },
}

/**
 * /contact — every channel, one page.
 *
 * FOUR CHANNELS, RANKED BY WHAT THE CUSTOMER ACTUALLY USES. WhatsApp first,
 * because it is the CTA everywhere else on the site and the way furniture is
 * actually bought in Chattogram; then the phone, for the customer who wants
 * a voice; then email; then the showroom itself, which is the strongest
 * trust object the business owns. Each channel is ONE tap — a contact page
 * that makes a visitor copy a number by hand has failed at its only job.
 *
 * The same three-field brief form as the landing page sits underneath, on
 * the same no-backend contract: it composes a WhatsApp message and stores
 * nothing. When the client later adds a backend (see ContactForm's header
 * comment for the security checklist that must come with it), this page is
 * where it lands.
 */
export default function ContactRoute() {
  return (
    <main className={s.page}>
      <CatalogueChrome current="/contact" />

      <section className={`light section sheet-grid ${s.indexHead}`}>
        <div data-col="1-4">
          <p className="specimen" data-cat-fade>
            {contactPage.eyebrow}
          </p>
          <h1 className="section-title">{contactPage.title}</h1>
          <p className={s.lead} data-cat-fade>
            {contactPage.lead}
          </p>
        </div>
      </section>

      <section className={`light section sheet-grid ${s.channelGrid}`} aria-label="Contact channels">
        <a
          className={s.channel}
          data-col="1-3"
          data-cat-card
          href={whatsappUrl(whatsappMessages.default)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="specimen">{contactPage.channels.whatsapp.toUpperCase()}</span>
          <span className={s.channelValue}>{brand.phoneDisplay}</span>
          <span className="specimen">FREE DESIGN CONSULTATION</span>
        </a>

        <a className={s.channel} data-col="4-6" data-cat-card href={`tel:${brand.phoneTel}`}>
          <span className="specimen">{contactPage.channels.call.toUpperCase()}</span>
          <span className={s.channelValue}>{brand.phoneDisplay}</span>
          <span className="specimen">{showroom.specimens[2]}</span>
        </a>

        <a className={s.channel} data-col="1-3" data-cat-card href={`mailto:${brand.email}`}>
          <span className="specimen">{contactPage.channels.email.toUpperCase()}</span>
          <span className={s.channelValue}>{brand.email}</span>
        </a>

        <a
          className={s.channel}
          data-col="4-6"
          data-cat-card
          href={mapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="specimen">{contactPage.channels.visit.toUpperCase()}</span>
          <span className={s.channelValue}>{brand.address}</span>
          <span className="specimen">{showroom.directions.toUpperCase()}</span>
        </a>
      </section>

      {/* the brief form, on the dark ground its styles were drawn for */}
      <section className={`dark section sheet-grid ${s.note}`} data-grid aria-label={contactPage.formTitle}>
        <div data-col="1-4">
          <h2 className="section-title">{contactPage.formTitle}</h2>
          <ContactForm />
        </div>
      </section>

      <Footer />
      <CatalogueMotion />
    </main>
  )
}
