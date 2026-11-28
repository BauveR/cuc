import type { ReactNode } from 'react'
import type { ImageId } from '@/content/site'
import { ResponsiveImage } from '@/features/media/ResponsiveImage'

export interface BlockImage {
  readonly id: ImageId
  readonly alt: string
}

interface SplitBlockProps {
  readonly children: ReactNode
  readonly image: BlockImage
}

/**
 * Composición editorial de la referencia: texto en las columnas 1–6 y
 * imagen en las 7–12 (apilados en móvil). Gutter de la rejilla: 15 px.
 */
export function SplitBlock({ children, image }: SplitBlockProps) {
  return (
    <div className="grid grid-cols-12 gap-gutter">
      <div className="col-span-12 md:col-span-6">{children}</div>
      <div className="col-span-12 md:col-span-6">
        <ResponsiveImage id={image.id} alt={image.alt} sizes="(min-width: 768px) 50vw, 100vw" />
      </div>
    </div>
  )
}
