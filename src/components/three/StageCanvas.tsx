'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import { prefersReducedMotion, type Tier } from '@/lib/device'
import { hero } from '@/content/copy'
import { buildPiece, disposePiece, type PieceKind } from './piece-geometry'
import {
  stageState,
  getSwatch,
  onSwatch,
  setInspectArmed,
  getHeroPiece,
  onHeroPiece,
  setPieceSize,
  type PieceSize,
  type SwatchChoice,
} from '@/lib/stage-state'

/*
  NOTHING IS DOWNLOADED ANY MORE.

  Every piece on this page used to be a Khronos glTF sample asset: 1.8 MB of
  Draco-compressed GLB, a WASM decoder, three Suspense boundaries, and a
  turntable whose first piece was the single most-used free 3D sofa on the
  internet (a competing hackathon entry shipped the identical model). The
  pieces are now GENERATED from real furniture measurements — see
  piece-geometry.ts for why that is the right answer rather than merely a
  cheaper one. Consequences for this file:

    · no useGLTF, no Draco, no preloading, no Suspense around a piece
    · a piece is ready on the frame it is asked for, so the "empty stage
      while the model downloads" state cannot happen at any scroll speed
    · the fabric swatch now reaches the hero as well as the bespoke stage,
      because we author the materials instead of inheriting them

  The scene still makes zero third-party requests at runtime, which inside
  the Facebook in-app browser on a Bangladeshi mobile network was never a
  hypothetical.
*/

/* the S1 turntable's three pieces: copy.ts owns the words, piece-geometry.ts
   owns the shapes, and `kind` is the join */
const PIECES = hero.pieces

/* framing to use for the one frame before the first piece has been measured;
   a cube's half-extents, so the camera starts sane rather than at the origin */
const DEFAULT_HALF = new THREE.Vector3(0.5, 0.5, 0.5)

/* THE one fit factor: what share of the stage the piece fills once framed. */
const FIT = 0.96
const FOV = 35

const KEY_INTENSITY = 26

/**
 * The image-based light, generated rather than downloaded.
 *
 * This used to be a 1.5 MB .hdr file - by a wide margin the heaviest asset on
 * the page, one third of its total weight, and it was being fetched by every
 * visitor on Chattogram mobile data to be sampled at an intensity of 0.3.
 * three's RoomEnvironment builds an equivalent neutral studio (soft area
 * lights in a white box, which is exactly what upholstery wants) procedurally
 * at runtime: same job, zero bytes, no network dependency at all.
 *
 * PMREM is generated ONCE per view and disposed with it. Each drei <View> has
 * its own scene, so useThree().scene here is that view's scene, which is why
 * the hero and the bespoke stage can carry different intensities.
 */
function StudioEnvironment({ intensity }: { intensity: number }) {
  const gl = useThree((state) => state.gl)
  /* The scene is reached through this anchor's own root rather than through
     useThree().scene, because assigning to a hook's return value is exactly
     what react-hooks/immutability forbids, and rightly: the compiler cannot
     know a three.js scene is a mutable graph rather than React state. The
     root of the graph an object is attached to IS its scene, so walking up
     from an anchor gets the same object without lying to the compiler.
     Same reasoning as BespokeChair's imperative attach below. */
  const anchor = useRef<THREE.Group>(null)

  useEffect(() => {
    let node: THREE.Object3D | null = anchor.current
    while (node?.parent) node = node.parent
    const scene = node as THREE.Scene | null
    if (!scene) return

    const pmrem = new THREE.PMREMGenerator(gl)
    const room = new RoomEnvironment()
    const target = pmrem.fromScene(room, 0.04)
    scene.environment = target.texture
    scene.environmentIntensity = intensity

    return () => {
      scene.environment = null
      target.dispose()
      pmrem.dispose()
      /* RoomEnvironment builds real meshes; without this its geometries and
         materials outlive every view that ever mounted one */
      room.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return
        obj.geometry.dispose()
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => m.dispose())
      })
    }
  }, [gl, intensity])

  return <group ref={anchor} />
}

/* ---------------------------------------------------------------- helpers */

export type Fit = {
  s: number
  x: number
  y: number
  z: number
  /** half-extents AFTER scaling, so the camera can frame any silhouette */
  half: THREE.Vector3
  /** the box BEFORE normalising, in the file's own units (glTF = metres).
      This is what the drawn dimension lines print; see stage-state. */
  raw: THREE.Vector3
}

/**
 * Normalisation from the measured bounding box: largest dimension becomes 1,
 * centre on the origin.
 *
 * It used to normalise HEIGHT to 1, which is only correct for pieces that are
 * taller than they are wide. A sofa is two and a half times wider than it is
 * tall, so height-1 put most of it outside the frame (verified on the 390px
 * hero). Normalising the largest dimension, and returning the resulting
 * half-extents so the camera can do the real framing, holds for any piece we
 * drop in later, including a Meshy scan whose proportions we cannot predict.
 */
function measureFit(root: THREE.Object3D): Fit {
  const box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const center = box.getCenter(new THREE.Vector3())
  const s = 1 / Math.max(size.x, size.y, size.z)
  return {
    s,
    x: -center.x * s,
    y: -center.y * s,
    z: -center.z * s,
    half: new THREE.Vector3((size.x * s) / 2, (size.y * s) / 2, (size.z * s) / 2),
    raw: size.clone(),
  }
}

/** glTF is metres by definition, and furniture is quoted in millimetres in
    every workshop on earth, so the annotation layer speaks mm. Rounded to
    the nearest 10: a bounding box measured off a mesh is not accurate to the
    millimetre and printing four significant digits would be false precision. */
function toPieceSize(raw: THREE.Vector3): PieceSize {
  const mm = (m: number) => Math.round((m * 1000) / 10) * 10
  return { w: mm(raw.x), h: mm(raw.y), d: mm(raw.z) }
}

/**
 * The distance at which a piece of these half-extents fills FIT of a stage of
 * this aspect ratio. Both axes are checked and the looser one wins, so a wide
 * sofa on a narrow phone backs off until its arms are inside the frame while
 * a tall wardrobe on a wide desktop backs off for its height instead.
 *
 * The horizontal extent used is hypot(x, z), not x: the piece TURNS, and at
 * a quarter turn its depth is its width. Framing for the silhouette it can
 * reach is what stops a drag from pushing an arm through the stage edge.
 */
function fitDistance(half: THREE.Vector3, aspect: number): number {
  const vfov = (FOV * Math.PI) / 180
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect)
  const radial = Math.hypot(half.x, half.z)
  return (
    Math.max(half.y / Math.tan(vfov / 2), radial / Math.tan(hfov / 2)) / FIT + half.z
  )
}

/**
 * The stage camera. It re-frames whenever the piece or the stage rect
 * changes, which on this page is every breakpoint, every device rotation and
 * every piece swap. `size` here is the drei View's own rect, not the window,
 * because that is the box the piece actually has to fit inside.
 */
/* the smoothed elevation, module-scope so it survives a piece swap: the eye
   should stay where the visitor put it when the turntable changes pieces */
const tilt = { current: 0 }

function StageCamera({
  half,
  lift = 0,
  yaw = 0,
  orbit = false,
}: {
  half: THREE.Vector3
  lift?: number
  yaw?: number
  /** let a drag raise and lower the eye. Hero only; Sheet 04's blueprint has
      a fixed elevation because a drawing is drawn from one station point. */
  orbit?: boolean
}) {
  const size = useThree((state) => state.size)
  const aspect = size.height > 0 ? size.width / size.height : 1
  const dist = fitDistance(half, aspect)
  const cam = useRef<THREE.PerspectiveCamera>(null)

  /*
    THE SECOND AXIS, done by moving the eye rather than the object.

    heroSpin turns the piece; heroTilt walks the camera up a circle of the
    same radius and re-aims it at the origin, which is what "look at it from
    above" actually is. Tilting the group instead would have been one line
    and would have laid the sofa on its back.

    The clamp is the floor. Below about -6 degrees the camera is under the
    ground plane and the piece is lit from beneath by nothing at all; above
    about 52 it is a plan view, which is a drawing this page already has on
    Sheet 04. Between those the piece stays a piece.

    Lerped, not set: a mouse delta arrives in jumps and the eye should
    arrive smoothly, and the same lerp is what eases it back when the tilt is
    reset on a piece swap.
  */
  useFrame((_, delta) => {
    const c = cam.current
    if (!c) return
    const target = orbit ? THREE.MathUtils.clamp(stageState.heroTilt, -0.1, 0.9) : 0
    tilt.current = THREE.MathUtils.damp(tilt.current, target, 8, delta)
    const t = tilt.current
    const flat = dist * Math.cos(t)
    c.position.set(Math.sin(yaw) * flat, lift + Math.sin(t) * dist, Math.cos(yaw) * flat)
    c.lookAt(0, 0, 0)
  })

  return (
    <PerspectiveCamera
      ref={cam}
      makeDefault
      fov={FOV}
      position={[Math.sin(yaw) * dist, lift, Math.cos(yaw) * dist]}
      near={0.05}
      far={40}
      onUpdate={(c) => c.lookAt(0, 0, 0)}
    />
  )
}

/** The upholstery, not the legs. The contract is the material NAME: every
    fabric this page builds is named 'fabric-<kind>' (piece-geometry.ts), and
    the sheen fallback is kept so that a future imported GLB — a Meshy scan of
    a real Heaven piece — is swatched correctly without being renamed first,
    since upholstery in a scanned asset is exactly the set of
    KHR_materials_sheen materials. */
function collectFabrics(root: THREE.Object3D): THREE.MeshPhysicalMaterial[] {
  const out: THREE.MeshPhysicalMaterial[] = []
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const m of mats) {
      const phys = m as THREE.MeshPhysicalMaterial
      if (m.name.toLowerCase().startsWith('fabric') || phys.sheen > 0) {
        if (!out.includes(phys)) out.push(phys)
      }
    }
  })
  return out
}

/** Apply the chosen fabric to a set of upholstery materials. Base colour AND
    sheen colour: the asset's sheen factor is orange, and ivory fabric with an
    orange sheen would still glow orange at grazing angles. */
function applyFabricTo(fabrics: THREE.MeshPhysicalMaterial[], sw: SwatchChoice, instant: boolean) {
  const c = new THREE.Color(sw.hex)
  for (const m of fabrics) {
    if (instant) {
      m.color.copy(c)
      m.sheenColor?.copy(c)
    } else {
      gsap.to(m.color, { r: c.r, g: c.g, b: c.b, duration: 0.8, ease: 'power2.out' })
      if (m.sheenColor) {
        gsap.to(m.sheenColor, { r: c.r, g: c.g, b: c.b, duration: 0.8, ease: 'power2.out' })
      }
    }
  }
}

/* ------------------------------------------------------------- hero view */

/**
 * One piece on the plinth: drawn on mount, measured, normalised, disposed.
 *
 * Each piece keeps its OWN default fabric (copy.ts `hex`) rather than the
 * swatch. The swatch belongs to Sheet 03, where choosing the fabric is the
 * interaction; a hero that silently re-dyed itself from a control four sheets
 * away would be a mystery rather than a feature. Three pieces in three
 * fabrics is also the more honest advertisement for a bespoke studio: a
 * range, not one model recoloured.
 */
function HeroPiece({
  kind,
  hex,
  onReady,
  onMeasure,
}: {
  kind: PieceKind
  hex: string
  onReady: () => void
  onMeasure: (fit: Fit) => void
}) {
  const group = useRef<THREE.Group>(null)

  /* Imperative attach for the same reason BespokeChair does it below: the
     built piece is mutable three.js state with a disposal contract, which is
     precisely what React's compiler rules keep out of render-time values.
     Render declares the stable shell; the effect owns the contents. */
  useEffect(() => {
    const holder = group.current
    if (!holder) return
    const piece = buildPiece(kind, hex)
    const fit = measureFit(piece)
    piece.scale.setScalar(fit.s)
    piece.position.set(fit.x, fit.y, fit.z)
    holder.add(piece)
    onMeasure(fit)
    /* There is no loading state to wait for — the piece exists the moment it
       is asked for — so "ready" is true on the first frame it is attached. */
    onReady()
    return () => {
      holder.remove(piece)
      disposePiece(piece)
    }
  }, [kind, hex, onReady, onMeasure])

  return <group ref={group} />
}

/**
 * S1 "The Turntable": the hero's piece, grabbable and changing.
 *
 * Three motions ride on the same group, added rather than fighting:
 *   spin  - the visitor's drag, plus the inertia after they let go
 *   auto  - a slow presentation turn that retires the first time a visitor
 *           takes hold; a piece that keeps turning under someone's hand is
 *           a toy, and a piece that never moves looks like an image
 *   exit  - the scroll yaw and recede as the hero hands over to S2
 *
 * The swap between pieces is a dip: the current piece turns away and shrinks
 * into the light, the next grows out of it. Nothing cross-fades, because
 * fading these materials would mean marking opaque upholstery transparent
 * and inheriting three.js's sort order for the rest of the session.
 */
function HeroTurntable({
  onReady,
  onMeasure,
}: {
  onReady: () => void
  onMeasure: (fit: Fit) => void
}) {
  const [index, setIndex] = useState(() => getHeroPiece())
  const group = useRef<THREE.Group>(null)
  const shell = useRef<THREE.Group>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])

  /* tweened by GSAP, read by useFrame: 1 = fully on stage, 0 = gone */
  const presence = useRef({ v: 1 })
  /* the auto-turn's own accumulated angle; frozen once a visitor drags */
  const auto = useRef(0)
  const everGrabbed = useRef(false)

  useEffect(() => {
    /* No preloading, and no `index` in the dependency list that only existed
       to drive it: there is nothing to fetch. A piece is built in about a
       millisecond, so the swap is instant at any scroll speed and a visitor
       on Chattogram mobile data pays nothing for pieces two and three. */
    return onHeroPiece((next) => {
      gsap.killTweensOf(presence.current)
      if (reduced) {
        /* no dip, no spin: the piece is simply the other piece now */
        setIndex(next)
        presence.current.v = 1
        return
      }
      gsap.to(presence.current, {
        v: 0,
        duration: 0.28,
        ease: 'power2.in',
        onComplete: () => {
          setIndex(next)
          gsap.to(presence.current, { v: 1, duration: 0.55, ease: 'power3.out' })
        },
      })
    })
  }, [reduced])

  useFrame(({ clock }, delta) => {
    /* ---- the drag and its inertia ---- */
    if (stageState.heroGrabbed) {
      everGrabbed.current = true
    } else if (stageState.heroSpinVelocity !== 0) {
      stageState.heroSpin += stageState.heroSpinVelocity
      /* per-frame decay normalised to 60fps, so a 120Hz screen settles in
         the same amount of TIME rather than half of it */
      stageState.heroSpinVelocity *= Math.pow(0.92, delta * 60)
      if (Math.abs(stageState.heroSpinVelocity) < 0.0002) stageState.heroSpinVelocity = 0
    }

    /* ---- the presentation turn, until a hand takes over ---- */
    if (!reduced && !everGrabbed.current && !stageState.heroGrabbed) {
      /* slower than it was (0.14): at that rate a visitor who read the
         headline first arrived to find the piece side-on, which is the one
         angle a sofa has nothing to say from */
      auto.current += delta * 0.085
    }

    if (group.current) {
      const p = stageState.heroProgress
      const sway = reduced ? 0 : Math.sin(clock.elapsedTime * ((Math.PI * 2) / 6)) * 0.03
      /* PLAN-V6 B2: the chapter is pinned for the five pieces, so the
         scroll's share of the yaw is a quarter turn per piece */
      group.current.rotation.y = auto.current + stageState.heroSpin + sway + p * Math.PI * 2.5
    }

    /* ---- the swap dip ---- */
    if (shell.current) {
      const v = presence.current.v
      shell.current.scale.setScalar(0.55 + 0.45 * v)
      shell.current.position.y = (1 - v) * 0.14
      /* a half turn spent inside the dip: the plinth revolved, and what
         comes back up is a different piece */
      shell.current.rotation.y = (1 - v) * Math.PI * 0.5
    }
  })

  return (
    <group ref={group}>
      <group ref={shell}>
        {/* no Suspense boundary: a drawn piece has no pending state */}
        <HeroPiece
          kind={PIECES[index].kind}
          hex={PIECES[index].hex}
          onReady={onReady}
          onMeasure={onMeasure}
        />
      </group>
    </group>
  )
}

function HeroLights({ tier }: { tier: Tier }) {
  const key = useRef<THREE.SpotLight>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])
  /* THE SWITCH (BLUEPRINT SS5.7): tweened 1 -> 0.25 -> 1 by the piece swap,
     multiplied into the light every frame. A floodlight being switched as
     the plinth revolves, which is what makes the swap read as staging rather
     than as an asset being replaced. */
  const dip = useRef({ v: 1 })

  useEffect(() => {
    if (reduced) return
    return onHeroPiece(() => {
      gsap.killTweensOf(dip.current)
      gsap
        .timeline()
        .to(dip.current, { v: 0.25, duration: 0.12, ease: 'power2.in' })
        .to(dip.current, { v: 1, duration: 0.38, ease: 'power2.out' })
    })
  }, [reduced])

  /* key breathes +-8% over ~4s: the light moves, not the object */
  useFrame(({ clock }) => {
    if (!key.current) return
    if (reduced) {
      key.current.intensity = KEY_INTENSITY
      return
    }
    key.current.intensity =
      KEY_INTENSITY *
      (1 + 0.08 * Math.sin(clock.elapsedTime * ((Math.PI * 2) / 4))) *
      dip.current.v
  })

  return (
    <>
      <spotLight
        ref={key}
        /* warm, because a real showroom light is warm and this light is
           INSIDE the photograph's world; the page's own monochrome rule
           governs the page, never the lit object (SS2.8 exception 3) */
        color="#ffd9a0"
        /* top LEFT, 45 degrees: the One Light Law (SS5.7). Every shadow on
           the page, drawn or rendered, falls to the bottom right from here. */
        position={[-1.6, 2.4, 1.8]}
        angle={0.7}
        penumbra={1}
        intensity={KEY_INTENSITY}
        castShadow={tier === 'high'}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      />
      <directionalLight color="#bcd2e8" position={[1.4, 1.0, -2.2]} intensity={0.6} />
    </>
  )
}

function Floor({ tier, y }: { tier: Tier; y: number }) {
  /* the contact shadow is high-tier only; without it the plane would draw
     nothing at all, so skip the mesh entirely on mid tier */
  if (tier !== 'high') return null
  return (
    /* shadowMaterial, not a lit plane: it renders ONLY the received shadow
       and is transparent everywhere else, so nothing can ever reveal the
       view rect's straight edges against the page ink. The pool of light
       under the piece is the CSS light pool's job. The plane sits at the
       piece's own feet, which differ per piece now that models are
       normalised by their largest dimension rather than by height. */
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <circleGeometry args={[14, 48]} />
      <shadowMaterial opacity={0.35} />
    </mesh>
  )
}

function HeroStage({ tier, onReady }: { tier: Tier; onReady: () => void }) {
  /* the active piece's proportions, published upward by HeroPiece so the
     camera and the shadow plane both track whatever is on the plinth */
  const [fit, setFit] = useState<Fit | null>(null)
  /* the same measurement drives two very different things: the camera's
     framing (normalised half-extents) and the drawn dimension line (the raw
     box in mm). One measure, published both ways. */
  const onMeasure = useCallback((next: Fit) => {
    setFit(next)
    setPieceSize('hero', toPieceSize(next.raw))
  }, [])
  /* leaving the stage retracts the annotation: no model, no dimensions */
  useEffect(() => () => setPieceSize('hero', null), [])
  const half = fit?.half ?? DEFAULT_HALF

  return (
    <>
      {/* THREE-QUARTER, never dead-on. A sofa photographed square to the
          camera is a rectangle; the angle is what shows the arm's end, the
          depth of the seat and the splay of the legs all at once, and it is
          how every furniture catalogue on earth shoots one. Yaw is on the
          CAMERA rather than the piece so that a visitor's drag still counts
          from the piece's own front. */}
      <StageCamera half={half} lift={half.y * 0.6} yaw={0.62} orbit />
      <HeroTurntable onReady={onReady} onMeasure={onMeasure} />
      {/* Raised from 0.3. The image-based light is what puts form on flat
          upholstery — at 0.3 the large faces of a drawn piece all returned
          nearly the same value and the sofa read as one blue shape. */}
      <StudioEnvironment intensity={0.75} />
      <HeroLights tier={tier} />
      <Floor tier={tier} y={-half.y} />
    </>
  )
}

/* ---------------------------------------------------------- bespoke view */

function buildBespoke(swatchHex: string) {
  /* Sheet 03 gets its OWN piece with its OWN materials: this copy is
     blueprint-clipped and re-dyed by the swatch dock, and neither of those
     may reach across into the hero's pieces. It is the sofa, because the
     sofa is the largest fabric area on the page and the swatch is the point
     of this sheet. */
  const root = buildPiece('sofa', swatchHex)
  const fit = measureFit(root)
  /* The craft-plane sweeps the piece's OWN height, measured, with a hair of
     margin either side so the first and last frames are fully clipped.
     Constants would only have been right for a model normalised to height 1,
     which is no longer how any piece is normalised. */
  const minY = -fit.half.y - 0.02
  const maxY = fit.half.y + 0.02

  /* THREE clip planes keep the halfspace where dot(normal, p) + constant
     >= 0, in WORLD space. The group holding this sits at the origin and
     only rotates about Y, so y-planes stay valid without re-projection.
       real:  normal (0,-1,0), constant  planeY -> keep y <= planeY
       edges: normal (0, 1,0), constant -planeY -> keep y >= planeY  */
  const planeReal = new THREE.Plane(new THREE.Vector3(0, -1, 0), minY)
  const planeEdges = new THREE.Plane(new THREE.Vector3(0, 1, 0), -minY)

  const edgeMat = new THREE.LineBasicMaterial({
    /* filament white (SS2.8): the blueprint is drawn in light, not in gold */
    color: '#FFFFFF',
    transparent: true,
    opacity: 0,
    clippingPlanes: [planeEdges],
    /* skip ACES so the brass reads as emitted light, not lit paint */
    toneMapped: false,
  })

  /* collect first, THEN mutate: adding children while traverse() walks
     the tree would revisit the additions */
  const meshes: THREE.Mesh[] = []
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) meshes.push(obj)
  })

  /* One clone PER SOURCE MATERIAL, not per mesh. A drawn piece shares two
     materials (upholstery, legs) across a dozen meshes, so cloning blindly
     would put twelve distinct materials on the GPU, twelve opacity writes in
     every frame of the sweep, and twelve state changes per draw — for two
     actual appearances. The Map keeps the sharing the geometry already has. */
  const clones = new Map<THREE.Material, THREE.Material>()
  const realMats: THREE.Material[] = []
  for (const mesh of meshes) {
    const source = mesh.material as THREE.Material
    let mat = clones.get(source)
    if (!mat) {
      mat = source.clone()
      mat.transparent = true
      mat.opacity = 0
      mat.clippingPlanes = [planeReal]
      clones.set(source, mat)
      realMats.push(mat)
    }
    mesh.material = mat
    mesh.castShadow = false
    /* 30deg threshold keeps the structural edges of the beveled volumes and
       drops the bevel's own shallow facets, which is exactly the difference
       between a drafted outline and triangle soup */
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 30), edgeMat))
  }

  /* the originals are now referenced by nothing: every mesh carries a clone.
     buildPiece created them, so leaving them undisposed would leak one
     material pair per mount of this section. */
  clones.forEach((_clone, source) => source.dispose())

  return { root, fit, minY, maxY, planeReal, planeEdges, edgeMat, realMats }
}

/** Flip the whole clone between the clipped-transparent path (phases A/B)
    and the cheap opaque path (phase C). Module-level on purpose: it mutates
    three.js material state that lives outside React's data flow. */
function setSweepDone(b: ReturnType<typeof buildBespoke>, done: boolean) {
  for (const m of b.realMats) {
    m.transparent = !done
    m.clippingPlanes = done ? null : [b.planeReal]
    m.needsUpdate = true
  }
}

function setRealOpacity(b: ReturnType<typeof buildBespoke>, opacity: number) {
  for (const m of b.realMats) m.opacity = opacity
}

function BespokeChair({ onMeasure }: { onMeasure: (fit: Fit) => void }) {
  const group = useRef<THREE.Group>(null)
  /* one-shot flag so per-frame work stays writes, not allocations */
  const doneRef = useRef(false)
  const nudgedRef = useRef(false)
  const builtRef = useRef<ReturnType<typeof buildBespoke> | null>(null)

  /* Imperative attach, on purpose: every part of this bundle (plane
     constants, material opacities, the clone itself) is mutable per-frame
     state, which React's compiler rules rightly ban from render-time values.
     So render declares only the stable group shell; the effect owns the
     contents; useFrame mutates through the ref. */
  useEffect(() => {
    const holder = group.current
    if (!holder) return
    /* built already dyed to the visitor's current swatch, so a visitor who
       picks emerald, scrolls away and scrolls back never sees one frame of
       ivory before the sync catches up */
    const built = buildBespoke(getSwatch().hex)
    builtRef.current = built
    onMeasure(built.fit)
    built.root.scale.setScalar(built.fit.s)
    built.root.position.set(built.fit.x, built.fit.y, built.fit.z)
    holder.add(built.root)

    const fabrics = collectFabrics(built.root)
    const unsub = onSwatch((sw) => applyFabricTo(fabrics, sw, false))

    return () => {
      unsub()
      holder.remove(built.root)
      /* the edge material and the line geometries are this piece's too, and
         they are not reachable from disposePiece's mesh walk */
      built.edgeMat.dispose()
      built.root.traverse((obj) => {
        if (obj instanceof THREE.LineSegments) obj.geometry.dispose()
      })
      disposePiece(built.root)
      builtRef.current = null
      doneRef.current = false
    }
  }, [onMeasure])

  /* The whole three-phase sequence is a pure function of one number that
     GSAP scrubs into stageState (PLAN 4.4): no coupling between the GSAP
     timeline and the three.js object graph, so either side can mount first. */
  useFrame(() => {
    const b = builtRef.current
    if (!b) return
    const p = stageState.bespokeProgress
    /* 0 -> 1 the moment the sheet comes into view, independent of the scrub.
       See stageState.bespokeArrival for why this is a second number. */
    const arrival = stageState.bespokeArrival

    /* A - Designed: the blueprint is ALWAYS on the panel and brightens over
       the first 8%. The FLOOR IS THE POINT, and it is 0.45 rather than the
       0.22 it used to be: at 0.22 a white wireframe on a near-black panel is
       at the edge of visible on a phone in daylight, so a visitor who arrived
       before the scrub caught up saw an empty rectangle and read the section
       as broken. A drawing waiting to be drawn is a composition; a faint one
       is indistinguishable from a bug.

       Multiplied by arrival so the drawing DRAWS ITSELF IN on entry rather
       than being simply present. */
    b.edgeMat.opacity = (0.45 + 0.55 * Math.min(p / 0.08, 1)) * arrival

    /* B - Crafted: material arrives right at phase start, then the sweep
       (the clip plane) is what actually reveals it */
    const matOpacity = p < 0.3 ? 0 : Math.min((p - 0.3) / 0.05, 1)
    const sweep = THREE.MathUtils.clamp((p - 0.33) / 0.33, 0, 1)
    const planeY = b.minY + (b.maxY - b.minY) * sweep
    b.planeReal.constant = planeY
    b.planeEdges.constant = -planeY

    /* C - Customized: once fully swept, drop transparency and clipping so
       the chair renders on the cheap opaque path for the rest of the pin */
    const done = p > 0.7
    if (done !== doneRef.current) {
      doneRef.current = done
      setSweepDone(b, done)
    }
    if (!done) setRealOpacity(b, matOpacity)

    /* The slow quarter-turn across the pin: the piece being walked around.
       Stops at the inspect threshold, otherwise it would overwrite both the
       discovery nudge and (through it) the visitor's sense that the piece is
       now theirs to move. */
    /* the greeting's own motion: the piece settles down onto the drafting
       table and its last few degrees of turn resolve, over the same 0.9s the
       blueprint takes to brighten. Additive to everything below. */
    if (group.current) {
      group.current.position.y = (1 - arrival) * 0.16
      group.current.scale.setScalar(0.94 + 0.06 * arrival)
    }

    if (group.current && p < 0.98) {
      group.current.rotation.y = -0.35 + p * 0.55 - (1 - arrival) * 0.22
      nudgedRef.current = false
    } else if (group.current && !nudgedRef.current) {
      /* one-time discovery nudge: ~12 degrees out and eased back, so the
         interaction is found without a tutorial (PLAN S3b) */
      nudgedRef.current = true
      const from = group.current.rotation.y
      gsap.fromTo(
        group.current.rotation,
        { y: from },
        { y: from + 0.21, duration: 0.6, ease: 'power2.out', yoyo: true, repeat: 1 },
      )
    }
  })

  return <group ref={group} />
}

/**
 * S3b "360 inspect mode" (PLAN S3b): once the pinned story has resolved, the
 * vitrine becomes grabbable and the piece orbits a full 360.
 *
 * Armed ONLY at bespokeProgress >= 0.98 and disarmed the moment the visitor
 * scrolls back up, so the scroll timeline and the pointer never fight for the
 * same object. Polar angle is clamped near seat height (never from beneath),
 * azimuth is free (the 360 IS the feature), zoom and pan are off so the
 * visitor can never get lost inside the canvas.
 */
function InspectControls() {
  const [armed, setArmed] = useState(false)
  const armedRef = useRef(false)

  /* polled from the frame loop rather than React state per scroll tick:
     stageState is mutated by GSAP outside React entirely */
  useFrame(() => {
    const next = stageState.bespokeProgress >= 0.98
    if (next !== armedRef.current) {
      armedRef.current = next
      setArmed(next)
      /* the DOM affordance subscribes to this, so the hint can never appear
         without the 3D that makes it true */
      setInspectArmed(next)
    }
  })

  if (!armed) return null

  return (
    <OrbitControls
      makeDefault
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      /* clamped either side of seat height: never from underneath, never a
         top-down view of an empty seat */
      minPolarAngle={Math.PI * 0.32}
      maxPolarAngle={Math.PI * 0.54}
      target={[0, -0.02, 0]}
    />
  )
}

function BespokeStage({ onReady }: { onReady: () => void }) {
  const [fit, setFit] = useState<Fit | null>(null)
  const onMeasure = useCallback(
    (next: Fit) => {
      setFit(next)
      setPieceSize('bespoke', toPieceSize(next.raw))
      /* the canvas wrapper fades in on this (StageLoader): since PLAN-V5
         the hero view no longer exists, so if only the hero reported ready
         the bespoke piece rendered into a wrapper held at opacity 0 -
         present in the GL buffer, invisible on screen (verified 09-03) */
      onReady()
    },
    [onReady],
  )
  useEffect(() => () => setPieceSize('bespoke', null), [])
  const half = fit?.half ?? DEFAULT_HALF

  return (
    <>
      {/* slight three-quarter framing: a piece on the workshop floor */}
      <StageCamera half={half} lift={half.y * 0.35} yaw={0.42} />
      <BespokeChair onMeasure={onMeasure} />
      {/* dimmer IBL than the hero: workshop, not showroom */}
      <StudioEnvironment intensity={0.12} />
      <InspectControls />
      {/* cool key + faint brass fill: the blueprint mood */}
      <spotLight color="#cfe0f2" position={[1.4, 2.6, 1.6]} angle={0.7} penumbra={1} intensity={14} />
      <directionalLight color="#cfd6de" position={[-1.5, 0.8, -1.8]} intensity={0.35} />
    </>
  )
}

/* --------------------------------------------------------------- canvas */

/** Resolve a server-rendered element into the ref shape drei's View tracks.
    Sections stay Server Components; this is the bridge. */
const noopSubscribe = () => () => {}

function useTrack(selector: string) {
  /* useSyncExternalStore, not setState-in-effect: the stage divs are static
     server HTML, so the snapshot (a stable element reference) never changes
     and the subscription never fires; the server snapshot is null. */
  const el = useSyncExternalStore(
    noopSubscribe,
    () => document.querySelector<HTMLElement>(selector),
    () => null,
  )
  return useMemo(() => (el ? { current: el } : null), [el])
}

/**
 * ONE WebGL context for the whole page (PLAN 4.3). The canvas is fixed and
 * transparent behind a pointer-events: none wrapper; each drei <View>
 * scissor-renders its own scene into the live rect of a server-rendered
 * stage div, re-measured every frame, so pinned sections and Lenis scroll
 * both track for free. Never a second <Canvas> anywhere.
 */
export function StageCanvas({ tier, onReady }: { tier: Tier; onReady: () => void }) {
  const heroTrack = useTrack('[data-stage-hero]')
  const bespokeTrack = useTrack('[data-stage-bespoke]')

  /*
    FRAMES ONLY WHERE THERE IS SOMETHING TO SEE.

    This used to stop only when the TAB was hidden, which left a rAF loop
    and a getBoundingClientRect per stage running for the whole length of a
    13,000 px page while the only stage was four chapters away. drei's
    <View> already skips the draw when its rect is off screen - measured:
    zero draw calls - so this was never a GPU cost, but it is a wake-up
    every 16 ms on a phone for nothing.

    Two conditions, one state: the tab is visible AND at least one stage is
    within a screen of the viewport. The margin is deliberately generous -
    the loop must already be running when the chapter arrives, or the piece
    would land on its first frame mid-scroll.
  */
  const [visible, setVisible] = useState(true)
  const [near, setNear] = useState(true)
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    const stages = document.querySelectorAll('[data-stage-hero], [data-stage-bespoke]')
    if (!stages.length || !('IntersectionObserver' in window)) return
    const live = new Set<Element>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) live.add(e.target)
          else live.delete(e.target)
        }
        setNear(live.size > 0)
      },
      { rootMargin: '100% 0px 100% 0px' },
    )
    stages.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const frameloop: 'always' | 'never' = visible && near ? 'always' : 'never'

  return (
    /* localClippingEnabled: the S3 craft-plane sweep is per-material clip
       planes; without this flag three ignores them silently (PLAN 4.4) */
    <Canvas
      dpr={[1, tier === 'high' ? 2 : 1.5]}
      gl={{
        antialias: tier !== 'low',
        alpha: true,
        powerPreference: 'high-performance',
        localClippingEnabled: true,
      }}
      shadows={tier === 'high' ? 'percentage' : false}
      frameloop={frameloop}
    >
      {heroTrack && (
        <View track={heroTrack}>
          <HeroStage tier={tier} onReady={onReady} />
        </View>
      )}
      {bespokeTrack && (
        <View track={bespokeTrack}>
          <BespokeStage onReady={onReady} />
        </View>
      )}
    </Canvas>
  )
}

/* There is no preload here any more, and that is the whole point: the module
   that used to race a 411 KB download for the hero piece and defer a 570 KB
   one for Sheet 03 now builds both on demand from arithmetic. Nothing to
   fetch, nothing to race, nothing to be caught missing. */
