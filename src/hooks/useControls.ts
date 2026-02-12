import { useEffect, useRef, useCallback } from 'react';

export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  /** Joystick analog values (-1 to 1) */
  joyX: number;
  joyY: number;
}

/**
 * Keyboard controls hook.
 * Returns a ref to the current control state (mutated in place for perf).
 */
export function useKeyboardControls() {
  const controls = useRef<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    joyX: 0,
    joyY: 0,
  });

  const handleKey = useCallback((e: KeyboardEvent, pressed: boolean) => {
    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        controls.current.forward = pressed;
        break;
      case 's':
      case 'arrowdown':
        controls.current.backward = pressed;
        break;
      case 'a':
      case 'arrowleft':
        controls.current.left = pressed;
        break;
      case 'd':
      case 'arrowright':
        controls.current.right = pressed;
        break;
    }
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => handleKey(e, true);
    const onUp = (e: KeyboardEvent) => handleKey(e, false);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [handleKey]);

  return controls;
}
