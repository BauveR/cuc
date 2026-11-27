import type { Document } from '@gltf-transform/core'

/** Presupuesto del modelo del hero (rendimiento en móvil y LCP). */
export const MODEL_BUDGET = {
  maxBytes: 2 * 1024 * 1024,
  maxTriangles: 100_000,
} as const

const TRIANGLES = 4 // GL_TRIANGLES

export interface ModelReport {
  readonly bytes: number
  readonly triangles: number
  readonly violations: readonly string[]
}

/** Cuenta triángulos de todas las primitivas en modo TRIANGLES. */
export const countTriangles = (doc: Document): number =>
  doc
    .getRoot()
    .listMeshes()
    .flatMap((mesh) => mesh.listPrimitives())
    .filter((prim) => prim.getMode() === TRIANGLES)
    .reduce((total, prim) => {
      const vertices = prim.getIndices()?.getCount() ?? prim.getAttribute('POSITION')?.getCount() ?? 0
      return total + Math.floor(vertices / 3)
    }, 0)

export const checkModel = (doc: Document, bytes: number): ModelReport => {
  const triangles = countTriangles(doc)
  const violations = [
    ...(bytes > MODEL_BUDGET.maxBytes ? [`Tamaño ${bytes} B > ${MODEL_BUDGET.maxBytes} B`] : []),
    ...(triangles > MODEL_BUDGET.maxTriangles
      ? [`Triángulos ${triangles} > ${MODEL_BUDGET.maxTriangles}`]
      : []),
  ]
  return { bytes, triangles, violations }
}
