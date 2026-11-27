import type { ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProviders } from '@/providers/AppProviders'

type Options = Omit<RenderOptions, 'wrapper'>

/**
 * Render con los mismos providers que la app + userEvent ya configurado.
 * Uso: const { user } = renderWithProviders(<Comp />)
 */
export const renderWithProviders = (ui: ReactElement, options: Options = {}) => ({
  user: userEvent.setup(),
  ...render(ui, { wrapper: AppProviders, ...options }),
})

export { screen, within, waitFor } from '@testing-library/react'
export { axe } from 'vitest-axe'
export { setMatchMedia } from './mocks/matchMedia'
