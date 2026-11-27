import { afterEach, describe, expect, it, vi } from 'vitest'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { useThree, type RootState } from '@react-three/fiber'
import type { Group, PerspectiveCamera } from 'three'
import { AnimatedModel } from './AnimatedModel'
import { PlaceholderModel, createPlaceholderController } from './PlaceholderModel'
import { fitDistance } from './fitCamera'
import { scrollState, setScrollProgress } from './scrollState'
import { SCENE } from './scene.config'
import type { ModelController } from './types'

// Esta suite usa R3F real (renderer sin GPU), no el mock global de Canvas.
vi.unmock('@react-three/fiber')

const controller: ModelController = {
  radius: 1,
  poseAt: (p) => ({ position: [p * 4, 0, 0], rotation: [0, p, 0], scale: 1 + p }),
}

const renderModel = () =>
  ReactThreeTestRenderer.create(
    <AnimatedModel controller={controller}>
      <mesh />
    </AnimatedModel>,
  )

describe('escena 3D', () => {
  afterEach(() => setScrollProgress(0))

  it('AnimatedModel se acerca a la pose objetivo con amortiguación', async () => {
    const renderer = await renderModel()
    const group = renderer.scene.children[0]?.instance as Group
    setScrollProgress(1)

    await ReactThreeTestRenderer.act(() => renderer.advanceFrames(1, 1 / 60))
    const afterOne = group.position.x
    expect(afterOne).toBeGreaterThan(0)
    expect(afterOne).toBeLessThan(4) // no salta: amortigua

    await ReactThreeTestRenderer.act(() => renderer.advanceFrames(240, 1 / 60))
    expect(group.position.x).toBeCloseTo(4, 2)
    expect(group.scale.x).toBeCloseTo(2, 2)
    expect(scrollState.progress).toBe(1)
  })

  it('PlaceholderModel encuadra la cámara según el radio del recorrido', async () => {
    let state: RootState | undefined
    function Probe() {
      state = useThree()
      return null
    }
    await ReactThreeTestRenderer.create(
      <>
        <PlaceholderModel />
        <Probe />
      </>,
      { camera: SCENE.camera },
    )
    if (!state) throw new Error('Sin estado de R3F')
    const { camera, size } = state
    const cam = camera as PerspectiveCamera
    const radius = createPlaceholderController(size.width < 768).radius
    const expected = fitDistance(radius * 1.15, cam.fov, size.width / size.height)
    expect(cam.position.z).toBeCloseTo(expected, 3)
  })

  it('createPlaceholderController usa keyframes distintos en móvil y escritorio', () => {
    const mobile = createPlaceholderController(true).poseAt(0)
    const desktop = createPlaceholderController(false).poseAt(0)
    expect(mobile.position[0]).toBe(0)
    expect(desktop.position).not.toEqual(mobile.position)
  })
})
