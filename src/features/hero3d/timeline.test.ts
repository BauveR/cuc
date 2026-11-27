import { describe, expect, it } from 'vitest'
import { TIMELINE } from './timeline.config'
import { assertTimeline, boundingRadius, createKeyframeController, sampleTimeline } from './timeline'
import type { Keyframe } from './types'

const K: readonly [Keyframe, Keyframe, Keyframe] = [
  { at: 0, position: [0, 0, 0], rotation: [0, 0, 0], scale: 1 },
  { at: 0.5, position: [2, 0, 0], rotation: [0, 1, 0], scale: 2 },
  { at: 1, position: [2, 4, 0], rotation: [0, 1, 0], scale: 1 },
]

describe('timeline', () => {
  it.each(['mobile', 'desktop'] as const)('la configuración %s es válida', (device) => {
    expect(() => assertTimeline(TIMELINE[device])).not.toThrow()
  })

  it('rechaza timelines desordenadas o incompletas', () => {
    expect(() => assertTimeline([K[1], K[0]])).toThrow()
    expect(() => assertTimeline([K[0], K[1]])).toThrow()
    expect(() => assertTimeline([])).toThrow()
  })

  it('devuelve los keyframes exactos en sus puntos', () => {
    expect(sampleTimeline(K, 0)).toMatchObject({ position: [0, 0, 0], scale: 1 })
    expect(sampleTimeline(K, 0.5)).toMatchObject({ position: [2, 0, 0], scale: 2 })
    expect(sampleTimeline(K, 1)).toMatchObject({ position: [2, 4, 0], scale: 1 })
  })

  it('interpola entre keyframes', () => {
    const pose = sampleTimeline(K, 0.75)
    expect(pose.position).toEqual([2, 2, 0])
    expect(pose.scale).toBe(1.5)
  })

  it('acota el progreso fuera de [0, 1]', () => {
    expect(sampleTimeline(K, -1)).toEqual(sampleTimeline(K, 0))
    expect(sampleTimeline(K, 2)).toEqual(sampleTimeline(K, 1))
  })

  it('falla de forma explícita con una timeline vacía', () => {
    expect(() => sampleTimeline([], 0.5)).toThrow('Timeline vacía')
  })

  it('calcula el radio envolvente del recorrido', () => {
    // Peor caso: posición (2,4,0) → |p| = √20, más radio base × escala 1.
    expect(boundingRadius(K, 1)).toBeCloseTo(Math.sqrt(20) + 1)
  })

  it('el controller expone radio y poseAt', () => {
    const controller = createKeyframeController(K, 1)
    expect(controller.radius).toBeCloseTo(Math.sqrt(20) + 1)
    expect(controller.poseAt(0.25).position).toEqual([1, 0, 0])
  })
})
