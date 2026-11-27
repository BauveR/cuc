import { Card } from '@/components/ui/Card'
import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type SiteContent } from '@/content/site'

const TITLE_ID = 'sectors-title'

interface SectorsSectionProps {
  readonly content: SiteContent['sectors']
}

/** Sectores de pymes de Barcelona con los que trabajamos. */
export function SectorsSection({ content }: SectorsSectionProps) {
  return (
    <Section id={SECTION_IDS.sectors} labelledBy={TITLE_ID} tone="surface">
      <Heading id={TITLE_ID} eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {content.items.map((sector) => (
          <li key={sector.id}>
            <Card title={sector.name}>
              <p className="text-ink-muted">{sector.description}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
