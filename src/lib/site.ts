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
    : /* THE LAST FALLBACK IS LOCALHOST, ON PURPOSE.
         It used to be a guessed `heaven-furniture-mart.vercel.app`, which
         turns out to be somebody else's site: checked 2026-09-05, it serves
         a different page under a different headline. A wrong guess here is
         not a cosmetic slip - this value is metadataBase, so it signs every
         canonical, the sitemap and robots.txt, and it would have pointed a
         crawler at a stranger. Localhost cannot be mistaken for the truth.
         On Vercel neither branch is reached (the platform sets
         VERCEL_PROJECT_PRODUCTION_URL itself); anywhere else, set
         NEXT_PUBLIC_SITE_URL. */
      'http://localhost:3000')
