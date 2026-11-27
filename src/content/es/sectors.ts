import type { SiteContent } from '../types.ts'

export const sectors: SiteContent['sectors'] = {
  eyebrow: 'Sectores',
  title: 'Pymes de Barcelona, cada una con sus retos',
  intro: 'Conocemos el tejido empresarial de la ciudad y adaptamos la tecnología a cada sector.',
  items: [
    {
      id: 'retail',
      name: 'Comercio y retail',
      description: 'TPV, tienda online y stock sincronizados en un solo sistema.',
    },
    {
      id: 'hospitality',
      name: 'Hostelería y turismo',
      description: 'Reservas, pagos y redes wifi seguras para clientes y equipo.',
    },
    {
      id: 'professional-services',
      name: 'Despachos profesionales',
      description: 'Asesorías y bufetes con documentación protegida y trabajo en remoto.',
    },
    {
      id: 'health',
      name: 'Salud y bienestar',
      description: 'Clínicas y centros con datos sensibles tratados según el RGPD.',
    },
    {
      id: 'industry',
      name: 'Industria y logística',
      description: 'Integración de ERP, trazabilidad y automatización de operaciones.',
    },
    {
      id: 'education',
      name: 'Educación y formación',
      description: 'Aulas conectadas, plataformas online y gestión de alumnos.',
    },
  ],
}
