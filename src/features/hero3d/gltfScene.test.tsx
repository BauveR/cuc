import { afterEach, describe, expect, it, vi } from 'vitest'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { AnimationClip, Group, Mesh, VectorKeyframeTrack, type Object3D } from 'three'
import { GltfModel } from './GltfModel'
import { HeroModel } from './HeroModel'
import { setScrollProgress } from './scrollState'

vi.unmock('@react-three/fiber') // R3F real, sin GPU

const loadGltf = vi.hoisted(() => vi.fn())
vi.mock('./useHeroGltf', () => ({ useHeroGltf: loadGltf }))

/** GLB falso: un mesh "part" que el clip mueve de x=0 a x=4 en 2 s. */
const fakeGltf = () => {
  const part = new Mesh()
  part.name = 'part'
  const scene = new Group().add(part)
  const track = new VectorKeyframeTrack('part.position', [0, 2], [0, 0, 0, 4, 0, 0])
  return { scene, part, animations: [new AnimationClip('scroll', 2, [track])] }
}

const meshes = (root: Object3D): Mesh[] => {
  const found: Mesh[] = []
  root.traverse((o) => o instanceof Mesh && found.push(o))
  return found
}

describe('modelo GLB', () => {
  afterEach(() => setScrollProgress(0))

  it('el scroll mueve el cabezal del clip con amortiguación', async () => {
    const gltf = fakeGltf()
    loadGltf.mockReturnValue(gltf)
    const r = await ReactThreeTestRenderer.create(<GltfModel url="/models/hero.glb" />)
    setScrollProgress(1)
    await ReactThreeTestRenderer.act(() => r.advanceFrames(1, 1 / 60))
    expect(gltf.part.position.x).toBeGreaterThan(0)
    expect(gltf.part.position.x).toBeLessThan(4) // no salta
    await ReactThreeTestRenderer.act(() => r.advanceFrames(300, 1 / 60))
    expect(gltf.part.position.x).toBeCloseTo(4, 2) // último frame del clip
  })

  it('sin URL usa el placeholder', async () => {
    const r = await ReactThreeTestRenderer.create(<HeroModel url={null} />)
    expect(meshes(r.scene.instance)[0]?.geometry.type).toBe('IcosahedronGeometry')
    expect(loadGltf).not.toHaveBeenCalled()
  })

  it('si el GLB falla al cargar, cae al placeholder sin romper la escena', async () => {
    // El reconciler de R3F informa el error capturado vía window "error"
    // (en el navegador: solo consola). Se marca como gestionado aquí.
    const reported: unknown[] = []
    const onError = (event: ErrorEvent) => {
      reported.push(event.error)
      event.preventDefault()
    }
    window.addEventListener('error', onError)
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const failure = new Error('404 /models/hero.glb')
    loadGltf.mockImplementation(() => {
      throw failure
    })
    const r = await ReactThreeTestRenderer.create(<HeroModel url="/models/hero.glb" />)
    expect(meshes(r.scene.instance)[0]?.geometry.type).toBe('IcosahedronGeometry')
    window.removeEventListener('error', onError)
    expect(reported).toContain(failure)
  })
})
