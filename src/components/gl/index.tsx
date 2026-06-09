import { Canvas } from "@react-three/fiber"
import { Preload } from "@react-three/drei"
import { Particles } from "./particles"

const speed = 1.0, focus = 3.8, aperture = 1.79, size = 185
const noiseScale = 0.6, noiseIntensity = 0.52, timeScale = 1.0
const pointSize = 4.0, opacity = 0.85, planeScale = 12.0
const vignetteDarkness = 1.5, vignetteOffset = 0.4
const useManualTime = false, manualTime = 0

type GLProps = {
  hovering: boolean
}

export function GL({ hovering }: GLProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 18, 48]} />
      <Particles
        speed={speed}
        focus={focus}
        aperture={aperture}
        size={size}
        noiseScale={noiseScale}
        noiseIntensity={noiseIntensity}
        timeScale={timeScale}
        pointSize={pointSize}
        opacity={opacity}
        planeScale={planeScale}
        hovering={hovering}
        useManualTime={useManualTime}
        manualTime={manualTime}
      />
      <Preload all />
    </Canvas>
  )
}
