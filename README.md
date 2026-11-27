# [NOMBRE] · Web de marca

Sitio de marca de [NOMBRE]: servicios tecnológicos e integración de soluciones
para pymes en Barcelona. Contenido en ES, preparado para CA/EN.

## Requisitos

- Node 22.23.5 (`.nvmrc`, mínimo `>=22.22.2`): `nvm install && nvm use`

## Uso

```bash
npm install
npm run dev
npm run check   # typecheck + lint + tests
npm run build
```

## Reglas del proyecto

- SOLID / KISS / DRY · un componente = una responsabilidad.
- Ningún archivo supera 100 líneas (lo aplica ESLint).
- Cada componente tiene su test (render, a11y básica, props/estados).
- Todo el texto vive en `src/content/`.
- Mobile-first, WCAG AA, respeta `prefers-reduced-motion`.
- **Nunca** secretos en código, docs o tests. Las variables `VITE_*` son públicas.
- Conventional Commits. Ramas `feat/*` → `develop` → `release/*` → `main`.
- Vulnerabilidades: ver [SECURITY.md](./SECURITY.md).

## Documentación

Ver [`docs/`](./docs): un documento por sección principal.

0. [Flujo de Git (ADR-001)](./docs/00-git-workflow.md)
1. [Setup base](./docs/01-setup.md)
3. [Testing](./docs/03-testing.md)
4. [Design tokens y contenido](./docs/04-content-tokens.md)
6. [Smooth scroll](./docs/06-smooth-scroll.md)
7. [Hero 3D](./docs/07-hero3d.md)
8. [Hero 3D: GLB y calidad adaptativa](./docs/08-hero3d-glb.md)
