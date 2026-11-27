import { describe, expect, it } from 'vitest'
import { getContent } from '../src/content/site.ts'
import { buildRobots, buildSitemap } from './seo-files.ts'
import { findCriticalFont } from './seo-plugin.ts'
import { buildHeadTags, buildJsonLd, serializeJsonLd } from './seo-tags.ts'

const content = getContent()
const SITE = 'https://www.marca.es'

describe('head tags', () => {
  const tags = buildHeadTags(content, SITE)

  it('incluye canonical, Open Graph y Twitter Card con URLs absolutas', () => {
    expect(tags).toContain(`<link rel="canonical" href="${SITE}/" />`)
    expect(tags).toContain(`<meta property="og:image" content="${SITE}/og/og-image.jpg" />`)
    expect(tags).toContain('<meta property="og:locale" content="es_ES" />')
    expect(tags).toContain('<meta name="twitter:card" content="summary_large_image" />')
  })

  it('sin URL real marca noindex (coherente con robots.txt)', () => {
    expect(tags).toContain('content="index, follow')
    expect(buildHeadTags(content, SITE, false)).toContain('content="noindex, nofollow"')
  })

  it('escapa los valores (sin inyección de HTML)', () => {
    const evil = { ...content, meta: { ...content.meta, title: '"><script>x</script>' } }
    expect(buildHeadTags(evil, SITE)).not.toContain('<script>')
  })
})

describe('JSON-LD', () => {
  const data = buildJsonLd(content, SITE)

  it('es un LocalBusiness en Barcelona con los servicios del contenido', () => {
    expect(data).toMatchObject({ '@type': 'LocalBusiness', address: { addressLocality: 'Barcelona' } })
    const catalog = data['hasOfferCatalog'] as { itemListElement: unknown[] }
    expect(catalog.itemListElement).toHaveLength(content.services.items.length)
  })

  it('no puede cerrar la etiqueta <script> aunque el texto lo intente', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' })
    expect(json).not.toMatch(/<\/?script/i)
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)</script>' })
  })
})

describe('robots y sitemap', () => {
  it('con URL real permite indexar y enlaza el sitemap', () => {
    expect(buildRobots(SITE, false)).toContain(`Sitemap: ${SITE}/sitemap.xml`)
  })

  it('con URL placeholder bloquea la indexación', () => {
    expect(buildRobots('https://example.com', true)).toContain('Disallow: /')
  })

  it('sitemap válido con loc y lastmod', () => {
    const xml = buildSitemap(SITE, '2026-11-27')
    expect(xml).toContain(`<loc>${SITE}/</loc>`)
    expect(xml).toContain('<lastmod>2026-11-27</lastmod>')
  })

  it('localiza la fuente crítica (latin, no latin-ext) en el bundle', () => {
    const files = ['assets/inter-latin-ext-wght-normal-A1.woff2', 'assets/inter-latin-wght-normal-B2.woff2']
    expect(findCriticalFont(files)).toBe('assets/inter-latin-wght-normal-B2.woff2')
    expect(findCriticalFont([])).toBeUndefined()
  })
})
