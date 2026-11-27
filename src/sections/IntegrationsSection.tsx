import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type SiteContent } from '@/content/site'

const TITLE_ID = 'integrations-title'

interface IntegrationsSectionProps {
  readonly content: SiteContent['integrations']
}

/** Herramientas agrupadas por categoría, como etiquetas. */
export function IntegrationsSection({ content }: IntegrationsSectionProps) {
  return (
    <Section id={SECTION_IDS.integrations} labelledBy={TITLE_ID} tone="surface">
      <Heading id={TITLE_ID} eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <div className="grid gap-10 md:grid-cols-2">
        {content.items.map((group) => (
          <div key={group.id} className="flex flex-col gap-4">
            <h3 id={`integration-${group.id}`} className="text-caption font-medium uppercase">
              {group.category}
            </h3>
            <ul aria-labelledby={`integration-${group.id}`} className="flex flex-wrap gap-3">
              {group.tools.map((tool) => (
                <li key={tool} className="rounded-full border border-ink px-4 py-2 text-body">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
