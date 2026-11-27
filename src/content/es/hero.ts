import type { HeroContent } from '../types.ts'
import { SECTION_IDS, anchor } from '../sections.ts'

export const hero: HeroContent = {
  eyebrow: 'Servicios tecnológicos · Barcelona',
  title: 'Tecnología que trabaja para tu pyme',
  lead:
    'Soporte, ciberseguridad, cloud y software integrados en un solo equipo. ' +
    'Menos incidencias, procesos más ágiles y decisiones con datos.',
  primaryCta: { label: 'Hablemos de tu proyecto', href: anchor(SECTION_IDS.contact) },
  secondaryCta: { label: 'Ver servicios', href: anchor(SECTION_IDS.services) },
}
