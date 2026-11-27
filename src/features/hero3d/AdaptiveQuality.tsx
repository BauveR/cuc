import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import type { DprRange } from './quality'

interface AdaptiveQualityProps {
  readonly dpr: DprRange
}

/**
 * Ajusta la resolución en caliente según los FPS reales:
 * - PerformanceMonitor: si el rendimiento cae, baja al DPR mínimo del tier;
 *   si se recupera, vuelve al rango completo.
 * - AdaptiveDpr: baja temporalmente la resolución durante regresiones.
 */
export function AdaptiveQuality({ dpr }: AdaptiveQualityProps) {
  const setDpr = useThree((s) => s.setDpr)

  return (
    <>
      <PerformanceMonitor
        onDecline={() => setDpr(dpr[0])}
        onIncline={() => setDpr([dpr[0], dpr[1]])}
      />
      <AdaptiveDpr pixelated />
    </>
  )
}
