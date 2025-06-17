import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Box, Sphere, Cylinder } from "@react-three/drei";
import { useAvatarCustomization } from "../lib/stores/useAvatarCustomization";
import { useCampus } from "../lib/stores/useCampus";
import * as THREE from "three";

enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
}

interface AnimatedAvatarProps {
  onMove?: (
    position: [number, number, number],
    rotation: number,
    moving: boolean,
  ) => void;
}

export function AnimatedAvatar({ onMove }: AnimatedAvatarProps) {
  const { customization } = useAvatarCustomization();
  const { isInsideBuilding } = useCampus();
  const groupRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const hairRef = useRef<THREE.Mesh>(null);
  
  const [subscribe, getKeys] = useKeyboardControls<Controls>();
  const { camera } = useThree();
  
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const rotation = useRef(0);
  const walkCycle = useRef(0);
  const isMoving = useRef(false);

  const moveSpeed = isInsideBuilding ? 3 : 5;
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const { forward, backward, leftward, rightward } = getKeys();
    
    // Reset movement state
    isMoving.current = false;
    let moveDirection = new THREE.Vector3(0, 0, 0);
    let rotationChange = 0;
    
    // Pure character-relative movement (tank-style controls)
    if (forward) {
      moveDirection.z += 1; // Always move forward in character's facing direction
      isMoving.current = true;
    }
    if (backward) {
      moveDirection.z -= 1; // Always move backward from character's facing direction
      isMoving.current = true;
    }
    if (leftward) {
      rotationChange += 2; // Turn left (rotate character)
    }
    if (rightward) {
      rotationChange -= 2; // Turn right (rotate character)
    }
    
    // Apply rotation change
    if (rotationChange !== 0) {
      rotation.current += rotationChange * delta * 2; // Rotation speed
    }
    
    // Apply movement relative to character's current rotation
    if (isMoving.current && moveDirection.length() > 0) {
      // Normalize movement direction
      moveDirection.normalize();
      
      // Transform movement direction by character's rotation
      const rotatedDirection = moveDirection.clone().applyAxisAngle(
        new THREE.Vector3(0, 1, 0), 
        rotation.current
      );
      
      // Apply velocity
      velocity.current.copy(rotatedDirection).multiplyScalar(moveSpeed * delta);
      groupRef.current.position.add(velocity.current);
      
      // Update walk cycle
      walkCycle.current += delta * 8;
    } else {
      walkCycle.current = 0;
    }
    
    // Set rotation
    groupRef.current.rotation.y = rotation.current;
    
    // Animate limbs
    animateLimbs();
    
    // Boundary limits (adjust for indoor vs outdoor)
    const boundary = isInsideBuilding ? 8 : 50;
    groupRef.current.position.x = Math.max(-boundary, Math.min(boundary, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(-boundary, Math.min(boundary, groupRef.current.position.z));
    
    // Notify parent of movement
    if (onMove) {
      onMove(
        [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
        rotation.current,
        isMoving.current
      );
    }
  });

  const animateLimbs = () => {
    if (!isMoving.current) {
      // Idle animations
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = Math.sin(walkCycle.current * 0.5) * 0.1;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.sin(walkCycle.current * 0.5) * 0.1;
      if (hairRef.current) hairRef.current.rotation.z = Math.sin(walkCycle.current * 0.3) * 0.05;
    } else {
      // Walking animations
      const legSwing = Math.sin(walkCycle.current) * 0.5;
      const armSwing = Math.sin(walkCycle.current) * 0.3;
      const hairBounce = Math.sin(walkCycle.current * 2) * 0.1;
      
      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;
      if (hairRef.current) {
        hairRef.current.rotation.z = hairBounce * 0.3;
        hairRef.current.position.y = 0.1 + Math.abs(Math.sin(walkCycle.current * 2)) * 0.05;
      }
    }
  };

  useEffect(() => {
    console.log("Tank-style controls active:", { 
      forward: "W/↑ - Move forward", 
      backward: "S/↓ - Move backward", 
      left: "A/← - Turn left", 
      right: "D/→ - Turn right" 
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* Body */}
      <Box args={[0.8, 1.2, 0.4]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color={customization.clothingColor} />
      </Box>

      {/* Head */}
      <Sphere args={[0.3]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color={customization.headColor} />
      </Sphere>

      {/* Hair */}
      <group position={[0, 1.7, 0]}>
        <Sphere ref={hairRef} args={[0.35, 8, 6]} position={[0, 0.1, 0]}>
          <meshStandardMaterial color={customization.hairColor} />
        </Sphere>
      </group>

      {/* Eyes */}
      <Sphere args={[0.05]} position={[-0.1, 1.55, 0.25]}>
        <meshStandardMaterial color={customization.eyeColor} />
      </Sphere>
      <Sphere args={[0.05]} position={[0.1, 1.55, 0.25]}>
        <meshStandardMaterial color={customization.eyeColor} />
      </Sphere>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.5, 0.8, 0]}>
        <Cylinder args={[0.1, 0.1, 0.6]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={customization.bodyColor} />
        </Cylinder>
        {/* Hand */}
        <Sphere args={[0.12]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color={customization.bodyColor} />
        </Sphere>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.5, 0.8, 0]}>
        <Cylinder args={[0.1, 0.1, 0.6]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={customization.bodyColor} />
        </Cylinder>
        {/* Hand */}
        <Sphere args={[0.12]} position={[0, -0.6, 0]}>
          <meshStandardMaterial color={customization.bodyColor} />
        </Sphere>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.2, 0, 0]}>
        <Cylinder args={[0.12, 0.12, 0.8]} position={[0, -0.4, 0]}>
          <meshStandardMaterial color={customization.bodyColor} />
        </Cylinder>
        {/* Foot */}
        <Box args={[0.15, 0.1, 0.25]} position={[0, -0.85, 0.05]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.2, 0, 0]}>
        <Cylinder args={[0.12, 0.12, 0.8]} position={[0, -0.4, 0]}>
          <meshStandardMaterial color={customization.bodyColor} />
        </Cylinder>
        {/* Foot */}
        <Box args={[0.15, 0.1, 0.25]} position={[0, -0.85, 0.05]}>
          <meshStandardMaterial color="#333333" />
        </Box>
      </group>
    </group>
  );
}