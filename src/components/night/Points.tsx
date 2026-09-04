'use client'

import { useCallback, useState } from 'react'
import { night } from '@/content/copy'
import { Modal } from '@/components/deck/Modal'
import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from '@/components/ui/Icons'
import { deck } from '@/content/copy'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'

/**
 * THE THREE POINTS (client call, 2026-09-03: "customer not like to read
 * texts ... add few points only with detail button that opens modal").
 *
 * Three marks, three short lines, three buttons. Everything a paragraph
 * used to say is still on the page - it is behind the button now, set
 * large, one line at a time, for the visitor who actually wants it. That
 * is the difference between a page that is skimmed and one that is closed.
 *
 * THE MARKS ARE DRAWN HERE, in stroke, and NightMotion draws them on as
 * they arrive. No icon library: a downloaded glyph set is the one thing on
 * a bespoke furniture page that would look bought rather than made, and
 * these three are a drafting compass, a hand plane and a delivery van -
 * exactly the three things the points are about.
 */

function Mark({ kind }: { kind: string }) {
  /* one viewBox, one stroke weight, one corner treatment: three marks that
     look like they were drawn by the same hand on the same afternoon */
  const common = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  if (kind === 'compass') {
    return (
      <svg {...common} className={s.mark} data-mark>
        <path d="M24 7.5v5.5" />
        <circle cx="24" cy="6" r="1.9" />
        <path d="M24 13 13.5 39.5" />
        <path d="M24 13l10.5 26.5" />
        <path d="M31.6 32.8l4.6-2.2" />
        <path d="M12 41.5l3-4.8 2.6 1.6-3 4.8z" />
        <path d="M17.6 26.5c4.3 1.8 8.8 1.8 12.9 0" strokeDasharray="1.6 3" />
      </svg>
    )
  }
  if (kind === 'plane') {
    return (
      <svg {...common} className={s.mark} data-mark>
        <path d="M7 31.5h30a4 4 0 0 0 4-4v-6.5a2 2 0 0 0-2-2h-9.5" />
        <path d="M7 31.5v3.5a2 2 0 0 0 2 2h26" />
        <path d="M18.5 19l4.5-6.5a3 3 0 0 1 4.8 0l3.7 5.5" />
        <path d="M20 19.5l-3.5 12" />
        <path d="M7 40.5h34" strokeDasharray="1.6 3" />
        <path d="M11 24.5h4" />
      </svg>
    )
  }
  return (
    <svg {...common} className={s.mark} data-mark>
      <path d="M4 33V15.5a2 2 0 0 1 2-2h19a2 2 0 0 1 2 2V33" />
      <path d="M27 20h7.5l6.5 7.5V33" />
      <path d="M4 33h4.5M17 33h8M36 33h5" />
      <circle cx="12.5" cy="34.5" r="3.4" />
      <circle cx="31" cy="34.5" r="3.4" />
      <path d="M9 20.5h9M9 25h6" strokeDasharray="1.6 3" />
    </svg>
  )
}

export function Points() {
  const st = night.studio
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const current = open === null ? null : st.points[open]

  return (
    <>
      {/* `data-stagger`: the three arrive one after another rather than
          together, which is what makes three cards read as a sequence -
          drawn, then built, then delivered - instead of a row */}
      <div className={s.points} data-points data-stagger>
        {st.points.map((p, i) => (
          <article
            key={p.key}
            className={s.point}
            data-reveal="rise"
            style={{ '--i': i } as React.CSSProperties}
          >
            <span className={s.pointMark}>
              <Mark kind={p.icon} />
            </span>
            <h3 className={s.pointTitle}>{p.title}</h3>
            <p className={s.pointLine}>{p.line}</p>
            <button
              type="button"
              className={s.pointMore}
              onClick={() => setOpen(i)}
              aria-haspopup="dialog"
            >
              {st.more}
              <span className={s.pointMoreRule} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      <Modal
        id={`point-${current?.key ?? '0'}`}
        open={current !== null}
        onClose={close}
        title={current?.title ?? ''}
        sub={st.sheet}
        foot={
          <>
            <span className={d.modalSub}>{deck.freeLine}</span>
            <a className={d.pill} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {deck.cta}
            </a>
          </>
        }
      >
        {current && (
          <ol className={s.bigList}>
            {current.detail.map((line, i) => (
              <li key={line}>
                <span className={s.bigNo}>{String(i + 1).padStart(2, '0')}</span>
                {line}
              </li>
            ))}
          </ol>
        )}
      </Modal>
    </>
  )
}
