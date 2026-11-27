import { describe, expect, it } from 'vitest'
import { PLACEHOLDER_SITE_URL, resolveSiteUrl } from './site-url.ts'

describe('resolveSiteUrl', () => {
  it.each([undefined, '', '   '])('sin valor usa el placeholder (%s)', (raw) => {
    expect(resolveSiteUrl(raw)).toEqual({ url: PLACEHOLDER_SITE_URL, isPlaceholder: true })
  })

  it('normaliza quitando la barra final', () => {
    expect(resolveSiteUrl('https://www.marca.es/')).toEqual({ url: 'https://www.marca.es', isPlaceholder: false })
  })

  it.each([
    ['no es URL', 'marca.es'],
    ['http inseguro', 'http://www.marca.es'],
    ['javascript:', 'javascript:alert(1)'],
    ['credenciales', 'https://user:pass@marca.es'],
    ['query', 'https://marca.es/?utm=x'],
    ['hash', 'https://marca.es/#a'],
  ])('rechaza %s', (_, raw) => {
    expect(() => resolveSiteUrl(raw)).toThrow()
  })
})
