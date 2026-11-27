import type { CtaContent } from '../types.ts'
import { contact } from './contact.ts'

export const cta: CtaContent = {
  eyebrow: 'Empecemos',
  title: '¿Hablamos de tu próximo paso tecnológico?',
  intro: 'Una primera conversación de 30 minutos, sin coste, para entender qué necesitas.',
  action: contact.cta, // mismo destino que contacto (DRY)
}
