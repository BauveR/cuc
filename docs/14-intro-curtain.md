# 14 · Cortinilla de entrada

> Commit: `feat(intro): add entry curtain with monogram and hearts`

## Referencia: lenis.dev (solo la mecánica)

Analizado en Chrome (fotogramas y estilos computados). No se copia su marca,
logotipo ni color.

| lenis.dev | Medido |
| --------- | ------ |
| Panel `fixed` a pantalla completa, `z-1000`, color de marca | rosa `#ff98a2` |
| Letras SVG en máscara, suben de `105–125 %` a `0` con desfase de 5 % | ~1 s, `expo.out` |
| El panel sube `translate: 0 → −100 %` | ~1,1 s, `expo.out` (28 % a los 90 ms) |
| Scroll bloqueado durante la intro | `overflow: hidden` + Lenis parado |
| Frecuencia | en cada carga, solo escritorio (`max-dt:hidden`) |

## Nuestra versión

| Decisión | Valor |
| -------- | ----- |
| Color | Papel `#f3f0ea` (trazos en tinta) |
| Frecuencia | Una vez por sesión (`sessionStorage`, con `try/catch`) |
| Pantallas | Todas |
| Movimiento reducido | Sin cortinilla |

### Composición

- **Monograma** (`cuc-04.svg`) centrado en ambos ejes del viewport;
  alto `clamp(5rem, 14svh, 9rem)`.
- **10 corazones** (`cuc-03.svg`) justo debajo, centrados, posicionados en
  absoluto para **no desplazar** el centro del monograma.
- Medido: desviación del centro 0 × 0 px en 1440 y 390; corazones a 25–27 px.

### Secuencia (`useIntroTimeline`, GSAP)

| t | Qué pasa |
| - | -------- |
| 0 s | Monograma sube desde su máscara (0,9 s, `expo.out`) |
| 0,45 s | Corazones aparecen **uno a uno** (escala + opacidad, 80 ms de desfase) |
| ~1,7 s | Pausa breve; se liberan los reveals de texto (`onLift`) |
| ~1,7 → 2,8 s | La cortinilla sube (−100 %, 1,1 s, `expo.out`) y descubre el vídeo |
| ~2,8 s | Se desmonta; scroll y página se reactivan |

## Optimización de los SVG

- Trazos **en línea** en React (`IntroMarks.tsx`) con `fill="currentColor"`:
  sin peticiones extra y cada pieza se anima por separado.
- `cuc-03.svg` repetía 10 veces el mismo corazón (6,7 KB): se usa **un solo
  trazo** × 10 → ~0,7 KB.
- Originales en `src/features/intro/source/` (fuera de `public/`: no se publican).
- Revisados antes de usarlos: sin `<script>`, `<foreignObject>`, `<image>`,
  enlaces ni manejadores de eventos.

## Coordinación con el resto (`introGate.ts`)

- `main.tsx` decide **una vez, fuera de React** (StrictMode duplicaría
  inicializadores) si hay intro, y en ese caso retiene los reveals (`holdReveal`).
- `RevealText` usa `afterIntro`: síncrono sin intro; con intro, espera a que la
  cortinilla empiece a subir. Si no, el titular se animaría tapado.
- Durante la intro: `useScrollLock` (Lenis parado + `overflow: hidden`) y la
  página en un contenedor `inert` (sin foco ni clics bajo la cortinilla).
- Decorativa: `aria-hidden`.

## Verificación

- Tests: geometría SVG válida, 10 corazones, bloqueo/liberación de scroll,
  sesión marcada, `onLift` antes que `onDone`, página inerte, axe.
- Chrome (puppeteer): secuencia completa en 1440 y 390; al recargar en la misma
  sesión no se repite; tras la intro el titular se divide y anima.
- Lighthouse (móvil, primera visita): sin cambios frente a la rama sin intro
  (rendimiento 95, LCP 2,4–2,6 s).

## Incidencia durante el desarrollo

La extracción de los trazos con `d="…"` coincidió con `id="Layer_1"`: los SVG
no dibujaban nada y los tests pasaban. Se corrigió (`<path d="…">`) y se añadió
un test que exige geometría SVG válida.
