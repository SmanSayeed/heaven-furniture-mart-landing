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
 * Five TALL PANELS of one size, travelling past on the scroll.
 *
 * They used to be prints of five different proportions, hung at five
 * heights and turned at five angles, overlapping on a diagonal. On paper
 * that is a gallery; on screen it was five photographs that never lined up,
 * with the names and the quick-look pills landing at five different heights
 * and colliding with each other (client: "this section is looking ugly -
 * make it professional, with long categories on scroll with proper view").
 *
 * So: one height, one width, one baseline. The room's number, its name and
 * its line sit INSIDE the panel, over a shade at the foot, which is why
 * nothing can collide with anything any more - each caption is inside the
 * photograph it belongs to.
 *
 * THE ONE MECHANIC is still one room alive at a time: the panel under the
 * pointer, or the one the scroll has brought to the middle, comes up to
 * full colour and full light while the rest hold back. What changed is that
 * holding back is now a dim rather than black and white - a wall of grey
 * photographs tells a furniture customer nothing about the furniture.
 *
 * The panel IS the link to that room's page (`view-transition-name` carries
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
      {catalogue.categories.map((cat) => {
        const drawn = cat.slug === 'bespoke'
        return (
          <article
            key={cat.slug}
            className={s.wcard}
            data-rcard
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
                <span className={s.frameLight} aria-hidden="true" />
                <CropMarks />
                {/* the caption lives INSIDE the photograph, over a shade of
                    its own. Nothing floats beside the panel, so nothing can
                    land on top of anything else at any width. */}
                <span className={s.panelShade} aria-hidden="true" />
                <span className={s.panelBody}>
                  <span className={s.panelNo}>{cat.num}</span>
                  <span className={s.panelName}>{cat.name}</span>
                  <span className={s.panelLead}>{cat.lead}</span>
                  <span className={s.panelGo}>
                    {f.open} <ArrowRight />
                  </span>
                </span>
              </span>
            </a>

            <div className={s.wcardFoot}>
              <p className={s.rcardDetail}>
                {plural(cat.pieces.length, 'piece', 'pieces')} · {night.menu.built}
              </p>
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
