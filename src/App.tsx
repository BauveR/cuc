import { useCallback, useRef, useState } from 'react'
import { SECTION_IDS, getContent } from '@/content/site'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SkipLink } from '@/components/layout/SkipLink'
import { HeroBackdrop } from '@/features/hero3d/HeroBackdrop'
import { IntroCurtain } from '@/features/intro/IntroCurtain'
import { useSectionTriggers } from '@/features/scroll/useSectionTriggers'
import { Home } from '@/pages/Home'

const content = getContent()

interface AppProps {
  /** Si se pasa, se muestra la cortinilla; se llama cuando empieza a subir. */
  readonly onIntroLift?: () => void
}

export function App({ onIntroLift }: AppProps) {
  const mainRef = useRef<HTMLElement>(null)
  const [introActive, setIntroActive] = useState(Boolean(onIntroLift))
  const endIntro = useCallback(() => setIntroActive(false), [])
  useSectionTriggers(mainRef) // data-active en cada [data-section]

  return (
    <>
      {introActive && onIntroLift && <IntroCurtain onLift={onIntroLift} onDone={endIntro} />}
      {/* Durante la intro, la página no recibe foco ni clics (sigue tapada). */}
      <div inert={introActive}>
        <SkipLink label={content.layout.skipLink} />
        <Header content={content} />
        <HeroBackdrop />
        <main id={SECTION_IDS.main} ref={mainRef} tabIndex={-1} className="outline-none">
          <Home content={content} />
        </main>
        <Footer content={content} />
      </div>
    </>
  )
}
