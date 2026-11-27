import { Heading } from '@/components/ui/Heading'
import { SafeLink } from '@/components/ui/SafeLink'
import { Section } from '@/components/ui/Section'
import { SECTION_IDS, type HeroContent } from '@/content/site'

const TITLE_ID = 'intro-title'

interface IntroSectionProps {
  readonly content: HeroContent
}

/**
 * Claim principal (único h1). Fondo transparente: deja ver el hero 3D.
 * En móvil el modelo queda centrado detrás del texto: velo de papel para
 * garantizar contraste AA; en escritorio el modelo vive a la derecha.
 */
export function IntroSection({ content }: IntroSectionProps) {
  return (
    <Section
      id={SECTION_IDS.intro}
      labelledBy={TITLE_ID}
      tone="transparent"
      className="flex min-h-lvh flex-col justify-end"
    >
      <div className="flex flex-col gap-stack rounded-2xl max-md:bg-paper/85 max-md:p-6 max-md:backdrop-blur-sm md:max-w-[65%]">
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
