import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppProviders } from './AppProviders'

describe('<AppProviders />', () => {
  it('renderiza sus hijos sin envolverlos en DOM extra', () => {
    const { container } = render(
      <AppProviders>
        <p>hijo</p>
      </AppProviders>,
    )
    expect(screen.getByText('hijo')).toBeInTheDocument()
    expect(container.firstElementChild?.tagName).toBe('P')
  })
})
