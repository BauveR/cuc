import { describe, expect, it } from 'vitest'
import { escapeHtml, htmlMeta } from './html-meta-plugin.ts'

describe('escapeHtml', () => {
  it('neutraliza caracteres peligrosos', () => {
    expect(escapeHtml(`<script>"x"&'y'</script>`)).toBe(
      '&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;',
    )
  })
})

describe('htmlMeta', () => {
  it('sustituye los placeholders escapando valores', () => {
    const plugin = htmlMeta({ lang: 'es', title: 'A & B', description: '<b>d</b>' })
    const transform = plugin.transformIndexHtml as (html: string) => string
    const out = transform('<html lang="%LANG%"><title>%TITLE%</title>%DESCRIPTION%')
    expect(out).toBe('<html lang="es"><title>A &amp; B</title>&lt;b&gt;d&lt;/b&gt;')
  })
})
