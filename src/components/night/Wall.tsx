import { catalogue, night } from '@/content/copy'
import { Photo, hasPhoto } from '@/components/ui/Photo'
import { CropMarks } from '@/components/ui/CropMarks'
import { CollectionModal } from '@/components/deck/CollectionModal'
import { ArrowRight } from '@/components/ui/Icons'
import s from './night.module.css'
import d from '@/components/deck/deck.module.css'
import { plural } from '@/lib/plural'

/**
 * THE GLASS WALL (PLAN-V6 PART B3, redrawn on the client's call).
 *
 * Five plates of different proportions, hung at different heights and
 * turned at different angles, overlapping as they cross the screen on a
 * diagonal - prints laid on a table rather than cards in a row.
 *
 * THE ONE MECHANIC: the whole wall is behind glass and in black and white.
 * The plate the visitor is looking at - the one under the pointer, or the
 * one the scroll has brought to the middle - slides its glass away and
 * comes up in FULL COLOUR. One room alive at a time is what makes five
 * photographs read as a gallery instead of a grid, and it is the page's
 * only use of colour outside the photographs themselves.
 *
 * The frame IS the link to that room's page (`view-transition-name` carries
 * the photograph into the page's own plate where the browser supports it).
 * The pill beneath is the quick look: the same room in a sheet, without
 * leaving the floor.
 *
 * The fifth plate is bespoke and is drawn rather than photographed.
 *
 * `mode`: 'rail' inside the floor chapter (a track NightMotion translates
 * on wide screens, a snap carousel on phones); 'grid' on /collections.
 */
export function Wall({ mode = 'rail' }: { mode?: 'rail' | 'grid' }) {
  const f = night.floor
  /* the drafting table is a chapter of the landing page: an anchor from the
     wall's own chapter, a route from anywhere else */
  const table = mode === 'grid' ? '/#table' : '#table'
  return (
    <div className={`${s.track} ${mode === 'grid' ? s.wallGrid : ''}`} data-track>
      {catalogue.categories.map((cat, i) => {
        const frame = f.frames[i] ?? f.frames[0]
        const drawn = cat.slug === 'bespoke'
        return (
          <article
            key={cat.slug}
            className={s.wcard}
            data-rcard
            style={
              {
                '--ratio': frame.ratio,
                '--lift': frame.lift,
                '--rot': frame.rot,
              } as React.CSSProperties
            }
          >
            <a
              className={`${s.frame} ${drawn ? s.frameDrawn : ''}`}
              data-frame
              href={`/collections/${cat.slug}`}
              style={{ viewTransitionName: `room-${cat.slug}` } as React.CSSProperties}
            >
              <span className={s.mat}>
                <span className={s.frameImg}>
                  {drawn ? (
                    <svg viewBox="0 0 200 110" aria-hidden="true">
                      <path d="M22 48 H178 V92 H22 Z" />
                      <path d="M10 34 H30 V92 H10 Z M170 34 H190 V92 H170 Z" />
                      <path d="M32 22 H168 V48 H32 Z" />
                      <path d="M24 92 V102 M176 92 V102 M100 48 V92" />
                      <path d="M40 106 H160" strokeDasharray="2 4" />
                    </svg>
                  ) : (
                    hasPhoto(cat.cover) && (
                      <Photo
                        name={cat.cover}
                        alt={`${cat.name} furniture by Heaven Furniture Mart.`}
                        sizes="(min-width: 900px) 30vw, 82vw"
                        low
                      />
                    )
                  )}
                </span>
                {/* the pane: frosted, faintly lit across the diagonal, and
                    gone the moment this plate is the one being looked at */}
                <span className={s.glass} aria-hidden="true" />
                <span className={s.frameLight} aria-hidden="true" />
                <CropMarks />
                <span className={s.frameOpen} aria-hidden="true">
                  <span>
                    {f.open} <ArrowRight />
                  </span>
                </span>
              </span>
              {/* the plaque is the link's name: "01 · Living Room Open the room" */}
              <span className={s.plaque}>
                {cat.num} · {cat.name}
              </span>
            </a>

            <div className={s.wcardFoot}>
              <div>
                <h3 className={s.rcardName}>{cat.name}</h3>
                <p className={s.rcardDetail}>
                  {plural(cat.pieces.length, 'piece', 'pieces')} · {night.menu.built}
                </p>
              </div>
              <div className={s.rcardAct}>
                {drawn ? (
                  <a className={`${d.pill} ${d.pillGhost}`} href={table}>
                    {f.bespokeCard.action}
                  </a>
                ) : (
                  <CollectionModal slug={cat.slug} inline label={f.view} />
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
