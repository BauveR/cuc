import { useEffect, useRef } from 'react'
import { useScrollLock } from '@/hooks/useScrollLock'
import { IntroHearts, IntroLogo } from './IntroMarks'
import { markIntroSeen } from './introGate'
import { useIntroTimeline } from './useIntroTimeline'

interface IntroCurtainProps {
  /** Al empezar a subir: libera los reveals de texto. */
  readonly onLift: () => void
  /** Al terminar: el padre la desmonta y reactiva la página. */
  readonly onDone: () => void
}

/**
 * Cortinilla de entrada (mecánica de lenis.dev, identidad propia): panel color
 * papel a pantalla completa con el monograma centrado en ambos ejes y la fila
 * de corazones justo debajo (sin desplazar el centro del monograma).
 * Decorativa: aria-hidden; scroll bloqueado (Lenis incluido) mientras dura.
 */
export function IntroCurtain({ onLift, onDone }: IntroCurtainProps) {
  const panel = useRef<HTMLDivElement>(null)
  const logo = useRef<SVGSVGElement>(null)
  const hearts = useRef<HTMLUListElement>(null)
  useScrollLock(true)
  useIntroTimeline({ panel, logo, hearts }, onLift, onDone)
  useEffect(markIntroSeen, [])

  return (
    <div
      ref={panel}
      aria-hidden="true"
      data-testid="intro-curtain"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper text-ink"
    >
      <div className="relative">
        <div className="h-[clamp(5rem,14svh,9rem)] overflow-hidden">
          <IntroLogo ref={logo} />
        </div>
        <div className="absolute top-full left-1/2 mt-[clamp(1rem,3svh,1.75rem)] -translate-x-1/2 text-[clamp(0.875rem,2svh,1.25rem)]">
          <IntroHearts ref={hearts} />
        </div>
      </div>
    </div>
  )
}
