import { describe, expect, it } from 'vitest'
import { SECTION_IDS, anchor } from './sections'

describe('sections', () => {
  it('genera anclas a partir de ids estables', () => {
    expect(anchor(SECTION_IDS.contact)).toBe('#contacto')
  })

  it('los ids son únicos y válidos para atributos id', () => {
    const ids = Object.values(SECTION_IDS)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/)
  })
})
