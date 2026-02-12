import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { proposalConfig } from '../config/trailConfig';

/** The 3D decorations at the end of the trail (heart arch, string lights, etc.) */
export default function ProposalScene() {
  const z = proposalConfig.proposalZPosition;
  const lightsRef = useRef<THREE.Group>(null);
  const archRef = useRef<THREE.Group>(null);

  // String light positions in an arc
  const stringLights = useMemo(() => {
    const lights: [number, number, number][] = [];
    for (let i = 0; i < 20; i++) {
      const angle = (i / 19) * Math.PI;
      const x = Math.cos(angle) * 6;
      const y = Math.sin(angle) * 4 + 2;
      lights.push([x, y, z - 3]);
    }
    // Second row
    for (let i = 0; i < 15; i++) {
      const angle = (i / 14) * Math.PI;
      const x = Math.cos(angle) * 5;
      const y = Math.sin(angle) * 3 + 2.5;
      lights.push([x, y, z - 5]);
    }
    return lights;
  }, [z]);

  // Heart arch made of small spheres
  const heartArch = useMemo(() => {
    const points: [number, number, number][] = [];
    for (let t = 0; t < Math.PI * 2; t += 0.15) {
      const x = 16 * Math.pow(Math.sin(t), 3) * 0.25;
      const y =
        (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.25 + 5;
      points.push([x, y, z - 2]);
    }
    return points;
  }, [z]);

  useFrame(() => {
    const t = Date.now() * 0.001;
    // Twinkle string lights
    if (lightsRef.current) {
      lightsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat.emissiveIntensity !== undefined) {
          mat.emissiveIntensity = 0.5 + Math.sin(t * 3 + i * 0.5) * 0.5;
        }
      });
    }
  });

  return (
    <group>
      {/* Clearing ground - slightly different color */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, z - 3]} receiveShadow>
        <circleGeometry args={[10, 32]} />
        <meshStandardMaterial color="#5a8a4a" />
      </mesh>

      {/* Flower ring around clearing */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const x = Math.cos(angle) * 9;
        const zz = Math.sin(angle) * 9 + z - 3;
        const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#ff6347', '#ffd700'];
        return (
          <mesh key={`fring-${i}`} position={[x, 0.2, zz]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
              color={colors[i % colors.length]}
              emissive={colors[i % colors.length]}
              emissiveIntensity={0.3}
            />
          </mesh>
        );
      })}

      {/* Heart arch */}
      <group ref={archRef}>
        {heartArch.map((pos, i) => (
          <mesh key={`heart-${i}`} position={pos}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>

      {/* String lights */}
      <group ref={lightsRef}>
        {stringLights.map((pos, i) => (
          <mesh key={`light-${i}`} position={pos}>
            <sphereGeometry args={[0.08, 8, 8]} />
            <meshStandardMaterial
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={0.8}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Wire connecting string lights */}
      {/* Central spot light */}
      <pointLight position={[0, 6, z - 3]} intensity={2} color="#ffd700" distance={15} />
      <pointLight position={[0, 3, z - 3]} intensity={1} color="#ff69b4" distance={10} />

      {/* Pedestal */}
      <mesh position={[0, 0.15, z - 3]} castShadow>
        <cylinderGeometry args={[1.5, 1.8, 0.3, 16]} />
        <meshStandardMaterial color="#f5f5dc" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}
