import { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import Environment from './Environment';
import PlayerController from './PlayerController';
import TrailElements from './TrailElements';
import ProposalScene from './ProposalScene';
import ProposalUI from './ProposalUI';
import MobileJoystick from './MobileJoystick';
import LoadingScreen from './LoadingScreen';
import { useKeyboardControls } from '../hooks/useControls';
import { themeConfig } from '../config/trailConfig';
import type { DogMood } from './Dog';

/** Detects touch device */
function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export default function Scene() {
  const controlsRef = useKeyboardControls();
  const [dogZ, setDogZ] = useState(2);
  const [showProposal, setShowProposal] = useState(false);
  const [dogMood, setDogMood] = useState<DogMood>('idle');
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const isMobile = useRef(isTouchDevice());

  // Simulate loading progress
  const handleCreated = useCallback(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => setLoaded(true), 500);
      }
      setLoadProgress(progress);
    }, 300);
  }, []);

  const handlePositionChange = useCallback((z: number) => {
    setDogZ(z);
  }, []);

  const handleReachEnd = useCallback(() => {
    setShowProposal(true);
  }, []);

  const handleDogMoodChange = useCallback((mood: DogMood) => {
    setDogMood(mood);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Loading screen */}
      <AnimatePresence>
        {!loaded && <LoadingScreen progress={loadProgress} />}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 4, 10], fov: 60, near: 0.1, far: 300 }}
        onCreated={handleCreated}
        style={{ background: '#1a0a2e' }}
      >
        {/* Fog for depth */}
        <fog attach="fog" args={[themeConfig.fogColor, 30, 100]} />

        {/* Lighting: golden hour */}
        <ambientLight intensity={0.4} color="#fdb99b" />
        <directionalLight
          position={[10, 15, 5]}
          intensity={1.2}
          color="#ffd89b"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        <directionalLight position={[-5, 8, -10]} intensity={0.3} color="#ff9b7a" />
        {/* Hemisphere light for nicer ambient */}
        <hemisphereLight args={['#fdb99b', '#4a7c59', 0.4]} />

        {/* Sky */}
        <Sky
          distance={450000}
          sunPosition={[100, 20, -100]}
          inclination={0.52}
          azimuth={0.25}
          rayleigh={0.5}
        />

        <Suspense fallback={null}>
          <Environment />
          <TrailElements dogZ={dogZ} />
          <ProposalScene />
          <PlayerController
            controlsRef={controlsRef}
            onPositionChange={handlePositionChange}
            onReachEnd={handleReachEnd}
            dogMood={dogMood}
          />
        </Suspense>
      </Canvas>

      {/* Proposal overlay */}
      <ProposalUI visible={showProposal} onDogMoodChange={handleDogMoodChange} />

      {/* Mobile joystick */}
      {isMobile.current && <MobileJoystick controlsRef={controlsRef} />}

      {/* HUD: instructions */}
      {loaded && !showProposal && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.8rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'right',
            pointerEvents: 'none',
          }}
        >
          {isMobile.current ? 'Use the joystick to walk' : 'WASD / Arrow keys to walk'}
          <br />
          Walk down the trail 🐾
        </div>
      )}

      {/* Directional hint arrow */}
      {loaded && !showProposal && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.5rem',
            pointerEvents: 'none',
            animation: 'float 2s ease-in-out infinite',
          }}
        >
          ⬇️ Walk forward ⬇️
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
