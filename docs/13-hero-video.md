# 13 · Vídeo del hero con scroll (scrub)

> Commit: `feat(hero): add scroll-scrubbed hero video with responsive framing`

## Qué hace

Un vídeo en el hero que **avanza y retrocede al ritmo del scroll** (no se
reproduce solo). Ocupa el **80 % de alto** del hero (`80svh`), bajo el header
y entre los márgenes de la rejilla (15 px). Capas, de atrás adelante:

```
póster 3D (LCP) → vídeo (scrub) → canvas 3D → texto del hero (velo de papel)
```

Vive en el fondo fijo (`HeroBackdrop`): al hacer scroll, la siguiente sección
(opaca) sube y lo tapa, mientras el vídeo llega al final.

## Análisis del original (`IMG_2131.mov`)

| Dato | Valor | Decisión |
| ---- | ----- | -------- |
| Peso | 35 MB | Inviable en web → 2,7 MB (horizontal) y 2,5 MB (vertical); test de presupuesto ≤ 3 MB |
| Códec | HEVC (H.265) | No lo reproduce Firefox ni Chrome en muchos equipos → H.264 |
| Tamaño | 1708×914, 24 s, 30 fps, 11,5 Mbps | 1280×684 (CRF 36) y 684×914 (CRF 34), 24 fps |
| Color | SDR BT.709, rango completo (`yuvj420p`) | Rango limitado (`yuv420p`, tv): evita colores lavados |
| Audio | AAC | Eliminado (el scrub siempre va en silencio) |
| **Metadatos** | **GPS y fecha de grabación** | **Eliminados** (`-map_metadata -1`, bitexact) |

### Por qué el original no está en `public/`

Todo lo que hay en `public/` se copia al build y **se publica**, aunque esté
en `.gitignore`. El original vive en `media-src/` (ignorado; también `*.mov`)
y solo se versionan las versiones optimizadas y sin metadatos de `public/video/`.

## Codificación — `scripts/encode-hero-video.sh`

```bash
scripts/encode-hero-video.sh media-src/hero.mov 0.5   # 0.5 = foco horizontal del recorte vertical
```

- **H.264 High, yuv420p**: decodificación por hardware en todos los navegadores.
- **Keyframe cada 0,5 s** (`-g 12` a 24 fps, `-sc_threshold 0`): para mostrar un
  instante el decodificador parte del keyframe anterior; con GOP corto el seek
  es inmediato en ambos sentidos. Con el GOP por defecto (~250) el scrub da tirones.
- **faststart**: índice al principio → peticiones por rangos desde el inicio.
- Fotograma inicial en AVIF/WebP sin metadatos: primer paint y fallback.

### Pruebas de peso (horizontal)

El contenido (oleaje: textura fina en todo el plano) es el peor caso para comprimir:

| CRF | GOP | fps | Ancho | Peso |
| --- | --- | --- | ----- | ---- |
| 26 | 6 | 30 | 1280 | 14,3 MB |
| 30 | 6 | 30 | 1280 | 8,3 MB |
| 32 | 12 | 24 | 1280 | 4,8 MB |
| 34 | 12 | 24 | 1280 | 3,6 MB |
| **36** | **12** | **24** | **1280** | **2,7 MB** ✓ |

Comparado a 2× de zoom frente al original: diferencia apenas visible en un
fondo detrás del 3D y del texto.

## Responsive

| Recuadro | Encuadre | Fichero |
| -------- | -------- | ------- |
| Más ancho que alto (escritorio, tablet horizontal) | Original, 1280 px | `hero-landscape.*` |
| Más alto que ancho (móvil, tablet vertical) | Recorte 3:4 a altura completa | `hero-portrait.*` |

El recuadro mide (100vw − 30px) × 80svh: es vertical cuando el viewport
cumple `max-aspect-ratio: 4/5`. Se evalúa con `useMediaQuery`, así que
**al rotar el móvil cambia de encuadre** en caliente. `object-fit: cover`
ajusta el resto. `svh` evita saltos con la barra del navegador móvil.

## Scrub — `useVideoScrub`

- ScrollTrigger (`#inicio`, de `top top` a `bottom top`) solo guarda el
  progreso; Lenis ya suaviza el scroll.
- El seek se aplica en `gsap.ticker` (el mismo reloj que Lenis): uno por frame,
  nunca mientras el anterior sigue en curso (`video.seeking`) y solo si cambia
  más de 1/60 s → sin cola de seeks ni decodificador saturado.
- **iOS Safari** no descarga fotogramas de un vídeo nunca reproducido: se hace
  `play()` + `pause()` silenciado al cargar metadatos (permitido sin gesto).

## Rendimiento y accesibilidad

- El `<video>` se monta **tras el `load`** y en idle (`useAfterLoad`): no
  compite con el LCP (el póster sigue con `fetchpriority="high"`).
- **Sin vídeo** con `prefers-reduced-motion` o **ahorro de datos / 2G**
  (`prefersSaveData`): se queda el fotograma estático.
- Decorativo: dentro del fondo `aria-hidden`, `muted`, sin controles,
  `tabIndex=-1`, sin PiP ni cast. Sin audio → no requiere subtítulos.
- Texto del hero superpuesto con **velo de papel** (85 % + blur) en todos los
  tamaños: contraste AA garantizado sea cual sea el fotograma. La tarjeta se
  apoya dentro del recuadro (`pb: 100lvh − 80svh + gutter`).

## Verificación (puppeteer, Chrome)

| Pantalla | Encuadre | Recuadro | Scrub (45 % de scroll → vuelta) |
| -------- | -------- | -------- | ------------------------------- |
| Móvil 390×844 | vertical | 362×675 (80 %) | 0 → 9,45 s → 0 |
| Tablet 820×1180 | vertical | 792×944 (80 %) | 0 → 9,85 s → 0 |
| Escritorio 1440×900 | horizontal | 1412×720 (80 %) | 0 → 9,53 s → 0 |

Sin scroll horizontal en ninguna. `dist/` no contiene el `.mov`. Ficheros
finales sin GPS, modelo ni fecha (comprobado con ffprobe y en los bytes).

## Seguridad

- CSP: `media-src 'self'` explícito (solo vídeo propio).
- Metadatos de ubicación eliminados del vídeo y de los fotogramas.

## Herramientas

- ffmpeg (Homebrew) solo en local, para generar los ficheros; no es
  dependencia del proyecto ni del CI.
