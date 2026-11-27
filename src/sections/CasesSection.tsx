import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type SiteContent } from '@/content/site'

const TITLE_ID = 'cases-title'

interface CasesSectionProps {
  readonly content: SiteContent['cases']
}

/**
 * Casos de éxito. Los ilustrativos llevan SIEMPRE su etiqueta visible:
 * presentarlos como clientes reales sería engañoso.
 */
export function CasesSection({ content }: CasesSectionProps) {
  const { labels } = content

  return (
    <Section id={SECTION_IDS.cases} labelledBy={TITLE_ID}>
      <Heading id={TITLE_ID} eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <ul className="grid gap-x-8 gap-y-12 lg:grid-cols-3">
        {content.items.map((item) => (
          <li key={item.id}>
            <Card
              title={item.title}
              kicker={item.sector}
              {...(item.illustrative && { badge: labels.illustrative })}
            >
              <dl className="flex flex-col gap-3">
                {(['challenge', 'solution', 'outcome'] as const).map((field) => (
                  <div key={field}>
                    <dt className="text-caption font-medium uppercase text-ink-muted">{labels[field]}</dt>
                    <dd>{item[field]}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
