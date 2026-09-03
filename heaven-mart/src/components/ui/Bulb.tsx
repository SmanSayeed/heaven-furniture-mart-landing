import s from '@/components/sections/sections.module.css'

/**
 * THE BULB (CONCEPT-V2): the hero's light source, made visible.
 *
 * Every stage on this page already obeys the One Light Law - one source,
 * top left, 45 degrees - but the source itself was never shown. Now it
 * hangs there: a cord from the top of the panel, a tungsten bulb, and a cone
 * of warm light falling down and to the right across the piece. It swings
 * a few degrees on a slow CSS keyframe, which is what makes the pool of
 * light on the floor read as LIGHT rather than as a gradient.
 *
 * Pure CSS, no JS: present and lit in the server HTML, swinging only when
 * motion is allowed (the keyframe is gated in the stylesheet). The 3D piece
 * renders on the fixed canvas above this, so the cone paints UNDER the
 * piece and reads as the light it stands in.
 */
export function Bulb() {
  return (
    <span className={s.bulb} aria-hidden="true" data-bulb>
      <span className={s.bulbCord} />
      <span className={s.bulbGlass} />
      <span className={s.bulbCone} />
    </span>
  )
}
