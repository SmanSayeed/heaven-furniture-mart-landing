'use client'

import { Canvas } from '@react-three/fiber'

/**
 * Lab 01 — the smallest possible react-three-fiber scene.
 *
 * Mental model: a theatre stage.
 *   <Canvas>          the stage + the photographer + the film crew, in one tag
 *   light             without a lamp, a StandardMaterial renders pure black
 *   <mesh>            the actor = geometry (its shape) + material (its skin)
 *
 * Every three.js class has a lowercase JSX tag in R3F:
 *   new THREE.BoxGeometry()    ->  <boxGeometry />
 *   new THREE.DirectionalLight ->  <directionalLight />
 * There is no registry to update — R3F resolves the tag name against THREE.
 */
export default function Scene() {
  return (
    <Canvas
      // Where the photographer stands, looking at the origin [0, 0, 0] by default.
      // three.js is Y-up: x = right, y = up, z = toward the viewer.
      camera={{ position: [3, 2, 5], fov: 45 }}
      // Device pixel ratio, clamped to [min, max]. A phone may report dpr 3-4,
      // which means rendering 9-16x the pixels of dpr 1 for no visible gain.
      // Capping at 2 is the single cheapest performance win in any 3D scene.
      dpr={[1, 2]}
    >
      {/* Fill light: lifts the shadow side so it is not pure black. No direction. */}
      <ambientLight intensity={0.4} />

      {/* Key light: parallel rays, like the sun. Only the direction matters,
          the distance does not — position just sets which way it points. */}
      <directionalLight position={[5, 5, 5]} intensity={2} />

      {/* The actor. A mesh is meaningless without both children. */}
      <mesh>
        {/* args are the constructor arguments: new THREE.BoxGeometry(1, 1, 1) */}
        <boxGeometry args={[1, 1, 1]} />
        {/* "Standard" = physically based. It reacts to light.
            Brass gold, the accent colour from the Heaven logo. */}
        <meshStandardMaterial color="#C9A227" />
      </mesh>
    </Canvas>
  )
}
