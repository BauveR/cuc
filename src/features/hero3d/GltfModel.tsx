import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { AnimationMixer, LoopOnce, MathUtils } from 'three'
import { clipTime, objectRadius } from './clip'
import { scrollState } from './scrollState'
import { DAMPING, FRAME } from './timeline.config'
import { useFitCamera } from './useFitCamera'
import { useHeroGltf } from './useHeroGltf'

interface GltfModelProps {
  readonly url: string
}

/**
 * Modelo de marca (GLB). El progreso de scroll mueve el cabezal del primer
 * clip de animación, con amortiguación. La iluminación va horneada en las
 * texturas: la escena no necesita luces dinámicas caras.
 */
export function GltfModel({ url }: GltfModelProps) {
  const { scene, animations } = useHeroGltf(url)
  const mixer = useMemo(() => new AnimationMixer(scene), [scene])
  const radius = useMemo(() => objectRadius(scene), [scene])
  const duration = animations[0]?.duration ?? 0
  const time = useRef(0)
  useFitCamera(radius)

  useEffect(() => {
    const clip = animations[0]
    if (!clip) return
    const action = mixer.clipAction(clip)
    action.setLoop(LoopOnce, 1)
    action.clampWhenFinished = true // en progreso 1 se queda en el último frame
    action.play()
    return () => {
      mixer.stopAllAction()
      mixer.uncacheRoot(scene)
    }
  }, [animations, mixer, scene])

  useFrame((state, rawDelta) => {
    if (duration === 0) return
    const target = clipTime(scrollState.progress, duration)
    const delta = Math.min(rawDelta, FRAME.maxDelta)
    time.current = MathUtils.damp(time.current, target, DAMPING, delta)
    mixer.setTime(time.current)
    if (Math.abs(target - time.current) > FRAME.epsilon) state.invalidate()
  })

  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}
