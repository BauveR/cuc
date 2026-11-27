import type { ImageId } from '@/content/site'

/** Anchos generados para cada imagen (AVIF + WebP, sin metadatos EXIF). */
export const IMAGE_WIDTHS = [640, 1280, 1920] as const

interface ImageMeta {
  /** Dimensiones de la versión 1920 (proporción para width/height → CLS 0). */
  readonly width: number
  readonly height: number
}

/**
 * Catálogo de imágenes servidas desde /public/images (CSP img-src 'self').
 * Fuente: Pexels (licencia Pexels). Créditos en docs/CREDITS.md.
 */
export const IMAGES: Readonly<Record<ImageId, ImageMeta>> = {
  workspace: { width: 1920, height: 1080 },
  office: { width: 1920, height: 1280 },
  barcelona: { width: 1920, height: 1280 },
  network: { width: 1920, height: 1277 },
  team: { width: 1920, height: 1281 },
}

export type ImageFormat = 'avif' | 'webp'

export const imageUrl = (id: ImageId, width: number, format: ImageFormat): string =>
  `/images/${id}-${width}.${format}`

export const imageSrcSet = (id: ImageId, format: ImageFormat): string =>
  IMAGE_WIDTHS.map((w) => `${imageUrl(id, w, format)} ${w}w`).join(', ')
