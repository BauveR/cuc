# 08 · Hero 3D: modelo GLB y calidad adaptativa

> Commit: `feat(hero3d): add glb model pipeline and gpu-adaptive quality`

## Piezas nuevas

```
src/features/hero3d/
  assets.ts               Rutas públicas (benchmarks) + HERO_MODEL_URL
  HeroModel.tsx           GLB si hay URL; si no o si falla → PlaceholderModel
  GltfModel.tsx           Scroll → cabezal del clip de animación (damping)
  ModelErrorBoundary.tsx  Un GLB roto nunca tumba la página
  useHeroGltf.ts          useLoader(GLTFLoader) con Suspense y caché
  configureGltfLoader.ts  Meshopt + Draco (variante glTF) + KTX2
  clip.ts                 clipTime(), objectRadius()
  quality.ts              dprForGpu(): tabla tier → DPR
  useGpuTier.ts           detect-gpu (import dinámico, benchmarks propios)
  AdaptiveQuality.tsx     PerformanceMonitor + AdaptiveDpr
src/hooks/usePageVisible.ts   Page Visibility API
config/self-hosted-assets.ts  Plugin: sirve benchmarks de detect-gpu (allowlist)
config/model-budget.ts        Presupuesto: < 2 MB y < 100k triángulos
scripts/check-model.ts        npm run models:check (también en CI)
```

## Calidad por GPU

| Tier (detect-gpu) | Resultado |
| ----------------- | --------- |
| detectando / fallo | solo póster (no se descarga three) |
| 0 | solo póster |
| 1 | DPR 1 |
| ≥ 2 | DPR `[1, 1.5]` móvil · `[1, 2]` escritorio |

En caliente: `PerformanceMonitor` baja al DPR mínimo del tier si caen los FPS
y lo recupera si mejoran; `AdaptiveDpr` reduce la resolución durante
regresiones (`performance.min = 0.5`).

**Pestaña oculta** → `frameloop="never"` (0 frames, 0 GPU). Al volver, `invalidate()`.

## Modelo GLB

- `HERO_MODEL_URL = null` hasta tener el modelo de marca → placeholder.
  Para activarlo: dejar el archivo en `public/models/hero.glb` y poner la URL.
- El progreso de scroll mueve el **cabezal del primer clip** (`LoopOnce` +
  `clampWhenFinished`): progreso 1 = último frame. Damping con `MathUtils.damp`.
- Encuadre: `objectRadius()` (esfera envolvente) → `useFitCamera`; `<Center>`.
- **Iluminación horneada** en las texturas: las luces de la escena solo
  afectan al placeholder.
- Si el GLB falla (404, corrupto…), `ModelErrorBoundary` muestra el placeholder.

### Pipeline y presupuesto

```bash
# Optimizar (Meshopt + texturas KTX2). KTX2 requiere `toktx` (KTX-Software).
npx @gltf-transform/cli optimize modelo.glb public/models/hero.glb \
  --compress meshopt --texture-compress ktx2
npm run models:check   # falla si > 2 MB o > 100k triángulos
```

`models:check` corre en CI; sin modelo termina en OK.

## Seguridad: nada desde CDNs externos

| Recurso | Riesgo por defecto | Solución |
| ------- | ------------------ | -------- |
| Benchmarks de detect-gpu | Los pide a **unpkg.com** | Plugin propio los sirve en `/gpu-benchmarks` desde `node_modules` (allowlist exacta, test anti-traversal) |
| Decoders Draco/Basis (WASM) | Ejemplos típicos usan gstatic | three ≥ r18x los referencia con `new URL(…, import.meta.url)`: **Vite los empaqueta** como assets con hash en nuestro origen |
| Compilar WASM | CSP lo bloquea | `script-src 'wasm-unsafe-eval'`: permite **solo** WebAssembly, no `eval()` de JS (test lo garantiza) |

> **Cambio respecto al prompt**: pedía decoders "desde /public". Se valoró y
> se descartó copiarlos a mano: three ya los emite desde su propio paquete,
> con hash (caché inmutable) y versión siempre alineada. Copiarlos además los
> duplicaba en `dist/`. El objetivo (nunca CDN externo) se cumple y se testea.
> Nota: Vite emite también la variante Draco no-glTF (no se descarga nunca).

## Verificado en navegador (`vite preview`, CSP de producción)

detect-gpu pidió `/gpu-benchmarks/d-apple.json` a nuestro origen; **0 peticiones
externas**; tier de escritorio → DPR 2; póster desvanecido; 0 errores de consola
ni violaciones CSP. **No verificado aún en navegador**: la carga real de un GLB
con Draco/KTX2 (no hay modelo); queda cubierto por tests de configuración.

## Tests

`quality.test.ts` (tabla DPR, detect-gpu con benchmarks propios y fallback,
visibilidad) · `gltf.test.ts` (decoders mismo origen, clip, radio) ·
`gltfScene.test.tsx` (R3F real: scrub del clip, placeholder, fallback ante 404) ·
`AdaptiveQuality.test.tsx` (DPR baja/sube) · `HeroCanvas/HeroBackdrop` (tiers,
pausa) · `config/*` (allowlist, presupuesto, CSP con `wasm-unsafe-eval`).
