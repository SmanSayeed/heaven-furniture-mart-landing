'use client'

import { useId, useState } from 'react'
import { brand, contact } from '@/content/copy'
import { WhatsApp } from './Icons'
import s from '@/components/sections/footer.module.css'

/**
 * SHEET 09's brief form.
 *
 * IT HAS NO BACKEND, AND THAT IS THE DESIGN, not a gap to be filled in later
 * by accident. Pressing the button composes the visitor's answers into a
 * WhatsApp message and opens the studio's own thread with it already typed.
 *
 * Why that is the right call for THIS business rather than a compromise:
 *
 *   · It cannot fail silently. A form that POSTs somewhere leaves the visitor
 *     trusting a "thanks, we'll be in touch" they cannot verify; this one
 *     ends with the message visibly sitting in their own WhatsApp, in their
 *     own sent history, from their own number.
 *   · It is where the client already works. Heaven's published contact route
 *     is a WhatsApp number, so a database in between would only delay the
 *     same conversation.
 *   · It keeps the page's one-CTA rule intact: this is not a second action,
 *     it is the same action with the first message already written.
 *   · Nothing is transmitted anywhere, nothing is stored, and there is no
 *     endpoint to rate-limit, no inbox to spam, and no personal data at rest.
 *     The form's threat surface is empty because the form has no server.
 *
 * WHEN A REAL BACKEND ARRIVES (Node/Nest on the VPS), this component is the
 * only file that changes, and the checklist it must satisfy is: validate and
 * length-cap every field server-side, rate-limit by IP and by phone, add a
 * honeypot plus a timing check for bots, keep the WhatsApp path as the
 * fallback when the POST fails, never log the phone number, and serve it
 * over HTTPS only with the origin locked down. Until every line of that is
 * done, this version is the safer product.
 *
 * Progressive enhancement: the `action` on the <form> is a real WhatsApp URL,
 * so with JavaScript disabled the button still opens the studio's thread with
 * the default message. The composed brief is the enhancement.
 */
export function ContactForm() {
  const id = useId()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [brief, setBrief] = useState('')
  const [touched, setTouched] = useState(false)

  const ready = name.trim().length > 0 && phone.trim().length > 0

  const send = (event: React.FormEvent) => {
    event.preventDefault()
    setTouched(true)
    if (!ready) return

    /* Built with encodeURIComponent, never by hand: a brief is free text and
       will contain the characters that break a hand-built query string. The
       fields are also capped — a wa.me url past a few thousand characters is
       silently truncated by WhatsApp, and a truncated brief is worse than a
       short one. */
    const cap = (value: string, max: number) => value.trim().slice(0, max)
    const lines = [
      `Hi Heaven, I would like a free design consultation.`,
      ``,
      `Name: ${cap(name, 80)}`,
      `Phone: ${cap(phone, 40)}`,
      brief.trim() ? `Looking for: ${cap(brief, 600)}` : '',
    ].filter(Boolean)

    window.open(
      `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <form
      className={s.contactForm}
      onSubmit={send}
      /* the no-JS path: a plain GET to wa.me still reaches the studio */
      action={`https://wa.me/${brand.whatsappNumber}`}
      method="get"
      target="_blank"
      noValidate
    >
      <div className={s.formRow}>
        <div className={s.field}>
          <label className="specimen" htmlFor={`${id}-name`}>
            {contact.fields.name.label}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            className={s.input}
            placeholder={contact.fields.name.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={s.field}>
          <label className="specimen" htmlFor={`${id}-phone`}>
            {contact.fields.phone.label}
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            /* tel, not number: a number input strips the leading zero every
               Bangladeshi mobile begins with, and offers a spinner nobody
               wants on a phone number */
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            className={s.input}
            placeholder={contact.fields.phone.placeholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      <div className={s.field}>
        <label className="specimen" htmlFor={`${id}-brief`}>
          {contact.fields.brief.label}
        </label>
        <textarea
          id={`${id}-brief`}
          name="brief"
          rows={3}
          maxLength={600}
          className={`${s.input} ${s.textarea}`}
          placeholder={contact.fields.brief.placeholder}
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
        />
      </div>

      {/* announced, not just coloured: the error has to reach a screen reader
          the moment it appears, and it only appears after a real attempt */}
      <p className={s.formNote} role="status">
        {touched && !ready ? contact.error : contact.note}
      </p>

      <button type="submit" className="btn btn-lead">
        <WhatsApp />
        {contact.submit}
      </button>
    </form>
  )
}
