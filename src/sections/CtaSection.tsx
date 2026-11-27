import { Heading } from '@/components/ui/Heading'
import { SafeLink } from '@/components/ui/SafeLink'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type CtaContent } from '@/content/site'

const TITLE_ID = 'cta-title'

interface CtaSectionProps {
  readonly content: CtaContent
}

/** Llamada a la acción final. Es el destino de los CTA "#contacto". */
export function CtaSection({ content }: CtaSectionProps) {
  return (
    <Section id={SECTION_IDS.contact} labelledBy={TITLE_ID} tone="inverse">
      <Heading id={TITLE_ID} eyebrow={content.eyebrow} title={content.title} intro={content.intro} inverse />
      <div>
        <SafeLink href={content.action.href} variant="inverse">
          {content.action.label}
        </SafeLink>
      </div>
    </Section>
  )
}
