import { useEffect, useRef } from 'react'
import { Hearts } from '@/components/brand/Hearts'
import { Monogram } from '@/components/brand/Monogram'
import { useScrollLock } from '@/hooks/useScrollLock'
import { markIntroSeen } from './introGate'
import { useIntroTimeline } from './useIntroTimeline'

interface IntroCurtainProps {
  /** Al empezar a subir: libera los reveals de texto. */
  readonly onLift: () => void
  /** Al terminar: el padre la desmonta y muestra los elementos del header. */
  readonly onDone: () => void
}

/**
 * Cortinilla de entrada (mecánica de lenis.dev, identidad propia).
 * Dos capas: el panel color papel (sube) y, encima, los elementos (no suben
 * con él: quedan flotando y luego vuelan a su sitio en el header).
 * Monograma centrado en ambos ejes; corazones justo debajo sin desplazarlo.
 * Decorativa: aria-hidden; scroll bloqueado (Lenis incluido) mientras dura.
 */
export function IntroCurtain({ onLift, onDone }: IntroCurtainProps) {
  const panel = useRef<HTMLDivElement>(null)
  const logoBox = useRef<HTMLDivElement>(null)
  const logo = useRef<SVGSVGElement>(null)
  const hearts = useRef<HTMLUListElement>(null)
  useScrollLock(true)
  useIntroTimeline({ panel, logoBox, logo, hearts }, onLift, onDone)
  useEffect(markIntroSeen, [])

  return (
    <div aria-hidden="true" data-testid="intro-curtain">
      <div ref={panel} data-intro-panel="" className="fixed inset-0 z-[100] bg-paper" />
      <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center text-ink">
        <div className="relative">
          <div ref={logoBox} className="h-[clamp(5rem,14svh,9rem)] overflow-hidden">
            <Monogram ref={logo} outlined className="h-full" />
          </div>
          <div className="absolute top-full left-1/2 mt-[clamp(1rem,3svh,1.75rem)] -translate-x-1/2 text-[clamp(0.875rem,2svh,1.25rem)]">
            <Hearts ref={hearts} />
          </div>
        </div>
      </div>
    </div>
  )
}
