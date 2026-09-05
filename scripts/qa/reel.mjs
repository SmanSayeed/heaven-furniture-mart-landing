/**
 * THE HERO REEL, SAMPLED OVER A FULL CYCLE.
 *
 *   node scripts/qa/reel.mjs ./shots [url]
 *
 * Room one cross-fades two frames on a pure-CSS clock (night.module.css,
 * `hfm-reel` / `hfm-reel-zoom`). The two things that can silently break it
 * are the ones this checks:
 *
 *   1. frame 1 must be at opacity 1 at t=0. Its animation carries a
 *      NEGATIVE delay for exactly that reason - if someone "tidies" it
 *      away, the LCP spends a second and a half as a black rectangle and
 *      no test but this one notices.
 *   2. the hand-over must be a cross-fade, not a cut: at t=8s both frames
 *      should be part-way, summing to about 1.
 *
 * The scale column is the mild zoom (1.02 -> 1.085 while a frame holds).
 */
import { chromium } from 'playwright'

const OUT = process.argv[2] || '.'
const URL = process.argv[3] || 'http://localhost:3210/'

/* one full cycle is 16s: frame 1 holds to 8, frame 2 to 16 */
const SAMPLES = [0, 1, 3, 6, 7, 8, 9, 12, 15, 16]

const VPS = [
  { n: 'desktop', w: 1440, h: 900, mob: false },
  { n: 'mobile', w: 390, h: 844, mob: true },
]

for (const v of VPS) {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: v.w, height: v.h },
    isMobile: v.mob,
    hasTouch: v.mob,
    userAgent: v.mob
      ? 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Mobile Safari/537.36'
      : undefined,
  })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 140)))
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text().slice(0, 140))
  })

  await page.goto(URL, { waitUntil: 'networkidle' })
  console.log(`\n=== ${v.n} ${v.w}x${v.h} ===`)

  let at = 0
  for (const t of SAMPLES) {
    if (t > at) await page.waitForTimeout((t - at) * 1000)
    at = t
    const frames = await page.evaluate(() =>
      [...document.querySelectorAll('[data-view="0"] > span')].map((f) => {
        const img = f.querySelector('img')
        const m = getComputedStyle(img).transform.match(/matrix\(([^)]+)\)/)
        return {
          op: +(+getComputedStyle(f).opacity).toFixed(2),
          scale: m ? +parseFloat(m[1].split(',')[0]).toFixed(3) : 1,
          src: img.currentSrc.split('/').pop(),
        }
      }),
    )
    console.log(
      ` t=${String(t).padStart(2)}s  ` +
        frames.map((f) => `[${f.src.slice(0, 24)} op=${f.op} scale=${f.scale}]`).join('  '),
    )
  }
  console.log('  errors:', errs.length ? errs.slice(0, 3) : 'none')
  await page.screenshot({ path: `${OUT}/reel-${v.n}.png` })
  await browser.close()
}
