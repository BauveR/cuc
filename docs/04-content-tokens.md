# 04 · Design tokens y contenido

> Commit: `feat(content): add editorial design tokens and typed site content`

## Design tokens (`src/styles/tokens.css`)

Tailwind v4 genera las utilidades a partir de `@theme`. La paleta por defecto
se resetea (`--color-*: initial`): **solo existen los colores de marca**, nadie
puede usar `bg-red-500` por accidente.

### Paleta editorial sobria

| Token | Valor | Uso | Utilidades |
| ----- | ----- | --- | ---------- |
| `paper` | `#f3f0ea` | Fondo principal | `bg-paper` |
| `surface` | `#e8e3d9` | Bloques, tarjetas | `bg-surface` |
| `line` | `#cfc8ba` | Separadores (decorativo) | `border-line` |
| `ink` | `#141414` | Texto principal | `text-ink` |
| `ink-muted` | `#57534e` | Texto secundario | `text-ink-muted` |
| `accent` | `#8a3a1c` | Enlaces, foco, detalles | `text-accent` |
| `inverse` / `on-inverse(-muted)` | `#141414` / `#f3f0ea` / `#a8a29e` | Overlay del menú, footer | `bg-inverse text-on-inverse` |

**Contraste AA verificado por test** (`tokens.test.ts`): el test lee el CSS en
crudo, extrae los colores y comprueba ≥ 4.5:1 en cada par texto/fondo. Cambiar
un color que rompa AA hace fallar la CI.

### Tipografía (fluida con `clamp()`, mobile-first)

| Token | Rango | Uso |
| ----- | ----- | --- |
| `text-display` | 3.25 → 11 rem | Titular del hero |
| `text-headline` | 2.5 → 6.5 rem | Títulos de sección |
| `text-title` | 1.75 → 3 rem | Títulos de tarjeta / paso |
| `text-lead` | 1.125 → 1.5 rem | Entradillas |
| `text-body` | 1 rem | Texto corrido |
| `text-caption` | 0.8125 rem, tracking 0.06em | Eyebrows, etiquetas |

Line-height y letter-spacing van asociados a cada token (`--text-x--line-height`).
Fuente: pendiente de elegir y **auto-alojar** (la CSP solo permite `font-src 'self'`).

### Espaciado y layout

`p-gutter` (márgenes laterales), `gap-stack` (ritmo vertical), `py-section`
(separación entre secciones), `max-w-content` (90 rem), `max-w-prose` (40 rem).
Easing: `ease-out-expo`, `ease-in-out-quart`.

## Contenido (`src/content/`)

```
types.ts       Contrato SiteContent (cada idioma debe cumplirlo)
sections.ts    IDs de ancla estables, no traducibles (#servicios, #contacto…)
site.ts        getContent(locale) + re-exports públicos
es/            Un módulo por sección: hero, services, process, sectors, cases, contact
```

> El prompt pedía `src/content/site.ts` con todo el contenido. Con la regla de
> 100 líneas eso es inviable: `site.ts` es el punto de entrada y el texto se
> reparte por sección en `es/`. Para CA/EN se crea `ca/` y `en/` con la misma forma.

Secciones: **hero**, **servicios** (soporte IT, ciberseguridad, cloud, desarrollo
web, integración/automatización, consultoría digital), **proceso** (4 pasos),
**sectores** (6 sectores de pymes de Barcelona), **casos** y **contacto**.

### Casos ilustrativos

Los casos no son de clientes reales: llevan `illustrative: true` y un
`illustrativeLabel` que el componente **debe mostrar**. No contienen cifras ni
nombres inventados. Sustituir por casos reales autorizados antes de producción.

## Seguridad

- `src/lib/url.ts → isSafeHref`: allowlist de esquemas (`#`, `/`, `mailto:`,
  `tel:`, `https:`). Bloquea `javascript:`, `data:`, `vbscript:`, `//host` y `http:`.
- Un test recorre **todo** el contenido y exige que cada `href` sea seguro y
  que cada ancla interna exista en `SECTION_IDS`.
- Email de contacto con dominio reservado `example.com` hasta tener el real.

## Pendiente de marca

`[NOMBRE]` (`es/index.ts`), email real (`es/contact.ts`), tipografía, casos reales.
