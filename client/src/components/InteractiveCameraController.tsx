import { useFrame, useThree } from '@react-three/fiber';
import { useCameraSettings } from '../lib/stores/useCameraSettings';
import { useCampus } from '../lib/stores/useCampus';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useEffect } from 'react';

interface InteractiveCameraControllerProps {
  targetPosition: [number, number, number];
  targetRotation: number;
  moving: boolean;
}

export function InteractiveCameraController({ 
  targetPosition, 
  targetRotation, 
  moving 
}: InteractiveCameraControllerProps) {
  const { camera } = useThree();
  const {
    offsetX,
    offsetY,
    offsetZ,
    pitch,
    yaw,
    followDistance,
    followHeight,
    followSpeed,
    mode,
    fov,
    smoothing,
    lookAtTarget
  } = useCameraSettings();
  const { isInsideBuilding } = useCampus();
  
  const currentPosition = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3());
  const orbitControlsRef = useRef<any>();
  const manualControl = useRef(false);
  const lastMouseTime = useRef(0);
  
  // Handle mouse and touch events for orbit control detection
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 2) { // Right click
        manualControl.current = true;
        lastMouseTime.current = Date.now();
      }
    };

    const handleMouseUp = () => {
      // Resume automatic camera after a short delay
      setTimeout(() => {
        if (Date.now() - lastMouseTime.current > 2000) { // 2 seconds
          manualControl.current = false;
        }
      }, 100);
    };

    // Handle trackpad gestures
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 2) { // Two finger gesture
        manualControl.current = true;
        lastMouseTime.current = Date.now();
      }
    };

    const handleTouchEnd = () => {
      // Resume automatic camera after delay
      setTimeout(() => {
        if (Date.now() - lastMouseTime.current > 3000) { // 3 seconds for touch
          manualControl.current = false;
        }
      }, 100);
    };

    // Handle wheel events (for trackpad scrolling/pinching)
    const handleWheel = (event: WheelEvent) => {
      // Only trigger for zoom operations (vertical scroll or pinch)
      if (event.ctrlKey) { // Pinch gesture
        manualControl.current = true;
        lastMouseTime.current = Date.now();
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('wheel', handleWheel);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useFrame((state, delta) => {
    // Update camera FOV (only for perspective cameras)
    if (camera instanceof THREE.PerspectiveCamera && camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
    
    let targetCameraPosition = new THREE.Vector3();
    let targetLookAtPosition = new THREE.Vector3();
    
    // Calculate positions based on camera mode
    switch (mode) {
      case 'follow':
        // Simple follow camera - use direct offsets
        targetCameraPosition.set(
          targetPosition[0] + offsetX,
          targetPosition[1] + offsetY,
          targetPosition[2] + offsetZ
        );
        targetLookAtPosition.set(targetPosition[0], targetPosition[1] + 2, targetPosition[2]);
        break;
        
      case 'top-down':
        targetCameraPosition.set(
          targetPosition[0] + offsetX,
          targetPosition[1] + Math.max(15, offsetY),
          targetPosition[2] + offsetZ
        );
        targetLookAtPosition.set(...targetPosition);
        break;
        
      case 'first-person':
        targetCameraPosition.set(
          targetPosition[0],
          targetPosition[1] + 1.8,
          targetPosition[2]
        );
        
        // Look in the direction the character is facing
        const firstPersonYaw = targetRotation * Math.PI / 180;
        targetLookAtPosition.set(
          targetPosition[0] + Math.sin(firstPersonYaw),
          targetPosition[1] + 1.8,
          targetPosition[2] + Math.cos(firstPersonYaw)
        );
        break;
        
      case 'free':
        // In free mode, use manual offsets
        targetCameraPosition.set(
          targetPosition[0] + offsetX,
          targetPosition[1] + offsetY,
          targetPosition[2] + offsetZ
        );
        targetLookAtPosition.set(...targetPosition);
        break;
    }
    
    // Only update camera automatically if not in manual control
    if (!manualControl.current) {
      // Update orbit controls target to follow character
      if (orbitControlsRef.current) {
        orbitControlsRef.current.target.copy(targetLookAtPosition);
        orbitControlsRef.current.update();
      }
      
      // Force camera update
      camera.position.copy(targetCameraPosition);
      
      // Update look-at if enabled
      if (lookAtTarget) {
        camera.lookAt(targetLookAtPosition);
      }
    }
    
    // Add slight camera shake when moving (optional)
    if (moving && mode === 'follow') {
      const shakeIntensity = 0.02;
      camera.position.x += (Math.random() - 0.5) * shakeIntensity;
      camera.position.y += (Math.random() - 0.5) * shakeIntensity * 0.5;
    }
  });
  
  return (
    <>
      {/* Orbit controls for right-click camera rotation */}
      <OrbitControls
        ref={orbitControlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.05}
        mouseButtons={{
          LEFT: undefined, // Disable left click rotation
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE, // Enable right click rotation
        }}
        touches={{
          ONE: undefined, // Disable single finger
          TWO: THREE.TOUCH.ROTATE, // Two finger gesture for rotation only
        }}
        target={new THREE.Vector3(...targetPosition)}
        minDistance={isInsideBuilding ? 1.5 : 2}
        maxDistance={isInsideBuilding ? 12 : 50}
        maxPolarAngle={Math.PI / 2.1}
        minPolarAngle={Math.PI / 8}
        rotateSpeed={0.8}
        zoomSpeed={1.2}
        onStart={() => {
          manualControl.current = true;
          lastMouseTime.current = Date.now();
        }}
        onEnd={() => {
          // Resume automatic control after a few seconds of inactivity
          setTimeout(() => {
            if (Date.now() - lastMouseTime.current > 3000) {
              manualControl.current = false;
            }
          }, 100);
        }}
      />
    </>
  );
}