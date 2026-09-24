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
  const [hasIntersected, setHasIntersected] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    // Check WebGL and reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setSupported(false);
      return;
    }

    const onMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setSupported(false);
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    setSupported(detectWebGL());

    // Continuous IntersectionObserver to pause loop when scrolled out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
        }
      },
      { rootMargin: "100px", threshold: 0 }
    );

    const hero = document.querySelector("[data-hero-section]");
    if (hero) observer.observe(hero);

    // Document visibility listener to pause loop when tab is backgrounded
    const onVisibilityChange = () => {
      setIsDocumentVisible(!document.hidden);
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!supported) return <WebGLFallback />;

  const isRenderingActive = isIntersecting && isDocumentVisible;

  return (
    <div
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
      aria-hidden="true"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {hasIntersected ? (
        <Suspense fallback={<WebGLFallback />}>
          <LazyGL hovering={hovering} active={isRenderingActive} />
        </Suspense>
      ) : (
        <WebGLFallback />
      )}
    </div>
  );
}
