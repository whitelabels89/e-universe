import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { useAvatarCustomization } from "../lib/stores/useAvatarCustomization";
import * as THREE from "three";

// Define movement controls
enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
}

interface AvatarProps {
  position?: [number, number, number];
  onPositionChange?: (position: [number, number, number]) => void;
  onMove?: (position: [number, number, number], rotation: number) => void;
}

export function Avatar({
  position = [0, 2, 0],
  onPositionChange,
  onMove,
}: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [, getControls] = useKeyboardControls<Controls>();
  const { customization } = useAvatarCustomization();

  // Apply rotation offset for the imported model so its forward direction
  // matches the movement logic. The Nina model faces +Z already, so no
  // adjustment is required.
  const MODEL_ROT_OFFSET = 0;

  // Load Nina 3D model with error handling
  const gltf = useGLTF("/models/nina_avatar.glb");
  const ninaModel = gltf?.scene;

  // Simple position/rotation state (similar to SimpleAvatar)
  const positionRef = useRef<[number, number, number]>(position);
  // Current rotation in radians, 0 means avatar faces world +Z
  const rotationRef = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const controls = getControls();
    const speed = 10;

    let [x, y, z] = positionRef.current;
    let rot = rotationRef.current;

    // Determine intended direction based on pressed keys
    let dirX = 0;
    let dirZ = 0;
    if (controls.forward) dirZ += 1;
    if (controls.backward) dirZ -= 1;
    if (controls.leftward) dirX -= 1;
    if (controls.rightward) dirX += 1;

    // If any movement key pressed, face that direction instantly
    let bounce = 0;
    if (dirX !== 0 || dirZ !== 0) {
      const targetRot = Math.atan2(dirX, dirZ);
      rot = targetRot;
      x += Math.sin(rot) * speed * delta;
      z += Math.cos(rot) * speed * delta;
      // simple walking bounce effect
      bounce = Math.sin(state.clock.elapsedTime * 8) * 0.1;
    }

    positionRef.current = [x, y, z];
    rotationRef.current = rot;

    groupRef.current.position.set(x, y + bounce, z);
    groupRef.current.rotation.y = rot + MODEL_ROT_OFFSET;

    if (
      onPositionChange &&
      (controls.forward ||
        controls.backward ||
        controls.leftward ||
        controls.rightward)
    ) {
      onPositionChange([x, y, z]);
    }

    if (
      onMove &&
      (controls.forward ||
        controls.backward ||
        controls.leftward ||
        controls.rightward)
    ) {
      onMove([x, y, z], rot);
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
useGLTF.preload("/models/nina_avatar.glb");
