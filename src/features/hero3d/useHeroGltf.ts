import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { configureGltfLoader } from './configureGltfLoader'

/** Carga (con Suspense y caché de R3F) un GLB con Meshopt/Draco/KTX2. */
export const useHeroGltf = (url: string): GLTF => {
  const gl = useThree((s) => s.gl)
  return useLoader(GLTFLoader, url, (loader) => configureGltfLoader(loader, gl))
}
