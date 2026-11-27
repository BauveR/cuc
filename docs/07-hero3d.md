# 07 · Hero 3D

> Commit: `feat(hero3d): add lazy 3d hero canvas with poster and placeholder model`

## Arquitectura

```
src/features/hero3d/
  HeroBackdrop.tsx       Contenedor fixed 100lvh: póster + canvas lazy (chunk inicial)
  HeroPoster.tsx         <picture> AVIF/WebP, LCP, fundido al cargar el 3D
  HeroCanvas.tsx         <Canvas frameloop="demand"> (chunk diferido)
  PlaceholderModel.tsx   Icosaedro + controller móvil/escritorio + useFitCamera
  AnimatedModel.tsx      Sigue la pose objetivo con damping en useFrame
  useFitCamera.ts        Encuadra la cámara para un radio dado
  useScrollProgress.ts   ScrollTrigger → scrollState + invalidate()
  scrollState.ts         Progreso mutable FUERA de React
  timeline.ts            Interpolación pura, radio envolvente, controller por keyframes
  timeline.config.ts     Keyframes mobile/desktop, breakpoint, damping
  scene.config.ts        Cámara, luces, material, rutas del póster
  fitCamera.ts           fitDistance(): matemática pura del encuadre
  types.ts               Vec3, Pose, Keyframe, Timeline, ModelController
src/lib/webgl.ts         supportsWebGL() cacheado
public/hero/             poster.avif (4 KB) · poster.webp (11 KB)
```

## Flujo de render

1. **Primer paint**: `HeroPoster` ya es visible (`fetchpriority="high"` +
   `<link rel="preload">` del AVIF en `index.html`). Es el candidato a LCP.
2. `React.lazy` carga `HeroCanvas` → chunk `vendor-three` (~243 KB gzip).
3. `onCreated` → `ready` → el póster se desvanece (`data-faded`, 1 s, `ease-out-expo`).
4. **Sin 3D** (solo póster) con `prefers-reduced-motion` o sin WebGL.

Contenedor: `fixed inset-x-0 top-0 -z-10 h-lvh`, `aria-hidden`, `pointer-events-none`.
`100lvh` (large viewport) evita saltos cuando la barra del navegador móvil aparece o desaparece.

## Progreso de scroll sin React

```
ScrollTrigger.onUpdate ──► scrollState.progress (objeto mutable)
                       └─► invalidate()  ──► useFrame lee scrollState y amortigua
```

- **Prohibido `useState` para el progreso**: cambiaría a 60 fps y
  re-renderizaría el árbol en cada frame.
- `frameloop="demand"`: solo se renderiza cuando el scroll cambia o mientras
  el damping no ha llegado a la pose (`error > 1e-4` → `invalidate()`).
  En reposo, **0 frames**: GPU y batería en paz.
- `MathUtils.damp` (independiente del framerate) con delta acotado a 1/15 s.

## ModelController (abierto/cerrado)

```ts
interface ModelController {
  readonly radius: number          // esfera envolvente de todo el recorrido
  poseAt(progress: number): Pose   // pose objetivo para 0..1
}
```

`PlaceholderModel` usa `createKeyframeController(TIMELINE.mobile|desktop)`.
Cambiar al modelo de marca (GLTF) = nuevo componente + su controller; escena,
cámara y scroll no se tocan. `assertTimeline` valida keyframes (0 → 1, orden creciente).

## Encuadre de cámara

`fitDistance(radius, fov, aspect) = radius / sin(min(vFov, hFov) / 2)`.
Usa el FOV más restrictivo: en móvil vertical manda el horizontal y el modelo
no se corta. Margen 1.15. Recalcula al cambiar el aspect ratio. `<Center>` (drei)
centra la geometría en el origen.

## Chunks (`vite.config.ts → manualChunks`)

| Chunk | gzip | Carga |
| ----- | ---- | ----- |
| `index` | 59 KB | inicial |
| `vendor-react` | 68 KB | inicial (modulepreload) |
| `vendor-three` | 243 KB | **diferida** (import dinámico) |
| `HeroCanvas` | 1.6 KB | diferida |

> **Trampa evitada**: sin el grupo `vendor-react` explícito, Rolldown arrastraba
> `react-dom`/`scheduler` (dependencias de R3F) a `vendor-three`, y el chunk
> principal importaba three **estáticamente**: el lazy-load no servía. Verificado
> en el build: `index.html` ya no precarga `vendor-three`.

## Verificación en navegador (vite preview + CSP de producción)

- Póster → `index` → `vendor-react` → `HeroCanvas` → `vendor-three`, en ese orden.
- Canvas creado, póster desvanecido, Lenis activo, **0 errores de consola / CSP**.
- Con scroll forzado, el modelo se desplaza, rota y escala según los keyframes.

## Tests

| Archivo | Cubre |
| ------- | ----- |
| `timeline.test.ts` | configs válidas, interpolación, clamp, radio envolvente, controller |
| `pure.test.ts` | `fitDistance` (FOV vertical/horizontal), `scrollState` acotado |
| `scene.test.tsx` | **R3F real** (`@react-three/test-renderer`): damping hacia la pose, encuadre de cámara |
| `HeroCanvas.test.tsx` | ScrollTrigger de página, escritura fuera de React + `invalidate`, `kill` |
| `HeroBackdrop.test.tsx` | póster LCP, lazy + fundido, sin WebGL, reduced-motion, axe |
| `webgl.test.ts` | detección, caché, error al crear contexto |

## Pendiente / conocido

- **Póster provisional** generado por script (esfera facetada). Sustituir por un
  render real del frame 0 del modelo de marca (`avifenc -q 60`, `cwebp -q 78`).
- **Texto sobre el modelo**: el modelo oscuro puede quedar bajo el titular y
  romper el contraste AA. Se resuelve en la maquetación del hero (texto y
  modelo en zonas distintas, o velo detrás del texto).
- Material muy oscuro con la iluminación actual: ajustar con el modelo real.
- Aviso `THREE_CJS_DEPRECATED` en `scene.test.tsx`: lo provoca el build CJS de
  `@react-three/test-renderer` (sin `exports`). Solo en tests, sin impacto.
