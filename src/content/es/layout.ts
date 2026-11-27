import type { FooterContent, LayoutContent } from '../layout-types.ts'
import { SECTION_IDS, anchor } from '../sections.ts'
import { contact } from './contact.ts'

export const layout: LayoutContent = {
  skipLink: 'Saltar al contenido',
  navLabel: 'Navegación principal',
  nav: [
    { label: 'Servicios', href: anchor(SECTION_IDS.services) },
    { label: 'Integraciones', href: anchor(SECTION_IDS.integrations) },
    { label: 'Proceso', href: anchor(SECTION_IDS.process) },
    { label: 'Sectores', href: anchor(SECTION_IDS.sectors) },
    { label: 'Casos', href: anchor(SECTION_IDS.cases) },
    { label: 'Contacto', href: anchor(SECTION_IDS.contact) },
  ],
  menu: { open: 'Menú', close: 'Cerrar', dialogLabel: 'Menú de navegación' },
  languages: {
    label: 'Idioma',
    unavailable: 'próximamente',
    options: [
      { code: 'es', label: 'ES', name: 'Español', available: true },
      { code: 'ca', label: 'CA', name: 'Català', available: false },
      { code: 'en', label: 'EN', name: 'English', available: false },
    ],
  },
}

/**
 * TODO(legal): las páginas legales (LSSI-CE, RGPD) son obligatorias antes de
 * publicar. TODO(marca): sustituir las URLs de redes por los perfiles reales.
 */
export const footer: FooterContent = {
  label: 'Pie de página',
  columns: [
    { title: 'Navegación', links: layout.nav },
    {
      title: 'Contacto',
      links: [contact.cta, { label: contact.location, href: anchor(SECTION_IDS.contact) }],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Aviso legal', href: '/aviso-legal' },
        { label: 'Privacidad', href: '/privacidad' },
        { label: 'Cookies', href: '/cookies' },
      ],
    },
    {
      title: 'Redes',
      links: [
        { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
        { label: 'Instagram', href: 'https://www.instagram.com/' },
      ],
    },
  ],
  rights: 'Todos los derechos reservados.',
}
