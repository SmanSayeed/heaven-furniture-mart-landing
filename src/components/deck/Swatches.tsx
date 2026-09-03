'use client'

import { useState } from 'react'
import { setSwatch, type SwatchChoice } from '@/lib/stage-state'
import { whatsappUrlWithSwatch } from '@/lib/whatsapp'
import s from './deck.module.css'

/**
 * The fabric dots on the bespoke plate. A tap re-dyes the 3D piece (through
 * the swatch store the scene subscribes to) and rewrites the plate's CTA so
 * WhatsApp opens naming the fabric. Both work without WebGL: the choice
 * still reaches the conversation.
 */
export function Swatches({ swatches }: { swatches: readonly SwatchChoice[] }) {
  const [activeId, setActiveId] = useState(swatches[0]?.id)

  const choose = (sw: SwatchChoice) => {
    setActiveId(sw.id)
    setSwatch(sw)
    const cta = document.querySelector<HTMLAnchorElement>('[data-bespoke-cta]')
    if (cta) cta.href = whatsappUrlWithSwatch(sw.name)
    /* the stage's light takes the fabric's accent (deck.module.css .stage3d
       reads --stage-glow), so the plate answers the tap even with no WebGL */
    document.getElementById('bespoke')?.style.setProperty('--stage-glow', sw.accent)
  }

  return (
    <div className={s.swatches} role="group" aria-label="Fabric">
      {swatches.map((sw) => (
        <button
          key={sw.id}
          type="button"
          className={s.swatch}
          style={{ background: sw.hex }}
          aria-pressed={activeId === sw.id}
          aria-label={sw.name}
          title={sw.name}
          onClick={() => choose(sw)}
        />
      ))}
    </div>
  )
}
