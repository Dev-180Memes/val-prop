import { useRef, useEffect, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import { trailPhotos, trailMessages, themeConfig } from '../config/trailConfig';

/** Inner component that loads the texture */
function PhotoImage({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  return (
    <mesh position={[0, 0.05, -0.06]}>
      <planeGeometry args={[1.9, 1.4]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

/** Fallback colored plane when texture hasn't loaded */
function PhotoPlaceholder() {
  return (
    <mesh position={[0, 0.05, -0.06]}>
      <planeGeometry args={[1.9, 1.4]} />
      <meshStandardMaterial color="#ffb6c1" />
    </mesh>
  );
}

/** Inner component that plays a looping video as a texture */
function VideoMedia({ videoUrl }: { videoUrl: string }) {
  const video = useMemo(() => {
    const el = document.createElement('video');
    el.src = videoUrl;
    el.crossOrigin = 'anonymous';
    el.loop = true;
    el.muted = true;
    el.playsInline = true;
    el.play();
    return el;
  }, [videoUrl]);

  const texture = useMemo(() => {
    const tex = new THREE.VideoTexture(video);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [video]);

  useEffect(() => {
    return () => {
      video.pause();
      video.src = '';
      texture.dispose();
    };
  }, [video, texture]);

  return (
    <mesh position={[0, 0.05, -0.06]}>
      <planeGeometry args={[1.9, 1.4]} />
      <meshStandardMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

/** A floating photo frame along the trail */
function PhotoFrame({
  imageUrl,
  caption,
  position,
  dogZ,
  type = 'image',
}: {
  imageUrl: string;
  caption: string;
  position: [number, number, number];
  dogZ: number;
  type?: 'image' | 'video';
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dist = Math.abs(dogZ - position[2]);
    const isNear = dist < 8;

    // Gentle float
    groupRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001 + position[2]) * 0.1;

    // Glow when near
    const targetScale = isNear ? 1.15 : 1;
    const s = groupRef.current.scale.x;
    const newS = THREE.MathUtils.lerp(s, targetScale, delta * 3);
    groupRef.current.scale.setScalar(newS);

    // Slight rotation toward dog when near
    if (isNear) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        position[0] > 0 ? -0.2 : 0.2,
        delta * 2
      );
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.8, 0.1]} />
        <meshStandardMaterial color={themeConfig.frameColor} />
      </mesh>
      {/* Photo or Video with Suspense fallback */}
      <Suspense fallback={<PhotoPlaceholder />}>
        {type === 'video' ? (
          <VideoMedia videoUrl={imageUrl} />
        ) : (
          <PhotoImage imageUrl={imageUrl} />
        )}
      </Suspense>
      {/* Caption */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="top"
        maxWidth={2}
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {caption}
      </Text>
      {/* Glow ring */}
      <mesh position={[0, 0, 0.05]}>
        <ringGeometry args={[1.15, 1.25, 32]} />
        <meshStandardMaterial
          color="#ff69b4"
          emissive="#ff69b4"
          emissiveIntensity={0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

/** A message sign along the trail */
function MessageSign({
  text,
  position,
  dogZ,
}: {
  text: string;
  position: [number, number, number];
  dogZ: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const dist = Math.abs(dogZ - position[2]);
    const isNear = dist < 8;
    const targetScale = isNear ? 1.1 : 1;
    const s = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, delta * 3));
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Sign post */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
        <meshStandardMaterial color="#5c3b1e" />
      </mesh>
      {/* Sign board */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <boxGeometry args={[2.5, 0.8, 0.08]} />
        <meshStandardMaterial color="#f5e6c8" />
      </mesh>
      {/* Text */}
      <Text
        position={[0, 1.2, -0.05]}
        fontSize={0.18}
        color={themeConfig.signTextColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.2}
        textAlign="center"
      >
        {text}
      </Text>
      {/* Heart decoration on top */}
      <mesh position={[0, 1.75, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ff1493" emissive="#ff1493" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

/** All trail photo frames and message signs */
export default function TrailElements({ dogZ }: { dogZ: number }) {
  return (
    <group>
      {trailPhotos.map((photo) => {
        const x = photo.side === 'left' ? -4 : 4;
        return (
          <PhotoFrame
            key={photo.id}
            imageUrl={photo.imageUrl}
            caption={photo.caption}
            position={[x, 1.8, photo.zPosition]}
            dogZ={dogZ}
            type={photo.type}
          />
        );
      })}
      {trailMessages.map((msg) => {
        const x = msg.side === 'left' ? -3.5 : 3.5;
        return (
          <MessageSign
            key={msg.id}
            text={msg.text}
            position={[x, 0, msg.zPosition]}
            dogZ={dogZ}
          />
        );
      })}
    </group>
  );
}
