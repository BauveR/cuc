import { describe, expect, it, vi } from 'vitest'
import ReactThreeTestRenderer from '@react-three/test-renderer'
import { useThree, type RootState } from '@react-three/fiber'
import { AdaptiveQuality } from './AdaptiveQuality'

vi.unmock('@react-three/fiber') // R3F real, sin GPU

const monitor = vi.hoisted(() => ({ props: {} as { onDecline?: () => void; onIncline?: () => void } }))
vi.mock('@react-three/drei', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  PerformanceMonitor: (props: typeof monitor.props) => {
    monitor.props = props
    return null
  },
  AdaptiveDpr: () => null,
}))

describe('<AdaptiveQuality />', () => {
  it('baja al DPR mínimo si caen los FPS y lo recupera si mejoran', async () => {
    vi.stubGlobal('devicePixelRatio', 3)
    let state: RootState | undefined
    function Probe() {
      state = useThree()
      return null
    }
    await ReactThreeTestRenderer.create(
      <>
        <AdaptiveQuality dpr={[1.5, 2]} />
        <Probe />
      </>,
    )
    await ReactThreeTestRenderer.act(async () => monitor.props.onDecline?.())
    expect(state?.viewport.dpr).toBe(1.5)
    await ReactThreeTestRenderer.act(async () => monitor.props.onIncline?.())
    expect(state?.viewport.dpr).toBe(2)
  })
})
