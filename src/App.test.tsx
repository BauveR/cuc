import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { App } from './App'
import { getContent } from '@/content'

const { brand } = getContent()

describe('<App />', () => {
  it('renderiza el nombre de marca como encabezado principal', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1, name: brand.name })).toBeInTheDocument()
  })

  it('expone un landmark main', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('no tiene violaciones de accesibilidad detectables', async () => {
    const { container } = render(<App />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
