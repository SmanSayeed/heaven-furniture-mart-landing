import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from './Icons'

/**
 * The page's ONE call to action, reused everywhere (hero, bespoke, footer, sticky).
 * Always the same action: a prefilled WhatsApp conversation. No competing buttons.
 *
 * `shortLabel` is a responsive TEXT swap, not a second button: at 390px the
 * full label wraps to three lines inside the pill, so narrow phones render the
 * short wording and everything from 480px up renders the full one. Exactly one
 * of the two is ever displayed, so the accessible name is never doubled.
 */
export function Cta({
  label,
  shortLabel,
  message,
}: {
  label: string
  shortLabel?: string
  message?: string
}) {
  return (
    <a className="btn" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer">
      <WhatsApp />
      {shortLabel ? (
        <>
          <span className="only-narrow">{shortLabel}</span>
          <span className="only-wide">{label}</span>
        </>
      ) : (
        label
      )}
    </a>
  )
}
