import { Suspense } from 'react'
import { HERO_MODEL_URL } from './assets'
import { GltfModel } from './GltfModel'
import { ModelErrorBoundary } from './ModelErrorBoundary'
import { PlaceholderModel } from './PlaceholderModel'

interface HeroModelProps {
  /** Por defecto HERO_MODEL_URL; null = sin GLB de marca. */
  readonly url?: string | null
}

/**
 * Elige el modelo del hero: GLB de marca si existe; si no, o si falla
 * al cargar, el placeholder. Mismo contrato visual para la escena.
 */
export function HeroModel({ url = HERO_MODEL_URL }: HeroModelProps) {
  if (!url) return <PlaceholderModel />

  return (
    <ModelErrorBoundary fallback={<PlaceholderModel />}>
      <Suspense fallback={null}>
        <GltfModel url={url} />
      </Suspense>
    </ModelErrorBoundary>
  )
}
