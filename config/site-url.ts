/** URL usada si VITE_SITE_URL no está definida (dominio reservado, RFC 2606). */
export const PLACEHOLDER_SITE_URL = 'https://example.com'

export interface SiteUrl {
  readonly url: string
  /** true si se está usando el placeholder: no apto para producción. */
  readonly isPlaceholder: boolean
}

/**
 * Valida y normaliza la URL pública del sitio (canonical, OG, sitemap).
 * Solo https y sin credenciales, query ni hash: evita publicar URLs
 * inseguras o con datos en metadatos que indexan buscadores y redes.
 */
export const resolveSiteUrl = (raw: string | undefined): SiteUrl => {
  if (!raw?.trim()) return { url: PLACEHOLDER_SITE_URL, isPlaceholder: true }

  let parsed: URL
  try {
    parsed = new URL(raw.trim())
  } catch {
    throw new Error(`VITE_SITE_URL no es una URL válida: "${raw}"`)
  }
  if (parsed.protocol !== 'https:') throw new Error('VITE_SITE_URL debe usar https')
  if (parsed.username || parsed.password || parsed.search || parsed.hash) {
    throw new Error('VITE_SITE_URL no puede llevar credenciales, query ni hash')
  }
  return { url: `${parsed.origin}${parsed.pathname}`.replace(/\/$/, ''), isPlaceholder: false }
}
