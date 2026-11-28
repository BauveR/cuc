import { MediaRow } from '@/components/ui/MediaRow'
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
  const { media } = content
  return (
    <>
      <IntroSection content={content.hero} />
      <ServicesSection content={content.services} image={{ id: 'workspace', alt: media.workspace }} />
      <MediaRow
        wide={{ id: 'office', alt: media.office }}
        narrow={{ id: 'network', alt: media.network }}
      />
      <IntegrationsSection content={content.integrations} />
      <ProcessSection content={content.process} />
      <SectorsSection content={content.sectors} image={{ id: 'barcelona', alt: media.barcelona }} />
      <CasesSection content={content.cases} image={{ id: 'team', alt: media.team }} />
      <CtaSection content={content.cta} />
    </>
  )
}
