import { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useWorldObjects } from "../lib/stores/useWorldObjects";
import { useEducation } from "../lib/stores/useEducation";
import { PREFAB_TYPES } from "../types/education";
import * as THREE from "three";

interface BuildPreviewProps {
  position: [number, number, number];
  prefabType: string;
  isValid: boolean;
}

function BuildPreview({ position, prefabType, isValid }: BuildPreviewProps) {
  const meshRef = useRef<THREE.Group>(null);
  const prefab = PREFAB_TYPES.find(p => p.id === prefabType);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  if (!prefab) return null;

  const opacity = isValid ? 0.7 : 0.3;
  const color = isValid ? prefab.color : "#ff4444";

  return (
    <group ref={meshRef} position={[position[0], position[1], position[2]]}>
      {/* Preview building based on type */}
      {prefab.type === 'school' && (
        <mesh>
          <boxGeometry args={[15, 8, 12]} />
          <meshLambertMaterial color={color} transparent opacity={opacity} wireframe />
        </mesh>
      )}
      
      {prefab.type === 'coding-lab' && (
        <mesh>
          <boxGeometry args={[12, 6, 10]} />
          <meshLambertMaterial color={color} transparent opacity={opacity} wireframe />
        </mesh>
      )}
      
      {prefab.type === 'house' && (
        <>
          <mesh>
            <boxGeometry args={[8, 5, 8]} />
            <meshLambertMaterial color={color} transparent opacity={opacity} wireframe />
          </mesh>
          <mesh position={[0, 6, 0]}>
            <coneGeometry args={[6, 3, 4]} />
            <meshLambertMaterial color="#8D6E63" transparent opacity={opacity} wireframe />
          </mesh>
        </>
      )}
      
      {/* Build indicator */}
      <mesh position={[0, -2, 0]}>
        <ringGeometry args={[3, 4, 16]} />
        <meshBasicMaterial color={isValid ? "#00ff00" : "#ff0000"} transparent opacity={0.8} />
      </mesh>
      
      {/* Floating text */}
      <mesh position={[0, 12, 0]}>
        <planeGeometry args={[6, 1]} />
        <meshBasicMaterial 
          color="white" 
          transparent 
          opacity={0.9}
        />
      </mesh>
    </group>
  );
}

export function BuildSystem() {
  const { 
    selectedPrefab, 
    isPlacementMode, 
    addObject, 
    setPlacementMode, 
    setSelectedPrefab 
  } = useWorldObjects();
  const { student } = useEducation();
  const { camera, scene, raycaster, mouse } = useThree();
  const [previewPosition, setPreviewPosition] = useState<[number, number, number] | null>(null);
  const [isValidPosition, setIsValidPosition] = useState(false);

  // Handle mouse movement for build preview
  const handlePointerMove = (event: any) => {
    if (!isPlacementMode || !selectedPrefab) return;

    const rect = event.target.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // Raycast against an invisible ground plane
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, intersection);

    if (intersection) {
      const gridX = Math.round(intersection.x);
      const gridZ = Math.round(intersection.z);
      const position: [number, number, number] = [gridX, 1, gridZ];
      
      setPreviewPosition(position);
      
      // Check if position is valid (within bounds and not occupied)
      const maxBounds = 24;
      const inBounds = Math.abs(gridX) <= maxBounds && Math.abs(gridZ) <= maxBounds;
      
      // TODO: Check if position is not occupied by other objects
      setIsValidPosition(inBounds);
    }
  };

  // Handle click to place building
  const handleClick = (event: any) => {
    if (!isPlacementMode || !selectedPrefab || !previewPosition || !isValidPosition) return;

    event.stopPropagation();
    
    const prefabType = PREFAB_TYPES.find(p => p.id === selectedPrefab);
    if (!prefabType) return;

    // Check if student can place this object
    const isUnlocked = student.level >= prefabType.requiredLevel;
    
    // Add object to world
    addObject({
      type: prefabType.type,
      position: previewPosition,
      isUnlocked,
      requiredLevel: prefabType.requiredLevel
    });
    
    // Exit placement mode
    setPlacementMode(false);
    setSelectedPrefab(null);
    setPreviewPosition(null);
    
    console.log(`Built ${prefabType.name} at position:`, previewPosition);
  };

  if (!isPlacementMode || !selectedPrefab || !previewPosition) {
    return null;
  }

  return (
    <>
      {/* Invisible plane for mouse interaction */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Build preview */}
      <BuildPreview 
        position={previewPosition}
        prefabType={selectedPrefab}
        isValid={isValidPosition}
      />
    </>
  );
}