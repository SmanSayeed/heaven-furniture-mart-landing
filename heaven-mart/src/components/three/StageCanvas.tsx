'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera, View, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { prefersReducedMotion, type Tier } from '@/lib/device'
import { hero } from '@/content/copy'
import {
  stageState,
  getSwatch,
  onSwatch,
  setInspectArmed,
  getHeroPiece,
  onHeroPiece,
  type SwatchChoice,
} from '@/lib/stage-state'

/* Khronos SheenChair (CC0), Draco-compressed, staged as the placeholder
   until the real Meshy sofa lands. Decoder and environment are SELF-HOSTED
   (public/draco, public/hdr): zero third-party requests at runtime, and the
   page keeps working if gstatic/githack are unreachable (FB in-app browser
   networks are unpredictable). */
const MODEL_URL = '/models/placeholder-chair.glb'

/* S1 turntable pieces. The order, the captions and these files are the same
   list: copy.ts owns the words, public/models owns the geometry, and the id
   is the join. Swapping in a Meshy scan of a real Heaven piece is renaming
   one .glb. All three are TEMPORARY stand-ins; see ASSETS.md for licences. */
const PIECE_URLS = hero.pieces.map((piece) => `/models/${piece.id}.glb`)

/* framing to use for the one frame before the first piece has been measured;
   a cube's half-extents, so the camera starts sane rather than at the origin */
const DEFAULT_HALF = new THREE.Vector3(0.5, 0.5, 0.5)
const DRACO_PATH = '/draco/'
const HDR_URL = '/hdr/potsdamer_platz_1k.hdr'

/* THE one fit factor: what share of the stage the piece fills once framed. */
const FIT = 0.9
const FOV = 35

const KEY_INTENSITY = 26

/* ---------------------------------------------------------------- helpers */

export type Fit = {
  s: number
  x: number
  y: number
  z: number
  /** half-extents AFTER scaling, so the camera can frame any silhouette */
  half: THREE.Vector3
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
  }
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
function StageCamera({
  half,
  lift = 0,
  yaw = 0,
}: {
  half: THREE.Vector3
  lift?: number
  yaw?: number
}) {
  const size = useThree((state) => state.size)
  const aspect = size.height > 0 ? size.width / size.height : 1
  const dist = fitDistance(half, aspect)
  return (
    <PerspectiveCamera
      makeDefault
      fov={FOV}
      position={[Math.sin(yaw) * dist, lift, Math.cos(yaw) * dist]}
      near={0.05}
      far={40}
      onUpdate={(c) => c.lookAt(0, 0, 0)}
    />
  )
}

/** The upholstery, not the legs: the SheenChair's fabric materials are named
    'fabric Mystere Mango Velvet' / 'fabric Mystere Peacock Velvet' (verified
    by parsing the GLB's JSON chunk), so the stable test is the name prefix.
    Falls back to "has sheen" because upholstery in this asset is exactly the
    set of KHR_materials_sheen materials. */
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
 * One piece on the plinth. Purely presentational: it normalises itself to
 * height 1 and does nothing else, so swapping pieces is swapping this
 * component's url and never touching the staging around it.
 */
function HeroPiece({
  url,
  onReady,
  onMeasure,
}: {
  url: string
  onReady: () => void
  onMeasure: (fit: Fit) => void
}) {
  const { scene } = useGLTF(url, DRACO_PATH)

  /* Each piece gets its own clone: useGLTF caches by url, and three.js
     objects have exactly one parent, so rendering the cached scene directly
     would tear the model out of whichever view mounted it first. */
  const model = useMemo(() => {
    const root = scene.clone(true)
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) obj.castShadow = true
    })
    return { root, fit: measureFit(root) }
  }, [scene])

  /*
    Deliberately NOT swatched. The swatch store belongs to S3, where choosing
    the fabric IS the interaction; forcing the hero's pieces to the default
    ivory overwrote materials that were authored with real velvet sheen and
    left them looking mottled and worn (compared side by side). Each piece
    now presents in the material it was made in, which is both better looking
    and more honest about what a bespoke studio offers: different pieces, in
    different fabrics, all of them real.
  */

  /* can only run after Suspense resolved = the GLB is genuinely renderable */
  useEffect(() => onReady(), [onReady])
  /* every piece has its own proportions, so the camera re-frames per piece */
  useEffect(() => onMeasure(model.fit), [model, onMeasure])

  return (
    <primitive
      object={model.root}
      scale={model.fit.s}
      position={[model.fit.x, model.fit.y, model.fit.z]}
    />
  )
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
    /* every piece is fetched once the first one is up, so the swap is
       instant rather than a hole in the middle of the hero */
    PIECE_URLS.forEach((url) => useGLTF.preload(url, DRACO_PATH))

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
      auto.current += delta * 0.14
    }

    if (group.current) {
      const p = stageState.heroProgress
      const sway = reduced ? 0 : Math.sin(clock.elapsedTime * ((Math.PI * 2) / 6)) * 0.03
      group.current.rotation.y = auto.current + stageState.heroSpin + sway + p * 0.35
      group.current.position.z = -p * 0.55 // recedes as the hero leaves
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
        <Suspense fallback={null}>
          <HeroPiece url={PIECE_URLS[index]} onReady={onReady} onMeasure={onMeasure} />
        </Suspense>
      </group>
    </group>
  )
}

function HeroLights({ tier }: { tier: Tier }) {
  const key = useRef<THREE.SpotLight>(null)
  const reduced = useMemo(() => prefersReducedMotion(), [])

  /* key breathes +-8% over ~4s: the light moves, not the object */
  useFrame(({ clock }) => {
    if (reduced || !key.current) return
    key.current.intensity =
      KEY_INTENSITY * (1 + 0.08 * Math.sin(clock.elapsedTime * ((Math.PI * 2) / 4)))
  })

  return (
    <>
      <spotLight
        ref={key}
        color="#ffd9a0"
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
  const onMeasure = useCallback((next: Fit) => setFit(next), [])
  const half = fit?.half ?? DEFAULT_HALF

  return (
    <>
      <StageCamera half={half} lift={half.y * 0.12} />
      <HeroTurntable onReady={onReady} onMeasure={onMeasure} />
      <Suspense fallback={null}>
        <Environment files={HDR_URL} environmentIntensity={0.3} />
      </Suspense>
      <HeroLights tier={tier} />
      <Floor tier={tier} y={-half.y} />
    </>
  )
}

/* ---------------------------------------------------------- bespoke view */

function buildBespoke(scene: THREE.Object3D) {
  /* Own clone + own materials: the hero view keeps rendering the original
     scene graph at full opacity while this copy is blueprint-clipped. */
  const root = scene.clone(true)
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
    color: '#C8A96A',
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

  const realMats: THREE.Material[] = []
  for (const mesh of meshes) {
    const mat = (mesh.material as THREE.Material).clone()
    mat.transparent = true
    mat.opacity = 0
    mat.clippingPlanes = [planeReal]
    mesh.material = mat
    realMats.push(mat)
    mesh.castShadow = false
    /* 30deg threshold keeps structural edges, drops the triangle soup */
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 30), edgeMat))
  }

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
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH)
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
    const built = buildBespoke(scene)
    builtRef.current = built
    onMeasure(built.fit)
    built.root.scale.setScalar(built.fit.s)
    built.root.position.set(built.fit.x, built.fit.y, built.fit.z)
    holder.add(built.root)

    /* this clone owns cloned materials, so it needs its own fabric sync */
    const fabrics = collectFabrics(built.root)
    applyFabricTo(fabrics, getSwatch(), true)
    const unsub = onSwatch((sw) => applyFabricTo(fabrics, sw, false))

    return () => {
      unsub()
      holder.remove(built.root)
      builtRef.current = null
      doneRef.current = false
    }
  }, [scene, onMeasure])

  /* The whole three-phase sequence is a pure function of one number that
     GSAP scrubs into stageState (PLAN 4.4): no coupling between the GSAP
     timeline and the three.js object graph, so either side can mount first. */
  useFrame(() => {
    const b = builtRef.current
    if (!b) return
    const p = stageState.bespokeProgress

    /* A - Designed: the blueprint is ALWAYS faintly on the panel and glows up
       over the first 8%. The floor is not decoration: at a hard 0 the stage
       was an empty rectangle whenever the scrub had not started, which is
       what a visitor sees if scrolling ever stalls, if they land deep-linked,
       or if they simply stop at the top of the section. A drawing waiting to
       be drawn is a composition; an empty panel is a bug. */
    b.edgeMat.opacity = 0.22 + 0.78 * Math.min(p / 0.08, 1)

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
    if (group.current && p < 0.98) {
      group.current.rotation.y = -0.35 + p * 0.55
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

function BespokeStage() {
  const [fit, setFit] = useState<Fit | null>(null)
  const onMeasure = useCallback((next: Fit) => setFit(next), [])
  const half = fit?.half ?? DEFAULT_HALF

  return (
    <>
      {/* slight three-quarter framing: a piece on the workshop floor */}
      <StageCamera half={half} lift={half.y * 0.35} yaw={0.42} />
      <Suspense fallback={null}>
        <BespokeChair onMeasure={onMeasure} />
        {/* dimmer IBL than the hero: workshop, not showroom */}
        <Environment files={HDR_URL} environmentIntensity={0.12} />
      </Suspense>
      <InspectControls />
      {/* cool key + faint brass fill: the blueprint mood */}
      <spotLight color="#cfe0f2" position={[1.4, 2.6, 1.6]} angle={0.7} penumbra={1} intensity={14} />
      <directionalLight color="#c8a96a" position={[-1.5, 0.8, -1.8]} intensity={0.35} />
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

  /* frames only while the tab is visible */
  const [frameloop, setFrameloop] = useState<'always' | 'never'>('always')
  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

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
          <BespokeStage />
        </View>
      )}
    </Canvas>
  )
}

/* Start fetching the moment this chunk loads, not on first render. The hero
   piece first (it is what the visitor is looking at), then the bespoke
   chair; the other two turntable pieces follow once the first has resolved,
   from inside HeroTurntable. */
useGLTF.preload(PIECE_URLS[0], DRACO_PATH)
useGLTF.preload(MODEL_URL, DRACO_PATH)
