import type { SiteContent } from '../types.ts'

export const services: SiteContent['services'] = {
  eyebrow: 'Servicios',
  title: 'Todo lo que tu empresa necesita, sin intermediarios',
  intro:
    'Un único interlocutor para la tecnología de tu negocio: diseñamos, ' +
    'implantamos y mantenemos soluciones a medida de cada pyme.',
  items: [
    {
      id: 'it-support',
      title: 'Soporte IT',
      summary: 'Mantenimiento preventivo y soporte cercano para que nada se detenga.',
      points: ['Helpdesk presencial y remoto', 'Gestión de equipos y licencias', 'Copias de seguridad'],
    },
    {
      id: 'cybersecurity',
      title: 'Ciberseguridad',
      summary: 'Protegemos tus datos, tus equipos y la confianza de tus clientes.',
      points: ['Auditorías y análisis de riesgos', 'Protección de endpoints y correo', 'Formación y adecuación RGPD'],
    },
    {
      id: 'cloud',
      title: 'Cloud',
      summary: 'Migración y gestión de infraestructura en la nube, segura y escalable.',
      points: ['Microsoft 365 y Google Workspace', 'Servidores y almacenamiento cloud', 'Optimización de costes'],
    },
    {
      id: 'web-development',
      title: 'Desarrollo web',
      summary: 'Webs y aplicaciones rápidas, accesibles y pensadas para convertir.',
      points: ['Webs corporativas y e-commerce', 'Aplicaciones a medida', 'Rendimiento, SEO y accesibilidad'],
    },
    {
      id: 'integration-automation',
      title: 'Integración y automatización',
      summary: 'Conectamos tus herramientas y eliminamos tareas repetitivas.',
      points: ['Integración de ERP, CRM y e-commerce', 'Automatización de procesos', 'APIs y flujos de datos'],
    },
    {
      id: 'digital-consulting',
      title: 'Consultoría digital',
      summary: 'Un plan tecnológico claro, alineado con los objetivos de tu negocio.',
      points: ['Diagnóstico y hoja de ruta', 'Selección de herramientas', 'Acompañamiento en ayudas y subvenciones'],
    },
  ],
}
