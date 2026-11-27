import { Heading } from '@/components/ui/Heading'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type SiteContent } from '@/content/site'

const TITLE_ID = 'process-title'

/** 1 → "01". Número decorativo: el orden ya lo comunica la <ol>. */
export const stepNumber = (index: number): string => String(index + 1).padStart(2, '0')

interface ProcessSectionProps {
  readonly content: SiteContent['process']
}

/** Pasos numerados 01–05 en una lista ordenada semántica. */
export function ProcessSection({ content }: ProcessSectionProps) {
  return (
    <Section id={SECTION_IDS.process} labelledBy={TITLE_ID}>
      <Heading id={TITLE_ID} eyebrow={content.eyebrow} title={content.title} intro={content.intro} />
      <ol className="flex flex-col">
        {content.steps.map((step, index) => (
          <li
            key={step.title}
            className="grid gap-4 border-t border-ink py-8 md:grid-cols-[8rem_1fr_2fr] md:gap-8"
          >
            <span aria-hidden="true" className="text-title font-semibold text-ink-muted">
              {stepNumber(index)}
            </span>
            <h3 className="text-title font-semibold">{step.title}</h3>
            <p className="max-w-prose text-lead text-ink-muted">{step.description}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
