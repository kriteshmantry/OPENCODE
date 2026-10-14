// src/components/OpenCodeMascot.tsx
// "BYTE" – the OpenCode NITR 3D mascot. React Three Fiber + Drei.
// Supports both Procedural (zero assets download) and GLB modes,
// with interactive cursor tracking, blinking, idle float, and theme synchronization.

import { Suspense, useEffect, useMemo, useRef, useState, CSSProperties } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* Brand palette (matches the site: Matrix Green or Cobalt Blue)       */
/* ------------------------------------------------------------------ */
interface Palette {
  shell: string
  shellLight: string
  visor: string
  glow: string
  cyan: string
  rim: string
}

function getPalette(theme: 'green' | 'blue' = 'green'): Palette {
  if (theme === 'blue') {
    return {
      shell: '#0e1726',
      shellLight: '#18263e',
      visor: '#030812',
      glow: '#1C6DFD',
      cyan: '#38bdf8',
      rim: '#1C6DFD',
    }
  }
  return {
    shell: '#16211c',      // graphite w/ slight green tint
    shellLight: '#22322b',
    visor: '#030806',
    glow: '#00ff41',
    cyan: '#00d4ff',       // tiny accent only (matches the ">" prompt on the site)
    rim: '#00ff41',
  }
}

/* Shared materials – created once, reused by every mesh */
function useMaterials(theme: 'green' | 'blue' = 'green') {
  const palette = useMemo(() => getPalette(theme), [theme])

  return useMemo(() => {
    const shell = new THREE.MeshStandardMaterial({
      color: palette.shell,
      roughness: 0.55,
      metalness: 0.35,
    })
    const shellLight = new THREE.MeshStandardMaterial({
      color: palette.shellLight,
      roughness: 0.5,
      metalness: 0.4,
    })
    const visor = new THREE.MeshStandardMaterial({
      color: palette.visor,
      roughness: 0.15,
      metalness: 0.6,
    })
    const glow = new THREE.MeshBasicMaterial({
      color: palette.glow,
      toneMapped: false,
    })
    const glowDim = new THREE.MeshStandardMaterial({
      color: palette.glow,
      emissive: palette.glow,
      emissiveIntensity: 0.6,
      roughness: 0.6,
    })
    const cyan = new THREE.MeshBasicMaterial({
      color: palette.cyan,
      toneMapped: false,
    })
    return { shell, shellLight, visor, glow, glowDim, cyan, palette }
  }, [palette])
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

interface IdleRefs {
  root: React.RefObject<THREE.Group | null>
  head: React.RefObject<THREE.Group | null>
  eyeL: React.RefObject<THREE.Mesh | null>
  eyeR: React.RefObject<THREE.Mesh | null>
  armL: React.RefObject<THREE.Group | null>
  armR: React.RefObject<THREE.Group | null>
}

/* ------------------------------------------------------------------ */
/* Idle animation shared by procedural + GLB versions                  */
/* ------------------------------------------------------------------ */
function useIdle(refs: IdleRefs) {
  const reduced = useRef(prefersReducedMotion())
  const nextBlink = useRef(2)
  const blink = useRef(0)

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const { root, head, eyeL, eyeR, armL, armR } = refs
    if (reduced.current) return

    // Gentle floating bob and slight body yaw
    if (root.current) {
      root.current.position.y = Math.sin(t * 1.6) * 0.06
      root.current.rotation.y = Math.sin(t * 0.5) * 0.08
    }

    // Head follows pointer (damped), with a slow idle wander as base
    if (head.current) {
      const tx = -state.pointer.y * 0.25 + Math.sin(t * 0.7) * 0.03
      const ty = state.pointer.x * 0.45 + Math.sin(t * 0.4) * 0.05
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tx, 4, dt)
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, ty, 4, dt)
    }

    // Arms sway in opposite phase
    if (armL.current) armL.current.rotation.z = 0.08 + Math.sin(t * 1.6) * 0.05
    if (armR.current) armR.current.rotation.z = -0.08 - Math.sin(t * 1.6 + 0.6) * 0.05

    // Blink every 2–5 s
    nextBlink.current -= dt
    if (nextBlink.current <= 0) {
      blink.current = 0.14
      nextBlink.current = 2 + Math.random() * 3
    }
    let k = 1
    if (blink.current > 0) {
      blink.current -= dt
      const p = 1 - Math.max(blink.current, 0) / 0.14 // 0 -> 1
      k = Math.max(0.08, Math.abs(Math.cos(p * Math.PI))) // close & reopen
    }
    if (eyeL.current) eyeL.current.scale.y = k
    if (eyeR.current) eyeR.current.scale.y = k
  })
}

/* ------------------------------------------------------------------ */
/* Procedural mascot – ~15 meshes, low segment counts, 6 materials     */
/* ------------------------------------------------------------------ */
interface ByteProps {
  theme?: 'green' | 'blue'
  onRootReady?: (group: THREE.Group) => void
}

export function ProceduralByte({ theme = 'green', onRootReady }: ByteProps) {
  const m = useMaterials(theme)
  const refs: IdleRefs = {
    root: useRef<THREE.Group>(null),
    head: useRef<THREE.Group>(null),
    eyeL: useRef<THREE.Mesh>(null),
    eyeR: useRef<THREE.Mesh>(null),
    armL: useRef<THREE.Group>(null),
    armR: useRef<THREE.Group>(null),
  }
  useIdle(refs)

  useEffect(() => {
    if (refs.root.current && onRootReady) {
      onRootReady(refs.root.current)
    }
  }, [onRootReady])

  const Arm = ({ side, innerRef }: { side: number; innerRef: React.RefObject<THREE.Group | null> }) => (
    <group ref={innerRef as any} position={[side * 0.78, 0.0, 0]}>
      <mesh material={m.shellLight} position={[side * 0.02, -0.05, 0]}>
        <sphereGeometry args={[0.22, 12, 10]} />
      </mesh>
      <mesh material={m.shell} position={[side * 0.04, -0.4, 0]}>
        <capsuleGeometry args={[0.12, 0.4, 4, 8]} />
      </mesh>
      <RoundedBox
        args={[0.26, 0.26, 0.26]}
        radius={0.06}
        smoothness={2}
        material={m.shellLight}
        position={[side * 0.04, -0.82, 0]}
      />
    </group>
  )

  return (
    <group ref={refs.root as any} position={[0, -0.2, 0]}>
      {/* ---------- HEAD ---------- */}
      <group ref={refs.head as any} position={[0, 1.15, 0]}>
        <RoundedBox args={[1.6, 1.15, 1.1]} radius={0.18} smoothness={3} material={m.shell} />

        {/* Recessed visor */}
        <RoundedBox
          args={[1.28, 0.84, 0.08]}
          radius={0.1}
          smoothness={3}
          material={m.visor}
          position={[0, 0, 0.53]}
        />

        {/* Eyes (glow neon) */}
        <mesh ref={refs.eyeL as any} material={m.glow} position={[-0.3, 0.02, 0.58]} scale={[0.8, 1.15, 0.25]}>
          <sphereGeometry args={[0.13, 14, 12]} />
        </mesh>
        <mesh ref={refs.eyeR as any} material={m.glow} position={[0.3, 0.02, 0.58]} scale={[0.8, 1.15, 0.25]}>
          <sphereGeometry args={[0.13, 14, 12]} />
        </mesh>

        {/* Side modules (the "ear" capsule from the sketch) */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.84, 0, 0.05]}>
            <RoundedBox args={[0.14, 0.5, 0.34]} radius={0.06} smoothness={2} material={m.shellLight} />
            <mesh material={m.glowDim} position={[s * 0.075, 0, 0]}>
              <boxGeometry args={[0.02, 0.28, 0.14]} />
            </mesh>
          </group>
        ))}

        {/* Tiny status LED, top-right corner */}
        <mesh material={m.cyan} position={[0.62, -0.5, 0.56]}>
          <sphereGeometry args={[0.03, 8, 8]} />
        </mesh>
      </group>

      {/* ---------- NECK ---------- */}
      <mesh material={m.visor} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.26, 0.2, 10]} />
      </mesh>

      {/* ---------- TORSO ---------- */}
      <RoundedBox
        args={[1.2, 0.9, 0.78]}
        radius={0.15}
        smoothness={3}
        material={m.shell}
        position={[0, 0.0, 0]}
      />

      {/* Chest plate */}
      <RoundedBox
        args={[0.8, 0.5, 0.06]}
        radius={0.06}
        smoothness={2}
        material={m.shellLight}
        position={[0, 0.08, 0.4]}
      />

      {/* Terminal-style LED strip */}
      <mesh material={m.glowDim} position={[0, -0.12, 0.44]}>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
      </mesh>

      {/* Waist */}
      <RoundedBox
        args={[0.8, 0.22, 0.6]}
        radius={0.06}
        smoothness={2}
        material={m.visor}
        position={[0, -0.55, 0]}
      />

      {/* ---------- ARMS (relaxed, hands empty) ---------- */}
      <Arm side={-1} innerRef={refs.armL} />
      <Arm side={1} innerRef={refs.armR} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* GLB mascot – expects named nodes: Head, EyeL, EyeR, ArmL, ArmR      */
/* ------------------------------------------------------------------ */
const GLB_URL = '/models/opencode-byte.glb'

function GLBByte() {
  const { scene } = useGLTF(GLB_URL)
  const refs: IdleRefs = {
    root: useRef<THREE.Group>(null),
    head: useRef<THREE.Group>(null),
    eyeL: useRef<THREE.Mesh>(null),
    eyeR: useRef<THREE.Mesh>(null),
    armL: useRef<THREE.Group>(null),
    armR: useRef<THREE.Group>(null),
  }

  useEffect(() => {
    refs.head.current = scene.getObjectByName('Head') as any
    refs.eyeL.current = scene.getObjectByName('EyeL') as any
    refs.eyeR.current = scene.getObjectByName('EyeR') as any
    refs.armL.current = scene.getObjectByName('ArmL') as any
    refs.armR.current = scene.getObjectByName('ArmR') as any
  }, [scene])

  useIdle(refs)
  return (
    <group ref={refs.root as any}>
      <primitive object={scene} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Canvas wrapper – lighting, perf settings, pauses when off-screen    */
/* ------------------------------------------------------------------ */
export interface MascotCanvasProps {
  useGLB?: boolean
  className?: string
  style?: CSSProperties
  theme?: 'green' | 'blue'
  onRootReady?: (group: THREE.Group) => void
}

export function MascotCanvas({
  useGLB = false,
  className = '',
  style,
  theme = 'green',
  onRootReady,
}: MascotCanvasProps) {
  const wrap = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const palette = useMemo(() => getPalette(theme), [theme])

  useEffect(() => {
    if (!wrap.current) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(wrap.current)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={wrap}
      className={`relative select-none pointer-events-auto ${className}`}
      style={{ width: '100%', height: 420, ...style }}
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'} // Zero GPU cost when scrolled away
        dpr={[1, 1.75]} // Cap pixel ratio for performance
        camera={{ position: [0, 0.6, 5], fov: 32 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        style={{ background: 'transparent' }} // Let site grid and particles show through
      >
        <hemisphereLight
          args={[theme === 'blue' ? '#38bdf8' : '#6bffa0', '#02100a', 0.55]}
        />
        <directionalLight position={[3, 4, 4]} intensity={1.1} />
        {/* Neon rim light matching current theme */}
        <pointLight
          position={[-3, 1, -2]}
          color={palette.rim}
          intensity={18}
          distance={10}
        />
        <Suspense fallback={null}>
          {useGLB ? (
            <GLBByte />
          ) : (
            <ProceduralByte theme={theme} onRootReady={onRootReady} />
          )}
        </Suspense>
      </Canvas>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Export helper: export procedural model to .glb file                 */
/* ------------------------------------------------------------------ */
export async function exportGLB(object3D: THREE.Object3D, filename = 'opencode-byte.glb') {
  const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js')
  new GLTFExporter().parse(
    object3D,
    (buf) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([buf as ArrayBuffer], { type: 'model/gltf-binary' }))
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
    },
    (err) => console.error(err),
    { binary: true }
  )
}

export default MascotCanvas
