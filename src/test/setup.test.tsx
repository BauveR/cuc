import { describe, expect, it } from 'vitest'
import { Canvas } from '@react-three/fiber'
import { renderWithProviders, screen, setMatchMedia } from './renderWithProviders'

/** Test de ejemplo: valida que el entorno de pruebas está bien montado. */
describe('entorno de test', () => {
  it('matchMedia es controlable (prefers-reduced-motion)', () => {
    const query = '(prefers-reduced-motion: reduce)'
    expect(window.matchMedia(query).matches).toBe(false)

    setMatchMedia((q) => q === query)
    expect(window.matchMedia(query).matches).toBe(true)
  })

  it('expone IntersectionObserver y ResizeObserver', () => {
    const io = new IntersectionObserver(() => undefined)
    const ro = new ResizeObserver(() => undefined)
    expect(() => io.observe(document.body)).not.toThrow()
    expect(() => ro.observe(document.body)).not.toThrow()
  })

  it('el Canvas de R3F se renderiza como un div inerte y oculto', () => {
    renderWithProviders(
      <Canvas>
        <mesh />
      </Canvas>,
    )
    const canvas = screen.getByTestId('r3f-canvas')
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toBeEmptyDOMElement()
  })

  it('renderWithProviders devuelve userEvent listo para usar', async () => {
    const { user } = renderWithProviders(<button type="button">OK</button>)
    await user.click(screen.getByRole('button', { name: 'OK' }))
    expect(screen.getByRole('button')).toHaveFocus()
  })
})
