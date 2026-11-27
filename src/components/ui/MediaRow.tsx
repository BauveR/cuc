import { ResponsiveImage } from '@/features/media/ResponsiveImage'
import type { BlockImage } from './SplitBlock'

interface MediaRowProps {
  /** Imagen ancha (8 columnas). */
  readonly wide: BlockImage
  /** Imagen estrecha (4 columnas). */
  readonly narrow: BlockImage
}

/** Fila de imágenes 8 + 4 columnas sobre la rejilla (apiladas en móvil). */
export function MediaRow({ wide, narrow }: MediaRowProps) {
  return (
    <div className="grid grid-cols-12 items-start gap-gutter bg-paper px-gutter">
      <div className="col-span-12 md:col-span-8">
        <ResponsiveImage id={wide.id} alt={wide.alt} sizes="(min-width: 768px) 66vw, 100vw" />
      </div>
      <div className="col-span-12 md:col-span-4">
        <ResponsiveImage id={narrow.id} alt={narrow.alt} sizes="(min-width: 768px) 33vw, 100vw" />
      </div>
    </div>
  )
}
