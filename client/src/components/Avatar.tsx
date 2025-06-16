import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
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
  
  // Avatar movement state
  const velocity = useRef(new THREE.Vector3());
  const currentPosition = useRef(new THREE.Vector3(...position));
  
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
    
    // Apply movement based on controls
    if (controls.forward) {
      velocity.current.z -= moveSpeed * delta;
      console.log("Moving forward");
    }
    if (controls.backward) {
      velocity.current.z += moveSpeed * delta;
      console.log("Moving backward");
    }
    if (controls.leftward) {
      velocity.current.x -= moveSpeed * delta;
      console.log("Moving left");
    }
    if (controls.rightward) {
      velocity.current.x += moveSpeed * delta;
      console.log("Moving right");
    }
    
    // Apply velocity with bounds checking
    const newPosition = currentPosition.current.clone().add(velocity.current);
    
    // Clamp position to grid bounds
    newPosition.x = Math.max(-maxBounds, Math.min(maxBounds, newPosition.x));
    newPosition.z = Math.max(-maxBounds, Math.min(maxBounds, newPosition.z));
    newPosition.y = 1.0; // Keep avatar above ground
    
    // Update position
    currentPosition.current.copy(newPosition);
    groupRef.current.position.copy(newPosition);
    
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
      {/* Avatar Body - A simple character representation */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 1.8, 0.3]} />
        <meshLambertMaterial color={customization.bodyColor} />
      </mesh>
      
      {/* Avatar Head */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.3]} />
        <meshLambertMaterial color={customization.headColor} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <sphereGeometry args={[0.33]} />
        <meshLambertMaterial color={customization.hairColor} />
      </mesh>
      
      {/* Simple face features - Eyes */}
      <mesh position={[0.1, 1.3, 0.25]} castShadow>
        <sphereGeometry args={[0.04]} />
        <meshLambertMaterial color={customization.eyeColor} />
      </mesh>
      <mesh position={[-0.1, 1.3, 0.25]} castShadow>
        <sphereGeometry args={[0.04]} />
        <meshLambertMaterial color={customization.eyeColor} />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, 1.15, 0.25]} castShadow>
        <sphereGeometry args={[0.03]} />
        <meshLambertMaterial color="#FF6B6B" />
      </mesh>
      
      {/* Avatar Legs */}
      <mesh position={[0.15, -0.8, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshLambertMaterial color={customization.clothingColor} />
      </mesh>
      <mesh position={[-0.15, -0.8, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshLambertMaterial color={customization.clothingColor} />
      </mesh>
      
      {/* Avatar Arms */}
      <mesh position={[0.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshLambertMaterial color={customization.bodyColor} />
      </mesh>
      <mesh position={[-0.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.6, 0.15]} />
        <meshLambertMaterial color={customization.bodyColor} />
      </mesh>
      
      {/* Avatar name label */}
      <mesh position={[0, 2, 0]}>
        <planeGeometry args={[1, 0.3]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
