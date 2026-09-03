import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { catalogue } from '@/content/copy'
import { Room } from '@/components/night/Room'

const find = (slug: string) => catalogue.categories.find((c) => c.slug === slug)

/* Every category is known at build time, so all five pages are prerendered as
   static HTML. No server, no database, no request-time work: the whole
   catalogue deploys to any host as files. */
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
 * /collections/[slug] — one room, the pieces Heaven has actually built for
 * it, in the night system (components/night/Room.tsx). No 3D on this route;
 * the heaviest thing here is a photograph.
 */
export default async function CategoryPage(props: PageProps<'/collections/[slug]'>) {
  const { slug } = await props.params
  const cat = find(slug)
  if (!cat) notFound()
  const idx = catalogue.categories.findIndex((c) => c.slug === cat.slug)
  const next = catalogue.categories[(idx + 1) % catalogue.categories.length]
  return <Room cat={cat} next={next} />
}
