import type { SiteContent } from '@/content/site'
import { CasesSection } from '@/sections/CasesSection'
import { CtaSection } from '@/sections/CtaSection'
import { IntegrationsSection } from '@/sections/IntegrationsSection'
import { IntroSection } from '@/sections/IntroSection'
import { ProcessSection } from '@/sections/ProcessSection'
import { SectorsSection } from '@/sections/SectorsSection'
import { ServicesSection } from '@/sections/ServicesSection'

interface HomeProps {
  readonly content: SiteContent
}

/** Home: compone las secciones en orden a partir del contenido tipado. */
export function Home({ content }: HomeProps) {
  return (
    <>
      <IntroSection content={content.hero} />
      <ServicesSection content={content.services} />
      <IntegrationsSection content={content.integrations} />
      <ProcessSection content={content.process} />
      <SectorsSection content={content.sectors} />
      <CasesSection content={content.cases} />
      <CtaSection content={content.cta} />
    </>
  )
}
