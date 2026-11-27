# 03 · Entorno de testing

> Commit: `test: configure vitest mocks, coverage thresholds and renderWithProviders`

## Stack

Vitest 5 · jsdom · Testing Library (+ user-event) · jest-dom · vitest-axe ·
cobertura `@vitest/coverage-v8`.

## Estructura

```
src/test/
  setup.ts                 Matchers, mocks globales y limpieza entre tests
  renderWithProviders.tsx  Render con providers reales + userEvent (DRY)
  setup.test.tsx           Test de ejemplo: valida el propio entorno
  mocks/
    matchMedia.ts          matchMedia controlable (setMatchMedia)
    observers.ts           IntersectionObserver / ResizeObserver
    r3f.ts                 @react-three/fiber sin WebGL
src/providers/AppProviders.tsx  Composición única de providers (app y tests)
```

## Mocks

| Mock | Motivo | Uso en tests |
| ---- | ------ | ------------ |
| `matchMedia` | jsdom no lo implementa; lo usan reduced-motion, breakpoints, Lenis | `setMatchMedia((q) => q.includes('reduce'))` |
| `IntersectionObserver` | ScrollTrigger / lazy-load | Automático |
| `ResizeObserver` | R3F, drei, layouts | Automático |
| `@react-three/fiber` | jsdom no tiene WebGL | `<Canvas>` → `<div data-testid="r3f-canvas" aria-hidden>` |
| `HTMLCanvasElement.getContext` | axe lo invoca (color-contrast) | Devuelve `null` |

**R3F se mockea por completo** (sin `importOriginal`): así three no se carga
en jsdom (tests más rápidos, sin el aviso CJS de three). Si un componente usa
otra API de R3F a nivel de módulo, se añade a `r3fMock`.

Los mocks se reinstalan en `beforeEach` y se resetean en `afterEach`
(`vi.unstubAllGlobals`, `resetMatchMedia`): ningún test contamina a otro.

## renderWithProviders

```tsx
import { axe, renderWithProviders, screen } from '@/test/renderWithProviders'

const { user, container } = renderWithProviders(<MenuToggle />)
await user.click(screen.getByRole('button', { name: /menu/i }))
expect(await axe(container)).toHaveNoViolations()
```

Usa el mismo `AppProviders` que `main.tsx`: tests y app no divergen.

## Cobertura

- Provider v8, reportes `text`, `html` y `lcov` (en `coverage/`, ignorado en git).
- **Umbral 80 %** en líneas, funciones, ramas y sentencias: por debajo, falla.
- Excluidos: tests, `src/test/**`, `main.tsx`, `*.d.ts`, tipos de contenido.
- `npm run check` ahora ejecuta `test:coverage`: la CI aplica el umbral.

## Contrato por componente

Cada componente tiene un test que cubre: **render**, **accesibilidad básica**
(roles/nombres accesibles + axe) y **props/estados**.

## Otros cambios

- Versiones de dependencias fijadas exactas (sin `^`) en `package.json`.
- Instaladas `three`, `@react-three/fiber`, `@react-three/drei` (necesarias para
  el mock; se usarán en la escena 3D).
- ADR de Git: las ramas aceptan cualquier tipo Conventional (`test/*`, etc.).

## Comandos

```bash
npm test               # una pasada
npm run test:watch     # modo watch
npm run test:coverage  # con cobertura y umbral
```
