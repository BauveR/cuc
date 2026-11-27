import type { SiteContent } from '../types.ts'

export const workProcess: SiteContent['process'] = {
  eyebrow: 'Cómo trabajamos',
  title: 'Un proceso claro, de principio a fin',
  intro: 'Sin jerga ni sorpresas: sabes en todo momento qué hacemos y por qué.',
  steps: [
    {
      title: 'Diagnóstico',
      description: 'Escuchamos, analizamos tu situación actual y detectamos riesgos y oportunidades.',
    },
    {
      title: 'Propuesta',
      description: 'Diseñamos una solución a medida con alcance, plazos y presupuesto cerrados.',
    },
    {
      title: 'Implantación',
      description: 'Desplegamos por fases, minimizando el impacto en el día a día de tu equipo.',
    },
    {
      title: 'Formación',
      description: 'Tu equipo aprende a sacar partido a las nuevas herramientas desde el primer día.',
    },
    {
      title: 'Acompañamiento',
      description: 'Medimos resultados, damos soporte y mantenemos la solución al día.',
    },
  ],
}
