import { useRef } from 'react'
import { SECTION_IDS, getContent } from '@/content/site'
import { HeroBackdrop } from '@/features/hero3d/HeroBackdrop'
import { useSectionTriggers } from '@/features/scroll/useSectionTriggers'
import { Home } from '@/pages/Home'

const content = getContent()

export function App() {
  const mainRef = useRef<HTMLElement>(null)
  useSectionTriggers(mainRef) // data-active en cada [data-section]

  return (
    <>
      <HeroBackdrop />
      <main id={SECTION_IDS.main} ref={mainRef} tabIndex={-1} className="outline-none">
        <Home content={content} />
      </main>
    </>
  )
}
