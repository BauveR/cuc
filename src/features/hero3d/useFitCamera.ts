import { useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { PerspectiveCamera } from 'three'
import { fitDistance } from './fitCamera'

/** Margen extra alrededor del modelo (1 = justo al borde). */
const MARGIN = 1.15

/**
 * Coloca la cámara a la distancia que encuadra una esfera de `radius`
 * y la recalcula al cambiar el aspect ratio (rotación, resize).
 */
export const useFitCamera = (radius: number): void => {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / Math.max(1, s.size.height))
  const invalidate = useThree((s) => s.invalidate)

  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return
    camera.position.set(0, 0, fitDistance(radius * MARGIN, camera.fov, aspect))
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    invalidate()
  }, [camera, aspect, radius, invalidate])
}
