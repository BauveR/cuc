import type { RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { flightTo, heartDestinations, introTarget, type Flight } from './flight'

/**
 * Tiempos: entrada y subida medidos en lenis.dev (expo.out, ~1 s por fase);
 * el vuelo empieza cuando el panel ya casi ha subido. Total ≈ 4 s.
 */
export const INTRO_TIMING = {
  logo: { duration: 0.9, ease: 'expo.out' },
  hearts: { at: 0.45, duration: 0.3, stagger: 0.08, ease: 'back.out(2.5)' },
  hold: 0.25,
  lift: { duration: 1.1, ease: 'expo.out' },
  flight: { overlap: 0.45, duration: 1, stagger: 0.06, ease: 'expo.inOut', menuScale: 0.3 },
} as const

interface IntroRefs {
  readonly panel: RefObject<HTMLDivElement | null>
  readonly logoBox: RefObject<HTMLDivElement | null>
  readonly logo: RefObject<SVGSVGElement | null>
  readonly hearts: RefObject<HTMLUListElement | null>
}

const STAY: Flight = { x: 0, y: 0, scale: 1 }

/**
 * Logo sube desde su máscara → corazones uno a uno → pausa → sube el panel
 * (los elementos quedan flotando) → vuelan a su sitio en el header.
 * Los destinos se miden al empezar el vuelo (valores función de GSAP).
 * `onLift`: al empezar la subida (reveals de texto). `onDone`: al terminar.
 */
export const useIntroTimeline = (refs: IntroRefs, onLift: () => void, onDone: () => void): void => {
  useGSAP(() => {
    const panel = refs.panel.current
    const logoBox = refs.logoBox.current
    const logo = refs.logo.current
    const hearts = refs.hearts.current
    if (!panel || !logoBox || !logo || !hearts) return
    const { logo: l, hearts: h, hold, lift, flight: f } = INTRO_TIMING

    // Destinos resueltos una sola vez, al empezar el vuelo (no antes: fuentes y layout definitivos).
    let plan: ReturnType<typeof heartDestinations> | null = null
    const heartsPlan = () => (plan ??= heartDestinations())
    const heart = (i: number, el: Element): Flight => {
      const target = heartsPlan().at(i)
      return target ? flightTo(el, target) : STAY
    }
    const monogram = () => {
      const target = introTarget('monogram')
      return target ? flightTo(logoBox, target) : STAY
    }
    const fly = { duration: f.duration, ease: f.ease, transformOrigin: '50% 50%' }

    gsap
      .timeline({ onComplete: onDone })
      .from(logo, { yPercent: 100, duration: l.duration, ease: l.ease })
      .from(hearts.children, { autoAlpha: 0, scale: 0.4, duration: h.duration, stagger: h.stagger, ease: h.ease }, h.at)
      .call(onLift, [], `+=${hold}`)
      .to(panel, { yPercent: -100, duration: lift.duration, ease: lift.ease })
      .addLabel('flight', `-=${f.overlap}`)
      .to(logoBox, { ...fly, x: () => monogram().x, y: () => monogram().y, scale: () => monogram().scale }, 'flight')
      .to(
        hearts.children,
        {
          ...fly,
          stagger: f.stagger,
          x: (i: number, el: Element) => heart(i, el).x,
          y: (i: number, el: Element) => heart(i, el).y,
          scale: (i: number, el: Element) => heart(i, el).scale * (heartsPlan().toMenu ? f.menuScale : 1),
          autoAlpha: () => (heartsPlan().toMenu ? 0 : 1),
        },
        'flight',
      )
  })
}
