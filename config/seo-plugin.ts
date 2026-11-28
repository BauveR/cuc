import type { Plugin } from 'vite'
import type { SiteContent } from '../src/content/types.ts'
import { POSTER, posterSrcSet } from '../src/features/hero3d/scene.config.ts'
import { buildRobots, buildSitemap } from './seo-files.ts'
import { buildHeadTags, buildJsonLd, serializeJsonLd } from './seo-tags.ts'
import type { SiteUrl } from './site-url.ts'

export const SEO_PLACEHOLDER = '<!--%SEO%-->'

/** Fuente crítica (texto latino): se precarga para evitar FOUT/CLS. */
const CRITICAL_FONT = /inter-latin-wght-normal-[\w-]+\.woff2$/

const posterPreload = (): string =>
  `<link rel="preload" as="image" type="image/avif" imagesrcset="${posterSrcSet('avif')}" ` +
  `imagesizes="${POSTER.sizes}" fetchpriority="high" />`

const fontPreload = (fileName: string): string =>
  `<link rel="preload" as="font" type="font/woff2" href="/${fileName}" crossorigin />`

export const findCriticalFont = (fileNames: readonly string[]): string | undefined =>
  fileNames.find((name) => CRITICAL_FONT.test(name))

interface SeoOptions {
  readonly content: SiteContent
  readonly site: SiteUrl
  /** Fecha del build (YYYY-MM-DD) para sitemap lastmod. */
  readonly buildDate: string
}

/** SEO + precargas críticas en index.html; robots.txt y sitemap.xml en dist/. */
export const seoPlugin = ({ content, site, buildDate }: SeoOptions): Plugin => ({
  name: 'seo',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      const font = findCriticalFont(Object.keys(ctx.bundle ?? {}))
      const tags = [
        posterPreload(),
        ...(font ? [fontPreload(font)] : []),
        buildHeadTags(content, site.url, !site.isPlaceholder),
        `<script type="application/ld+json">${serializeJsonLd(buildJsonLd(content, site.url))}</script>`,
      ]
      return html.replace(SEO_PLACEHOLDER, tags.join('\n    '))
    },
  },
  generateBundle() {
    if (site.isPlaceholder) {
      this.warn('VITE_SITE_URL no definida: canonical/OG usan example.com y robots.txt bloquea la indexación.')
    }
    this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobots(site.url, site.isPlaceholder) })
    this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemap(site.url, buildDate) })
  },
})
