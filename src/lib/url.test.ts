import { describe, expect, it } from 'vitest'
import { isExternalHref, isSafeHref } from './url'

describe('isSafeHref', () => {
  it.each([
    '#servicios',
    '/',
    '/legal/privacidad',
    'mailto:hola@example.com',
    'tel:+34 900 000 000',
    'https://www.linkedin.com/company/x',
  ])('acepta %s', (href) => {
    expect(isSafeHref(href)).toBe(true)
  })

  it.each([
    'javascript:alert(1)',
    ' JavaScript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '//evil.example',
    'http://insecure.example',
    'mailto:no-es-email',
    '',
  ])('rechaza %s', (href) => {
    expect(isSafeHref(href)).toBe(false)
  })
})

describe('isExternalHref', () => {
  it('solo considera externos los https', () => {
    expect(isExternalHref('https://example.com')).toBe(true)
    expect(isExternalHref('#contacto')).toBe(false)
  })
})
