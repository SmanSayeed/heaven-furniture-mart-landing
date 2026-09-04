import s from './night.module.css'

/**
 * THE PIECE, AS A DRAWING.
 *
 * What stood here before was a PHOTOGRAPH of a sofa, which is the wrong
 * object twice over: it is a different sofa from the one the 3D builds, and
 * it is a finished thing standing where an unfinished thing belongs, so a
 * visitor watched a real sofa turn into a wireframe and read it as a bug
 * (client, verbatim: "here showing another image at first - confusing").
 *
 * So the placeholder is now the same piece the 3D draws, in the same
 * hairlines, at the same moment of its making: a front elevation off the
 * drafting table this chapter is named for. When the real one arrives it
 * replaces a drawing of itself, which is the chapter's whole argument
 * ("Designed. Crafted. Customized.") rather than an interruption of it.
 *
 * It is also the FINAL state on a device with no WebGL: an elevation of a
 * 2100 x 820 x 950 sofa is a complete thing to be looking at, and the
 * dimension line underneath already prints those millimetres.
 *
 * Drawn to the real proportions - 2100 mm wide, 820 mm tall, seat at 450,
 * legs at 150 - so the drawing and the mesh are the same object. Pure
 * geometry, no request, no decode, no animation: it is on screen in the
 * server HTML and it never moves.
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

export function Skeleton() {
  /* 2100 x 820 mm at 0.181 units per mm; floor at y = 190 */
  return (
    <svg
      className={s.skeleton}
      viewBox="0 0 420 206"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      aria-hidden="true"
      focusable="false"
    >
      {/* the sheet: the floor the piece stands on, and the centre line every
          elevation is dimensioned from */}
      <path d="M4 190h412" strokeOpacity="0.3" />
      <path d="M210 22v176" strokeOpacity="0.12" strokeDasharray="3 7" />

      {/* THE BACK, full width and the tallest thing in the drawing - which is
          what separates a sofa from the cabinet a plain box would read as */}
      <path d="M26 152V44q0-10 10-10h348q10 0 10 10v108" strokeOpacity="0.6" />

      {/* the three back cushions, sitting on the seat line */}
      {BAYS.map((x) => (
        <rect key={`b${x}`} x={x} y="46" width={BAY_W} height="62" rx="6" strokeOpacity="0.34" />
      ))}

      {/* the seat deck, drawn right across between the arms */}
      <path d="M72 110h276" strokeOpacity="0.5" />

      {/* the three seat cushions, shallower than the back and pushed forward */}
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
        <path
          key={x}
          d={`M${x - 5} 163L${x - 3 + splay} 190h6L${x + 5} 163`}
          strokeOpacity="0.6"
        />
      ))}
    </svg>
  )
}
