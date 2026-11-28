import { useRef } from 'react'
import { SECTION_IDS, getContent } from '@/content/site'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { HeroBackdrop } from '@/features/hero3d/HeroBackdrop'
import { useSectionTriggers } from '@/features/scroll/useSectionTriggers'
import { Home } from '@/pages/Home'

const content = getContent()

export function App() {
  const mainRef = useRef<HTMLElement>(null)
  useSectionTriggers(mainRef) // data-active en cada [data-section]

  return (
    <>
      <SkipLink label={content.layout.skipLink} />
      <Header content={content} />
      <HeroBackdrop />
      <main id={SECTION_IDS.main} ref={mainRef} tabIndex={-1} className="outline-none">
        <Home content={content} />
      </main>
      <Footer content={content} />
    </>
  )
}
