import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import Dog from './Dog';
import type { DogHandle, DogMood } from './Dog';
import type { ControlState } from '../hooks/useControls';
import { proposalConfig } from '../config/trailConfig';

interface Props {
  controlsRef: React.RefObject<ControlState>;
  onPositionChange: (z: number) => void;
  onReachEnd: () => void;
  dogMood: DogMood;
}

const MOVE_SPEED = 6;
const TRAIL_HALF_WIDTH = 8; // How far left/right the dog can go

/**
 * Controls the dog's movement, camera following, and reports position.
 */
export default function PlayerController({ controlsRef, onPositionChange, onReachEnd, dogMood }: Props) {
  const dogRef = useRef<DogHandle>(null);
  const posRef = useRef(new THREE.Vector3(0, 0, 2));
  const rotRef = useRef(0); // Y rotation
  const { camera } = useThree();
  const reachedEnd = useRef(false);

  // Camera offset behind the dog
  const cameraOffset = useRef(new THREE.Vector3(0, 4, 8));
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    const moveDir = new THREE.Vector3();

    // Keyboard
    if (controls.forward) moveDir.z -= 1;
    if (controls.backward) moveDir.z += 1;
    if (controls.left) moveDir.x -= 1;
    if (controls.right) moveDir.x += 1;

    // Joystick
    if (Math.abs(controls.joyX) > 0.1 || Math.abs(controls.joyY) > 0.1) {
      moveDir.x += controls.joyX;
      moveDir.z -= controls.joyY; // nipplejs Y is inverted
    }

    const isMoving = moveDir.length() > 0.1;

    if (isMoving) {
      moveDir.normalize();
      posRef.current.x += moveDir.x * MOVE_SPEED * delta;
      posRef.current.z += moveDir.z * MOVE_SPEED * delta;

      // Clamp X to trail bounds
      posRef.current.x = THREE.MathUtils.clamp(posRef.current.x, -TRAIL_HALF_WIDTH, TRAIL_HALF_WIDTH);

      // Clamp Z (can't go past start, can go to proposal area)
      posRef.current.z = THREE.MathUtils.clamp(
        posRef.current.z,
        proposalConfig.proposalZPosition - 15,
        5
      );

      // Rotate dog to face movement direction
      // Dog model faces -Z in local space, so negate Z for correct atan2
      const targetRot = Math.atan2(moveDir.x, -moveDir.z);
      rotRef.current = THREE.MathUtils.lerp(rotRef.current, targetRot, delta * 8);
    }

    // Update dog group transform
    if (dogRef.current?.group) {
      const g = dogRef.current.group;
      g.position.copy(posRef.current);
      g.rotation.y = rotRef.current;

      // Set walking mood only if no override mood
      if (dogMood === 'idle' || dogMood === 'walking') {
        dogRef.current.setMood(isMoving ? 'walking' : 'idle');
      } else {
        dogRef.current.setMood(dogMood);
      }
    }

    // Camera: follow behind the dog
    const idealOffset = cameraOffset.current.clone();
    // Rotate offset based on dog rotation (but only partially for smoother feel)
    idealOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotRef.current * 0.3);
    const idealPos = posRef.current.clone().add(idealOffset);

    camera.position.lerp(idealPos, delta * 3);
    cameraTarget.current.copy(posRef.current);
    cameraTarget.current.y += 1;
    camera.lookAt(cameraTarget.current);

    // Report position
    onPositionChange(posRef.current.z);

    // Check if reached the end
    if (posRef.current.z <= proposalConfig.proposalZPosition + 5 && !reachedEnd.current) {
      reachedEnd.current = true;
      onReachEnd();
    }
  });

  return (
    <group>
      <Dog ref={dogRef} mood={dogMood} />
    </group>
  );
}
