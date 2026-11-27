import { escapeHtml } from './html-meta-plugin.ts'

/**
 * robots.txt. Con la URL placeholder (build sin VITE_SITE_URL) se bloquea
 * la indexación: un despliegue mal configurado nunca entra en buscadores.
 */
export const buildRobots = (siteUrl: string, isPlaceholder: boolean): string =>
  isPlaceholder
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

/** sitemap.xml de la home (one-page). Se amplía al añadir rutas. */
export const buildSitemap = (siteUrl: string, lastmod: string): string =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${escapeHtml(`${siteUrl}/`)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </url>',
    '</urlset>',
    '',
  ].join('\n')
