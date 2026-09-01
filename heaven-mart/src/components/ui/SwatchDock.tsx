'use client'

import { useState } from 'react'
import gsap from 'gsap'
import { setSwatch, type SwatchChoice } from '@/lib/stage-state'
import { prefersReducedMotion } from '@/lib/device'
import { whatsappUrlWithSwatch } from '@/lib/whatsapp'
import s from '@/components/sections/sections.module.css'

/**
 * The live fabric dock (S3, Customized phase). A small client island inside
 * the server-rendered Bespoke section; swatch data arrives as props from
 * copy.ts so the copy stays in one file.
 *
 * A tap does three things, and each works independently of the others:
 *  1. publishes the choice to stage-state (the 3D scene subscribes and tints
 *     the chair fabric; a no-op when 3D never mounted, e.g. low tier)
 *  2. tweens the page accent to the fabric's accent
 *  3. rewrites the bespoke CTA href so WhatsApp opens with the fabric named.
 * That order matters for the fallback promise: even with zero WebGL, taps
 * still recolour the page and carry the choice into the conversation.
 */
export function SwatchDock({ swatches }: { swatches: readonly SwatchChoice[] }) {
  /* default = the first swatch (Ivory Boucle), matching the scene's setup tint */
  const [activeId, setActiveId] = useState(swatches[0]?.id)

  const choose = (sw: SwatchChoice) => {
    setActiveId(sw.id)
    setSwatch(sw)
    gsap.to(document.documentElement, {
      '--accent': sw.accent,
      /* reduced motion: apply instantly, never animate */
      duration: prefersReducedMotion() ? 0 : 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    })
    /* only the bespoke CTA carries the fabric; hero/footer/sticky keep the
       generic message (they sit outside the customization story) */
    const cta = document.querySelector<HTMLAnchorElement>('[data-bespoke-cta] a')
    if (cta) cta.href = whatsappUrlWithSwatch(sw.name)
  }

  return (
    <div className={s.swatchDock} role="group" aria-label="Fabric options" data-swatch-dock>
      {swatches.map((sw) => (
        <button
          key={sw.id}
          type="button"
          className={s.swatch}
          aria-pressed={activeId === sw.id}
          onClick={() => choose(sw)}
        >
          <span className={s.swatchDot} style={{ background: sw.hex }} aria-hidden="true" />
          {sw.name}
        </button>
      ))}
    </div>
  )
}
