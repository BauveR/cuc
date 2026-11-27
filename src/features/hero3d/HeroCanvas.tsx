import { useEffect } from 'react'
import { Canvas, invalidate } from '@react-three/fiber'
import { usePageVisible } from '@/hooks/usePageVisible'
import { AdaptiveQuality } from './AdaptiveQuality'
import { HeroModel } from './HeroModel'
import { PERFORMANCE_MIN, type DprRange } from './quality'
import { SCENE } from './scene.config'
import { useScrollProgress } from './useScrollProgress'

interface HeroCanvasProps {
  readonly onReady: () => void
  /** Rango de DPR decidido por el tier de GPU (useGpuTier). */
  readonly dpr: DprRange
}

/**
 * Canvas WebGL del hero. Chunk diferido (React.lazy + vendor-three).
 * Decorativo y sin interacción. Con la pestaña oculta: frameloop "never"
 * (0 frames, 0 GPU); al volver se pide un frame para repintar.
 */
export default function HeroCanvas({ onReady, dpr }: HeroCanvasProps) {
  useScrollProgress()
  const visible = usePageVisible()
  const { ambient, key, rim } = SCENE.lights

  useEffect(() => {
    if (visible) invalidate()
  }, [visible])

  return (
    <Canvas
      frameloop={visible ? 'demand' : 'never'}
      dpr={[dpr[0], dpr[1]]}
      performance={{ min: PERFORMANCE_MIN }}
      camera={SCENE.camera}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      onCreated={onReady}
      className="pointer-events-none"
    >
      <ambientLight intensity={ambient} />
      <directionalLight intensity={key.intensity} position={key.position} />
      <directionalLight intensity={rim.intensity} position={rim.position} color={rim.color} />
      <AdaptiveQuality dpr={dpr} />
      <HeroModel />
    </Canvas>
  )
}
