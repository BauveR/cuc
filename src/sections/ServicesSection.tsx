import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type SiteContent } from '@/content/site'

const TITLE_ID = 'services-title'

interface ServicesSectionProps {
  readonly content: SiteContent['services']
}

/** Grid de servicios: 1 columna en móvil, 2 en tablet, 3 en escritorio. */
export function ServicesSection({ content }: ServicesSectionProps) {
  return (
    <Section id={SECTION_IDS.services} labelledBy={TITLE_ID}>
      <Heading id={TITLE_ID} eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {content.items.map((service) => (
          <li key={service.id}>
            <Card title={service.title}>
              <p className="text-ink-muted">{service.summary}</p>
              <ul className="flex flex-col gap-2 text-body">
                {service.points.map((point) => (
                  <li key={point} className="before:mr-2 before:content-['—']">
                    {point}
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
