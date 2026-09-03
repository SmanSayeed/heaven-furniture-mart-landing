'use client'

import { useCallback, useId, useState } from 'react'
import { brand, collections, deck } from '@/content/copy'
import { WhatsApp } from '@/components/ui/Icons'
import { Modal } from './Modal'
import s from './deck.module.css'

/**
 * THE QUOTE BUILDER - three questions, then WhatsApp with the message
 * already written.
 *
 * NO BACKEND, BY DESIGN. Nothing typed here is stored or transmitted to us:
 * the three answers are composed into one WhatsApp message and the studio's
 * own thread opens with it, from the visitor's own number. That is the
 * whole threat surface: there is no endpoint, no database, no inbox to
 * spam, no personal data at rest. When Saadman's backend arrives, `send`
 * is the one function that changes, and it must keep this path as the
 * fallback (see the checklist in PLAN-V5).
 *
 * Input discipline anyway: every field is length-capped, the phone is
 * loosely validated (Bangladeshi mobiles are 11 digits; the country code
 * form is allowed), and the URL is built with encodeURIComponent.
 */
const ROOMS = ['Living room', 'Bedroom', 'Dining', 'Office / study', 'Whole home'] as const

export function QuoteModal({ label = deck.cta }: { label?: string }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [category, setCategory] = useState('')
  const [room, setRoom] = useState<string>(ROOMS[0])
  const [size, setSize] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [touched, setTouched] = useState(false)

  const close = useCallback(() => {
    setOpen(false)
    setStep(0)
    setTouched(false)
  }, [])

  const phoneOk = /^\+?[0-9 -]{8,16}$/.test(phone.trim())
  const ready = name.trim().length > 0 && phoneOk

  const send = () => {
    setTouched(true)
    if (!ready) return
    const cap = (v: string, n: number) => v.trim().slice(0, n)
    const lines = [
      `Hi Heaven, I would like a free design consultation.`,
      ``,
      category ? `Looking for: ${cap(category, 40)}` : '',
      `Room: ${cap(room, 40)}${size.trim() ? ` · ${cap(size, 40)}` : ''}`,
      `Name: ${cap(name, 80)}`,
      `Phone: ${cap(phone, 20)}`,
    ].filter(Boolean)
    window.open(
      `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer',
    )
    close()
  }

  const titles = [deck.quoteSteps[0], deck.quoteSteps[1], deck.quoteSteps[2]]

  return (
    <>
      <button
        type="button"
        className={`${s.pill} ${s.pillBrass}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        <WhatsApp />
        {label}
      </button>
      <Modal
        id="quote-builder"
        open={open}
        onClose={close}
        title={titles[step]}
        sub={`Step ${step + 1} of 3`}
        dark
        foot={
          <>
            <span className={s.modalSub}>{deck.quoteEnds}</span>
            <div className={s.row}>
              {step > 0 && (
                <button type="button" className={s.modalClose} onClick={() => setStep(step - 1)}>
                  ← BACK
                </button>
              )}
              {step < 2 ? (
                <button type="button" className={s.pill} onClick={() => setStep(step + 1)}>
                  Next →
                </button>
              ) : (
                <button type="button" className={s.pill} onClick={send}>
                  <WhatsApp />
                  {deck.quoteSend}
                </button>
              )}
            </div>
          </>
        }
      >
        <div className={s.steps} aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <i key={i} data-on={i <= step ? '' : undefined} />
          ))}
        </div>

        {step === 0 && (
          <div className={s.stepBody} key="s0">
            <div className={s.tiles} role="group" aria-label={titles[0]}>
              {collections.items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={s.tile}
                  aria-pressed={category === item.name}
                  onClick={() => setCategory(item.name)}
                >
                  {item.name}
                </button>
              ))}
              <button
                type="button"
                className={s.tile}
                aria-pressed={category === 'Whole home'}
                onClick={() => setCategory('Whole home')}
              >
                Whole home
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className={`${s.stepBody} ${s.field}`} key="s1" style={{ gap: '1.25rem' }}>
            <div className={s.field}>
              <label htmlFor={`${id}-room`}>Which room?</label>
              <select
                id={`${id}-room`}
                className={s.input}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                {ROOMS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className={s.field}>
              <label htmlFor={`${id}-size`}>Rough size (optional)</label>
              <input
                id={`${id}-size`}
                className={s.input}
                type="text"
                maxLength={40}
                placeholder="12 × 14 ft, or the wall length"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className={`${s.stepBody} ${s.field}`} key="s2" style={{ gap: '1.25rem' }}>
            <div className={s.field}>
              <label htmlFor={`${id}-name`}>Your name</label>
              <input
                id={`${id}-name`}
                className={s.input}
                type="text"
                autoComplete="name"
                maxLength={80}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor={`${id}-phone`}>Phone or WhatsApp</label>
              <input
                id={`${id}-phone`}
                className={s.input}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <p className={s.formNote} role="status">
              {touched && !ready ? deck.quoteError : deck.quoteNote}
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}
