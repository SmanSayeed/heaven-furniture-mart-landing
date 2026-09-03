import { night } from '@/content/copy'
import s from './night.module.css'

/**
 * THE MAP: a floor plan of the showroom, one-pixel lines, fixed in the
 * corner. Seven rooms, one per chapter. The room the visitor is in is lit,
 * the rooms they have passed stay lit, and the brass dot is them.
 *
 * Server-rendered SVG; NightMotion toggles data-here / data-lit on the
 * rooms and moves the dot. With no JS the first room is lit and the dot
 * waits at the door, which is a true statement about the page.
 *
 * Coordinates are a drawing, not data: the rooms are laid out as a plan
 * reads, entrance bottom-left, the ask top-right.
 */
const ROOMS: Record<
  (typeof night.chapters)[number]['id'],
  { x: number; y: number; w: number; h: number; dx: number; dy: number }
> = {
  room: { x: 4, y: 60, w: 44, h: 52, dx: 26, dy: 92 },
  studio: { x: 48, y: 20, w: 44, h: 44, dx: 70, dy: 42 },
  floor: { x: 92, y: 20, w: 80, h: 44, dx: 132, dy: 42 },
  table: { x: 48, y: 64, w: 90, h: 48, dx: 93, dy: 88 },
  maker: { x: 172, y: 20, w: 44, h: 44, dx: 194, dy: 42 },
  home: { x: 142, y: 64, w: 92, h: 48, dx: 188, dy: 88 },
  ask: { x: 216, y: 20, w: 40, h: 44, dx: 236, dy: 42 },
}

export function Map() {
  const first = night.chapters[0]
  return (
    <div className={s.map} data-map aria-hidden="true">
      <svg className={s.mapSvg} viewBox="0 0 260 116">
        {night.chapters.map((ch) => {
          const r = ROOMS[ch.id]
          return (
            <g
              key={ch.id}
              data-map-room={ch.id}
              data-x={r.dx}
              data-y={r.dy}
              {...(ch.id === first.id ? { 'data-here': '', 'data-lit': '' } : {})}
            >
              <rect x={r.x} y={r.y} width={r.w} height={r.h} />
              <text x={r.x + 4} y={r.y + 11}>
                {ch.no}
              </text>
            </g>
          )
        })}
        <circle className={s.you} data-map-you cx="0" cy="0" r="3" transform={`translate(${ROOMS.room.dx} ${ROOMS.room.dy})`} />
      </svg>
      <div className={s.mapLabel}>
        <span data-map-no>{first.no}</span>
        <span data-map-name>{first.name}</span>
      </div>
    </div>
  )
}
