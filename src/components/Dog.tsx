import { useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export type DogMood = 'idle' | 'walking' | 'sitting' | 'sad' | 'angry' | 'barking' | 'chasing' | 'proud';

export interface DogHandle {
  group: THREE.Group | null;
  setMood: (mood: DogMood) => void;
}

/**
 * Procedural low-poly dog built from basic geometries.
 * Animated via useFrame based on mood and velocity.
 */
const Dog = forwardRef<DogHandle, { mood?: DogMood }>(({ mood: externalMood }, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const bounceRef = useRef<THREE.Group>(null);
  const internalMood = useRef<DogMood>(externalMood ?? 'idle');

  // Leg refs for walk animation
  const frontLeftLeg = useRef<THREE.Mesh>(null);
  const frontRightLeg = useRef<THREE.Mesh>(null);
  const backLeftLeg = useRef<THREE.Mesh>(null);
  const backRightLeg = useRef<THREE.Mesh>(null);
  const tail = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Mesh>(null);
  const rightEye = useRef<THREE.Mesh>(null);
  const leftEyebrow = useRef<THREE.Mesh>(null);
  const rightEyebrow = useRef<THREE.Mesh>(null);

  const eyeMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a1a1a' }), []);
  const angryEyeMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ff0000', emissive: '#ff0000', emissiveIntensity: 1 }),
    []
  );

  useImperativeHandle(ref, () => ({
    group: groupRef.current,
    setMood: (m: DogMood) => {
      internalMood.current = m;
    },
  }));

  useFrame((_, delta) => {
    const mood = externalMood ?? internalMood.current;
    const t = Date.now() * 0.001;
    // Leg animation
    if (mood === 'walking' || mood === 'chasing') {
      const speed = mood === 'chasing' ? 1.5 : 1;
      const swing = Math.sin(t * 8 * speed) * 0.5;
      if (frontLeftLeg.current) frontLeftLeg.current.rotation.x = swing;
      if (frontRightLeg.current) frontRightLeg.current.rotation.x = -swing;
      if (backLeftLeg.current) backLeftLeg.current.rotation.x = -swing;
      if (backRightLeg.current) backRightLeg.current.rotation.x = swing;
    } else {
      // Reset legs for idle/sitting
      [frontLeftLeg, frontRightLeg, backLeftLeg, backRightLeg].forEach((leg) => {
        if (leg.current) {
          leg.current.rotation.x = THREE.MathUtils.lerp(leg.current.rotation.x, 0, delta * 5);
        }
      });
    }

    // Tail wag
    if (tail.current) {
      if (mood === 'proud' || mood === 'walking') {
        tail.current.rotation.z = Math.sin(t * 10) * 0.5;
        tail.current.rotation.x = -0.3;
      } else if (mood === 'sad') {
        tail.current.rotation.x = THREE.MathUtils.lerp(tail.current.rotation.x, 0.5, delta * 3);
        tail.current.rotation.z = 0;
      } else if (mood === 'angry' || mood === 'barking') {
        tail.current.rotation.x = -0.5;
        tail.current.rotation.z = Math.sin(t * 15) * 0.3;
      } else {
        tail.current.rotation.z = Math.sin(t * 3) * 0.2;
        tail.current.rotation.x = THREE.MathUtils.lerp(tail.current.rotation.x, -0.2, delta * 3);
      }
    }

    // Head bob / tilt based on mood
    if (head.current) {
      if (mood === 'sad') {
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, 0.3, delta * 3);
        head.current.rotation.z = Math.sin(t * 2) * 0.05;
      } else if (mood === 'barking') {
        head.current.rotation.x = Math.sin(t * 12) * 0.15 - 0.1;
      } else if (mood === 'angry') {
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -0.15, delta * 3);
      } else {
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, 0, delta * 3);
        head.current.rotation.z = 0;
      }
    }

    // Eyes: angry glow
    const isAngry = mood === 'angry' || mood === 'barking';
    if (leftEye.current) leftEye.current.material = isAngry ? angryEyeMaterial : eyeMaterial;
    if (rightEye.current) rightEye.current.material = isAngry ? angryEyeMaterial : eyeMaterial;

    // Eyebrows
    if (leftEyebrow.current && rightEyebrow.current) {
      if (mood === 'sad') {
        leftEyebrow.current.rotation.z = 0.3;
        rightEyebrow.current.rotation.z = -0.3;
        leftEyebrow.current.visible = true;
        rightEyebrow.current.visible = true;
      } else if (isAngry) {
        leftEyebrow.current.rotation.z = -0.4;
        rightEyebrow.current.rotation.z = 0.4;
        leftEyebrow.current.visible = true;
        rightEyebrow.current.visible = true;
      } else {
        leftEyebrow.current.visible = false;
        rightEyebrow.current.visible = false;
      }
    }

    // Sitting posture
    if (mood === 'sitting' || mood === 'proud') {
      if (backLeftLeg.current) backLeftLeg.current.rotation.x = -0.8;
      if (backRightLeg.current) backRightLeg.current.rotation.x = -0.8;
    }

    // Body bounce for walking (applied to inner group so it doesn't conflict with position)
    if (bounceRef.current) {
      if (mood === 'walking') {
        bounceRef.current.position.y = Math.abs(Math.sin(t * 8)) * 0.05;
      } else if (mood === 'barking') {
        bounceRef.current.position.y = Math.abs(Math.sin(t * 12)) * 0.08;
      } else {
        bounceRef.current.position.y = THREE.MathUtils.lerp(bounceRef.current.position.y, 0, delta * 5);
      }
    }
  });

  const bodyColor = '#d4923a';
  const bellyColor = '#f0d9a0';

  return (
    <group ref={groupRef}>
    <group ref={bounceRef}>
      {/* Body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      {/* Belly */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.6, 0.2, 1]} />
        <meshStandardMaterial color={bellyColor} />
      </mesh>

      {/* Head group */}
      <group ref={head} position={[0, 0.95, -0.5]}>
        {/* Head */}
        <mesh castShadow>
          <boxGeometry args={[0.55, 0.5, 0.5]} />
          <meshStandardMaterial color={bodyColor} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.1, -0.3]}>
          <boxGeometry args={[0.3, 0.25, 0.25]} />
          <meshStandardMaterial color={bellyColor} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.02, -0.44]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Left ear */}
        <mesh position={[-0.25, 0.3, 0.05]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.15, 0.3, 0.08]} />
          <meshStandardMaterial color="#a0652a" />
        </mesh>
        {/* Right ear */}
        <mesh position={[0.25, 0.3, 0.05]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.15, 0.3, 0.08]} />
          <meshStandardMaterial color="#a0652a" />
        </mesh>
        {/* Left eye */}
        <mesh ref={leftEye} position={[-0.15, 0.08, -0.26]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Right eye */}
        <mesh ref={rightEye} position={[0.15, 0.08, -0.26]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Eye highlights */}
        <mesh position={[-0.13, 0.1, -0.31]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.17, 0.1, -0.31]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Eyebrows (hidden by default) */}
        <mesh ref={leftEyebrow} position={[-0.15, 0.18, -0.27]} visible={false}>
          <boxGeometry args={[0.14, 0.03, 0.02]} />
          <meshStandardMaterial color="#5c3b1e" />
        </mesh>
        <mesh ref={rightEyebrow} position={[0.15, 0.18, -0.27]} visible={false}>
          <boxGeometry args={[0.14, 0.03, 0.02]} />
          <meshStandardMaterial color="#5c3b1e" />
        </mesh>
        {/* Tongue (for happy/panting) */}
        <mesh position={[0.05, -0.2, -0.35]}>
          <boxGeometry args={[0.08, 0.04, 0.12]} />
          <meshStandardMaterial color="#ff6b8a" />
        </mesh>
      </group>

      {/* Legs */}
      <mesh ref={frontLeftLeg} position={[-0.25, 0.2, -0.4]} castShadow>
        <boxGeometry args={[0.18, 0.45, 0.18]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh ref={frontRightLeg} position={[0.25, 0.2, -0.4]} castShadow>
        <boxGeometry args={[0.18, 0.45, 0.18]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh ref={backLeftLeg} position={[-0.25, 0.2, 0.4]} castShadow>
        <boxGeometry args={[0.18, 0.45, 0.18]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>
      <mesh ref={backRightLeg} position={[0.25, 0.2, 0.4]} castShadow>
        <boxGeometry args={[0.18, 0.45, 0.18]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Paws */}
      {[[-0.25, 0, -0.4], [0.25, 0, -0.4], [-0.25, 0, 0.4], [0.25, 0, 0.4]].map((pos, i) => (
        <mesh key={`paw-${i}`} position={pos as [number, number, number]}>
          <boxGeometry args={[0.2, 0.06, 0.22]} />
          <meshStandardMaterial color="#a0652a" />
        </mesh>
      ))}

      {/* Tail */}
      <mesh ref={tail} position={[0, 0.85, 0.65]} rotation={[-0.3, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.03, 0.5, 8]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      {/* Collar */}
      <mesh position={[0, 0.75, -0.35]}>
        <torusGeometry args={[0.22, 0.03, 8, 16]} />
        <meshStandardMaterial color="#ff1493" />
      </mesh>
      {/* Tag */}
      <mesh position={[0, 0.6, -0.55]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
    </group>
  );
});

Dog.displayName = 'Dog';
export default Dog;
