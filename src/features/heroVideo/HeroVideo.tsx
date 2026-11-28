import { useRef, useState, type SyntheticEvent } from 'react'
import { SECTION_IDS } from '@/content/site'
import { useAfterLoad } from '@/hooks/useAfterLoad'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { prefersSaveData } from '@/hooks/prefersSaveData'
import { useVideoScrub } from './useVideoScrub'
import { HERO_VIDEO } from './video.config'

/**
 * iOS Safari no descarga fotogramas de un vídeo que nunca se reprodujo
 * (ignora preload). Un play()+pause() silenciado (permitido sin gesto)
 * lo "despierta" para poder hacer seek.
 */
const prime = ({ currentTarget: video }: SyntheticEvent<HTMLVideoElement>): void => {
  video
    .play()
    .then(() => video.pause())
    .catch(() => undefined) // bloqueado por el navegador: queda el fotograma
}

/**
 * Vídeo del hero que avanza al ritmo del scroll, en un recuadro del 80 %
 * de alto apoyado abajo: el margen inferior es el mismo gutter que los
 * laterales (15 px) y el espacio libre queda arriba, bajo el header.
 * Se mide con svh (viewport visible): en móvil la barra del navegador no lo tapa.
 * Vive en el fondo fijo (detrás del 3D); las secciones opacas lo tapan al subir.
 * - Primer paint: fotograma estático (AVIF/WebP) del encuadre que toca.
 * - El <video> se monta tras el load (no compite con el LCP) y nunca con
 *   reduced-motion o ahorro de datos: entonces se queda el fotograma.
 * - Encuadre vertical u horizontal según la forma del recuadro (y al rotar);
 *   en horizontal, resolución nativa solo en pantallas grandes o Retina.
 */
export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const portrait = useMediaQuery(HERO_VIDEO.portraitQuery)
  const hd = useMediaQuery(HERO_VIDEO.hdQuery)
  const reducedMotion = usePrefersReducedMotion()
  const afterLoad = useAfterLoad()
  const media = portrait ? HERO_VIDEO.portrait : hd ? HERO_VIDEO.landscapeHd : HERO_VIDEO.landscape
  const withVideo = afterLoad && !reducedMotion && !prefersSaveData()
  const loaded = loadedSrc === media.src // al rotar cambia el src: vuelve a cargar
  useVideoScrub(videoRef, SECTION_IDS.intro, withVideo && loaded)

  return (
    <div
      data-testid="hero-video"
      className="absolute inset-x-gutter top-[calc(20svh-var(--spacing-gutter))] h-[80svh] overflow-hidden bg-surface"
    >
      <picture>
        <source type="image/avif" srcSet={media.poster.avif} />
        <img
          src={media.poster.webp}
          alt=""
          width={media.width}
          height={media.height}
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      {withVideo && (
        <video
          key={media.src}
          ref={videoRef}
          src={media.src}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          onLoadedMetadata={prime}
          onLoadedData={() => setLoadedSrc(media.src)}
          data-loaded={loaded}
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 data-[loaded=true]:opacity-100"
        />
      )}
    </div>
  )
}
