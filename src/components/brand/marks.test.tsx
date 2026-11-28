import { describe, expect, it } from 'vitest'
import { axe, renderWithProviders } from '@/test/renderWithProviders'
import { Hearts } from './Hearts'
import { Monogram } from './Monogram'
import { HEART_COUNT, MONOGRAM } from './marks.paths'

describe('<Monogram />', () => {
  it('decorativo, en currentColor y con el trazo exacto del original (sin contorno)', () => {
    const { container } = renderWithProviders(<Monogram />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(container.querySelector('svg')).toHaveAttribute('fill', 'currentColor')
    const path = container.querySelector('path')
    expect(path).toHaveAttribute('d', MONOGRAM.path)
    expect(path).not.toHaveAttribute('stroke')
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
