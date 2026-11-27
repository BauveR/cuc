import { getContent } from '@/content/site'

const content = getContent()

export function App() {
  const { brand } = content

  return (
    <main className="min-h-dvh grid place-content-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">{brand.name}</h1>
      <p className="text-lg text-ink-muted">{brand.tagline}</p>
    </main>
  )
}
