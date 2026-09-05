/**
 * The deployment's own origin, in one place.
 *
 * metadataBase, robots.txt, the sitemap and every canonical read this, so a
 * preview build advertises itself rather than production and none of them
 * can drift from the others. NEXT_PUBLIC_SITE_URL wins; Vercel's own
 * production hostname is the fallback; the last value is the current
 * deployment and is the only thing here that has to be edited by hand when
 * a real domain arrives.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://heaven-furniture-mart.vercel.app')
