import { useRef, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils, type Group } from 'three'
import { DAMPING, FRAME } from './timeline.config'
import { scrollState } from './scrollState'
import type { ModelController } from './types'

interface AnimatedModelProps {
  readonly controller: ModelController
  readonly children: ReactNode
}

/**
 * Sigue la pose del controller para el progreso actual con amortiguación
 * (MathUtils.damp, independiente del framerate). Mientras no alcance la
 * pose objetivo, pide otro frame (frameloop="demand").
 */
export function AnimatedModel({ controller, children }: AnimatedModelProps) {
  const group = useRef<Group>(null)

  useFrame((state, rawDelta) => {
    const g = group.current
    if (!g) return
    const delta = Math.min(rawDelta, FRAME.maxDelta)
    const target = controller.poseAt(scrollState.progress)
    let error = 0

    const damp = (current: number, goal: number): number => {
      const next = MathUtils.damp(current, goal, DAMPING, delta)
      error = Math.max(error, Math.abs(goal - next))
      return next
    }

    g.position.set(
      damp(g.position.x, target.position[0]),
      damp(g.position.y, target.position[1]),
      damp(g.position.z, target.position[2]),
    )
    g.rotation.set(
      damp(g.rotation.x, target.rotation[0]),
      damp(g.rotation.y, target.rotation[1]),
      damp(g.rotation.z, target.rotation[2]),
    )
    g.scale.setScalar(damp(g.scale.x, target.scale))

    if (error > FRAME.epsilon) state.invalidate()
  })

  return <group ref={group}>{children}</group>
}
