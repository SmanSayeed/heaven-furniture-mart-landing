import type { MetadataRoute } from 'next'
import { catalogue } from '@/content/copy'
import { siteUrl } from '@/lib/site'

/* Six static routes plus one per room. Generated from the catalogue rather
   than typed, so a new room appears in the sitemap by existing. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority,
  })
  return [
    page('/', 1),
    page('/collections', 0.8),
    ...catalogue.categories.map((c) => page(`/collections/${c.slug}`, 0.7)),
    page('/process', 0.6),
    page('/about', 0.6),
    page('/contact', 0.6),
  ]
}
