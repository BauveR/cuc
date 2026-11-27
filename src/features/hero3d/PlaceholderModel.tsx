import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { AnimatedModel } from './AnimatedModel'
import { createKeyframeController } from './timeline'
import { MOBILE_BREAKPOINT, PLACEHOLDER_RADIUS, TIMELINE } from './timeline.config'
import { SCENE } from './scene.config'
import { useFitCamera } from './useFitCamera'
import type { ModelController } from './types'

/** Controller del placeholder: keyframes móvil o escritorio. */
export const createPlaceholderController = (isMobile: boolean): ModelController =>
  createKeyframeController(isMobile ? TIMELINE.mobile : TIMELINE.desktop, PLACEHOLDER_RADIUS)

/**
 * Modelo provisional (icosaedro facetado) hasta tener el modelo de marca.
 * Sustituirlo = otro componente con su propio ModelController.
 */
export function PlaceholderModel() {
  const isMobile = useThree((s) => s.size.width < MOBILE_BREAKPOINT)
  const controller = useMemo(() => createPlaceholderController(isMobile), [isMobile])
  useFitCamera(controller.radius)

  return (
    <AnimatedModel controller={controller}>
      <Center>
        <mesh>
          <icosahedronGeometry args={[PLACEHOLDER_RADIUS, 1]} />
          <meshStandardMaterial {...SCENE.material} flatShading />
        </mesh>
      </Center>
    </AnimatedModel>
  )
}
