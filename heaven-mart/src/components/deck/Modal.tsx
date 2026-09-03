'use client'

import { useCallback, useEffect, useRef } from 'react'
import { getLenis } from '@/lib/lenis-store'
import s from './deck.module.css'

/**
 * THE MODAL - one <dialog> for the whole site.
 *
 * Native `showModal()` does the hard parts correctly and for free: focus is
 * contained inside the dialog, Escape closes it, everything behind it is
 * inert, and focus returns to the opener on close. What this adds:
 *
 *   · the backdrop click closes it (the dialog element itself is the only
 *     thing a click on the backdrop lands on)
 *   · Lenis is stopped while it is open, because Lenis drives the real
 *     window scroll and would otherwise scroll the page under the sheet
 *   · the URL hash follows it, so the phone's back button closes the modal
 *     instead of leaving the site - the single most common way a visitor
 *     loses a page on Android
 *
 * Content is passed as children and is only rendered while open (the
 * consumers guard that), so a modal's photographs cost nothing until it is
 * asked for.
 */
export function Modal({
  id,
  open,
  onClose,
  title,
  sub,
  dark = false,
  children,
  foot,
}: {
  id: string
  open: boolean
  onClose: () => void
  title: string
  sub?: string
  dark?: boolean
  children: React.ReactNode
  foot?: React.ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  /* whether WE pushed the history entry this modal is standing on */
  const pushed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* smooth scroll, if this device has it (lenis-store: null on phones) */
    const lenis = getLenis()
    if (open && !el.open) {
      el.showModal()
      lenis?.stop()
      try {
        history.pushState({ modal: id }, '', `#${id}`)
        pushed.current = true
      } catch {
        pushed.current = false
      }
    } else if (!open && el.open) {
      el.close()
      lenis?.start()
    }
  }, [open, id])

  /* the back button: the browser pops our entry, we close */
  useEffect(() => {
    if (!open) return
    const onPop = () => {
      pushed.current = false
      onClose()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [open, onClose])

  /* a UI close (button, Escape, backdrop) also retires the history entry it
     pushed, so the visitor's back button afterwards goes where it should */
  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false
      history.back()
      return
    }
    onClose()
  }, [onClose])

  useEffect(() => {
    return () => {
      getLenis()?.start()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className={`${s.modal} ${dark ? s.modalDark : ''}`}
      aria-labelledby={`${id}-title`}
      /* Lenis is stopped while the sheet is open and swallows every wheel
         event it sees; this attribute exempts the dialog's subtree, so the
         sheet's own overflow scrolls (the "AR modal wheel dead" bug) */
      data-lenis-prevent=""
      
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      {open && (
        <>
          <div className={s.modalHead}>
            <div>
              <h3 id={`${id}-title`} className={s.modalTitle}>
                {title}
              </h3>
              {sub && <span className={s.modalSub}>{sub}</span>}
            </div>
            <button type="button" className={s.modalClose} onClick={close}>
              ESC · CLOSE ×
            </button>
          </div>
          <div className={s.modalBody}>{children}</div>
          {foot && <div className={s.modalFoot}>{foot}</div>}
        </>
      )}
    </dialog>
  )
}
