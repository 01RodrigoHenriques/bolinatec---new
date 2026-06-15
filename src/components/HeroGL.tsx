import { useState, useEffect, lazy, Suspense } from "react"

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

const LazyGL = lazy(() => import("./gl/index").then(m => ({ default: m.GL })))

function WebGLFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'radial-gradient(ellipse at 50% 40%, #1a1a2e 0%, #000 70%)',
      }}
    />
  )
}

function WebGLLoader() {
  return <WebGLFallback />
}

export function HeroGL() {
  const [hovering, setHovering] = useState(false)
  const [supported, setSupported] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setSupported(detectWebGL())

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    const hero = document.querySelector('[data-hero-section]')
    if (hero) observer.observe(hero)

    return () => observer.disconnect()
  }, [])

  if (!supported) return <WebGLFallback />

  return (
    <div
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {visible ? (
        <Suspense fallback={<WebGLLoader />}>
          <LazyGL hovering={hovering} />
        </Suspense>
      ) : (
        <WebGLFallback />
      )}
    </div>
  )
}
