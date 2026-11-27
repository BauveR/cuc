import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  readonly fallback: ReactNode
  readonly children: ReactNode
}

interface State {
  readonly failed: boolean
}

/**
 * Si el GLB no carga (404, archivo corrupto, decoder bloqueado…) se muestra
 * el fallback en vez de romper la escena. El 3D es decorativo: nunca debe
 * tumbar la página.
 */
export class ModelErrorBoundary extends Component<Props, State> {
  override state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) console.warn('[hero3d] modelo no disponible:', error, info)
  }

  override render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
