# 09 · Secciones de la home

> Commit: `feat(sections): add home sections rendered from typed content`

## Estructura

```
src/components/ui/        Componentes base reutilizables
  Section.tsx             <section> con nombre accesible, ancla, data-section, tono
  Heading.tsx             Antetítulo + título (RevealText) + entradilla
  Card.tsx                <article> con h3, kicker y badge opcionales
  SafeLink.tsx            ÚNICO componente de enlace (allowlist de href)
src/sections/             Una sección por archivo, contenido por props
  IntroSection            Claim (único h1) + 2 CTA · transparente sobre el 3D
  ServicesSection         Grid de cards 1 → 2 → 3 columnas
  IntegrationsSection     Herramientas por categoría (listas nombradas)
  ProcessSection          <ol> 01–05 (número decorativo, aria-hidden)
  SectorsSection          Cards por sector
  CasesSection            Cards con <dl> reto/solución/resultado + badge ilustrativo
  CtaSection              Tono inverso · destino de todos los "#contacto"
src/pages/Home.tsx        Compone las secciones en orden
src/content/section-types.ts  Tipos por sección (types.ts superaba 100 líneas)
```

Las secciones reciben su porción de contenido por props (inyección de
dependencias): se testean en aislamiento y la Home solo compone (SRP).

## Contenido nuevo

- `integrations`: 4 categorías de herramientas habituales en pymes. Se citan
  como ecosistema, **no como partnerships** (TODO: validar la lista).
- `process`: ahora 5 pasos (Diagnóstico → Propuesta → Implantación →
  Formación → Acompañamiento).
- `cases.labels`: etiquetas de la `<dl>` y del badge, todas en `src/content`.
- `cta`: reutiliza `contact.cta` como acción (DRY).
- `SECTION_IDS`: añadidos `intro` (`#inicio`) e `integrations` (`#integraciones`).

## Accesibilidad

- Cada sección es un landmark `region` nombrado por su h2 (`aria-labelledby`).
- Un único `h1` (tests en Intro, Home y App).
- `<main id="contenido" tabIndex={-1}>`: destino del futuro SkipLink.
- Casos ilustrativos: badge **siempre visible** (test lo garantiza).
- **Velo móvil del intro** (`paper/85` + blur): el modelo queda centrado tras
  el texto en móvil; test de contraste con el peor caso (velo sobre tinta).
- **Foco en secciones oscuras**: el acento sobre tinta no llega a 3:1
  (WCAG 2.4.11) → `[data-tone='inverse'] :focus-visible` usa `on-inverse`.
- Botones con altura mínima 48 px (objetivo táctil).

## Seguridad

`SafeLink` aplica `isSafeHref` en el render: un `javascript:`/`data:`/`//host`
nunca llega a ser `<a>` (se muestra solo el texto). Externos con
`rel="noopener noreferrer"`. Test con vectores reales.

## Ajustes tras revisión visual (Chrome, CSP de producción)

| Problema | Causa | Solución |
| -------- | ----- | -------- |
| Titular recortado ("Tecnolo…") | `text-display` hasta 11rem: la palabra más larga no cabía y la máscara de SplitText la cortaba | Escala `clamp(3rem, 1rem + 6.5vw, 8.5rem)` + `break-words` como red de seguridad |
| Descendentes cortados (g, j, y) | Máscara `overflow: clip` con line-height 0.88 | `[data-reveal] > div { padding-bottom/margin-bottom: ±0.18em }` |
| Modelo 3D sobre "pyme" (contraste) | Keyframe inicial en x=1.4 | x=2.4, escala 0.9: fuera de la columna del titular |

**No verificado visualmente**: el ancho móvil (la ventana del navegador no se
dejó redimensionar). Cubierto por tests de contraste del velo y por el layout
mobile-first; pendiente de revisión manual en dispositivo.

## Tests

Un archivo por componente: `Section`, `Heading`, `Card`, `SafeLink`, las 7
secciones, `Home` (orden, h1 único, anclas internas resueltas, axe global) y `App`.
