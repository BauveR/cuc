/**
 * Cabeceras de seguridad HTTP. Fuente única de verdad: se usan en el
 * servidor de Vite (dev/preview) y deben replicarse en el hosting de
 * producción (ver docs/01-setup.md).
 */
interface Options {
  dev: boolean
}

const csp = (dev: boolean): string =>
  [
    "default-src 'self'",
    // En dev, React Refresh inyecta un preámbulo inline y HMR usa websockets.
    // 'wasm-unsafe-eval': solo compilar WebAssembly (decoders Draco/Basis), NO habilita eval().
    dev ? "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'" : "script-src 'self' 'wasm-unsafe-eval'",
    "style-src 'self' 'unsafe-inline'", // estilos inline de GSAP/R3F
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "media-src 'self'", // vídeo del hero: solo desde el propio origen
    dev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
    "worker-src 'self' blob:", // loaders de three/drei
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(dev ? [] : ['upgrade-insecure-requests']),
  ].join('; ')

export const securityHeaders = ({ dev }: Options): Record<string, string> => ({
  'Content-Security-Policy': csp(dev),
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
})
