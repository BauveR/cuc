import { describe, expect, it } from 'vitest'
import { DEFAULT_LOCALE, LOCALES, getContent } from '.'

describe('content', () => {
  it('devuelve el idioma por defecto', () => {
    expect(getContent().meta.lang).toBe(DEFAULT_LOCALE)
  })

  it.each(LOCALES)('el idioma "%s" no tiene textos vacíos', (locale) => {
    const walk = (value: unknown): string[] =>
      typeof value === 'string'
        ? [value]
        : Object.values(value as Record<string, unknown>).flatMap(walk)

    for (const text of walk(getContent(locale))) {
      expect(text.trim()).not.toBe('')
    }
  })
})
