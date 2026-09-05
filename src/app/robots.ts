import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/site'

/** Nothing here is private, so everything is crawlable; the sitemap is
    named so a crawler does not have to guess the shape of the site. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
