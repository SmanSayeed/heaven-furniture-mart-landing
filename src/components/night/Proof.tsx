import { night } from '@/content/copy'
import s from './night.module.css'

/**
 * THE PROOF STRIP — the hero's answer, where the narrator line used to be.
 *
 * A first-time visitor asks three things before they ask a price: who draws
 * it, who builds it, who delivers it. The hero now answers all three in the
 * space under the CTA, in the studio's own words — so the gap does work
 * instead of holding atmosphere.
 *
 * THE MOTION is the page's own, not a new system:
 *   - the words arrive out of a line mask (`Words`' `.w` stagger, driven by
 *     the same `data-reveal` / `data-wait` gate as every other reveal)
 *   - each item's brass rule DRAWS from left to right, one after another,
 *     `--i` frames apart — transform only, so it is compositor work and
 *     costs nothing per frame
 *   - the number and the rule answer to the pointer: the hero already
 *     carries a pool of warm light (`Torch`), and an item lit by it lifts
 *     its rule to full brass
 *
 * ON A PHONE THE STRIP IS A SLIDER (client, 2026-09-03: "hero section ...
 * looking messy", "as on scroll changing hero sections, we can divide texts
 * to multiple sections"). Three rows plus a marks line under a headline, a
 * tagline and a CTA is six blocks of type over a photograph on a 390px
 * screen, and it read as a wall. The hero already changes photograph three
 * times as it is scrolled, so the three answers ride those changes: the
 * items stack in ONE cell and NightMotion lights item `v` as view `v`
 * arrives. One line at a time, the same three facts, a third of the height.
 * Wide screens keep all three - there the strip was never the problem.
 *
 * Server Component. Every word is in the HTML; with JavaScript off the
 * strip is simply present and lit — nothing here is required to read it.
 */
export function Proof() {
  const { proof, marks } = night.hero
  return (
    <div className={s.proof} data-reveal="words" data-proof>
      <ul className={s.proofList}>
        {proof.map((p, i) => (
          <li
            key={p.no}
            className={s.proofItem}
            data-proof-item
            /* item 1 is lit in the server HTML: with no JS, on a phone, the
               strip is one finished line rather than an empty slot */
            data-on={i === 0 ? '' : undefined}
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className={s.proofRule} aria-hidden="true" />
            <span className={s.proofNo}>{p.no}</span>
            <span className={s.proofLabel}>{p.label}</span>
            <span className={s.proofNote}>{p.note}</span>
          </li>
        ))}
      </ul>
      <p className={s.proofMarks}>
        {marks.map((m, i) => (
          <span key={m} className={s.proofMark} style={{ '--i': i + 3 } as React.CSSProperties}>
            {i > 0 ? <i className={s.proofDot} aria-hidden="true" /> : null}
            {m}
          </span>
        ))}
      </p>
    </div>
  )
}
