/**
 * Vídeo del hero: avanza con el scroll (no se reproduce solo).
 * Dos encuadres generados con scripts/encode-hero-video.sh a partir de
 * media-src/hero.mov (original ignorado por git, con metadatos GPS):
 * - landscapeHd: resolución nativa (1920×1080), solo escritorio grande/Retina;
 * - landscape: 1280 px, recuadros anchos en pantallas medianas;
 * - portrait: recorte 3:4, para móvil/tablet en vertical.
 * H.264 24 fps + faststart, keyframe cada 0,5 s: seek rápido al hacer scrub.
 */
export interface VideoRendition {
  readonly src: string
  readonly poster: { readonly avif: string; readonly webp: string }
  readonly width: number
  readonly height: number
  /** Presupuesto de peso del mp4 (lo comprueba un test). */
  readonly maxBytes: number
}

const MB = 1024 * 1024

const rendition = (name: string, width: number, height: number, maxMb: number): VideoRendition => ({
  src: `/video/hero-${name}.mp4`,
  poster: { avif: `/video/hero-${name}.avif`, webp: `/video/hero-${name}.webp` },
  width,
  height,
  maxBytes: maxMb * MB,
})

export const HERO_VIDEO = {
  landscapeHd: rendition('landscape-hd', 1920, 1080, 6),
  landscape: rendition('landscape', 1280, 720, 3),
  portrait: rendition('portrait', 810, 1080, 3),
  /**
   * Recuadro = (100vw − 2 gutters) × 80svh. Es más alto que ancho cuando
   * ancho/alto del viewport < 0.8 → encuadre vertical (móvil, tablet vertical).
   */
  portraitQuery: '(max-aspect-ratio: 4/5)',
  /**
   * Recuadro ≥ ~1250 px CSS, o ≥ ~1000 px en pantallas Retina (2× píxeles
   * físicos): 1280 px se vería estirado → versión nativa.
   */
  hdQuery: '(min-width: 1280px), (min-width: 1024px) and (min-resolution: 2dppx)',
  /** Altura del recuadro respecto al hero. */
  heightRatio: 0.8,
} as const
