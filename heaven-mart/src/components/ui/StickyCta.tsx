import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from './Icons'
import s from '@/components/sections/sections.module.css'

/* Mobile-only floating WhatsApp pill (frosted glass). Pure CSS, no JS.
   Sprint 4 adds: hide while S3 is pinned to avoid overlapping the swatch dock. */
export function StickyCta() {
  return (
    <a
      className={s.sticky}
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consult Heaven Furniture Mart on WhatsApp"
    >
      <WhatsApp />
      Consult
    </a>
  )
}
