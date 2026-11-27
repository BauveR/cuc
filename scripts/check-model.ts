/**
 * Verifica el presupuesto del GLB del hero (tamaño y triángulos).
 * Uso: npm run models:check  — sin modelo todavía, termina en OK.
 */
import { existsSync, readFileSync } from 'node:fs'
import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS } from '@gltf-transform/extensions'
import { MeshoptDecoder } from 'meshoptimizer'
import draco3d from 'draco3dgltf'
import { checkModel } from '../config/model-budget.ts'

const FILE = 'public/models/hero.glb'

if (!existsSync(FILE)) {
  console.log(`ℹ️  ${FILE} no existe todavía: se usa PlaceholderModel. Nada que comprobar.`)
  process.exit(0)
}

await MeshoptDecoder.ready
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder,
  'draco3d.decoder': await draco3d.createDecoderModule(),
})

const bytes = readFileSync(FILE).byteLength
const report = checkModel(await io.read(FILE), bytes)

console.log(`📦 ${FILE}: ${(bytes / 1024).toFixed(0)} KB · ${report.triangles} triángulos`)
for (const violation of report.violations) console.error(`❌ ${violation}`)
process.exit(report.violations.length > 0 ? 1 : 0)
