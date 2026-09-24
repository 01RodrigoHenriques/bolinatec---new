import { useState, useEffect, lazy, Suspense } from "react";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

const LazyGL = lazy(() => import("./gl/index").then((m) => ({ default: m.GL })));

function WebGLFallback() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: "#080808",
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        transform: "perspective(800px) rotateX(45deg) scale(1.4)",
        transformOrigin: "center 80%",
        opacity: 0.6,
      }}
    />
  );
}

export function HeroGL() {
  const [hovering, setHovering] = useState(false);
  const [supported, setSupported] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check WebGL and reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setSupported(false);
      return;
    }

    setSupported(detectWebGL());

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    const hero = document.querySelector("[data-hero-section]");
    if (hero) observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  if (!supported) return <WebGLFallback />;

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {visible ? (
        <Suspense fallback={<WebGLFallback />}>
          <LazyGL hovering={hovering} />
        </Suspense>
      ) : (
        <WebGLFallback />
      )}
    </div>
  );
}
