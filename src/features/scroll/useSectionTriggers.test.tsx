import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useRef } from 'react'
import { render, screen } from '@testing-library/react'
import { ScrollTrigger } from '@/lib/gsap'
import { useSectionTriggers } from './useSectionTriggers'

type Config = Parameters<typeof ScrollTrigger.create>[0]

function Harness({ onActive }: { readonly onActive?: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useSectionTriggers(ref, onActive ? { onActive } : {})
  return (
    <div ref={ref}>
      <section data-section="servicios" aria-label="servicios" />
      <section data-section="contacto" aria-label="contacto" />
      <section aria-label="sin-trigger" />
    </div>
  )
}

const configs = (): Config[] => vi.mocked(ScrollTrigger.create).mock.calls.map(([c]) => c)
const toggle = (index: number, isActive: boolean) =>
  configs()[index]?.onToggle?.({ isActive } as ScrollTrigger)

describe('useSectionTriggers', () => {
  beforeEach(() => {
    vi.spyOn(ScrollTrigger, 'create')
  })

  it('crea un trigger por cada [data-section] con start/end por defecto', () => {
    render(<Harness />)
    expect(configs()).toHaveLength(2)
    expect(configs()[0]).toMatchObject({ start: 'top center', end: 'bottom center' })
  })

  it('marca data-active y notifica el id de la sección activa', () => {
    const onActive = vi.fn()
    render(<Harness onActive={onActive} />)

    toggle(1, true)
    expect(screen.getByLabelText('contacto')).toHaveAttribute('data-active', 'true')
    expect(onActive).toHaveBeenCalledWith('contacto')

    toggle(1, false)
    expect(screen.getByLabelText('contacto')).toHaveAttribute('data-active', 'false')
    expect(onActive).toHaveBeenCalledTimes(1)
  })

  it('destruye los triggers al desmontar', () => {
    const { unmount } = render(<Harness />)
    const created = vi.mocked(ScrollTrigger.create).mock.results.map((r) => r.value as ScrollTrigger)
    const kills = created.map((t) => vi.spyOn(t, 'kill'))
    unmount()
    for (const kill of kills) expect(kill).toHaveBeenCalled()
  })
})
