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
  
  // Fixed movement system based on working SimpleAvatar
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    const controls = getControls();
    const speed = 10;
    const turnSpeed = 3;
    
    // Get current position
    let x = groupRef.current.position.x;
    let y = 2;
    let z = groupRef.current.position.z;
    let rot = groupRef.current.rotation.y;
    
    // Rotation
    if (controls.leftward) {
      rot += turnSpeed * delta;
    }
    if (controls.rightward) {
      rot -= turnSpeed * delta;
    }
    
    // Movement
    if (controls.forward) {
      x += Math.sin(rot) * speed * delta;
      z += Math.cos(rot) * speed * delta;
    }
    if (controls.backward) {
      x -= Math.sin(rot) * speed * delta;
      z -= Math.cos(rot) * speed * delta;
    }
    
    // Apply position directly
    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y = rot;
    currentPosition.current.set(x, y, z);
    rotation.current = rot;
    
    // Debug logging after movement
    if (controls.forward || controls.backward || controls.leftward || controls.rightward) {
      console.log("Avatar position after:", [x, y, z], "applied to mesh");
    }
    
    // Notify parent
    if (onPositionChange && (controls.forward || controls.backward || controls.leftward || controls.rightward)) {
      onPositionChange([x, y, z]);
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
