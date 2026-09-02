import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * THE ROYAL SOFA — Heaven's own piece, drawn from four reference elevations.
 *
 * WHY THIS FILE IS SEPARATE FROM piece-geometry.ts.
 * Every other piece on this page is built from ONE primitive: a box with
 * radiused edges. That language is honest for modern upholstery and it is
 * cheap, and five pieces share about two hundred lines because of it.
 *
 * This piece cannot be built that way, and pretending otherwise would have
 * produced the thing the whole redesign exists to avoid — a generic sofa.
 * Heaven's actual signature piece is a Louis XV canapé: a gilded frame that
 * runs as one continuous ribbon from the front foot, over the arm, across a
 * serpentine back and down the far side; cabriole legs that are an S-curve in
 * two planes at once; a carved palmette at the crest. None of that is a box.
 *
 * So this file adds a second, richer primitive — SWEEP — and builds the piece
 * the way a frame-maker does: bend a moulding along a path.
 *
 *   sweep(profile, path)  →  drag a small 2D cross-section along a 3D curve.
 *
 * That one function produces the frame ribbon, all four rails, and all four
 * cabriole legs. It is the difference between "a box with gold paint" and
 * something a Chattogram workshop would recognise as their own joinery.
 *
 * WHAT IT DOES NOT DO, said plainly: it does not carve. The acanthus leaves
 * on the real crest and the seat-rail cartouche are sculpture, and no amount
 * of parametric code will produce them. What this does instead is get the
 * SILHOUETTE right — the serpentine crest, the pierced palmette outline, the
 * scrolled cabriole foot — because at hero scale (the piece is ~600 px on a
 * phone, turning, under one hard light) silhouette is the entire read. Nobody
 * has ever recognised a sofa by its leaf veins.
 *
 * Sources: assets-raw/sofa-views/{front,left,right,rear-2}.jpeg — read as
 * elevations. The numbers below were measured off those frames, converted at
 * the scale implied by a 2100 mm overall width, then rounded to something a
 * workshop could cut to.
 *
 * Units are METRES. Origin is on the FLOOR, centred in x and z, matching
 * every other piece so the stage's normalisation and the AR export need no
 * special case.
 */

/* ------------------------------------------------------------- dimensions */

/** arm outer to arm outer — the number the hero's dimension line prints */
const WIDTH = 2.1
/** the gilt frame's centreline planes */
const BACK_Z = -0.375
const FRONT_Z = 0.358
const ARM_X = 1.012
/** where a leg meets its rail */
const LEG_X = 0.945

/** frame moulding cross-section: through-thickness × face height */
const MOULD_T = 0.052
const MOULD_H = 0.082

/**
 * THE CREST, measured off the rear elevation.
 *
 * Half profile only — the piece is symmetric, and storing half means the two
 * sides can never drift apart. x is distance from centre, y is the frame
 * centreline height. The wave at 0.545/0.655 is not noise: it is the small
 * ogee every canapé of this family carries between the shoulder and the
 * corner, and dropping it was the first thing that made a test build read as
 * "arch", not "rococo".
 */
const CREST: ReadonlyArray<readonly [number, number]> = [
  [0.0, 1.0],
  [0.13, 0.992],
  [0.29, 0.958],
  [0.43, 0.902],
  [0.545, 0.882],
  [0.655, 0.908],
  [0.79, 0.876],
  [0.91, 0.862],
  [0.985, 0.852],
]

/** the crest height at any x, by linear interpolation of the measured half */
function crestY(x: number): number {
  const a = Math.min(Math.abs(x), CREST[CREST.length - 1][0])
  for (let i = 1; i < CREST.length; i++) {
    const [x0, y0] = CREST[i - 1]
    const [x1, y1] = CREST[i]
    if (a <= x1) return y0 + ((y1 - y0) * (a - x0)) / (x1 - x0)
  }
  return CREST[CREST.length - 1][1]
}

/* --------------------------------------------------------------- primitive */

/**
 * Parallel-transport frames along a curve.
 *
 * three ships computeFrenetFrames and it is the wrong tool here. Frenet frames
 * are defined by CURVATURE, so on any straight run — and the back rail is
 * nearly straight for a third of its length — the normal is undefined and the
 * moulding spins on its own axis. Parallel transport instead carries one
 * starting normal along the path, rotating it only by the minimum amount each
 * step needs, which is exactly what a bent length of timber does.
 *
 * The seed is chosen from the tangent at t=0, so every caller below starts its
 * curve on a horizontal run: that makes the profile's y axis vertical, which
 * is what keeps the moulding's face pointing outward all the way round.
 */
function transportFrames(curve: THREE.Curve<THREE.Vector3>, steps: number) {
  const points: THREE.Vector3[] = []
  const tangents: THREE.Vector3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    points.push(curve.getPoint(t))
    tangents.push(curve.getTangent(t).normalize())
  }

  const up = new THREE.Vector3(0, 1, 0)
  const n = new THREE.Vector3().crossVectors(tangents[0], up)
  if (n.lengthSq() < 1e-8) {
    n.crossVectors(tangents[0], new THREE.Vector3(0, 0, 1))
  }
  n.normalize()

  const normals: THREE.Vector3[] = []
  const binormals: THREE.Vector3[] = []
  const axis = new THREE.Vector3()

  for (let i = 0; i <= steps; i++) {
    if (i > 0) {
      axis.crossVectors(tangents[i - 1], tangents[i])
      if (axis.lengthSq() > 1e-12) {
        axis.normalize()
        const dot = THREE.MathUtils.clamp(tangents[i - 1].dot(tangents[i]), -1, 1)
        n.applyAxisAngle(axis, Math.acos(dot))
      }
      /* re-orthogonalise: floating point drift over ninety steps is enough to
         visibly shear the moulding by the far end */
      n.addScaledVector(tangents[i], -n.dot(tangents[i])).normalize()
    }
    normals.push(n.clone())
    binormals.push(new THREE.Vector3().crossVectors(tangents[i], n).normalize())
  }

  return { points, normals, binormals }
}

/**
 * Drag a closed 2D profile along a 3D path — the whole frame in one function.
 *
 * `scaleAt` is what turns a constant-section moulding into a cabriole leg:
 * return a smaller number near the ankle and the same path becomes a turned,
 * tapered leg rather than a bent pipe.
 *
 * Winding: (normal, binormal, tangent) is right-handed, so a counter-clockwise
 * profile gives outward-facing quads with the order (a,b,c)(a,c,d). Verified
 * by hand on a unit case before anything else in this file was written —
 * getting it backwards produces a sofa that is inside out only under shadow,
 * which is a miserable thing to debug later.
 */
function sweep(
  profile: ReadonlyArray<THREE.Vector2>,
  curve: THREE.Curve<THREE.Vector3>,
  steps: number,
  scaleAt: (t: number) => number = () => 1,
): THREE.BufferGeometry {
  const { points, normals, binormals } = transportFrames(curve, steps)
  const n = profile.length
  const pos: number[] = []

  for (let i = 0; i <= steps; i++) {
    const s = scaleAt(i / steps)
    const p = points[i]
    const nm = normals[i]
    const bn = binormals[i]
    for (const q of profile) {
      pos.push(
        p.x + nm.x * q.x * s + bn.x * q.y * s,
        p.y + nm.y * q.x * s + bn.y * q.y * s,
        p.z + nm.z * q.x * s + bn.z * q.y * s,
      )
    }
  }

  const idx: number[] = []
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < n; j++) {
      const k = (j + 1) % n
      const a = i * n + j
      const b = i * n + k
      const c = (i + 1) * n + k
      const d = (i + 1) * n + j
      idx.push(a, b, c, a, c, d)
    }
  }

  /* caps, as fans around each end's centre point */
  const startCentre = pos.length / 3
  pos.push(points[0].x, points[0].y, points[0].z)
  const endCentre = pos.length / 3
  pos.push(points[steps].x, points[steps].y, points[steps].z)

  for (let j = 0; j < n; j++) {
    const k = (j + 1) % n
    idx.push(startCentre, k, j)
    idx.push(endCentre, steps * n + j, steps * n + k)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/** a rounded-rectangle profile, counter-clockwise, for sweep() */
function mouldProfile(w: number, h: number, r: number, seg = 3): THREE.Vector2[] {
  const x = w / 2 - r
  const y = h / 2 - r
  const pts: THREE.Vector2[] = []
  const corners: [number, number, number][] = [
    [x, y, 0],
    [-x, y, Math.PI / 2],
    [-x, -y, Math.PI],
    [x, -y, Math.PI * 1.5],
  ]
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (Math.PI / 2) * (i / seg)
      pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cy + Math.sin(a) * r))
    }
  }
  return pts
}

/** smoothstep, used everywhere a taper or a falloff needs to not have a corner */
function smooth(t: number): number {
  const c = THREE.MathUtils.clamp(t, 0, 1)
  return c * c * (3 - 2 * c)
}

/* ------------------------------------------------------------ the ribbon */

/**
 * Half of the gilt frame, from the crest centre out to the front foot.
 *
 * ONE PATH, not seven parts. On the real piece this is a single bent-and-
 * jointed run of timber, and building it as separate arm/back/upright meshes
 * put a visible seam at every junction — three places per side where the
 * highlight breaks. Sweeping one curve gives one unbroken specular line from
 * the crest to the floor, which is the thing your eye actually reads as
 * "gilded frame" rather than "gold-painted parts".
 *
 * The seam that remains is at the crest centre, where the two halves meet.
 * That is deliberate: the palmette sits exactly there and hides it.
 */
function ribbonCurve(sign: number): THREE.CatmullRomCurve3 {
  const p: [number, number, number][] = [
    /* across the back, following the measured crest */
    [0.0, 1.0, BACK_Z],
    [0.13, 0.992, BACK_Z],
    [0.29, 0.958, BACK_Z],
    [0.43, 0.902, BACK_Z],
    [0.545, 0.882, BACK_Z],
    [0.655, 0.908, BACK_Z],
    [0.79, 0.876, BACK_Z],
    [0.91, 0.862, BACK_Z],
    /* the back corner turns forward */
    [0.985, 0.852, BACK_Z + 0.012],
    [1.005, 0.84, BACK_Z + 0.055],
    [ARM_X, 0.812, BACK_Z + 0.15],
    /* along the top of the arm, falling toward the front */
    [ARM_X, 0.782, -0.085],
    [1.01, 0.75, 0.06],
    [1.002, 0.716, 0.19],
    [0.988, 0.678, 0.286],
    /* down the front face of the arm to the seat rail */
    [0.968, 0.612, 0.342],
    [0.952, 0.51, 0.36],
    [0.946, 0.4, 0.362],
    [LEG_X, 0.32, 0.36],
  ]
  return new THREE.CatmullRomCurve3(
    p.map(([x, y, z]) => new THREE.Vector3(x * sign, y, z)),
    false,
    'centripetal',
    0.5,
  )
}

/** a serpentine rail: ends high, belly low, so the frame never reads as a box */
function railCurve(
  from: THREE.Vector3,
  to: THREE.Vector3,
  dip: number,
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = []
  const steps = 8
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = t * 2 - 1
    const v = new THREE.Vector3().lerpVectors(from, to, t)
    /* a cosine belly, not a parabola: the real rail is flat near the legs and
       drops away in the middle third */
    v.y -= dip * (0.5 + 0.5 * Math.cos(u * Math.PI))
    pts.push(v)
  }
  return new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5)
}

/**
 * A cabriole leg: knee out, ankle in, foot flicked out again — the S that
 * every Louis XV piece stands on, and the single silhouette that says
 * "period" from across a room.
 *
 * The S runs in x AND z at once, because the leg is at a corner and splays
 * diagonally. Scaling both by the same factor keeps it pointing away from the
 * body's centre without any trigonometry.
 */
function cabrioleCurve(sx: number, cz: number): THREE.CatmullRomCurve3 {
  const p: [number, number, number][] = [
    [0.945, 0.33, 1.0],
    [0.985, 0.25, 1.09],
    [0.992, 0.18, 1.1],
    [0.94, 0.105, 1.02],
    [0.93, 0.055, 1.0],
    [0.968, 0.014, 1.07],
    [0.995, 0.0, 1.12],
  ]
  return new THREE.CatmullRomCurve3(
    p.map(([x, y, f]) => new THREE.Vector3(x * sx, y, cz * f)),
    false,
    'centripetal',
    0.5,
  )
}

/** thick at the knee, thin at the ankle, a small bulb at the scrolled foot */
function legTaper(t: number): number {
  return t < 0.62
    ? THREE.MathUtils.lerp(1, 0.5, smooth(t / 0.62))
    : THREE.MathUtils.lerp(0.5, 0.82, smooth((t - 0.62) / 0.38))
}

/* ------------------------------------------------------------- the carving */

/**
 * The palmette at the crest, and the cartouche under the seat rail.
 *
 * This is the honest compromise of the whole file. The reference has hand-
 * carved acanthus with undercut leaves; what this draws is its OUTLINE — a
 * three-lobed fan flanked by two C-scrolls, with the two pierced eyes the
 * real one has. Extruded 45 mm with a bevel so it catches the key light along
 * its edge exactly as carved wood does.
 *
 * Splined rather than polygonal: at 140 mm tall a polyline reads as a paper
 * cut-out, and the one thing rococo is never is angular.
 */
/**
 * The right half of the ornament as quadratic segments: control point, then
 * end point. The left half is this list walked backwards with x negated, so
 * the two sides can never drift — one paper pattern, flipped, exactly as the
 * carver does it.
 *
 * Quadratics rather than a spline through sampled points: the first version
 * splined through twelve close-set coordinates, the curve overshot every one
 * of them, and three soft lobes came out as a saw blade — visible even at
 * 40 px on screen. Here each segment states its own control point, so a lobe
 * bulges exactly as far as it is told to and no further.
 */
const PALMETTE: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.03, 0.148, 0.046, 0.112], /* apex shoulder */
  [0.058, 0.08, 0.08, 0.096], /* the notch, then lobe two */
  [0.104, 0.11, 0.113, 0.07],
  [0.122, 0.04, 0.153, 0.053], /* lobe three */
  [0.191, 0.067, 0.205, 0.028], /* the scroll shoulder */
  [0.217, -0.003, 0.186, -0.011], /* and its curl under */
  [0.14, -0.021, 0.07, -0.03],
]

function palmetteShape(): THREE.Shape {
  const shape = new THREE.Shape()
  const n = PALMETTE.length

  shape.moveTo(0, 0.15)
  for (const [cx, cy, x, y] of PALMETTE) shape.quadraticCurveTo(cx, cy, x, y)
  shape.lineTo(0, -0.034)

  shape.lineTo(-PALMETTE[n - 1][2], PALMETTE[n - 1][3])
  for (let i = n - 1; i >= 1; i--) {
    const [cx, cy] = PALMETTE[i]
    const [, , px, py] = PALMETTE[i - 1]
    shape.quadraticCurveTo(-cx, cy, -px, py)
  }
  shape.quadraticCurveTo(-PALMETTE[0][0], PALMETTE[0][1], 0, 0.15)

  /* the two piercings. Without them the ornament reads as a solid blob and
     the light has nothing to pass through — piercing is most of what makes
     carved wood look carved at a distance. */
  for (const cx of [-0.058, 0.058]) {
    const hole = new THREE.Path()
    hole.absarc(cx, 0.044, 0.019, 0, Math.PI * 2, false)
    shape.holes.push(hole)
  }

  return shape
}

/** extrude, weld, smooth — the same three moves every solid in this project makes */
function carving(shape: THREE.Shape, depth: number, bevel: number): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth - 2 * bevel,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: 0,
    bevelSegments: 2,
    curveSegments: 8,
    steps: 1,
  })
  geo.translate(0, 0, -(depth - 2 * bevel) / 2)
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  const welded = mergeVertices(geo)
  geo.dispose()
  welded.computeVertexNormals()
  return welded
}

/* ---------------------------------------------------------- the upholstery */

/**
 * A stuffed panel on a grid — the back panel and both tufted arms.
 *
 * It has to be a grid rather than an extruded outline for one reason:
 * BUTTONS. ExtrudeGeometry triangulates a face with the minimum number of
 * triangles, so a flat panel comes back with vertices only at its border and
 * there is nothing in the middle to pull inward. Tufting needs interior
 * vertices, so the interior gets generated explicitly.
 *
 * The panel lies in XY with its thickness in Z; callers rotate it into place.
 * Front face is puffed and dimpled, back face is flat, and the two are
 * stitched at the rim so the result is a closed solid that casts a shadow.
 */
function stuffedPanel(opts: {
  width: number
  /** height at a given u ∈ [-1,1] across the width — a serpentine top edge */
  height: (u: number) => number
  thickness: number
  segX: number
  segY: number
  /** how far the front face bellies out beyond the flat thickness */
  puff: number
  tuft?: { cols: number; rows: number; depth: number; radius: number }
}): THREE.BufferGeometry {
  const { width, height, thickness, segX, segY, puff, tuft } = opts

  /** buttons on a diamond lattice, in normalised (u, v) panel space */
  const buttons: [number, number][] = []
  if (tuft) {
    for (let r = 0; r < tuft.rows; r++) {
      const v = (r + 0.5) / tuft.rows
      const stagger = r % 2 === 0 ? 0 : 0.5
      for (let c = 0; c < tuft.cols; c++) {
        const u = ((c + 0.5 + stagger) / tuft.cols) * 2 - 1
        if (Math.abs(u) > 0.92) continue
        buttons.push([u, v])
      }
    }
  }

  const front: number[] = []
  const back: number[] = []
  const at = (i: number, j: number) => {
    const u = (i / segX) * 2 - 1
    const v = j / segY
    const h = height(u)
    const x = (u * width) / 2
    const y = v * h
    /* fade the puff out at every edge so the panel meets its frame flush */
    const edge = smooth(Math.min(1, (1 - Math.abs(u)) / 0.14)) * smooth(Math.min(1, Math.min(v, 1 - v) / 0.14))
    let z = thickness / 2 + puff * edge
    if (tuft) {
      for (const [bu, bv] of buttons) {
        const du = (u - bu) * width * 0.5
        const dv = (v - bv) * h
        const d2 = du * du + dv * dv
        z -= tuft.depth * Math.exp(-d2 / (tuft.radius * tuft.radius)) * edge
      }
    }
    return { x, y, z }
  }

  for (let j = 0; j <= segY; j++) {
    for (let i = 0; i <= segX; i++) {
      const p = at(i, j)
      front.push(p.x, p.y, p.z)
      back.push(p.x, p.y, -thickness / 2)
    }
  }

  const pos = [...front, ...back]
  const row = segX + 1
  const offset = front.length / 3
  const idx: number[] = []

  for (let j = 0; j < segY; j++) {
    for (let i = 0; i < segX; i++) {
      const a = j * row + i
      const b = a + 1
      const c = a + row + 1
      const d = a + row
      idx.push(a, b, c, a, c, d)
      idx.push(offset + a, offset + c, offset + b, offset + a, offset + d, offset + c)
    }
  }

  /* rim: walk the border once, stitching front to back */
  const border: number[] = []
  for (let i = 0; i <= segX; i++) border.push(i)
  for (let j = 1; j <= segY; j++) border.push(j * row + segX)
  for (let i = segX - 1; i >= 0; i--) border.push(segY * row + i)
  for (let j = segY - 1; j >= 1; j--) border.push(j * row)
  for (let k = 0; k < border.length; k++) {
    const a = border[k]
    const b = border[(k + 1) % border.length]
    idx.push(a, offset + a, offset + b, a, offset + b, b)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/**
 * A loose cushion or pillow: a box grid inflated along its own normals.
 *
 * The falloff is the whole thing. Inflating uniformly gives a balloon;
 * inflating with a cosine that dies at the seams gives the pinched corners
 * and taut middle that a filled cushion actually has.
 */
function stuffedBox(w: number, h: number, d: number, seg: number, puff: number): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(w, h, d, seg, seg, seg)
  const pos = geo.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const fx = Math.cos((v.x / w) * Math.PI)
    const fy = Math.cos((v.y / h) * Math.PI)
    const fz = Math.cos((v.z / d) * Math.PI)
    /* each axis swells by how far the OTHER two are from their seams */
    pos.setXYZ(
      i,
      v.x + Math.sign(v.x) * puff * Math.max(0, fy * fz),
      v.y + Math.sign(v.y) * puff * Math.max(0, fx * fz),
      v.z + Math.sign(v.z) * puff * Math.max(0, fx * fy),
    )
  }
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  const welded = mergeVertices(geo)
  geo.dispose()
  welded.computeVertexNormals()
  return welded
}

/* --------------------------------------------------------------- materials */

/**
 * Gilded wood, not gold metal.
 *
 * Full metalness at low roughness gives a mirror, and a mirrored sofa frame
 * looks like a trophy. Gold leaf over gesso is a metal film with tooling marks
 * under it: high metalness, but roughness up near 0.4, which keeps the
 * highlight a soft band travelling along the moulding instead of a hard line.
 * That travelling band IS the reason the frame is swept as one path.
 */
function giltMaterial(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    name: 'metal-gilt',
    color: new THREE.Color('#C2A063'),
    metalness: 0.9,
    roughness: 0.38,
  })
}

/**
 * Velvet. Named 'fabric-…' because collectFabrics() in StageCanvas finds
 * upholstery by that prefix — so the bespoke swatch dock re-dyes this sofa's
 * velvet and leaves its gilt frame alone, which is exactly the right story:
 * the frame is Heaven's, the fabric is yours.
 */
function velvetMaterial(hex: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    name: 'fabric-royal-velvet',
    color: new THREE.Color(hex),
    roughness: 0.95,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.3,
    sheenColor: new THREE.Color(hex),
    clearcoat: 0.03,
    clearcoatRoughness: 0.9,
  })
}

/* ------------------------------------------------------------------- build */

type Placed = {
  geo: THREE.BufferGeometry
  pos?: [number, number, number]
  rot?: [number, number, number]
}

/**
 * Assemble the piece.
 *
 * Order below follows how it is actually made: frame first, then the rails it
 * sits on, then the legs, then the carving, then everything soft dropped into
 * the carcass last.
 */
export function buildRoyalSofa(fabricHex: string): THREE.Group {
  const gilt = giltMaterial()
  const velvet = velvetMaterial(fabricHex)

  const hard: Placed[] = []
  const soft: Placed[] = []

  /* --- the frame ribbon, both halves ------------------------------------ */
  const mould = mouldProfile(MOULD_T, MOULD_H, 0.02)
  for (const sign of [1, -1]) {
    hard.push({ geo: sweep(mould, ribbonCurve(sign), 84) })
  }

  /* --- the four rails --------------------------------------------------- */
  const railMould = mouldProfile(MOULD_T, 0.09, 0.022)
  hard.push({
    geo: sweep(
      railMould,
      railCurve(
        new THREE.Vector3(-LEG_X, 0.32, FRONT_Z),
        new THREE.Vector3(LEG_X, 0.32, FRONT_Z),
        0.062,
      ),
      36,
    ),
  })
  hard.push({
    geo: sweep(
      railMould,
      railCurve(
        new THREE.Vector3(-LEG_X, 0.33, BACK_Z),
        new THREE.Vector3(LEG_X, 0.33, BACK_Z),
        0.058,
      ),
      36,
    ),
  })
  for (const sx of [1, -1]) {
    hard.push({
      geo: sweep(
        railMould,
        railCurve(
          new THREE.Vector3(sx * 0.95, 0.325, FRONT_Z),
          new THREE.Vector3(sx * 0.95, 0.335, BACK_Z),
          0.028,
        ),
        24,
      ),
    })
  }

  /* --- four cabriole legs ----------------------------------------------- */
  const legMould = mouldProfile(0.078, 0.078, 0.03, 4)
  for (const sx of [1, -1]) {
    for (const cz of [FRONT_Z, BACK_Z]) {
      hard.push({ geo: sweep(legMould, cabrioleCurve(sx, cz), 28, legTaper) })
    }
  }

  /* --- the carving ------------------------------------------------------ */
  const palmette = palmetteShape()
  hard.push({
    geo: carving(palmette, 0.05, 0.008),
    pos: [0, 1.0, BACK_Z],
  })
  /* the same ornament inverted becomes the seat-rail cartouche — which is how
     the real cabinetmaker does it too, from one carved pattern */
  hard.push({
    geo: carving(palmette, 0.045, 0.007),
    pos: [0, 0.262, FRONT_Z],
    rot: [0, 0, Math.PI],
  })
  hard.push({
    geo: carving(palmette, 0.045, 0.007),
    pos: [0, 0.276, BACK_Z],
    rot: [0, 0, Math.PI],
  })

  /* --- the back panel --------------------------------------------------- */
  soft.push({
    geo: stuffedPanel({
      /* wide enough to run BEHIND both arms. At 1.90 it stopped just short of
         them and left a slot of black daylight at each end, which read as a
         gap in the carcass rather than as depth. */
      width: 1.96,
      /* the panel's own top edge is the measured crest, dropped by the
         moulding's half-height so the fabric tucks UNDER the frame rather
         than fighting it for the same millimetre */
      height: (u) => crestY(u * 0.95) - 0.055 - 0.3,
      thickness: 0.11,
      segX: 44,
      segY: 20,
      puff: 0.05,
    }),
    pos: [0, 0.3, BACK_Z + 0.075],
  })

  /* --- the tufted arm panels -------------------------------------------- */
  for (const sx of [1, -1]) {
    /*
      THE ARM FOLLOWS ITS FRAME, which sounds obvious and was not what the
      first build did. A constant-height slab sat level while the gilt ribbon
      above it fell away toward the front, so by the front foot the upholstery
      stood a hundred millimetres PROUD of the frame that is supposed to
      contain it — a grey box poking out through the gold.

      A quarter turn about y maps the panel's local +x to world -z when sx is
      positive and to +z when it is negative, so `back` below is +1 at the
      rear on both sides and the same height curve serves each arm.
    */
    const armHeight = (u: number) => {
      const back = sx > 0 ? u : -u
      return THREE.MathUtils.lerp(0.25, 0.42, (back + 1) / 2)
    }
    soft.push({
      geo: stuffedPanel({
        width: 0.7,
        height: armHeight,
        /* thick enough to be a volume rather than a card: at 100 mm the arms
           read as panels leaning against the frame */
        thickness: 0.15,
        segX: 34,
        segY: 24,
        puff: 0.045,
        /* buttons had to get deeper AND wider before they survived being
           drawn 40 px tall; at 30 mm they vanished entirely on a phone */
        tuft: { cols: 3, rows: 3, depth: 0.045, radius: 0.09 },
      }),
      /* inset behind the ribbon's inner face, not flush with it */
      pos: [sx * 0.912, 0.42, -0.01],
      rot: [0, (sx * Math.PI) / 2, 0],
    })
  }

  /* --- the seat --------------------------------------------------------- */
  soft.push({
    /* runs arm to arm and front rail to back panel: a seat that stops short
       of either leaves a shadow gap that reads as a missing cushion */
    geo: stuffedBox(1.71, 0.17, 0.7, 8, 0.04),
    pos: [0, 0.39, -0.005],
  })

  /* --- three loose pillows ---------------------------------------------- */
  soft.push({
    geo: stuffedBox(0.42, 0.42, 0.14, 6, 0.05),
    pos: [-0.47, 0.665, -0.13],
    rot: [-0.2, 0.12, 0.14],
  })
  soft.push({
    geo: stuffedBox(0.42, 0.42, 0.14, 6, 0.05),
    pos: [0.47, 0.665, -0.13],
    rot: [-0.2, -0.12, -0.14],
  })
  soft.push({
    geo: stuffedBox(0.5, 0.26, 0.14, 6, 0.045),
    pos: [0.0, 0.6, 0.02],
    rot: [-0.14, 0, 0],
  })

  const group = new THREE.Group()
  group.name = 'piece-royal'

  const add = (parts: Placed[], mat: THREE.Material) => {
    for (const part of parts) {
      const mesh = new THREE.Mesh(part.geo, mat)
      if (part.pos) mesh.position.set(...part.pos)
      if (part.rot) mesh.rotation.set(...part.rot)
      mesh.castShadow = true
      mesh.receiveShadow = true
      group.add(mesh)
    }
  }

  add(hard, gilt)
  add(soft, velvet)

  /*
    NORMALISE, so the drawing and the object agree.

    A swept frame has no tidy analytic bounding box: the moulding's own
    cross-section sticks out past its path by half its thickness, and how far
    depends on which way the path is pointing at that moment. The first build
    measured 2090 mm wide and sank 30 mm through the floor, because the
    cabriole toe's profile extends below the point its curve ends on.

    Rather than hand-tune eighteen control points until the arithmetic lands,
    measure the finished thing and correct it: sit it on the floor, centre it
    in x and z, then scale by half a percent so the width is EXACTLY the
    2100 mm the dimension line prints. Half a percent is invisible on a sofa
    and it is the difference between a drawing that measures its object and a
    drawing that is decorative.
  */
  const box = new THREE.Box3().setFromObject(group)
  const centre = box.getCenter(new THREE.Vector3())
  group.position.set(-centre.x, -box.min.y, -centre.z)
  group.updateMatrixWorld(true)

  const wrap = new THREE.Group()
  wrap.name = 'piece-royal'
  wrap.add(group)
  wrap.scale.setScalar(WIDTH / (box.max.x - box.min.x))

  return wrap
}

/**
 * Measured off the assembled, normalised group — printed by the hero's
 * dimension line, and used by the AR export to place the piece at true scale.
 * Re-run scripts/measure-piece if any control point above changes.
 */
export const ROYAL_SIZE = { width: WIDTH, depth: 0.884, height: 1.184 }
