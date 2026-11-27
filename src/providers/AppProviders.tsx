import type { ReactNode } from 'react'

interface AppProvidersProps {
  readonly children: ReactNode
}

/**
 * Punto único de composición de providers (locale, motion…).
 * Lo usan main.tsx y renderWithProviders, así tests y app no divergen.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>
}
