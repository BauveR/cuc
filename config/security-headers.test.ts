import { describe, expect, it } from 'vitest'
import { securityHeaders } from './security-headers.ts'

const directive = (csp: string, name: string): string =>
  csp.split('; ').find((d) => d.startsWith(`${name} `)) ?? ''

describe('securityHeaders', () => {
  const prod = securityHeaders({ dev: false })
  const csp = prod['Content-Security-Policy'] ?? ''

  it('la CSP de producción no permite scripts inline ni eval de JS', () => {
    const scripts = directive(csp, 'script-src')
    // Solo WebAssembly (decoders 3D); nunca 'unsafe-eval' ni 'unsafe-inline'.
    expect(scripts).toBe("script-src 'self' 'wasm-unsafe-eval'")
    expect(scripts).not.toMatch(/'unsafe-(eval|inline)'/)
  })

  it('bloquea framing, plugins y base-uri externos', () => {
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("base-uri 'self'")
    expect(prod['X-Frame-Options']).toBe('DENY')
  })

  it('incluye las cabeceras de endurecimiento básicas', () => {
    expect(prod['X-Content-Type-Options']).toBe('nosniff')
    expect(prod['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(prod['Permissions-Policy']).toContain('camera=()')
  })

  it('solo dev relaja la CSP para HMR', () => {
    const dev = securityHeaders({ dev: true })['Content-Security-Policy'] ?? ''
    expect(directive(dev, 'connect-src')).toContain('ws:')
    expect(directive(csp, 'connect-src')).not.toContain('ws:')
  })
})
