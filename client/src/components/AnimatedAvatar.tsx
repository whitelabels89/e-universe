import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { Box, Sphere, Cylinder } from "@react-three/drei";
import { useAvatarCustomization } from "../lib/stores/useAvatarCustomization";
import { useCampus } from "../lib/stores/useCampus";
import { TerrainPhysics } from "./PhysicsWorld";
import * as THREE from "three";

enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  jump = "jump",
  run = "run"
}

interface AnimatedAvatarProps {
  onMove?: (
    position: [number, number, number],
    rotation: number,
    moving: boolean,
    jumping?: boolean,
    velocity?: number
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
  const isRunning = useRef(false);
  const isJumping = useRef(false);
  const jumpVelocity = useRef(0);
  const jumpCooldown = useRef(0);
  const mobileControls = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false
  });

  const baseMoveSpeed = isInsideBuilding ? 3 : 5;
  const runMultiplier = 1.8;
  const jumpForce = 12;
  
  // Mobile control handlers
  const handleMobileMove = (direction: string, active: boolean) => {
    switch (direction) {
      case 'forward':
        mobileControls.current.forward = active;
        break;
      case 'backward':
        mobileControls.current.backward = active;
        break;
      case 'left':
        mobileControls.current.left = active;
        break;
      case 'right':
        mobileControls.current.right = active;
        break;
    }
  };

  const handleMobileRun = (active: boolean) => {
    mobileControls.current.run = active;
    isRunning.current = active;
  };

  const handleMobileJump = () => {
    if (!isJumping.current && jumpCooldown.current <= 0 && groupRef.current) {
      // Import TerrainPhysics dynamically for mobile too
      import('./PhysicsWorld').then(({ TerrainPhysics }) => {
        if (!groupRef.current) return;
        
        // Get terrain type and adjust jump force for mobile too
        const terrainType = TerrainPhysics.getTerrainType([
          groupRef.current.position.x,
          groupRef.current.position.y,
          groupRef.current.position.z
        ]);
        const jumpMultiplier = TerrainPhysics.getJumpMultiplier(terrainType);
        const adaptiveJumpForce = jumpForce * jumpMultiplier;
        
        jumpVelocity.current = adaptiveJumpForce;
        isJumping.current = true;
        jumpCooldown.current = 1.0;
        
        console.log(`📱 Mobile jump on ${terrainType} with force ${adaptiveJumpForce.toFixed(1)} (${jumpMultiplier}x)`);
      });
    }
  };

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const keys = getKeys();
    const { forward, backward, leftward, rightward } = keys;
    
    // Combine keyboard and mobile controls
    const forwardActive = forward || mobileControls.current.forward;
    const backwardActive = backward || mobileControls.current.backward;
    const leftActive = leftward || mobileControls.current.left;
    const rightActive = rightward || mobileControls.current.right;
    
    // Reset movement state
    isMoving.current = false;
    let moveDirection = new THREE.Vector3(0, 0, 0);
    let rotationChange = 0;
    
    // Pure character-relative movement (tank-style controls)
    if (forwardActive) {
      moveDirection.z += 1; // Always move forward in character's facing direction
      isMoving.current = true;
    }
    if (backwardActive) {
      moveDirection.z -= 1; // Always move backward from character's facing direction
      isMoving.current = true;
    }
    if (leftActive) {
      rotationChange += 2; // Turn left (rotate character)
    }
    if (rightActive) {
      rotationChange -= 2; // Turn right (rotate character)
    }

    // Check for running (Shift key or mobile run button)
    const isRunningActive = keys.run || mobileControls.current.run;
    isRunning.current = isRunningActive;

    // Update jump cooldown
    if (jumpCooldown.current > 0) {
      jumpCooldown.current -= delta;
    }

    // Check for jumping (Space key) with cooldown and adaptive height
    if (keys.jump && !isJumping.current && jumpCooldown.current <= 0 && groupRef.current) {
      // Import TerrainPhysics dynamically to avoid circular import
      import('./PhysicsWorld').then(({ TerrainPhysics }) => {
        if (!groupRef.current) return;
        
        // Get terrain type and adjust jump force
        const terrainType = TerrainPhysics.getTerrainType([
          groupRef.current.position.x,
          groupRef.current.position.y,
          groupRef.current.position.z
        ]);
        const jumpMultiplier = TerrainPhysics.getJumpMultiplier(terrainType);
        const adaptiveJumpForce = jumpForce * jumpMultiplier;
        
        jumpVelocity.current = adaptiveJumpForce;
        isJumping.current = true;
        jumpCooldown.current = 1.0; // 1 second cooldown
        
        // Debug terrain-based jumping
        console.log(`🦘 Jumping on ${terrainType} with force ${adaptiveJumpForce.toFixed(1)} (${jumpMultiplier}x)`);
        
        // Update userData untuk physics system
        groupRef.current.userData.isJumping = true;
        groupRef.current.userData.jumpVelocity = jumpVelocity.current;
      });
    }
    
    // Apply rotation change
    if (rotationChange !== 0) {
      rotation.current += rotationChange * delta * 2; // Rotation speed
    }
    
    // Handle jumping physics with terrain awareness
    if (isJumping.current) {
      jumpVelocity.current -= 25 * delta; // Gravity
      groupRef.current.position.y += jumpVelocity.current * delta;
      
      // Get terrain height at current position
      const terrainHeight = TerrainPhysics.getGroundHeight([
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z
      ]);
      
      // Check if landed on terrain
      if (jumpVelocity.current < 0 && groupRef.current.position.y <= terrainHeight + 1.0) {
        groupRef.current.position.y = terrainHeight + 1.0;
        isJumping.current = false;
        jumpVelocity.current = 0;
        
        // Snap to terrain surface properly
        TerrainPhysics.snapCharacterToGround(groupRef.current);
      }
    } else {
      // Ensure character stays properly positioned on terrain
      const terrainHeight = TerrainPhysics.getGroundHeight([
        groupRef.current.position.x,
        groupRef.current.position.y,
        groupRef.current.position.z
      ]);
      
      // Apply proper ground snapping every frame
      TerrainPhysics.snapCharacterToGround(groupRef.current);
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
      
      // Calculate current move speed (base speed + running multiplier)
      const currentMoveSpeed = baseMoveSpeed * (isRunning.current ? runMultiplier : 1);
      
      // Apply velocity
      velocity.current.copy(rotatedDirection).multiplyScalar(currentMoveSpeed * delta);
      groupRef.current.position.add(velocity.current);
      
      // Update walk cycle (faster when running)
      const cycleSpeed = isRunning.current ? 12 : 8;
      walkCycle.current += delta * cycleSpeed;
    } else {
      walkCycle.current = 0;
    }
    
    // Set rotation
    groupRef.current.rotation.y = rotation.current;
    
    // Animate limbs
    animateLimbs();
    
    // Boundary limits (adjust for indoor vs outdoor)
    const boundary = isInsideBuilding ? 8 : 80;
    groupRef.current.position.x = Math.max(-boundary, Math.min(boundary, groupRef.current.position.x));
    groupRef.current.position.z = Math.max(-boundary, Math.min(boundary, groupRef.current.position.z));
    
    // Notify parent of movement with debug info
    if (onMove) {
      onMove(
        [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
        rotation.current,
        isMoving.current,
        isJumping.current,
        jumpVelocity.current
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
    <group 
      ref={groupRef} 
      position={[0, 1, 0]}
      userData={{ 
        needsGroundSnap: true, 
        isCharacter: true, 
        heightOffset: 0.5,
        isCollidable: true,
        collisionRadius: 0.5,
        isJumping: false,
        jumpVelocity: 0
      }}
    >
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