import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

export function Avatar({ position = [0, 2, 0], onPositionChange }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [, getControls] = useKeyboardControls<Controls>();
  const { customization } = useAvatarCustomization();

  // Load Nina 3D model with error handling
  const gltf = useGLTF('/models/nina_avatar.glb');
  const ninaModel = gltf?.scene;

  // Simple position/rotation state (similar to SimpleAvatar)
  const positionRef = useRef<[number, number, number]>(position);
  const rotationRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const controls = getControls();
    const speed = 10;
    const turnSpeed = 3;

    let [x, y, z] = positionRef.current;
    let rot = rotationRef.current;

    if (controls.leftward) {
      rot += turnSpeed * delta;
    }
    if (controls.rightward) {
      rot -= turnSpeed * delta;
    }

    const movingForward =
      controls.forward || (!controls.backward && (controls.leftward || controls.rightward));

    if (movingForward) {
      x += Math.sin(rot) * speed * delta;
      z += Math.cos(rot) * speed * delta;
    }

    if (controls.backward) {
      x -= Math.sin(rot) * speed * delta;
      z -= Math.cos(rot) * speed * delta;
    }

    positionRef.current = [x, y, z];
    rotationRef.current = rot;

    groupRef.current.position.set(x, y, z);
    groupRef.current.rotation.y = rot;

    if (
      onPositionChange &&
      (controls.forward || controls.backward || controls.leftward || controls.rightward)
    ) {
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
          rotation={[0, -Math.PI / 2, 0]}
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
