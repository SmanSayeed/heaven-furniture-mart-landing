'use client'

import { useCallback, useState } from 'react'
import { ar, deck } from '@/content/copy'
import { ArViewer } from '@/components/ui/ArViewer'
import { Modal } from './Modal'
import s from './deck.module.css'

/**
 * "See it in your room" - the AR viewer, inside the modal, on the bespoke
 * plate. The existing ArViewer already loads model-viewer only on its own
 * button press, so opening this sheet costs a photograph and nothing else;
 * the 1 MB viewer arrives only when the visitor asks for it a second time.
 */
export function ArModal({ inline = false, label = deck.bespoke.ar }: { inline?: boolean; label?: string }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button
        type="button"
        className={`${s.pill} ${s.pillGhost} ${inline ? '' : s.view}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {label}
      </button>
      <Modal id="your-room" open={open} onClose={close} title={ar.title} sub={ar.support} dark>
        <ArViewer />
      </Modal>
    </>
  )
}
