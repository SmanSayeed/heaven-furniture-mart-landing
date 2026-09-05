import s from './night.module.css'

/**
 * THE PIECE, DRAWN — AND THEN BUILT.
 *
 * This chapter's whole argument is three words: Designed, Crafted,
 * Customized. Until now only the WebGL piece could say them, so on any
 * device that did not get WebGL the chapter was three headings lighting up
 * over a stage where nothing happened (client: "on scroll texts are
 * highlighting only ... make sure with texts this 3d shape properly works
 * as per our idea"). A section whose subject is optional is not a section.
 *
 * So the DRAWING tells the story now, and the 3D is the upgrade on top of
 * it. Two stacked drawings of the same sofa:
 *
 *   lines  the elevation, always on, brightening as the chapter arrives
 *   fill   the same piece in wood and fabric, revealed BOTTOM-UP by
 *          `--sweep` - the same clip plane the 3D sweeps, done in CSS
 *
 * `--build` and `--sweep` are written by NightMotion from the scrubbed
 * progress; the fabric colour is the swatch the visitor picked, so choosing
 * a fabric re-dyes the drawing even where there is no 3D to re-dye.
 *
 * INVERSION LAW: with no JavaScript, no motion layer and reduced motion,
 * `--sweep` stays at its CSS default of 1 and this is simply the finished
 * piece, in colour, standing on the sheet.
 *
 * Drawn to the real proportions - 2100 mm wide, 820 mm tall, seat at 450,
 * legs at 150 - so the drawing and the mesh are the same object.
 */

/* the three cushion bays between the arms; one x each, in drawing units */
const BAYS = [76, 166, 256]
const BAY_W = 88

/* the four legs: x at the rail, and how far the foot splays outward */
const LEGS = [
  { x: 44, splay: -7 },
  { x: 152, splay: 0 },
  { x: 268, splay: 0 },
  { x: 376, splay: 7 },
]

/* the back slab, as one closed outline: 2100 mm across, top rail at 820 */
const BACK = 'M26 152V44q0-10 10-10h348q10 0 10 10v108Z'
const leg = (x: number, splay: number) => `M${x - 5} 163L${x - 3 + splay} 190h6L${x + 5} 163Z`

const VIEW = '0 0 420 206'

export function Skeleton() {
  return (
    <span className={s.skeletonWrap}>
      {/* ---- DESIGNED: the elevation, in hairlines ---- */}
      <svg
        className={s.skeletonLines}
        viewBox={VIEW}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        aria-hidden="true"
        focusable="false"
      >
        {/* the sheet: the floor the piece stands on, and the centre line
            every elevation is dimensioned from */}
        <path d="M4 190h412" strokeOpacity="0.3" />
        <path d="M210 22v176" strokeOpacity="0.12" strokeDasharray="3 7" />

        {/* THE BACK, full width and the tallest thing in the drawing - which
            is what separates a sofa from the cabinet a plain box reads as */}
        <path d={BACK} strokeOpacity="0.6" />

        {BAYS.map((x) => (
          <rect key={`b${x}`} x={x} y="46" width={BAY_W} height="62" rx="6" strokeOpacity="0.34" />
        ))}

        {/* the seat deck, drawn right across between the arms */}
        <path d="M72 110h276" strokeOpacity="0.5" />

        {BAYS.map((x) => (
          <rect key={`s${x}`} x={x} y="110" width={BAY_W} height="40" rx="6" strokeOpacity="0.5" />
        ))}

        {/* THE ARMS, in front of the back and lower than it. Two lines each:
            the block, and the roll along its top. */}
        <rect x="20" y="70" width="52" height="82" rx="12" strokeOpacity="0.8" />
        <rect x="348" y="70" width="52" height="82" rx="12" strokeOpacity="0.8" />
        <path d="M24 84h44M352 84h44" strokeOpacity="0.3" />

        {/* the base rail and four splayed legs, 150 mm of them */}
        <rect x="22" y="152" width="376" height="11" rx="3" strokeOpacity="0.6" />
        {LEGS.map(({ x, splay }) => (
          <path key={x} d={leg(x, splay)} strokeOpacity="0.6" />
        ))}
      </svg>

      {/* ---- CRAFTED + CUSTOMIZED: the same piece in wood and fabric.
              Clipped to nothing until the story reaches it, then swept up
              from the floor. Painter's order: slab, cushions, arms in
              front, rail and legs last. ---- */}
      <svg
        className={s.skeletonFill}
        viewBox={VIEW}
        aria-hidden="true"
        focusable="false"
      >
        {/* THE CLIP PLANE, in the DRAWING's own coordinates rather than the
            box's. The box is 4:3 and the elevation is 2:1, so it letterboxes
            - clipping the box would have spent a third of the sweep on empty
            space above and below the sofa. This rect's top edge is the plane:
            y 192 is the floor (nothing built), y 30 is above the back rail
            (all of it). Its `y` ATTRIBUTE is the built state, so a browser
            that does not support the CSS geometry property shows the
            finished piece rather than none of it. */}
        <defs>
          <clipPath id="hfm-build-sweep" clipPathUnits="userSpaceOnUse">
            <rect className={s.sweepPlane} x="0" y="30" width="420" height="200" />
          </clipPath>
        </defs>
        <g clipPath="url(#hfm-build-sweep)">
          <path d={BACK} className={s.fillWoodDark} />
          {BAYS.map((x) => (
            <rect key={`b${x}`} x={x} y="46" width={BAY_W} height="62" rx="6" className={s.fillFabric} />
          ))}
          {BAYS.map((x) => (
            <rect key={`s${x}`} x={x} y="110" width={BAY_W} height="40" rx="6" className={s.fillSeat} />
          ))}
          <rect x="20" y="70" width="52" height="82" rx="12" className={s.fillWood} />
          <rect x="348" y="70" width="52" height="82" rx="12" className={s.fillWood} />
          <rect x="22" y="152" width="376" height="11" rx="3" className={s.fillWoodDark} />
          {LEGS.map(({ x, splay }) => (
            <path key={x} d={leg(x, splay)} className={s.fillWoodDark} />
          ))}
        </g>
      </svg>
    </span>
  )
}
