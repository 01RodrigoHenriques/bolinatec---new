import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { SpatialBoardScene } from "./board";

type GLProps = {
  hovering: boolean;
};

export function GL({ hovering }: GLProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 5.0, 8.4], fov: 36 }}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <color attach="background" args={["#080808"]} />
      <fog attach="fog" args={["#080808", 9, 24]} />

      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 14, 6]} intensity={1.7} castShadow />
      <directionalLight position={[-8, 7, -4]} intensity={0.7} color="#a0c0ff" />
      <pointLight position={[0, 2, 0]} intensity={0.6} color="#ffffff" distance={6} />

      <SpatialBoardScene hovering={hovering} />
      <Preload all />
    </Canvas>
  );
}
