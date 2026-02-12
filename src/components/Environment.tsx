import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { themeConfig, proposalConfig } from '../config/trailConfig';

/** Ground plane + trail path */
function Terrain() {
  const trailLen = proposalConfig.trailLength + 30;

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -trailLen / 2]} receiveShadow>
        <planeGeometry args={[120, trailLen + 60]} />
        <meshStandardMaterial color={themeConfig.groundColor} />
      </mesh>
      {/* Trail path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -trailLen / 2]} receiveShadow>
        <planeGeometry args={[4, trailLen + 20]} />
        <meshStandardMaterial color={themeConfig.trailColor} />
      </mesh>
    </group>
  );
}

/** A simple procedural tree made of cones + cylinder */
function Tree({ position }: { position: [number, number, number] }) {
  const scale = 0.7 + Math.random() * 0.6;
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, 3, 8]} />
        <meshStandardMaterial color="#5c3b1e" />
      </mesh>
      {/* Foliage layers */}
      <mesh position={[0, 3.5, 0]} castShadow>
        <coneGeometry args={[1.8, 2.5, 8]} />
        <meshStandardMaterial color="#2d5a27" />
      </mesh>
      <mesh position={[0, 4.5, 0]} castShadow>
        <coneGeometry args={[1.4, 2, 8]} />
        <meshStandardMaterial color="#3a7d32" />
      </mesh>
      <mesh position={[0, 5.3, 0]} castShadow>
        <coneGeometry args={[0.9, 1.5, 8]} />
        <meshStandardMaterial color="#4a9e3f" />
      </mesh>
    </group>
  );
}

/** Grass tufts scattered around */
function GrassTuft({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <coneGeometry args={[0.1, 0.4, 4]} />
      <meshStandardMaterial color="#5a8a3c" />
    </mesh>
  );
}

/** Flower scattered around the trail */
function Flower({ position }: { position: [number, number, number] }) {
  const color = useMemo(() => {
    const colors = ['#ff69b4', '#ff1493', '#ff6347', '#ffb6c1', '#ffd700', '#ff4500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 4]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

/** Floating heart particles along the trail */
function FloatingHearts() {
  const heartsRef = useRef<THREE.Group>(null);
  const hearts = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: 2 + Math.random() * 5,
        z: -Math.random() * proposalConfig.trailLength,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.05 + Math.random() * 0.1,
      });
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!heartsRef.current) return;
    heartsRef.current.children.forEach((child, i) => {
      const h = hearts[i];
      child.position.y = h.y + Math.sin(Date.now() * 0.001 * h.speed + h.phase) * 0.5;
      child.rotation.y += delta * 0.5;
    });
  });

  return (
    <group ref={heartsRef}>
      {hearts.map((h, i) => (
        <mesh key={i} position={[h.x, h.y, h.z]} scale={h.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#ff69b4"
            emissive="#ff1493"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

/** All environment elements */
export default function Environment() {
  const trees = useMemo(() => {
    const arr: [number, number, number][] = [];
    const trailLen = proposalConfig.trailLength;
    for (let i = 0; i < 100; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (5 + Math.random() * 25);
      const z = -Math.random() * (trailLen + 20);
      arr.push([x, 0, z]);
    }
    return arr;
  }, []);

  const grass = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = -Math.random() * proposalConfig.trailLength;
      if (Math.abs(x) > 2.5) {
        arr.push([x, 0.15, z]);
      }
    }
    return arr;
  }, []);

  const flowers = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < 80; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (2.5 + Math.random() * 3);
      const z = -Math.random() * proposalConfig.trailLength;
      arr.push([x, 0, z]);
    }
    return arr;
  }, []);

  return (
    <group>
      <Terrain />
      {trees.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} />
      ))}
      {grass.map((pos, i) => (
        <GrassTuft key={`grass-${i}`} position={pos} />
      ))}
      {flowers.map((pos, i) => (
        <Flower key={`flower-${i}`} position={pos} />
      ))}
      <FloatingHearts />
    </group>
  );
}
