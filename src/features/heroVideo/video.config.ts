/**
 * Vídeo del hero: avanza con el scroll (no se reproduce solo).
 * Dos encuadres generados con scripts/encode-hero-video.sh a partir de
 * media-src/hero.mov (original ignorado por git, con metadatos GPS):
 * - landscape: 16:9 aprox., para recuadros más anchos que altos;
 * - portrait: recorte 3:4, para móvil/tablet en vertical.
 * H.264 24 fps + faststart, keyframe cada 0,5 s: seek rápido al hacer scrub.
 */
export interface VideoRendition {
  readonly src: string
  readonly poster: { readonly avif: string; readonly webp: string }
  readonly width: number
  readonly height: number
}

const rendition = (name: string, width: number, height: number): VideoRendition => ({
  src: `/video/hero-${name}.mp4`,
  poster: { avif: `/video/hero-${name}.avif`, webp: `/video/hero-${name}.webp` },
  width,
  height,
})

export const HERO_VIDEO = {
  landscape: rendition('landscape', 1280, 684),
  portrait: rendition('portrait', 684, 914),
  /**
   * Recuadro = (100vw − 2 gutters) × 80svh. Es más alto que ancho cuando
   * ancho/alto del viewport < 0.8 → encuadre vertical (móvil, tablet vertical).
   */
  portraitQuery: '(max-aspect-ratio: 4/5)',
  /** Altura del recuadro respecto al hero. */
  heightRatio: 0.8,
  /** Presupuesto por fichero (test): 3 MB. */
  maxBytes: 3 * 1024 * 1024,
} as const
