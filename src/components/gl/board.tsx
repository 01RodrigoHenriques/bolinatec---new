import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface BoardSceneProps {
  hovering: boolean;
}

// Architectural Pawn Component (Scale tuned for balanced hero composition)
function ArchitecturalPawn({ position }: { position: [number, number, number] }) {
  const pawnGroup = useRef<THREE.Group>(null);

  // Subtle floating and idle animation
  useFrame((state) => {
    if (!pawnGroup.current) return;
    const t = state.clock.getElapsedTime();
    pawnGroup.current.position.y = position[1] + Math.sin(t * 1.5) * 0.06;
    pawnGroup.current.rotation.y = Math.sin(t * 0.5) * 0.12;
  });

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#f0f0f0',
        metalness: 0.88,
        roughness: 0.18,
        envMapIntensity: 1.2,
      }),
    []
  );

  const darkMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        metalness: 0.92,
        roughness: 0.28,
      }),
    []
  );

  return (
    <group ref={pawnGroup} position={position} scale={[0.82, 0.82, 0.82]}>
      {/* Base Plinth */}
      <mesh position={[0, 0.08, 0]} material={darkMaterial}>
        <cylinderGeometry args={[0.55, 0.65, 0.16, 32]} />
      </mesh>
      {/* Lower Ring */}
      <mesh position={[0, 0.22, 0]} material={material}>
        <cylinderGeometry args={[0.45, 0.52, 0.12, 32]} />
      </mesh>
      {/* Tapered Stem */}
      <mesh position={[0, 0.65, 0]} material={material}>
        <cylinderGeometry args={[0.22, 0.42, 0.75, 32]} />
      </mesh>
      {/* Collar Ring */}
      <mesh position={[0, 1.08, 0]} material={darkMaterial}>
        <cylinderGeometry args={[0.38, 0.34, 0.1, 32]} />
      </mesh>
      {/* Spherical Head */}
      <mesh position={[0, 1.45, 0]} material={material}>
        <sphereGeometry args={[0.36, 32, 32]} />
      </mesh>
      {/* Subtle Apex Pin */}
      <mesh position={[0, 1.82, 0]} material={material}>
        <coneGeometry args={[0.08, 0.15, 16]} />
      </mesh>

      {/* Ground Projection Ring (Target Square) */}
      <mesh position={[0, -position[1] + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 32]} />
        <meshBasicMaterial color="#ffffff" opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

// 8x8 Problem Space Grid with Elevation and Highlight Path
function GridBoard() {
  const gridRef = useRef<THREE.Group>(null);

  // Board dimensions: 8 columns by 8 rows
  const tiles = useMemo(() => {
    const list: Array<{
      x: number;
      z: number;
      isPath: boolean;
      isObstacle: boolean;
      elevation: number;
    }> = [];

    // Verified path moving forward from rank 2 to rank 7
    const pathCoords = new Set(['3,1', '3,2', '4,3', '4,4', '4,5', '5,6']);

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const key = `${c},${r}`;
        const isPath = pathCoords.has(key);
        // Minor variation in tile elevation to represent terrain & regulatory constraints
        const isObstacle = !isPath && (c + r) % 5 === 0;
        const elevation = isPath ? 0.05 : isObstacle ? 0.12 : 0.0;
        list.push({
          x: (c - 3.5) * 1.3,
          z: (r - 3.5) * 1.3,
          isPath,
          isObstacle,
          elevation,
        });
      }
    }
    return list;
  }, []);

  return (
    <group ref={gridRef}>
      {/* Individual Architectural Board Tiles */}
      {tiles.map((tile, i) => (
        <mesh
          key={i}
          position={[tile.x, tile.elevation / 2, tile.z]}
          receiveShadow
        >
          <boxGeometry args={[1.22, 0.06 + tile.elevation, 1.22]} />
          <meshStandardMaterial
            color={
              tile.isPath
                ? '#1e2420'
                : tile.isObstacle
                ? '#181818'
                : (i + Math.floor(i / 8)) % 2 === 0
                ? '#111111'
                : '#0c0c0c'
            }
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}

      {/* Grid Wireframe Overlay */}
      <gridHelper
        args={[10.4, 8, '#ffffff', '#222222']}
        position={[0, 0.065, 0]}
      />

      {/* Path Illumination Lines */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array([
                (3 - 3.5) * 1.3, 0.08, (1 - 3.5) * 1.3,
                (3 - 3.5) * 1.3, 0.08, (2 - 3.5) * 1.3,
                (4 - 3.5) * 1.3, 0.08, (3 - 3.5) * 1.3,
                (4 - 3.5) * 1.3, 0.08, (4 - 3.5) * 1.3,
                (4 - 3.5) * 1.3, 0.08, (5 - 3.5) * 1.3,
                (5 - 3.5) * 1.3, 0.08, (6 - 3.5) * 1.3,
              ]),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.35} transparent linewidth={1.5} />
      </line>
    </group>
  );
}

export function SpatialBoardScene({ hovering }: BoardSceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  // Subtle interactive parallax based on mouse position
  useFrame((state, delta) => {
    if (!rootRef.current) return;
    const targetRotX = 0.62 + mouse.y * 0.06;
    const targetRotY = -0.38 + mouse.x * 0.08;

    rootRef.current.rotation.x = THREE.MathUtils.damp(
      rootRef.current.rotation.x,
      targetRotX,
      2.5,
      delta
    );
    rootRef.current.rotation.y = THREE.MathUtils.damp(
      rootRef.current.rotation.y,
      targetRotY,
      2.5,
      delta
    );
  });

  return (
    <group ref={rootRef} position={[0, -1.2, 0]}>
      {/* Board Base */}
      <GridBoard />

      {/* The Advancing Pawn */}
      <ArchitecturalPawn position={[(4 - 3.5) * 1.3, 0.1, (4 - 3.5) * 1.3]} />
    </group>
  );
}
