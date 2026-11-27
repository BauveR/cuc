import { describe, expect, it } from 'vitest'
import { fitDistance } from './fitCamera'
import { scrollState, setScrollProgress } from './scrollState'

describe('fitDistance', () => {
  it('encuadra la esfera con el FOV vertical en pantallas apaisadas', () => {
    // fov 90° → sin(45°): d = r / 0.7071
    expect(fitDistance(1, 90, 2)).toBeCloseTo(Math.SQRT2)
  })

  it('usa el FOV horizontal (más restrictivo) en pantallas verticales', () => {
    expect(fitDistance(1, 90, 0.5)).toBeGreaterThan(fitDistance(1, 90, 2))
  })

  it('escala linealmente con el radio', () => {
    expect(fitDistance(2, 35, 1.5)).toBeCloseTo(2 * fitDistance(1, 35, 1.5))
  })
})

describe('scrollState', () => {
  it('guarda el progreso acotado a [0, 1]', () => {
    setScrollProgress(0.4)
    expect(scrollState.progress).toBe(0.4)
    setScrollProgress(3)
    expect(scrollState.progress).toBe(1)
    setScrollProgress(-1)
    expect(scrollState.progress).toBe(0)
  })

  it('ignora valores no finitos', () => {
    setScrollProgress(Number.NaN)
    expect(scrollState.progress).toBe(0)
  })
})
