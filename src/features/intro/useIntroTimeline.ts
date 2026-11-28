import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Tiempos medidos en lenis.dev (expo.out, ~1 s por fase), sin su espera de
 * carga inicial. Total ≈ 2,6 s: logo 0,9 · corazones 10 × 0,08 · pausa · subida 1,1.
 */
export const INTRO_TIMING = {
  logo: { duration: 0.9, ease: 'expo.out' },
  hearts: { at: 0.45, duration: 0.3, stagger: 0.08, ease: 'back.out(2.5)' },
  hold: 0.25,
  lift: { duration: 1.1, ease: 'expo.out' },
} as const

interface IntroRefs {
  readonly panel: RefObject<HTMLDivElement | null>
  readonly logo: RefObject<SVGSVGElement | null>
  readonly hearts: RefObject<HTMLUListElement | null>
}

/**
 * Logo sube desde su máscara → corazones aparecen uno a uno → pausa →
 * la cortinilla sube (−100 %) descubriendo la página.
 * `onLift` se llama al empezar la subida (los reveals de texto arrancan ya)
 * y `onDone` al terminar (desmontar y liberar scroll).
 */
export const useIntroTimeline = (refs: IntroRefs, onLift: () => void, onDone: () => void): void => {
  useGSAP(() => {
    const panel = refs.panel.current
    const logo = refs.logo.current
    const hearts = refs.hearts.current
    if (!panel || !logo || !hearts) return
    const { logo: l, hearts: h, hold, lift } = INTRO_TIMING

    gsap
      .timeline({ onComplete: onDone })
      .from(logo, { yPercent: 100, duration: l.duration, ease: l.ease })
      .from(hearts.children, { autoAlpha: 0, scale: 0.4, duration: h.duration, stagger: h.stagger, ease: h.ease }, h.at)
      .call(onLift, [], `+=${hold}`)
      .to(panel, { yPercent: -100, duration: lift.duration, ease: lift.ease })
  })
}
