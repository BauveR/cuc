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

### Secuencia (`useIntroTimeline`, GSAP) · ~4 s

| t | Qué pasa |
| - | -------- |
| 0 s | Monograma sube desde su máscara (0,9 s, `expo.out`) |
| 0,45 s | Corazones aparecen **uno a uno** (escala + opacidad, 80 ms de desfase) |
| ~1,7 s | Pausa breve; se liberan los reveals de texto (`onLift`) |
| ~1,7 → 2,8 s | El panel sube (−100 %, 1,1 s); monograma y corazones **quedan flotando** (capa propia) |
| ~2,4 → 4 s | **Vuelan a su sitio en el header** (1 s, `expo.inOut`, corazones con 60 ms de desfase) |
| ~4 s | Se desmonta la cortinilla y aparecen las copias del header (mismo fotograma) |

## Vuelo al header (paso 15)

> Commit: `feat(intro): fly curtain marks to their place in the header`

**Destino final**

| Elemento | Dónde | Tamaño |
| -------- | ----- | ------ |
| Monograma | A la izquierda del logotipo, alineado arriba, **sobresale** por debajo del header | 96 px (≥ md) · 72 px (móvil) · 56 px (< 360 px) |
| Corazones (≥ 1280 px) | Entre «Contacto» y los idiomas | fila de 6 px de alto (~80 px) |
| Corazones (< 1280 px) | Vuelan al botón «Menú», se encogen y se desvanecen; viven en el menú abierto junto a los idiomas | — |

- Entre 1280 y 1365 px la separación de enlaces baja de 16 a 10 px y la de
  idiomas de 12 a 8 px: hueco de 57 px → caben los corazones (8 / 7 px de aire).
- El monograma sobresale siempre (sello fijo) con `pointer-events: none` (no
  bloquea clics). Se usa **tal cual el SVG original**: hubo un contorno papel
  de 1,5 px para fondos oscuros, pero se retiró — alteraba el diseño (se veía
  al cruzar el vídeo) y ningún fondo oscuro llega a pasar por debajo (contacto
  queda a ≥ 207 px del borde; el monograma acaba a 115 px).

**Técnica: FLIP con dos copias** (`flight.ts`)

- Los destinos existen siempre en el header (`data-intro-target`), ocultos con
  `visibility` durante la intro → reservan su sitio: **CLS 0**.
- Al empezar el vuelo se miden origen y destino (`getBoundingClientRect`) y se
  anima `x`, `y`, `scale` de centro a centro. Valores función de GSAP: se
  calculan en ese instante, con fuentes y layout definitivos.
- Sin plugin Flip ni reparentar nodos: los elementos son de React; moverlos
  por fuera rompería la reconciliación.
- Monograma y corazones pasan a `src/components/brand/` (los comparten
  cortinilla, header y menú).

**Accesibilidad**

- La página **no** queda `inert` durante la intro: con 4 s, un lector de
  pantalla se quedaba sin `main` (Lighthouse lo detectó: 96 → 94). La
  cortinilla es `aria-hidden`; los clics los bloquea el panel mientras cubre.

**Verificación (Chrome, puppeteer)**

- Error de aterrizaje justo antes del cambio de copias: **0 px** en monograma y
  en los 10 corazones (1440 y 1280); en 390 los corazones llegan a «Menú» con
  opacidad 0.
- Monograma alineado arriba con el logotipo (18,5 px), sobresale 62 px (39 en móvil).
- Sin scroll horizontal. Lighthouse: rendimiento 93–95, accesibilidad 96, CLS 0.

## Optimización de los SVG

- Trazos **en línea** en React (`src/components/brand/marks.paths.ts`,
  `Monogram.tsx`, `Hearts.tsx`) con `fill="currentColor"`:
  sin peticiones extra y cada pieza se anima por separado.
- `cuc-03.svg` repetía 10 veces el mismo corazón (6,7 KB): se usa **un solo
  trazo** × 10 → ~0,7 KB.
- Originales en `src/components/brand/source/` (fuera de `public/`: no se publican).
- Revisados antes de usarlos: sin `<script>`, `<foreignObject>`, `<image>`,
  enlaces ni manejadores de eventos.

## Coordinación con el resto (`introGate.ts`)

- `main.tsx` decide **una vez, fuera de React** (StrictMode duplicaría
  inicializadores) si hay intro, y en ese caso retiene los reveals (`holdReveal`).
- `RevealText` usa `afterIntro`: síncrono sin intro; con intro, espera a que la
  cortinilla empiece a subir. Si no, el titular se animaría tapado.
- Durante la intro: `useScrollLock` (Lenis parado + `overflow: hidden`).
  (La versión inicial usaba `inert` en la página; se retiró en el paso 15.)
- Decorativa: `aria-hidden`.

## Verificación

- Tests: geometría SVG válida, 10 corazones, bloqueo/liberación de scroll,
  sesión marcada, `onLift` antes que `onDone`, `main` disponible durante la
  intro, geometría del vuelo y destinos (nav / Menú), axe.
- Chrome (puppeteer): secuencia completa en 1440 y 390; al recargar en la misma
  sesión no se repite; tras la intro el titular se divide y anima.
- Lighthouse (móvil, primera visita): sin cambios frente a la rama sin intro
  (rendimiento 95, LCP 2,4–2,6 s).

## Incidencia durante el desarrollo

La extracción de los trazos con `d="…"` coincidió con `id="Layer_1"`: los SVG
no dibujaban nada y los tests pasaban. Se corrigió (`<path d="…">`) y se añadió
un test que exige geometría SVG válida.
