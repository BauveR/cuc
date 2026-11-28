import { useRef } from 'react'
import { SplitText, gsap, useGSAP } from '@/lib/gsap'
import { afterIntro } from '@/features/intro/introGate'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type Tag = 'h1' | 'h2' | 'h3' | 'p'

interface RevealTextProps {
  readonly children: string
  readonly as?: Tag
  readonly className?: string
  readonly id?: string
}

export const REVEAL = {
  duration: 0.9,
  stagger: 0.08,
  ease: 'expo.out',
  start: 'top 85%',
} as const

/**
 * Texto que aparece línea a línea (máscara por línea) al entrar en viewport.
 * SplitText añade aria-label al contenedor y oculta los fragmentos a lectores
 * de pantalla, así el texto se lee entero. Sin animación con reduced-motion.
 * Con la cortinilla de entrada activa, espera a que empiece a subir
 * (afterIntro): si no, el titular se animaría tapado.
 */
export function RevealText({ children, as: Tag = 'p', className, id }: RevealTextProps) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current
      if (reducedMotion || !el || !contextSafe) return

      // contextSafe: lo creado más tarde también se revierte al desmontar.
      const split = contextSafe(() => {
        if (!el.isConnected) return
        SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          aria: 'auto',
          autoSplit: true, // re-divide al cambiar tamaño o cargar fuentes
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 100,
              duration: REVEAL.duration,
              stagger: REVEAL.stagger,
              ease: REVEAL.ease,
              scrollTrigger: { trigger: el, start: REVEAL.start, once: true },
            }),
        })
      })
      afterIntro(split)
    },
    { scope: ref, dependencies: [reducedMotion, children], revertOnUpdate: true },
  )

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="">
      {children}
    </Tag>
  )
}
