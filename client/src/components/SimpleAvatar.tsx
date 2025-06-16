import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward'
}

interface SimpleAvatarProps {
  onPositionChange?: (position: [number, number, number]) => void;
}

export function SimpleAvatar({ onPositionChange }: SimpleAvatarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [, getControls] = useKeyboardControls<Controls>();
  
  // Simple position state
  const position = useRef([0, 2, 0]);
  const rotation = useRef(0);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const controls = getControls();
    const speed = 10;
    const turnSpeed = 3;
    
    let [x, y, z] = position.current;
    let rot = rotation.current;
    
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
    
    // Update refs
    position.current = [x, y, z];
    rotation.current = rot;
    
    // Apply to mesh
    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.y = rot;
    
    // Notify parent
    if (onPositionChange && (controls.forward || controls.backward || controls.leftward || controls.rightward)) {
      onPositionChange([x, y, z]);
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 2, 0]} castShadow>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshLambertMaterial color="#4CAF50" />
    </mesh>
  );
}