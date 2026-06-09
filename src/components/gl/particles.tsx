import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DofPointsMaterial } from './shaders/pointMaterial'

type ParticlesProps = {
  speed: number
  focus: number
  aperture: number
  size: number
  noiseScale: number
  noiseIntensity: number
  timeScale: number
  pointSize: number
  opacity: number
  planeScale: number
  hovering: boolean
  useManualTime: boolean
  manualTime: number
}

function buildGridTexture(size: number, planeScale: number, noiseScale: number, noiseIntensity: number) {
  const data = new Float32Array(size * size * 4)
  let offset = 0

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const nx = col / (size - 1) - 0.5
      const nz = row / (size - 1) - 0.5
      const x = nx * planeScale * 2
      const z = nz * planeScale * 2
      const wave = Math.sin((x + z) * noiseScale) * Math.cos((x - z) * noiseScale * 0.75) * noiseIntensity

      data[offset + 0] = x
      data[offset + 1] = wave * planeScale * 0.18
      data[offset + 2] = z
      data[offset + 3] = 1.0
      offset += 4
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType)
  texture.needsUpdate = true
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.flipY = false
  return texture
}

export function Particles({
  speed,
  focus,
  aperture,
  size,
  noiseScale,
  noiseIntensity,
  timeScale,
  pointSize,
  opacity,
  planeScale,
  hovering,
  useManualTime,
  manualTime,
}: ParticlesProps) {
  const material = useMemo(() => new DofPointsMaterial(), [])
  const geometry = useMemo(() => {
    const buffer = new THREE.BufferGeometry()
    const data = new Float32Array(size * size * 3)
    let offset = 0
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        data[offset + 0] = col / (size - 1)
        data[offset + 1] = row / (size - 1)
        data[offset + 2] = 0
        offset += 3
      }
    }
    buffer.setAttribute('position', new THREE.BufferAttribute(data, 3))
    return buffer
  }, [size])
  const positions = useMemo(() => buildGridTexture(size, planeScale, noiseScale, noiseIntensity), [size, planeScale, noiseScale, noiseIntensity])
  const initialPositions = useMemo(() => buildGridTexture(size, planeScale, noiseScale, noiseIntensity), [size, planeScale, noiseScale, noiseIntensity])
  const pointsRef = useRef<THREE.Points | null>(null)

  useEffect(() => {
    material.uniforms.positions.value = positions
    material.uniforms.initialPositions.value = initialPositions
    material.uniforms.uFocus.value = focus
    material.uniforms.uBlur.value = aperture * 0.35
    material.uniforms.uPointSize.value = pointSize
    material.uniforms.uOpacity.value = opacity
    material.uniforms.uRevealFactor.value = planeScale * 1.2
    material.uniforms.uRevealProgress.value = 1.0
    material.uniforms.uTransition.value = 0.0

    return () => {
      geometry.dispose()
      positions.dispose()
      initialPositions.dispose()
      material.dispose()
    }
  }, [aperture, focus, geometry, initialPositions, material, opacity, pointSize, positions, planeScale])

  useFrame(({ clock }, delta) => {
    const elapsed = useManualTime ? manualTime : clock.getElapsedTime() * timeScale
    material.uniforms.uTime.value = elapsed * speed
    if (pointsRef.current) {
      pointsRef.current.rotation.x = -Math.PI / 4.5 + (hovering ? 0.03 : 0)
      pointsRef.current.rotation.y = hovering ? 0.08 : 0
      pointsRef.current.scale.setScalar(hovering ? 1.02 : 1)
    }
    if (!useManualTime) {
      material.uniforms.uRevealProgress.value = Math.min(1, material.uniforms.uRevealProgress.value + delta * 0.12)
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <primitive object={material} attach="material" />
    </points>
  )
}
