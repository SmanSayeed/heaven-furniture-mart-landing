import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { brand, catalogue, whatsappMessages } from '@/content/copy'
import { CatalogueChrome } from '@/components/catalogue/CatalogueChrome'
import { CatalogueMotion } from '@/components/motion/CatalogueMotion'
import { Footer } from '@/components/sections/Footer'
import { Cta } from '@/components/ui/Cta'
import { PrintPhoto, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { WhatsApp, ArrowRight } from '@/components/ui/Icons'
import { whatsappUrl } from '@/lib/whatsapp'
import s from '@/components/catalogue/catalogue.module.css'

const find = (slug: string) => catalogue.categories.find((c) => c.slug === slug)

/* Every category is known at build time, so all five pages are prerendered as
   static HTML. No server, no database, no request-time work: the whole
   catalogue deploys to any host as files, which is what keeps it fast and
   what makes it the client's team's problem-free deployment later. */
export function generateStaticParams() {
  return catalogue.categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata(
  props: PageProps<'/collections/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const cat = find(slug)
  if (!cat) return {}
  return {
    title: `${cat.name} · Heaven Furniture Mart`,
    description: cat.lead,
    alternates: { canonical: `/collections/${cat.slug}` },
    openGraph: {
      title: `${cat.name} · Heaven Furniture Mart`,
      description: cat.lead,
      url: `/collections/${cat.slug}`,
    },
  }
}

/**
 * /collections/[slug] — one room, the pieces Heaven has actually built for it.
 *
 * THE ORDER PATH IS THE PAGE'S ONLY JOB. Each piece carries one action, and
 * it is the same action the landing page has: a WhatsApp thread, already
 * naming the piece the visitor was looking at, so the studio opens the chat
 * knowing which photograph is being discussed. No cart, no price, no form to
 * fill twice - the offer is bespoke, so the first step is always a
 * conversation.
 *
 * No 3D and no model-viewer on this route at all. The heaviest thing here is
 * a photograph, and every one of them is lazy except the first.
 */
export default async function CategoryPage(props: PageProps<'/collections/[slug]'>) {
  const { slug } = await props.params
  const cat = find(slug)
  if (!cat) notFound()

  const idx = catalogue.categories.findIndex((c) => c.slug === cat.slug)
  const next = catalogue.categories[(idx + 1) % catalogue.categories.length]

  return (
    <main className={s.page}>
      <CatalogueChrome back={{ href: '/collections', label: catalogue.backToIndex }} />

      <section className={`light section sheet-grid ${s.catHero}`}>
        <div data-col="1-4">
          <p className="specimen" data-cat-fade>
            {cat.num} · {brand.name.toUpperCase()}
          </p>
          <h1 className="section-title">{cat.name}</h1>
          <p className={s.lead} data-cat-fade>
            {cat.lead}
          </p>
        </div>
        <div className={s.indexAction} data-col="5-6" data-cat-fade>
          <Cta
            label={catalogue.bespokeNote.cta}
            message={whatsappMessages.default}
            lead={false}
          />
        </div>
      </section>

      <section className={`light section sheet-grid ${s.pieces}`} aria-label={`${cat.name} pieces`}>
        {cat.pieces.map((piece, i) => (
          /* two up on desktop, alternating halves of the six-column grid */
          <article
            key={piece.img}
            className={s.piece}
            data-col={i % 2 === 0 ? '1-3' : '4-6'}
            data-cat-card
          >
            <div
              className={`${hasPhoto(piece.img) ? '' : 'ph'} panel panel-land ${s.pieceMedia}`}
              data-card-media
            >
              <PrintPhoto
                name={piece.img}
                alt={`${piece.title}, built by Heaven Furniture Mart.`}
                sizes="(min-width: 900px) 46vw, 92vw"
                kenBurns
              />
              <CropMarks />
            </div>

            <div className={s.pieceBody}>
              <h2 className={s.pieceTitle}>
                <span className="index">
                  {cat.num}.{String(i + 1).padStart(2, '0')}
                </span>
                {piece.title}
              </h2>
              <div className="specimen-row">
                {piece.specs.map((spec) => (
                  <span key={spec} className="specimen">
                    {spec}
                  </span>
                ))}
              </div>
              {/* the one action, said for THIS photograph */}
              <a
                className="btn btn-sm"
                href={whatsappUrl(
                  `Hi Heaven, I saw the ${piece.title.toLowerCase()} in your ${cat.name} collection. My space is `,
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsApp />
                {catalogue.enquire}
              </a>
            </div>
          </article>
        ))}
      </section>

      <section className={`dark section sheet-grid ${s.note}`} data-grid>
        <div data-col="2-5">
          <h2 className="section-title">{catalogue.bespokeNote.title}</h2>
          <p className={s.lead}>{catalogue.bespokeNote.line}</p>
          <Cta label={catalogue.bespokeNote.cta} message={whatsappMessages.default} />
        </div>
        {/* the route continues rather than ending: the same "you are one step
            from the next thing" pull the landing page's title blocks use */}
        <Link href={`/collections/${next.slug}`} className={`specimen ${s.nextCat}`} data-col="2-5">
          NEXT COLLECTION · {next.name.toUpperCase()}
          <ArrowRight />
        </Link>
      </section>

      <Footer />
      <CatalogueMotion />
    </main>
  )
}
