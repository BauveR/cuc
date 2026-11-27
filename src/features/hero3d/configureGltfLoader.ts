import type { WebGLRenderer } from 'three'
import type { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader, DRACO_GLTF_CONFIG } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

/** Subconjunto del renderer que necesita KTX2Loader para detectar formatos GPU. */
type RendererLike = Pick<WebGLRenderer, 'extensions'>

/**
 * Habilita las compresiones del pipeline del modelo:
 * - Meshopt (geometría): decoder JS dentro del chunk vendor-three.
 * - Draco (geometría, variante glTF, más ligera) y KTX2/Basis (texturas):
 *   WASM que Vite empaqueta desde three como assets de nuestro origen.
 *   Nunca se configura una ruta de CDN externo.
 */
export const configureGltfLoader = (loader: GLTFLoader, renderer: RendererLike): void => {
  const draco = new DRACOLoader().setDecoderPath(DRACO_GLTF_CONFIG)
  const ktx2 = new KTX2Loader().detectSupport(renderer as WebGLRenderer)

  loader.setDRACOLoader(draco).setKTX2Loader(ktx2).setMeshoptDecoder(MeshoptDecoder)
}
