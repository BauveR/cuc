import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { setMatchMedia } from '@/test/mocks/matchMedia'
import { AppProviders } from './AppProviders'

const renderTree = () =>
  render(
    <AppProviders>
      <p>hijo</p>
    </AppProviders>,
  )

describe('<AppProviders />', () => {
  it('renderiza sus hijos con smooth scroll activo, sin DOM extra', () => {
    const { container } = renderTree()
    expect(screen.getByText('hijo')).toBeInTheDocument()
    expect(container.firstElementChild?.tagName).toBe('P')
  })

  it('renderiza sus hijos con movimiento reducido', () => {
    setMatchMedia((q) => q.includes('reduce'))
    renderTree()
    expect(screen.getByText('hijo')).toBeInTheDocument()
  })
})
