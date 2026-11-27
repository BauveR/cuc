import { POSTER } from './scene.config'

interface HeroPosterProps {
  /** true cuando el canvas 3D ya está listo: el póster se desvanece. */
  readonly faded: boolean
}

/**
 * Imagen estática visible desde el primer paint (candidato a LCP).
 * AVIF con fallback WebP. Decorativa: alt vacío.
 */
export function HeroPoster({ faded }: HeroPosterProps) {
  return (
    <picture>
      <source srcSet={POSTER.avif} type="image/avif" />
      <img
        src={POSTER.webp}
        alt=""
        width={POSTER.width}
        height={POSTER.height}
        fetchPriority="high"
        decoding="async"
        data-faded={faded}
        className="absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-out-expo data-[faded=true]:opacity-0"
      />
    </picture>
  )
}
