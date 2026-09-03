'use client'

import { useCallback, useState } from 'react'
import { catalogue, deck, night, type CataloguePiece } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { ArrowRight, WhatsApp } from '@/components/ui/Icons'
import { Modal } from './Modal'
import s from './deck.module.css'
import n from '@/components/night/night.module.css'

/**
 * A plate on a room page (PLAN-V6 PART B5): the framed photograph of one
 * piece, and the sheet it opens - the photograph large, what is visible
 * in it, and the one CTA already naming the piece, so the studio opens the
 * WhatsApp thread knowing which photograph is being discussed.
 *
 * `enter` is the plate's index for the page's print-in stagger (CSS
 * @starting-style, no JavaScript: the entrance is the page's own first
 * paint, which is also why it never flashes).
 */
export function PiecePlate({
  cat,
  piece,
  index,
  wide = false,
}: {
  cat: (typeof catalogue.categories)[number]
  piece: CataloguePiece
  index: number
  wide?: boolean
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const r = night.roomPage
  const message = `Hi Heaven, I saw the ${piece.title.toLowerCase()} in your ${cat.name} collection. My space is `

  return (
    <article
      className={`${n.plate} ${wide ? n.plateWide : ''} ${n.enter}`}
      style={{ '--i': index } as React.CSSProperties}
    >
      <button
        type="button"
        className={n.plateBtn}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        style={index === 0 ? ({ viewTransitionName: `room-${cat.slug}` } as React.CSSProperties) : undefined}
      >
        {/* the name is the piece, then the visible verb */}
        <span className="sr-only">{piece.title}</span>
        <span className={n.mat}>
          <span className={n.frameImg}>
            {hasPhoto(piece.img) && (
              <Photo
                name={piece.img}
                alt={`${piece.title}, built by Heaven Furniture Mart.`}
                sizes={wide ? '(min-width: 900px) 60vw, 92vw' : '(min-width: 900px) 30vw, 92vw'}
                priority={index === 0}
                low={index > 1}
              />
            )}
          </span>
          <span className={n.frameLight} aria-hidden="true" />
          <CropMarks />
          <span className={n.frameOpen} aria-hidden="true">
            <span>
              {r.open} <ArrowRight />
            </span>
          </span>
        </span>
      </button>
      <div className={n.plateCap}>
        <span className={n.rcardNo}>
          {cat.num}.{String(index + 1).padStart(2, '0')}
        </span>
        <h2 className={n.plateTitle}>{piece.title}</h2>
        <p className={n.rcardDetail}>{piece.specs.join(' · ')}</p>
      </div>

      <Modal
        id={`piece-${cat.slug}-${index + 1}`}
        open={open}
        onClose={close}
        title={piece.title}
        sub={`${cat.name} · ${r.built}`}
        dark
        foot={
          <>
            <span className={s.modalSub}>{deck.freeLine}</span>
            <a className={s.pill} href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
              <WhatsApp />
              {r.enquire}
            </a>
          </>
        }
      >
        {hasPhoto(piece.img) && (
          <div className={n.plateLarge}>
            <Photo name={piece.img} alt={piece.title} sizes="(min-width: 900px) 56vw, 88vw" />
          </div>
        )}
        <div className={s.specs}>
          {piece.specs.map((sp) => (
            <span key={sp}>{sp}</span>
          ))}
        </div>
        <p>{cat.lead}</p>
      </Modal>
    </article>
  )
}
