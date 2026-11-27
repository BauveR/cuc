import { describe, expect, it } from 'vitest'
import { Document } from '@gltf-transform/core'
import { MODEL_BUDGET, checkModel, countTriangles } from './model-budget.ts'

/** Documento sintético con `triangles` triángulos (indexados o no). */
const makeDoc = (triangles: number, indexed: boolean): Document => {
  const doc = new Document()
  const buffer = doc.createBuffer()
  const vertices = triangles * 3
  const position = doc
    .createAccessor()
    .setType('VEC3')
    .setArray(new Float32Array(vertices * 3))
    .setBuffer(buffer)
  const prim = doc.createPrimitive().setAttribute('POSITION', position)
  if (indexed) {
    const indices = doc
      .createAccessor()
      .setType('SCALAR')
      .setArray(new Uint32Array(vertices))
      .setBuffer(buffer)
    prim.setIndices(indices)
  }
  doc.createMesh().addPrimitive(prim)
  return doc
}

describe('model budget', () => {
  it.each([true, false])('cuenta triángulos (indexado: %s)', (indexed) => {
    expect(countTriangles(makeDoc(12, indexed))).toBe(12)
  })

  it('ignora primitivas que no son triángulos (líneas, puntos)', () => {
    const doc = makeDoc(10, true)
    doc.getRoot().listMeshes()[0]?.listPrimitives()[0]?.setMode(1) // LINES
    expect(countTriangles(doc)).toBe(0)
  })

  it('aprueba un modelo dentro del presupuesto', () => {
    expect(checkModel(makeDoc(100, true), 1024).violations).toEqual([])
  })

  it('rechaza por tamaño y por triángulos', () => {
    const report = checkModel(makeDoc(MODEL_BUDGET.maxTriangles + 1, false), MODEL_BUDGET.maxBytes + 1)
    expect(report.violations).toHaveLength(2)
    expect(report.triangles).toBe(MODEL_BUDGET.maxTriangles + 1)
  })
})
