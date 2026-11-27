import type { SiteContent } from '../types.ts'
import { hero } from './hero.ts'
import { services } from './services.ts'
import { integrations } from './integrations.ts'
import { workProcess } from './process.ts'
import { sectors } from './sectors.ts'
import { cases } from './cases.ts'
import { contact } from './contact.ts'
import { cta } from './cta.ts'
import { footer, layout } from './layout.ts'
import { media } from './media.ts'

// TODO(marca): sustituir "[NOMBRE]" por el nombre comercial definitivo.
export const es: SiteContent = {
  meta: {
    lang: 'es',
    title: '[NOMBRE] · Tecnología para pymes en Barcelona',
    description:
      'Soporte IT, ciberseguridad, cloud, desarrollo web e integración de software para pymes en Barcelona.',
  },
  brand: {
    name: '[NOMBRE]',
    tagline: 'Tecnología que trabaja para tu pyme',
    location: 'Barcelona',
  },
  hero,
  services,
  integrations,
  process: workProcess,
  sectors,
  cases,
  cta,
  contact,
  layout,
  footer,
  media,
}
