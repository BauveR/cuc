import { describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAnchorNavigation } from './useAnchorNavigation'

describe('useAnchorNavigation', () => {
  it('sin Lenis: hace scroll nativo y mueve el foco al destino', async () => {
    const section = document.createElement('section')
    section.id = 'casos'
    section.scrollIntoView = vi.fn()
    document.body.appendChild(section)

    const { result } = renderHook(() => useAnchorNavigation())
    result.current('#casos')
    await new Promise((resolve) => requestAnimationFrame(resolve))

    expect(section.scrollIntoView).toHaveBeenCalled()
    expect(section).toHaveAttribute('tabindex', '-1')
    expect(section).toHaveFocus()
    section.remove()
  })

  it('ignora destinos inexistentes o que no son anclas', () => {
    const { result } = renderHook(() => useAnchorNavigation())
    expect(() => result.current('#no-existe')).not.toThrow()
    expect(() => result.current('/ruta')).not.toThrow()
  })
})
