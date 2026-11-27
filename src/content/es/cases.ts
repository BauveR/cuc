import type { SiteContent } from '../types.ts'

/**
 * TODO(contenido): casos ILUSTRATIVOS (illustrative: true). Sustituir por
 * casos reales con autorización del cliente antes de producción. No añadir
 * cifras ni nombres que no sean verificables.
 */
export const cases: SiteContent['cases'] = {
  eyebrow: 'Casos',
  title: 'Así ayudamos a las pymes',
  intro: 'Ejemplos del tipo de proyectos que desarrollamos con empresas como la tuya.',
  labels: {
    illustrative: 'Caso ilustrativo',
    challenge: 'Reto',
    solution: 'Solución',
    outcome: 'Resultado',
  },
  items: [
    {
      id: 'retail-omnichannel',
      sector: 'Comercio',
      title: 'Una tienda, un solo stock',
      challenge: 'Tienda física y online con inventarios separados y errores de venta.',
      solution: 'Integración del TPV con el e-commerce y el ERP en tiempo real.',
      outcome: 'Stock unificado y pedidos sin gestión manual.',
      illustrative: true,
    },
    {
      id: 'law-firm-security',
      sector: 'Despacho profesional',
      title: 'Documentación protegida, equipo en remoto',
      challenge: 'Expedientes en equipos locales y acceso remoto poco seguro.',
      solution: 'Migración a la nube con MFA, cifrado y copias de seguridad automáticas.',
      outcome: 'Acceso seguro desde cualquier lugar y adecuación al RGPD.',
      illustrative: true,
    },
    {
      id: 'logistics-automation',
      sector: 'Logística',
      title: 'Menos papeleo, más entregas',
      challenge: 'Albaranes y facturas gestionados a mano entre varias herramientas.',
      solution: 'Automatización del flujo de documentos entre ERP, correo y contabilidad.',
      outcome: 'Procesos administrativos más rápidos y con menos errores.',
      illustrative: true,
    },
  ],
}
