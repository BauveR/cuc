import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders } from '@/test/renderWithProviders'
import { Hearts } from './Hearts'
import { Monogram } from './Monogram'
import { HEART_COUNT } from './marks.paths'

describe('<Monogram />', () => {
  it('decorativo, en currentColor y sin contorno por defecto', () => {
    const { container } = renderWithProviders(<Monogram />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('path')).not.toHaveAttribute('stroke')
  })

  it('outlined: contorno papel por fuera del trazo (legible sobre fondos oscuros)', () => {
    const { container } = renderWithProviders(<Monogram outlined />)
    const path = container.querySelector('path')
    expect(path).toHaveAttribute('stroke', 'var(--color-paper)')
    expect(path).toHaveAttribute('paint-order', 'stroke')
  })
})

describe('<Hearts />', () => {
  it('10 corazones animables por separado, decorativos y sin violaciones', async () => {
    const { container } = renderWithProviders(<Hearts />)
    expect(container.querySelector('ul')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelectorAll('[data-heart]')).toHaveLength(HEART_COUNT)
    expect(await axe(container)).toHaveNoViolations()
  })
})
