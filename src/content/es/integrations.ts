import type { SiteContent } from '../types.ts'

/**
 * Herramientas habituales en pymes. Se citan como ecosistema con el que
 * trabajamos, NO como partnerships oficiales.
 * TODO(contenido): confirmar la lista con el equipo antes de producción.
 */
export const integrations: SiteContent['integrations'] = {
  eyebrow: 'Integraciones',
  title: 'Conectamos las herramientas que ya usas',
  intro: 'No hace falta cambiarlo todo: unimos tus sistemas para que los datos fluyan solos.',
  items: [
    {
      id: 'productivity',
      category: 'Productividad',
      tools: ['Microsoft 365', 'Google Workspace', 'Slack'],
    },
    {
      id: 'management',
      category: 'Gestión y ERP',
      tools: ['Odoo', 'Holded', 'Sage', 'A3'],
    },
    {
      id: 'commerce',
      category: 'Ventas y e-commerce',
      tools: ['Shopify', 'WooCommerce', 'PrestaShop', 'HubSpot'],
    },
    {
      id: 'automation',
      category: 'Automatización',
      tools: ['Make', 'n8n', 'APIs a medida'],
    },
  ],
}
