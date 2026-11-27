import { describe, expect, it } from 'vitest'
import css from './tokens.css?raw'
import { blend, contrastRatio, parseColorTokens } from '@/test/contrast'

const tokens = parseColorTokens(css)
const color = (name: string): string => {
  const value = tokens[name]
  if (!value) throw new Error(`Token --color-${name} no definido`)
  return value
}

/** [texto, fondo, mínimo]. 4.5 = texto normal AA · 3 = texto grande / UI. */
const PAIRS: ReadonlyArray<readonly [string, string, number]> = [
  ['ink', 'paper', 4.5],
  ['ink', 'surface', 4.5],
  ['ink-muted', 'paper', 4.5],
  ['ink-muted', 'surface', 4.5],
  ['accent', 'paper', 4.5],
  ['accent', 'surface', 4.5],
  ['on-inverse', 'inverse', 4.5],
  ['on-inverse-muted', 'inverse', 4.5],
]

describe('design tokens', () => {
  it('la utilidad de contraste es correcta (negro/blanco = 21:1)', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1)
    expect(() => contrastRatio('red', '#fff')).toThrow()
  })

  it.each(PAIRS)('%s sobre %s cumple %s:1 (WCAG AA)', (fg, bg, min) => {
    expect(contrastRatio(color(fg), color(bg))).toBeGreaterThanOrEqual(min)
  })

  it('velo móvil del intro (paper 85 % sobre el modelo oscuro) mantiene AA', () => {
    // Peor caso: el velo sobre el color más oscuro posible del modelo (ink).
    const veil = blend(color('paper'), color('ink'), 0.85)
    expect(contrastRatio(color('ink-muted'), veil)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(color('ink'), veil)).toBeGreaterThanOrEqual(4.5)
  })

  it('el foco sobre fondo inverso usa on-inverse (≥ 3:1, WCAG 2.4.11)', () => {
    expect(contrastRatio(color('accent'), color('inverse'))).toBeLessThan(3)
    expect(contrastRatio(color('on-inverse'), color('inverse'))).toBeGreaterThanOrEqual(3)
  })

  it('define la escala tipográfica y los espaciados de layout', () => {
    for (const token of ['text-display', 'text-headline', 'text-title', 'text-lead']) {
      expect(css).toMatch(new RegExp(`--${token}:\\s*clamp\\(`))
    }
    for (const token of ['spacing-gutter', 'spacing-stack', 'spacing-section']) {
      expect(css).toContain(`--${token}:`)
    }
  })
})
