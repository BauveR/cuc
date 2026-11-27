/**
 * Allowlist de esquemas de enlace. Bloquea `javascript:`, `data:`, `vbscript:`
 * y URLs protocol-relative (`//evil.com`), vectores clásicos de XSS/open redirect.
 */
const SAFE_PATTERNS: readonly RegExp[] = [
  /^#[\w-]*$/, // ancla
  /^\/(?!\/)[\w\-./?=&#%]*$/, // ruta interna, no `//`
  /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/,
  /^tel:\+?[\d\s-]+$/,
  /^https:\/\/[^\s]+$/,
]

export const isSafeHref = (href: string): boolean =>
  SAFE_PATTERNS.some((pattern) => pattern.test(href.trim()))

/** Enlaces externos: deben abrirse con rel="noopener noreferrer". */
export const isExternalHref = (href: string): boolean => href.startsWith('https://')
