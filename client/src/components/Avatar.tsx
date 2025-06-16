import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { useAvatarCustomization } from "../lib/stores/useAvatarCustomization";
import * as THREE from "three";

// Define movement controls
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward'
}

interface AvatarProps {
  position?: [number, number, number];
  onPositionChange?: (position: [number, number, number]) => void;
}

export function Avatar({ position = [0, 0.5, 0], onPositionChange }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [subscribe, getControls] = useKeyboardControls<Controls>();
  const { camera } = useThree();
  const { customization } = useAvatarCustomization();
  
  // Load Nina 3D model with error handling
  const gltf = useGLTF('/models/nina_avatar.glb');
  const ninaModel = gltf?.scene;
  
  // Avatar movement state
  const velocity = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3(...position));
  const rotation = useRef(0);
  const cameraOffset = useRef(new THREE.Vector3(0, 8, 10));
  const cameraTarget = useRef(new THREE.Vector3());
  
  // Initialize position
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...position);
      currentPosition.current.set(...position);
    }
  }, [position]);
  
  // Movement system with bounds checking (10x10 grid)
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const controls = getControls();
    const moveSpeed = 5;
    const maxBounds = 24.5; // Keep within -24.5 to 24.5 for 50x50 grid
    
    // Reset velocity
    velocity.current.set(0, 0, 0);
    
    // Apply movement based on controls with rotation
    let moved = false;
    
    if (controls.forward) {
      velocity.current.x -= Math.sin(rotation.current) * moveSpeed * delta;
      velocity.current.z -= Math.cos(rotation.current) * moveSpeed * delta;
      moved = true;
    }
    if (controls.backward) {
      velocity.current.x += Math.sin(rotation.current) * moveSpeed * delta;
      velocity.current.z += Math.cos(rotation.current) * moveSpeed * delta;
      moved = true;
    }
    if (controls.leftward) {
      rotation.current += 2 * delta;
      moved = true;
    }
    if (controls.rightward) {
      rotation.current -= 2 * delta;
      moved = true;
    }
    
    // Apply velocity with bounds checking
    const newPosition = currentPosition.current.clone().add(velocity.current);
    
    // Clamp position to grid bounds
    newPosition.x = Math.max(-maxBounds, Math.min(maxBounds, newPosition.x));
    newPosition.z = Math.max(-maxBounds, Math.min(maxBounds, newPosition.z));
    newPosition.y = 1.0; // Keep avatar above ground
    
    // Update position and rotation
    currentPosition.current.copy(newPosition);
    groupRef.current.position.copy(newPosition);
    groupRef.current.rotation.y = rotation.current;
    
    // Calculate camera position relative to character's rotation (3rd person camera)
    const cameraDistance = cameraOffset.current.length();
    const rotatedOffset = cameraOffset.current.clone()
      .applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
    
    const idealCameraPosition = newPosition.clone().add(rotatedOffset);
    
    // Update camera target to be slightly ahead of the character
    cameraTarget.current.copy(newPosition);
    cameraTarget.current.y += 2; // Look slightly above character
    
    // 3rd Person Camera System
    const currentDistance = camera.position.distanceTo(newPosition);
    
    // Only update camera if character is moving to avoid interference with manual control
    if (moved) {
      // Update camera offset length based on current zoom level
      const targetDistance = Math.max(5, Math.min(currentDistance, 30));
      cameraOffset.current.setLength(targetDistance);
      
      // Calculate camera position behind character
      const cameraDirection = new THREE.Vector3(0, 0, 1); // Behind character
      cameraDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
      cameraDirection.multiplyScalar(targetDistance);
      cameraDirection.y = targetDistance * 0.6; // Elevated view
      
      const targetCameraPosition = newPosition.clone().add(cameraDirection);
      
      // Smooth camera movement only when character moves
      camera.position.lerp(targetCameraPosition, 2 * delta);
      
      // Look at character with slight forward offset
      const lookTarget = newPosition.clone();
      lookTarget.y += 1.5;
      const forwardOffset = new THREE.Vector3(0, 0, -2);
      forwardOffset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation.current);
      lookTarget.add(forwardOffset);
      
      camera.lookAt(lookTarget);
    }
    
    // Notify parent component of position changes
    if (onPositionChange) {
      onPositionChange([newPosition.x, newPosition.y, newPosition.z]);
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* 3D Nina Model with fallback */}
      {ninaModel ? (
        <primitive 
          object={ninaModel.clone()} 
          scale={[2.5, 2.5, 2.5]} 
          position={[0, -0.9, 0]}
          castShadow
        />
      ) : (
        // Fallback simple character while model loads
        <>
          <mesh castShadow>
            <boxGeometry args={[0.6, 1.8, 0.3]} />
            <meshLambertMaterial color={customization.bodyColor} />
          </mesh>
          <mesh position={[0, 1.25, 0]} castShadow>
            <sphereGeometry args={[0.3]} />
            <meshLambertMaterial color={customization.headColor} />
          </mesh>
        </>
      )}
      
      {/* Avatar name label */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// Preload the Nina model for better performance
useGLTF.preload('/models/nina_avatar.glb');
