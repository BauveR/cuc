import { Heading } from '@/components/ui/Heading'
import { SafeLink } from '@/components/ui/SafeLink'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type HeroContent } from '@/content/site'

const TITLE_ID = 'intro-title'

interface IntroSectionProps {
  readonly content: HeroContent
}

/**
 * Claim principal (único h1). Fondo transparente: deja ver el vídeo y el 3D.
 * El texto va superpuesto al vídeo: velo de papel translúcido en todos los
 * tamaños para garantizar contraste AA sea cual sea el fotograma.
 */
export function IntroSection({ content }: IntroSectionProps) {
  return (
    <Section
      id={SECTION_IDS.intro}
      labelledBy={TITLE_ID}
      tone="transparent"
      // El texto se apoya dentro del recuadro del vídeo (80svh bajo el header):
      // margen inferior = lo que sobra de la sección + un gutter.
      className="flex min-h-lvh flex-col justify-end pb-[calc(100lvh-80svh+var(--spacing-gutter))]!"
    >
      <div className="mx-gutter flex flex-col gap-stack bg-paper/85 p-6 backdrop-blur-sm md:max-w-[65%] lg:max-w-[50%]">
        <Heading id={TITLE_ID} level={1} eyebrow={content.eyebrow} title={content.title} intro={content.lead} />
        <div className="flex flex-wrap gap-4">
          <SafeLink href={content.primaryCta.href} variant="primary">
            {content.primaryCta.label}
          </SafeLink>
          <SafeLink href={content.secondaryCta.href} variant="secondary">
            {content.secondaryCta.label}
          </SafeLink>
        </div>
      </div>
    </Section>
  )
}
