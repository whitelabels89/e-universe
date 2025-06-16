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
  
  // Load Nina 3D model
  const { scene: ninaModel } = useGLTF('/models/nina_avatar.glb');
  
  // Avatar movement state
  const velocity = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3(...position));
  const rotation = useRef(0);
  
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
      velocity.current.x += Math.sin(rotation.current) * moveSpeed * delta;
      velocity.current.z += Math.cos(rotation.current) * moveSpeed * delta;
      moved = true;
    }
    if (controls.backward) {
      velocity.current.x -= Math.sin(rotation.current) * moveSpeed * delta;
      velocity.current.z -= Math.cos(rotation.current) * moveSpeed * delta;
      moved = true;
    }
    if (controls.leftward) {
      rotation.current -= 2 * delta;
      moved = true;
    }
    if (controls.rightward) {
      rotation.current += 2 * delta;
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
    groupRef.current.rotation.y = -rotation.current;
    
    // Update camera to follow avatar (offset behind and above)
    const idealCameraPosition = new THREE.Vector3(
      newPosition.x,
      newPosition.y + 3,
      newPosition.z + 5
    );
    
    camera.position.lerp(idealCameraPosition, 2 * delta);
    camera.lookAt(newPosition);
    
    // Notify parent component of position changes
    if (onPositionChange) {
      onPositionChange([newPosition.x, newPosition.y, newPosition.z]);
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* 3D Nina Model */}
      <primitive 
        object={ninaModel.clone()} 
        scale={[2.5, 2.5, 2.5]} 
        position={[0, -0.9, 0]}
        castShadow
      />
      
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
