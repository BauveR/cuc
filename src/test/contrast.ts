/** Utilidades WCAG 2.x de contraste (solo para tests de tokens). */

const toLinear = (channel: number): number => {
  const c = channel / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

const parseHex = (hex: string): [number, number, number] => {
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match?.[1]) throw new Error(`Color no soportado: ${hex}`)
  const n = Number.parseInt(match[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const luminance = (hex: string): number => {
  const [r, g, b] = parseHex(hex).map(toLinear) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export const contrastRatio = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (hi + 0.05) / (lo + 0.05)
}

/** Extrae `--color-x: #hex` de un CSS en crudo. */
export const parseColorTokens = (css: string): Record<string, string> =>
  Object.fromEntries(
    [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map((m) => [m[1], m[2]]),
  )

/** Mezcla `top` con opacidad `alpha` sobre `bottom` (composición sRGB simple). */
export const blend = (top: string, bottom: string, alpha: number): string => {
  const [t, b] = [parseHex(top), parseHex(bottom)]
  const mix = t.map((c, i) => Math.round(c * alpha + (b[i] ?? 0) * (1 - alpha)))
  return `#${mix.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}
