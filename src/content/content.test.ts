import { describe, expect, it } from 'vitest'
import { isSafeHref } from '@/lib/url'
import { DEFAULT_LOCALE, LOCALES, SECTION_IDS, getContent, type ServiceId } from './site'

const walk = (value: unknown, key = ''): Array<[string, unknown]> =>
  value !== null && typeof value === 'object'
    ? Object.entries(value).flatMap(([k, v]) => walk(v, k))
    : [[key, value]]

const REQUIRED_SERVICES: readonly ServiceId[] = [
  'it-support',
  'cybersecurity',
  'cloud',
  'web-development',
  'integration-automation',
  'digital-consulting',
]

describe('content', () => {
  it('devuelve el idioma por defecto', () => {
    expect(getContent().meta.lang).toBe(DEFAULT_LOCALE)
  })

  describe.each(LOCALES)('idioma "%s"', (locale) => {
    const content = getContent(locale)
    const leaves = walk(content)

    it('no tiene textos vacíos', () => {
      for (const [, value] of leaves) {
        if (typeof value === 'string') expect(value.trim()).not.toBe('')
      }
    })

    it('todos los enlaces usan esquemas seguros', () => {
      const hrefs = leaves.filter(([key]) => key === 'href').map(([, v]) => String(v))
      expect(hrefs.length).toBeGreaterThan(0)
      for (const href of hrefs) expect(isSafeHref(href), href).toBe(true)
    })

    it('incluye los seis servicios, sin duplicados', () => {
      const ids = content.services.items.map((s) => s.id)
      expect([...ids].sort()).toEqual([...REQUIRED_SERVICES].sort())
    })

    it('las anclas internas apuntan a secciones existentes', () => {
      const known = new Set<string>(Object.values(SECTION_IDS))
      const anchors = leaves
        .filter(([key, v]) => key === 'href' && String(v).startsWith('#'))
        .map(([, v]) => String(v).slice(1))
      for (const id of anchors) expect(known.has(id), id).toBe(true)
    })

    it('el proceso tiene 5 pasos (01–05)', () => {
      expect(content.process.steps).toHaveLength(5)
    })

    it('los ids de sectores, casos e integraciones son únicos', () => {
      for (const list of [content.sectors.items, content.cases.items, content.integrations.items]) {
        const ids = list.map((item) => item.id)
        expect(new Set(ids).size).toBe(ids.length)
      }
    })
  })
})
