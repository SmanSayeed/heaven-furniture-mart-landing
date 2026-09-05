import { brand } from '@/content/copy'
import s from './shared.module.css'

/**
 * THE CLIENT'S OWN LOGOTYPE, in the five places the page signs its name.
 *
 * It used to be set in type - `HE<span class="tri"/>VEN` over FURNITURE
 * MART - which was a good stand-in and a wrong one: the triangle in
 * Heaven's real mark is a drawn A with a winged crossbar, not a CSS border,
 * and the whole logotype is brass rather than ivory with a brass accent.
 * A furniture studio's page must sign its name in the studio's own hand
 * (client: "use this logo"), so this is their file, unretouched.
 *
 * 267 x 74 with a real alpha channel, so it sits on the dark header, the
 * ivory sheets and the footer without a plate behind it. That is also its
 * ceiling: it is displayed at ~120 CSS px, which is 240 device px on a 2x
 * screen - inside the file's own resolution. Do not set it larger without a
 * larger file, or the one thing on the page that must look made will look
 * stretched.
 *
 * `decorative` for the places where the surrounding link or region already
 * carries the brand name, so a screen reader is not told it twice.
 */
export function Wordmark({
  className = '',
  decorative = false,
}: {
  className?: string
  decorative?: boolean
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       a fixed-size static brand asset: next/image would add a runtime and a
       transform pipeline to a 27 KB PNG that never changes size. Same
       reasoning as Photo.tsx. */
    <img
      src="/brand/heaven-mart.png"
      alt={decorative ? '' : brand.name}
      {...(decorative ? { 'aria-hidden': true as const } : {})}
      width={267}
      height={74}
      draggable={false}
      className={`${s.wordmark} ${className}`.trim()}
    />
  )
}
