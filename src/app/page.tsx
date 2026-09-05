import { brand, night } from '@/content/copy'
import { Header } from '@/components/deck/Header'
import { DeckFooter } from '@/components/deck/DeckFooter'
import { Hero } from '@/components/night/Hero'
import { Studio } from '@/components/night/Studio'
import { Floor } from '@/components/night/Floor'
import { Signature } from '@/components/night/Signature'
import { Table } from '@/components/night/Table'
import { Maker } from '@/components/night/Maker'
import { Home } from '@/components/night/Home'
import { Ask } from '@/components/night/Ask'
import { Map } from '@/components/night/Map'
import { NightMotionIdle } from '@/components/motion/NightMotionIdle'
import { StageLoader } from '@/components/three/StageLoader'
import { StickyCta } from '@/components/ui/StickyCta'
import { SocialDock } from '@/components/ui/SocialDock'
import s from '@/components/night/night.module.css'

/**
 * A NIGHT AT HEAVEN (PLAN-V6). Seven chapters on one scroll; in every
 * chapter the visitor does one thing. One CTA, one 3D chapter, one map.
 *
 * A Server Component: every chapter is complete, readable and convertible
 * with JavaScript disabled. NightMotion and StageLoader layer the motion
 * and the 3D over this structure without touching it.
 *
 * Stacking: the fixed WebGL canvas is z 4 and the drafting table's stage is
 * the only thing it paints into; the chapters are ordinary flow (no sticky
 * stack any more), so nothing has to be told to paint over it.
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: brand.name,
  slogan: brand.tagline,
  telephone: brand.phoneDisplay,
  email: brand.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Agrabad Access Road',
    addressLocality: 'Chattogram',
    addressCountry: 'BD',
  },
  foundingDate: '2020',
  founder: { '@type': 'Person', name: 'Abul Kalam Bhuiyan' },
  sameAs: Object.values(brand.social),
}

export default function Page() {
  return (
    <main id="top">
      {/* JSON.stringify does NOT escape '<', so a future field carrying
          "</script>" would close this block and everything after it would
          be parsed as markup. Nothing in copy.ts can do that today - every
          value here is a static string we wrote - which is exactly when a
          one-character defence is cheap. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\u003c') }}
      />
      <Header nav={night.nav} counter={false} />

      <Hero />
      {/* THE GOODS BEFORE THE SERVICE (client: "take categories section
          above that icon and detail sections"). A first-time visitor's
          question after "who is this" is "what do you make" - the rooms,
          then six actual pieces - and only then "how do you work", which is
          what the studio chapter answers. night.chapters carries the same
          order, so the map, the chapter tags and the footer index follow. */}
      <Floor />
      <Signature />
      <Studio />
      <Table />
      <Maker />
      <Home />
      <Ask />

      <DeckFooter />

      <Map />
      <StickyCta />
      <SocialDock />
      {/* the DIM beat's layer: fixed, above the chapters and the canvas */}
      <div className={s.dimLayer} data-dim aria-hidden="true" />

      {/* mounted last, so every chapter exists before the orchestrator asks */}
      <NightMotionIdle />
      {/* the ONE fixed WebGL canvas; its view tracks [data-stage-bespoke] */}
      <StageLoader />
    </main>
  )
}
