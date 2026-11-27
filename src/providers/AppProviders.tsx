import type { ReactNode } from 'react'
import { SmoothScrollProvider } from '@/features/scroll/SmoothScrollProvider'

interface AppProvidersProps {
  readonly children: ReactNode
}

/**
 * Punto único de composición de providers (scroll, locale…).
 * Lo usan main.tsx y renderWithProviders, así tests y app no divergen.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>
}
