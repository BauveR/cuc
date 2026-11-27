import type { Plugin } from 'vite'
import type { MetaContent } from '../src/content/types.ts'

const HTML_ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)

/**
 * Inyecta lang/title/description desde src/content en index.html,
 * para que ningún texto viva hardcodeado fuera del contenido.
 */
export const htmlMeta = (meta: MetaContent): Plugin => ({
  name: 'html-meta',
  transformIndexHtml: (html) =>
    html
      .replaceAll('%LANG%', escapeHtml(meta.lang))
      .replaceAll('%TITLE%', escapeHtml(meta.title))
      .replaceAll('%DESCRIPTION%', escapeHtml(meta.description)),
})
