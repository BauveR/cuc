import { getContent } from '@/content/site'
import { HeroBackdrop } from '@/features/hero3d/HeroBackdrop'

const content = getContent()

export function App() {
  const { brand } = content

  return (
    <>
      <HeroBackdrop />
      <main className="min-h-dvh grid place-content-center gap-4 px-gutter text-center">
        <h1 className="text-display font-semibold">{brand.name}</h1>
        <p className="text-lead text-ink-muted">{brand.tagline}</p>
      </main>
    </>
  )
}
