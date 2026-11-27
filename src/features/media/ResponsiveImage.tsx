import type { ImageId } from '@/content/site'
import { cx } from '@/lib/cx'
import { IMAGES, imageSrcSet, imageUrl } from './images'

interface ResponsiveImageProps {
  readonly id: ImageId
  readonly alt: string
  /** Ancho que ocupa en el layout, p. ej. "(min-width: 768px) 50vw, 100vw". */
  readonly sizes: string
  readonly className?: string
}

/**
 * <picture> AVIF → WebP con srcset por ancho. Lazy por defecto (las imágenes
 * de contenido nunca son el LCP: lo es el póster del hero). width/height
 * reservan el espacio → sin saltos de layout.
 */
export function ResponsiveImage({ id, alt, sizes, className }: ResponsiveImageProps) {
  const { width, height } = IMAGES[id]

  return (
    <picture>
      <source type="image/avif" srcSet={imageSrcSet(id, 'avif')} sizes={sizes} />
      <img
        src={imageUrl(id, 1280, 'webp')}
        srcSet={imageSrcSet(id, 'webp')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cx('block h-auto w-full object-cover', className)}
      />
    </picture>
  )
}
