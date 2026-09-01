import { brand } from '@/content/copy'
import { Hero } from '@/components/sections/Hero'
import { Brand, Ticker } from '@/components/sections/Brand'
import { Bespoke } from '@/components/sections/Bespoke'
import { Collections } from '@/components/sections/Collections'
import { Showroom } from '@/components/sections/Showroom'
import { Ar } from '@/components/sections/Ar'
import { Proof } from '@/components/sections/Proof'
import { Footer } from '@/components/sections/Footer'
import { StickyCta } from '@/components/ui/StickyCta'
import { PageMotion } from '@/components/motion/PageMotion'
import { StageLoader } from '@/components/three/StageLoader'
import { IndexNav } from '@/components/ui/IndexNav'

/**
 * The whole page, as a Server Component. This file is deliberately boring:
 * eight sections in narrative order (PLAN.md Part 2), fully readable and
 * convertible with JavaScript disabled. Motion and 3D are layered on top in
 * later sprints without touching this structure.
 */
/* Structured data so Google understands this as a real local furniture store
   (SEO beyond Lighthouse: rich results, local pack eligibility). */
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Brand />
      <Ticker />
      <Bespoke />
      <Collections />
      <Showroom />
      <Ar />
      <Proof />
      <Footer />
      <StickyCta />
      {/* the page's only chrome: renders after hydration only, so the no-JS
          path is the Footer's plain category list (PLAN S1d) */}
      <IndexNav />
      {/* the golden thread (PLAN Part 2.5): a fixed 1px brass spine in the
          left gutter, drawn by scroll, tied off by the gold triangle at the
          footer. Fully drawn by default; PageMotion animates it when allowed. */}
      <div className="thread" aria-hidden="true" data-thread />
      <span className="tri thread-tip" aria-hidden="true" data-thread-tip />
      {/* mounted last so every section's DOM exists before the orchestrator
          queries it; renders nothing itself (Sprint 2 motion layer) */}
      <PageMotion />
      {/* the ONE fixed WebGL canvas (PLAN 4.3): gated, deferred, faded in;
          its two drei Views track the hero and bespoke stage divs */}
      <StageLoader />
    </main>
  )
}
