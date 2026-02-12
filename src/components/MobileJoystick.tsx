import { useEffect, useRef } from 'react';
import nipplejs from 'nipplejs';
import type { ControlState } from '../hooks/useControls';

interface Props {
  controlsRef: React.RefObject<ControlState>;
}

/**
 * Virtual joystick for mobile devices (bottom-left corner).
 * Writes analog values into the shared controlsRef.
 */
export default function MobileJoystick({ controlsRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const manager = nipplejs.create({
      zone: containerRef.current,
      mode: 'static',
      position: { left: '80px', bottom: '80px' },
      color: 'rgba(255, 105, 180, 0.5)',
      size: 120,
    });

    manager.on('move', (_, data) => {
      if (!controlsRef.current || !data.vector) return;
      // nipplejs gives x/y where x=left/right, y=up/down
      controlsRef.current.joyX = data.vector.x;
      controlsRef.current.joyY = data.vector.y;
    });

    manager.on('end', () => {
      if (!controlsRef.current) return;
      controlsRef.current.joyX = 0;
      controlsRef.current.joyY = 0;
    });

    return () => {
      manager.destroy();
    };
  }, [controlsRef]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '200px',
        height: '200px',
        zIndex: 100,
        touchAction: 'none',
      }}
    />
  );
}
