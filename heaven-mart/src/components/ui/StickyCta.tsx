import { whatsappUrl } from '@/lib/whatsapp'
import { WhatsApp } from './Icons'
import s from '@/components/ui/shared.module.css'

/* Mobile-only floating WhatsApp pill (frosted glass). Pure CSS, no JS.
   Sprint 4 adds: hide while S3 is pinned to avoid overlapping the swatch dock.

   `always`: the pill hides itself while html[data-hero-view='1'] stands,
   because the landing page's hero carries its own CTA. That flag is set in
   the layout for EVERY route and removed by the motion layer - which the
   room pages do not run, so without this the pill was hidden there forever.
   A page with no hero passes `always` and keeps its one action. */
export function StickyCta({ always = false }: { always?: boolean }) {
  return (
    <a
      className={`${s.sticky} ${always ? s.stickyAlways : ''}`}
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Request a quote from Heaven Furniture Mart on WhatsApp"
    >
      <WhatsApp />
      Quote
    </a>
  )
}
