import { Canvas } from '@react-three/fiber'
import { PlaceholderModel } from './PlaceholderModel'
import { SCENE } from './scene.config'
import { useScrollProgress } from './useScrollProgress'

interface HeroCanvasProps {
  readonly onReady: () => void
}

/**
 * Canvas WebGL del hero. Se carga con React.lazy en un chunk propio:
 * three/R3F no bloquean el primer render ni el LCP (lo cubre el póster).
 * Decorativo y sin interacción: sin eventos de puntero.
 */
export default function HeroCanvas({ onReady }: HeroCanvasProps) {
  useScrollProgress()
  const { ambient, key, rim } = SCENE.lights

  return (
    <Canvas
      frameloop="demand"
      dpr={SCENE.dpr}
      camera={SCENE.camera}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      className="pointer-events-none"
    >
      <ambientLight intensity={ambient} />
      <directionalLight intensity={key.intensity} position={key.position} />
      <directionalLight intensity={rim.intensity} position={rim.position} color={rim.color} />
      <PlaceholderModel />
    </Canvas>
  )
}
