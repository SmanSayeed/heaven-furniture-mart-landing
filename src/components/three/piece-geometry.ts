import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildRoyalSofa, ROYAL_SIZE } from './royal-sofa'

/**
 * THE HOUSE PIECES — furniture generated from measurements, not downloaded.
 *
 * WHY THIS FILE EXISTS AT ALL.
 * Every piece on this page used to be a Khronos glTF sample asset. They are
 * beautiful, free and correctly licensed — and they are also the three models
 * that every 3D furniture demo on the internet reaches for. A competing entry
 * in this same hackathon shipped the identical blue GlamVelvetSofa. A hero
 * object that someone else can also have is not a hero object.
 *
 * So the pieces are now DRAWN, in code, from a shared parametric design
 * language: soft radiused upholstery volumes, a visible seat seam, tapered
 * legs. Three consequences, all of them wins:
 *
 *   1. Collision is impossible. Nobody else has this geometry.
 *   2. They weigh nothing. 1.8 MB of GLB and a Draco decode left the page.
 *   3. The dimension lines stop being trivia. A downloaded scan measures
 *      whatever it happens to measure; these are built from real furniture
 *      dimensions in metres, so "2100 MM" on the drawing is a width a
 *      workshop could actually cut to. On a page whose entire thesis is
 *      "drawn to measure", the piece being drawn to a measure is the point.
 *
 * Units are METRES, because glTF is metres and because AR places the piece at
 * true scale. Origin is at the FLOOR, centred in x and z; the stage
 * normalises from the measured bounding box, exactly as it did for the GLBs.
 */

/* ------------------------------------------------------------------ specs */

/**
 * THE RANGE, not the catalogue.
 *
 * The turntable used to show three pieces of SEATING - a sofa, an armchair
 * and a settee - which advertised Heaven as a sofa shop. They sell five
 * categories, and the brief's whole pitch is that they build whatever a room
 * needs. So the pieces now cover the same five categories the Collections
 * sheet does, and a visitor who never scrolls past the hero has still seen
 * the range.
 */
export type PieceKind = 'royal' | 'sofa' | 'bed' | 'dining' | 'desk' | 'armchair'

/** which builder a kind uses. Seating shares one layout; the rest have their
    own, because a bed is not a wide sofa and a table is not a legless one. */
type PieceFamily = 'royal' | 'seating' | 'bed' | 'dining' | 'desk'

const FAMILY: Record<PieceKind, PieceFamily> = {
  /* its own family of one: the only piece here built by sweeping a moulding
     along a path rather than by stacking radiused boxes. See royal-sofa.ts. */
  royal: 'royal',
  sofa: 'seating',
  armchair: 'seating',
  bed: 'bed',
  dining: 'dining',
  desk: 'desk',
}

export type PieceSpec = {
  /** seat cushions across the width; also drives the seam count */
  seats: number
  /** overall, arm to arm */
  width: number
  /** overall, front rail to back */
  depth: number
  /** floor to the top of the seat cushion — the one dimension a person feels */
  seatHeight: number
  /** floor to the top of the back */
  backHeight: number
  /** floor to the top of the arm; 0 = armless */
  armHeight: number
  armWidth: number
  legHeight: number
  /** how far the legs splay outward at the foot, per side */
  legSplay: number
  legMaterial: 'brass' | 'walnut'
  /** upholstery corner softness. Small = tailored, large = pillowy. */
  soften: number
  /** loose cushions along the back, the difference between a settee and a sofa */
  backCushions: boolean
}

/**
 * The three pieces the turntable shows. These are real furniture dimensions
 * (a 2.1 m three-seater, a 0.92 m occasional chair, a 1.62 m two-seat
 * settee), not numbers picked to look good in a caption.
 */
export const SEATING_SPECS: Record<'sofa' | 'armchair', PieceSpec> = {
  sofa: {
    seats: 3,
    width: 2.1,
    depth: 0.92,
    seatHeight: 0.44,
    backHeight: 0.81,
    armHeight: 0.64,
    armWidth: 0.18,
    legHeight: 0.15,
    legSplay: 0.05,
    legMaterial: 'brass',
    /* TAILORED, NOT INFLATED. At 0.05 with the multipliers below, every
       cushion's radius was a third of its own thickness and the piece
       rendered as a row of balloons - the exact look a bespoke studio is
       selling against. Bespoke upholstery has a seam and an edge. */
    soften: 0.038,
    backCushions: true,
  },
  armchair: {
    seats: 1,
    width: 0.94,
    depth: 0.9,
    seatHeight: 0.43,
    backHeight: 0.88,
    armHeight: 0.65,
    armWidth: 0.16,
    legHeight: 0.16,
    legSplay: 0.055,
    legMaterial: 'brass',
    soften: 0.042,
    backCushions: false,
  },
}

/* Kept for the AR export and the dimension lines, which both ask for a
   piece's overall size by kind. Real furniture dimensions throughout: a
   1900x2100 king bed, a 2200x1000 eight-seat dining table, a 1600x760
   executive desk. */
export const PIECE_SIZE: Record<PieceKind, { width: number; depth: number; height: number }> = {
  royal: ROYAL_SIZE,
  sofa: { width: 2.1, depth: 0.92, height: 0.81 },
  armchair: { width: 0.94, depth: 0.9, height: 0.88 },
  bed: { width: 1.9, depth: 2.12, height: 1.12 },
  dining: { width: 2.2, depth: 1.0, height: 0.76 },
  desk: { width: 1.6, depth: 0.78, height: 0.76 },
}

/* -------------------------------------------------------------- primitives */

/**
 * A rounded rectangle as a Shape, corner radius r.
 * Drawn counter-clockwise from the right edge so the extrude winds correctly.
 */
function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const x = w / 2
  const y = h / 2
  const rad = Math.max(0.0005, Math.min(r, x - 0.0005, y - 0.0005))
  const shape = new THREE.Shape()
  shape.moveTo(x, -y + rad)
  shape.lineTo(x, y - rad)
  shape.absarc(x - rad, y - rad, rad, 0, Math.PI / 2, false)
  shape.lineTo(-x + rad, y)
  shape.absarc(-x + rad, y - rad, rad, Math.PI / 2, Math.PI, false)
  shape.lineTo(-x, -y + rad)
  shape.absarc(-x + rad, -y + rad, rad, Math.PI, Math.PI * 1.5, false)
  shape.lineTo(x - rad, -y)
  shape.absarc(x - rad, -y + rad, rad, Math.PI * 1.5, Math.PI * 2, false)
  return shape
}

/**
 * A box with every one of its twelve edges radiused — the single primitive
 * this whole design language is built from.
 *
 * THE ARITHMETIC MATTERS, because the dimension line prints the result. The
 * extruded shape is inset by the bevel on all four sides and the extrusion
 * depth is inset by the bevel at both ends, so the finished solid measures
 * exactly (w, h, d) and a cushion asked for 580 mm is 580 mm. Getting this
 * wrong would silently inflate every piece by two bevels and make the drawing
 * lie about the object beside it.
 *
 * Returned centred on its own origin; callers place it.
 */
function roundedBox(w: number, h: number, d: number, r: number, seg = 3): THREE.BufferGeometry {
  const b = Math.max(0.001, Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001))
  const shape = roundedRect(w - 2 * b, h - 2 * b, b)
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: d - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: 0,
    bevelSegments: seg,
    curveSegments: seg * 2,
    steps: 1,
  })
  geo.center()

  /*
    WELD, THEN SMOOTH — and in that order, for two separate reasons.

    Size: ExtrudeGeometry emits unindexed triangle soup. One cushion measured
    2484 vertices for 828 triangles, a three-times duplication of every
    position in the piece; welding takes the whole sofa from 25k vertices to
    about 4k, which is a sixth of the GPU buffers at runtime and the
    difference between an 800 KB and a 130 KB GLB in the AR export.

    Looks: mergeVertices compares every attribute, so the uv and the extruder's
    flat per-face normals have to go first or nothing coincident ever matches.
    Recomputing normals on the WELDED geometry then smooths straight across
    the bevels — which is exactly what upholstery is. Fabric over foam has no
    hard edge anywhere on it; leaving the facets in was the single thing that
    made an early version of these pieces read as chamfered plastic.

    UVs are dropped for good: nothing here is textured.
  */
  geo.deleteAttribute('normal')
  geo.deleteAttribute('uv')
  const welded = mergeVertices(geo)
  geo.dispose()
  welded.computeVertexNormals()
  return welded
}

/**
 * A tapered leg: wider where it meets the frame, narrower at the foot, with a
 * slight splay. Six sides would read as machined; sixteen reads as turned.
 */
function legGeometry(height: number, top: number, foot: number): THREE.BufferGeometry {
  const geo = new THREE.CylinderGeometry(top, foot, height, 16, 1)
  geo.translate(0, height / 2, 0)
  return geo
}

/* -------------------------------------------------------------- materials */

/**
 * Fabric that behaves like fabric under the studio IBL.
 *
 * `sheen` is the whole trick: it is three's implementation of the retro-
 * reflective lobe that makes velvet and bouclé glow at grazing angles, and it
 * is why an untextured rounded box reads as upholstery rather than as plastic.
 * The sheen colour is set to the fabric colour by the swatch code, so ivory
 * bouclé never glows orange the way a hard-coded sheen tint would.
 *
 * The material is NAMED 'fabric-…' because collectFabrics() in StageCanvas
 * finds upholstery by that prefix — the same contract the GLB materials
 * honoured, so the swatch dock keeps working without knowing what changed.
 */
export function fabricMaterial(hex: string, name: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    name: `fabric-${name}`,
    color: new THREE.Color(hex),
    roughness: 0.92,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.38,
    sheenColor: new THREE.Color(hex),
    /* a hair of clearcoat stands in for the way light sits on a tight weave;
       above ~0.1 it starts to look like vinyl */
    clearcoat: 0.04,
    clearcoatRoughness: 0.9,
  })
}

/**
 * Solid wood, for the pieces that are wood rather than upholstery.
 *
 * Deliberately NOT named 'fabric-…', so the swatch dock cannot re-dye a
 * dining table in Royal Blue Velvet. The swatch is a fabric choice and it
 * belongs to the pieces that have fabric; a control that silently does
 * nothing on two of five pieces would be worse than one that is honest about
 * its scope. `clearcoat` is the lacquer a finished table actually carries and
 * is what separates it from the matte walnut of a leg.
 */
function woodMaterial(hex: string, name: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    name: `wood-${name}`,
    color: new THREE.Color(hex),
    roughness: 0.42,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.32,
  })
}

function legMaterial(kind: PieceSpec['legMaterial']): THREE.MeshStandardMaterial {
  return kind === 'brass'
    ? new THREE.MeshStandardMaterial({
        name: 'metal-brass',
        /* the logo's brass, which is the one hue the brand owns */
        color: new THREE.Color('#B08D57'),
        metalness: 1,
        roughness: 0.26,
      })
    : new THREE.MeshStandardMaterial({
        name: 'wood-walnut',
        color: new THREE.Color('#4A3626'),
        metalness: 0,
        roughness: 0.48,
      })
}

/* ------------------------------------------------------------------ build */

type Part = { geo: THREE.BufferGeometry; pos: [number, number, number]; tilt?: number }

/**
 * Lay out one piece's parts from its spec. Pure arithmetic, no three.js state:
 * every number below is derived from the spec, so changing a single dimension
 * moves everything that depends on it and nothing that does not.
 *
 * WHAT MAKES A BOX READ AS FURNITURE. The first version of this stacked the
 * right volumes in the right places and still rendered as one blue lump,
 * because everything was flush: the arms, the back and the base all met at
 * the same planes, in one material, under smooth normals, so there was no
 * edge anywhere for the eye to find. Real upholstery reads through GAPS and
 * SHADOW LINES, not through outline. Three rules came out of fixing it, and
 * every offset below serves one of them:
 *
 *   1. The arms are the outer walls and they stand PROUD — the back sits
 *      BETWEEN them, not across them, so the arm has a visible end face.
 *   2. The base rail is RECESSED behind the seat's front edge, which puts a
 *      shadow under the cushions and lifts the whole piece off its legs.
 *   3. Cushions are separated by real gaps, not by hairlines, and sit a
 *      little proud of the frame that carries them.
 */
function layout(spec: PieceSpec) {
  const {
    width,
    depth,
    seatHeight,
    backHeight,
    armHeight,
    armWidth,
    legHeight,
    soften,
    seats,
  } = spec

  const backThickness = Math.min(0.17, depth * 0.2)
  /* the rail the cushions sit on. RECESSED at the front (rule 2) and inset
     between the arms, so it is a shadow rather than a wall. */
  const railH = 0.1
  const railTop = legHeight + railH
  const railInset = 0.06

  const inner = width - 2 * armWidth
  /* TUCK. The rail and the back run a little way UNDER the arms rather than
     butting against them: with radiused ends, two volumes that merely touch
     leave a lens-shaped gap at every corner, and the arms rendered as two
     pills floating beside the sofa. An overlap costs nothing (it is inside
     the solid) and closes the silhouette. */
  const tuck = 0.05
  /* a real, visible gap: at 0.014 the seams vanished at any distance */
  const seam = 0.022
  const cushionW = (inner - seam * (seats - 1)) / seats
  const cushionD = depth - backThickness - 0.09
  const cushionH = Math.max(0.13, seatHeight - railTop + 0.04)

  const upholstery: Part[] = []

  /* the rail, between the arms and set back from the front edge */
  upholstery.push({
    geo: roundedBox(inner + tuck * 2, railH, depth - railInset * 2, soften * 0.5),
    pos: [0, legHeight + railH / 2, 0],
  })

  /* THE BACK, between the arms, leaned back 7 degrees. Its width is `inner`,
     not `width`: a back that runs across the arms turns the whole piece into
     a single slab seen from behind, which is exactly how the first version
     failed. */
  const backH = backHeight - railTop
  upholstery.push({
    geo: roundedBox(inner + tuck * 2, backH, backThickness, soften * 0.85),
    pos: [0, railTop + backH / 2, -(depth / 2 - backThickness / 2)],
    tilt: -0.12,
  })

  /* seat cushions, front-aligned so the seam line reads across the piece and
     a little proud of the rail below them */
  const cushionZ = depth / 2 - cushionD / 2 - 0.03
  for (let i = 0; i < seats; i += 1) {
    const x = -inner / 2 + cushionW / 2 + i * (cushionW + seam)
    upholstery.push({
      geo: roundedBox(cushionW, cushionH, cushionD, soften * 1.15),
      pos: [x, railTop + cushionH / 2 - 0.02, cushionZ],
    })
  }

  /* loose back cushions: what makes a three-seater look sat-in rather than
     showroom-stiff. They stay BELOW the top of the back — poking above it
     read as two blobs floating behind the sofa, which is what they looked
     like before the height was clamped. */
  if (spec.backCushions) {
    /* Sized and placed so a BAND OF THE BACK ITSELF STAYS VISIBLE above
       them. Flush with the top of the back (which is where they sat before)
       there was no back panel left to see, and the sofa read as six loose
       pillows in two rows rather than as a back with cushions against it. */
    const bcH = Math.min(0.3, backH - 0.18)
    const bcD = 0.14
    for (let i = 0; i < seats; i += 1) {
      const x = -inner / 2 + cushionW / 2 + i * (cushionW + seam)
      upholstery.push({
        geo: roundedBox(cushionW - 0.02, bcH, bcD, soften * 1.35),
        pos: [
          x,
          railTop + cushionH + bcH / 2 - 0.09,
          -(depth / 2 - backThickness - bcD / 2 + 0.02),
        ],
        tilt: -0.16,
      })
    }
  }

  /* THE ARMS: full-depth outer walls, rising from the legs to the arm height
     and rolled at the top. Because the back stops inside them, each arm shows
     a face, a top and an end — three planes at three angles to the key light,
     which is what actually separates them from the mass. */
  if (armHeight > 0) {
    const armH = armHeight - legHeight
    for (const side of [-1, 1]) {
      upholstery.push({
        geo: roundedBox(armWidth, armH, depth, Math.min(armWidth / 3, soften * 1.6)),
        pos: [side * (width / 2 - armWidth / 2), legHeight + armH / 2, 0],
      })
    }
  }

  /* Legs: four, and thicker than they were. At 19 mm on a 2.1 m sofa they
     read as wire; a turned brass leg on a piece this size is nearer 45 mm at
     the shoulder, tapering to 25. Splayed outward at the foot. */
  const legs: Part[] = []
  const insetX = Math.min(0.17, width * 0.085)
  const insetZ = 0.14
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      legs.push({
        geo: legGeometry(legHeight + 0.03, 0.023, 0.013),
        pos: [sx * (width / 2 - insetX), 0, sz * (depth / 2 - insetZ)],
        /* splay is expressed as a tilt about z; the legs are radially
           symmetric, so leaning them outward in x is enough and the z pairs
           read as perspective */
        tilt: sx * spec.legSplay,
      })
    }
  }

  return { upholstery, legs }
}

/* ------------------------------------------------- the other three families

   Each returns two buckets: parts that take the piece's SOFT material (the
   fabric, re-dyeable by the swatch) and parts that take its HARD one (wood or
   brass). The same two-bucket shape as the seating layout above, so
   buildPiece assembles all four families through one loop.
*/

type Layout = { soft: Part[]; hard: Part[] }

/**
 * THE BED (Bedroom). An upholstered headboard, a wooden base with a shadow
 * gap under it, the mattress, and two pillows.
 *
 * The headboard is the whole silhouette: it is what says "bed" from across a
 * room and from any angle on a turntable, which is why it is 1.12 m tall and
 * the widest thing here. The base is inset on all four sides so the mattress
 * overhangs it - that gap and its shadow is the same trick the sofa's
 * recessed rail uses, and it is what stops the piece reading as one block.
 */
function layoutBed(): Layout {
  const { width: W, depth: D } = PIECE_SIZE.bed
  const soft: Part[] = []
  const hard: Part[] = []

  const legH = 0.11
  const baseH = 0.2
  const mattressH = 0.26
  const headH = 1.12 - legH - baseH
  const headT = 0.12

  /* the base, inset so the mattress above it overhangs on every side */
  hard.push({
    geo: roundedBox(W - 0.09, baseH, D - 0.09, 0.012),
    pos: [0, legH + baseH / 2, 0],
  })

  /* the mattress: the one part a person lies on, so it is the softest radius */
  soft.push({
    geo: roundedBox(W, mattressH, D - 0.16, 0.05),
    pos: [0, legH + baseH + mattressH / 2, 0.07],
  })

  /* the headboard, upholstered, standing at the back and leaned a hair */
  soft.push({
    geo: roundedBox(W, headH, headT, 0.045),
    pos: [0, legH + baseH + headH / 2, -(D / 2 - headT / 2)],
    tilt: -0.05,
  })

  /* two pillows against it, tilted up the way they sit when a bed is made */
  const pillowW = W / 2 - 0.1
  for (const side of [-1, 1]) {
    soft.push({
      geo: roundedBox(pillowW, 0.14, 0.36, 0.06),
      pos: [side * (pillowW / 2 + 0.04), legH + baseH + mattressH + 0.05, -(D / 2 - 0.34)],
      tilt: -0.32,
    })
  }

  /* four short feet, inset well under the base */
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      hard.push({
        geo: legGeometry(legH + 0.02, 0.03, 0.024),
        pos: [sx * (W / 2 - 0.18), 0, sz * (D / 2 - 0.2)],
      })
    }
  }

  return { soft, hard }
}

/**
 * One dining chair, at an offset. Six meshes: seat, back, four legs.
 *
 * The chairs are what make a table read as a DINING table rather than as a
 * desk or a console - a bare top on four legs is ambiguous at every angle.
 * Four of them cost about 3k vertices, which is worth paying for a silhouette
 * that cannot be misread.
 */
function diningChair(x: number, z: number, faceBack: boolean, soft: Part[], hard: Part[]) {
  const seatH = 0.45
  const seatW = 0.44
  const seatD = 0.44
  const backH = 0.5
  const dir = faceBack ? -1 : 1

  soft.push({
    geo: roundedBox(seatW, 0.09, seatD, 0.022),
    pos: [x, seatH, z],
  })
  soft.push({
    geo: roundedBox(seatW, backH, 0.07, 0.03),
    pos: [x, seatH + backH / 2 + 0.02, z + dir * (seatD / 2 - 0.035)],
    tilt: dir * 0.09,
  })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      hard.push({
        geo: legGeometry(seatH, 0.016, 0.011),
        pos: [x + sx * (seatW / 2 - 0.045), 0, z + sz * (seatD / 2 - 0.045)],
      })
    }
  }
}

/** THE DINING SET (Dining). A 2.2 m top on an apron, four turned legs, and
    four chairs - two down each long side, pulled slightly out. */
function layoutDining(): Layout {
  const { width: W, depth: D, height: H } = PIECE_SIZE.dining
  const soft: Part[] = []
  const hard: Part[] = []

  const topT = 0.05
  const apronH = 0.09
  const legH = H - topT - apronH

  hard.push({ geo: roundedBox(W, topT, D, 0.012), pos: [0, H - topT / 2, 0] })
  /* the apron, inset from the top's edge so the top reads as a slab laid ON
     something rather than as the top face of a box */
  hard.push({
    geo: roundedBox(W - 0.24, apronH, D - 0.24, 0.008),
    pos: [0, legH + apronH / 2, 0],
  })
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      hard.push({
        geo: legGeometry(legH, 0.033, 0.022),
        pos: [sx * (W / 2 - 0.15), 0, sz * (D / 2 - 0.15)],
      })
    }
  }

  /* two chairs a side, tucked but not pushed in: a set that is being used */
  for (const sx of [-1, 1]) {
    diningChair(sx * 0.42, D / 2 + 0.06, false, soft, hard)
    diningChair(sx * 0.42, -(D / 2 + 0.06), true, soft, hard)
  }

  return { soft, hard }
}

/**
 * THE EXECUTIVE DESK (Office & Study). A top, a drawer pedestal on one side,
 * a modesty panel across the back, and two legs on the open side.
 *
 * The asymmetry is the whole design: a top on four identical legs is a table.
 * A solid block under one end and open air under the other is unmistakably a
 * working desk, and it reads that way from behind as well as from in front.
 */
function layoutDesk(): Layout {
  const { width: W, depth: D, height: H } = PIECE_SIZE.desk
  const soft: Part[] = []
  const hard: Part[] = []

  const topT = 0.045
  const bodyH = H - topT
  const pedW = 0.44

  hard.push({ geo: roundedBox(W, topT, D, 0.01), pos: [0, H - topT / 2, 0] })

  /* the pedestal, set in from the top's edge on every side it touches */
  const pedX = -(W / 2 - pedW / 2 - 0.05)
  hard.push({
    geo: roundedBox(pedW, bodyH - 0.05, D - 0.1, 0.012),
    pos: [pedX, (bodyH - 0.05) / 2 + 0.05, 0],
  })
  /* three drawer fronts, proud of the pedestal so each throws its own line */
  for (let i = 0; i < 3; i += 1) {
    hard.push({
      geo: roundedBox(pedW - 0.05, 0.16, 0.02, 0.006),
      pos: [pedX, 0.16 + i * 0.19, (D - 0.1) / 2 + 0.005],
    })
  }
  /* and their brass pulls, the only metal on the piece */
  for (let i = 0; i < 3; i += 1) {
    const pull = legGeometry(0.16, 0.008, 0.008)
    pull.rotateZ(Math.PI / 2)
    soft.push({ geo: pull, pos: [pedX - 0.08, 0.16 + i * 0.19, (D - 0.1) / 2 + 0.022] })
  }

  /* the modesty panel: what a desk has and a table does not */
  hard.push({
    geo: roundedBox(W - pedW - 0.18, bodyH - 0.28, 0.03, 0.008),
    pos: [(pedW / 2 + 0.02) / 1, (bodyH - 0.28) / 2 + 0.2, -(D / 2 - 0.09)],
  })

  /* two legs holding the open end */
  for (const sz of [-1, 1]) {
    hard.push({
      geo: legGeometry(H - topT, 0.028, 0.02),
      pos: [W / 2 - 0.09, 0, sz * (D / 2 - 0.12)],
    })
  }

  return { soft, hard }
}

/**
 * Build one piece as a three.js Group standing on y = 0.
 *
 * `fabricHex` is the piece's default SOFT material - upholstery on the
 * seating and the bed, and the brass pulls on the desk (the one place a hard
 * piece has an accent worth its own colour). Callers that own a swatch
 * (Sheet 04) overwrite it afterwards through collectFabrics/applyFabricTo.
 */
export function buildPiece(kind: PieceKind, fabricHex: string): THREE.Group {
  const family = FAMILY[kind]

  /* the royal canapé owns its own builder end to end: it needs two materials
     rather than one soft and one hard, and its parts arrive already placed in
     world space because a swept frame has no meaningful local origin */
  if (family === 'royal') return buildRoyalSofa(fabricHex)

  let parts: Layout
  let hardMaterial: THREE.Material

  if (family === 'seating') {
    const spec = SEATING_SPECS[kind as 'sofa' | 'armchair']
    const { upholstery, legs } = layout(spec)
    parts = { soft: upholstery, hard: legs }
    hardMaterial = legMaterial(spec.legMaterial)
  } else if (family === 'bed') {
    parts = layoutBed()
    hardMaterial = woodMaterial('#4A3626', 'walnut')
  } else if (family === 'dining') {
    parts = layoutDining()
    /* a lighter, warmer wood than the bed's walnut: the brief's own
       "natural wood tan", and it keeps two wooden pieces from looking like
       the same piece twice */
    hardMaterial = woodMaterial('#7A5537', 'teak')
  } else {
    parts = layoutDesk()
    hardMaterial = woodMaterial('#2E2620', 'ebony')
  }

  const group = new THREE.Group()
  group.name = `piece-${kind}`

  const soft = family === 'desk'
    ? legMaterial('brass')
    : fabricMaterial(fabricHex, kind)

  for (const part of parts.soft) {
    const mesh = new THREE.Mesh(part.geo, soft)
    mesh.position.set(...part.pos)
    if (part.tilt) mesh.rotation.x = part.tilt
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }

  for (const part of parts.hard) {
    const mesh = new THREE.Mesh(part.geo, hardMaterial)
    mesh.position.set(...part.pos)
    /* seating legs splay about z; nothing else tilts on this axis */
    if (part.tilt) mesh.rotation.z = part.tilt
    mesh.castShadow = true
    mesh.receiveShadow = true
    group.add(mesh)
  }

  return group
}

/**
 * Release everything a built piece owns.
 *
 * Geometries are per-part and materials are shared within a piece, so this
 * walks meshes, disposes each geometry once and each material once. Without
 * it, every turntable swap would leak a full piece's worth of GPU buffers —
 * and the turntable swaps on every scroll of the hero.
 */
export function disposePiece(group: THREE.Object3D): void {
  const materials = new Set<THREE.Material>()
  group.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    obj.geometry.dispose()
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    mats.forEach((m) => materials.add(m))
  })
  materials.forEach((m) => m.dispose())
}
