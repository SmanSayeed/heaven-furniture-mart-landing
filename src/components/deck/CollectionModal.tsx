'use client'

import { useCallback, useState } from 'react'
import { catalogue, deck } from '@/content/copy'
import { whatsappUrl } from '@/lib/whatsapp'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { WhatsApp } from '@/components/ui/Icons'
import { Modal } from './Modal'
import s from './deck.module.css'

/**
 * The VIEW pill on a category plate, and the sheet it opens: that room's
 * real pieces (the same photographs the /collections pages list), one line
 * of what Heaven builds for it, and the one CTA already naming the room.
 *
 * Nothing inside the sheet exists until it is opened; the plate's own
 * photograph is the only image the deck pays for up front.
 */
export function CollectionModal({
  slug,
  inline = false,
  label = deck.view,
}: {
  slug: string
  inline?: boolean
  label?: string
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const cat = catalogue.categories.find((c) => c.slug === slug)
  if (!cat) return null

  return (
    <>
      <button
        type="button"
        className={`${s.pill} ${s.pillGhost} ${inline ? '' : s.view}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        /* DeckMotion forwards a click on the plate's photograph here, so the
           whole picture opens the room, not only this pill */
        data-view-pill
      >
        {label}
      </button>
      <Modal
        id={`pieces-${cat.slug}`}
        open={open}
        onClose={close}
        title={cat.name}
        sub={cat.pieces.length === 1 ? '1 piece · built in Agrabad' : `${cat.pieces.length} pieces · built in Agrabad`}
        foot={
          <>
            <span className={s.modalSub}>{deck.freeLine}</span>
            <a
              className={s.pill}
              href={whatsappUrl(deck.roomMessage(cat.name))}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsApp />
              {deck.cta} · {cat.name}
            </a>
          </>
        }
      >
        <div className={s.strip}>
          {cat.pieces.map(
            (piece) =>
              hasPhoto(piece.img) && (
                <figure key={piece.img} className={s.stripItem} style={{ margin: 0 }}>
                  <Photo name={piece.img} alt={piece.title} sizes="(min-width: 900px) 56vw, 88vw" />
                  <figcaption className={s.stripCap}>{piece.title}</figcaption>
                </figure>
              ),
          )}
        </div>
        <p>{cat.lead}</p>
        <div className={s.specs}>
          {cat.pieces[0]?.specs.map((sp) => (
            <span key={sp}>{sp}</span>
          ))}
        </div>
      </Modal>
    </>
  )
}
