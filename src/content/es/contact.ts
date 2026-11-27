import type { ContactContent } from '../types.ts'

// TODO(marca): sustituir el email de ejemplo (dominio reservado example.com).
const EMAIL = 'hola@example.com'

export const contact: ContactContent = {
  eyebrow: 'Contacto',
  title: 'Cuéntanos qué necesitas',
  intro: 'Te respondemos en menos de 24 horas laborables, sin compromiso.',
  email: EMAIL,
  location: 'Barcelona',
  hours: 'Lunes a viernes, de 9:00 a 18:00',
  cta: { label: 'Escríbenos', href: `mailto:${EMAIL}` },
}
