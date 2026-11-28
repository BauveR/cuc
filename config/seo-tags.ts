import type { SiteContent } from '../src/content/types.ts'
import { escapeHtml } from './html-meta-plugin.ts'

export const OG_IMAGE = { path: '/og/og-image.jpg', width: 1200, height: 630 } as const

const meta = (attr: 'name' | 'property', key: string, value: string): string =>
  `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`

/**
 * Canonical, robots, Open Graph y Twitter Card. Todos los valores escapados.
 * indexable=false (URL placeholder) → noindex, coherente con robots.txt.
 */
export const buildHeadTags = (content: SiteContent, siteUrl: string, indexable = true): string => {
  const { meta: m } = content
  const image = `${siteUrl}${OG_IMAGE.path}`
  return [
    `<link rel="canonical" href="${escapeHtml(`${siteUrl}/`)}" />`,
    meta('name', 'robots', indexable ? 'index, follow, max-image-preview:large' : 'noindex, nofollow'),
    meta('property', 'og:type', 'website'),
    meta('property', 'og:site_name', content.brand.name),
    meta('property', 'og:locale', m.locale),
    meta('property', 'og:url', `${siteUrl}/`),
    meta('property', 'og:title', m.title),
    meta('property', 'og:description', m.description),
    meta('property', 'og:image', image),
    meta('property', 'og:image:width', String(OG_IMAGE.width)),
    meta('property', 'og:image:height', String(OG_IMAGE.height)),
    meta('property', 'og:image:alt', m.ogImageAlt),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', m.title),
    meta('name', 'twitter:description', m.description),
    meta('name', 'twitter:image', image),
  ].join('\n    ')
}

/** Datos estructurados schema.org LocalBusiness (solo datos reales del contenido). */
export const buildJsonLd = (content: SiteContent, siteUrl: string): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: content.brand.name,
  description: content.meta.description,
  url: `${siteUrl}/`,
  image: `${siteUrl}${OG_IMAGE.path}`,
  email: content.contact.email,
  address: {
    '@type': 'PostalAddress',
    addressLocality: content.contact.location,
    addressCountry: 'ES',
  },
  areaServed: { '@type': 'City', name: content.contact.location },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: content.services.title,
    itemListElement: content.services.items.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.summary },
    })),
  },
})

/**
 * JSON-LD seguro para incrustar en <script>: escapa <, > y & como \\uXXXX
 * para que un texto con "</script>" nunca pueda cerrar la etiqueta (XSS).
 */
export const serializeJsonLd = (data: unknown): string =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
