import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useWorldObjects } from "../lib/stores/useWorldObjects";
import { useEducation } from "../lib/stores/useEducation";
import { useAudio } from "../lib/stores/useAudio";
import { PREFAB_TYPES } from "../types/education";
import { showNotification } from "./UI/NotificationSystem";
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
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 4, 16]} />
        <meshBasicMaterial color={isValid ? "#00ff00" : "#ff0000"} transparent opacity={0.8} />
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
    setSelectedPrefab,
    objects
  } = useWorldObjects();
  const { student } = useEducation();
  const { playSuccess, playHit } = useAudio();
  const [previewPosition, setPreviewPosition] = useState<[number, number, number] | null>(null);
  const [isValidPosition, setIsValidPosition] = useState(false);

  // Handle grid click for building placement
  const handleGridClick = (position: [number, number, number]) => {
    if (!isPlacementMode || !selectedPrefab) return;

    const prefabType = PREFAB_TYPES.find(p => p.id === selectedPrefab);
    if (!prefabType) return;

    // Check if student can place this object
    const isUnlocked = student.level >= prefabType.requiredLevel;
    
    // Check if position is valid (within bounds and not occupied)
    const maxBounds = 24;
    const inBounds = Math.abs(position[0]) <= maxBounds && Math.abs(position[2]) <= maxBounds;
    
    // Check if position is occupied
    const isOccupied = objects.some(obj => 
      Math.abs(obj.position[0] - position[0]) < 2 && 
      Math.abs(obj.position[2] - position[2]) < 2
    );
    
    if (inBounds && !isOccupied && isUnlocked) {
      // Add object to world
      addObject({
        type: prefabType.type,
        position: position,
        isUnlocked,
        requiredLevel: prefabType.requiredLevel
      });
      
      // Play success sound and show notification
      playSuccess();
      showNotification(`Built ${prefabType.name} successfully!`, 'success');
      
      // Exit placement mode
      setPlacementMode(false);
      setSelectedPrefab(null);
      setPreviewPosition(null);
      
      console.log(`Built ${prefabType.name} at position:`, position);
    } else {
      // Play error sound for invalid placement
      playHit();
      
      if (!inBounds) {
        showNotification('Cannot build outside the world boundaries!', 'error');
      } else if (isOccupied) {
        showNotification('Position is already occupied!', 'error');
      } else if (!isUnlocked) {
        showNotification(`Need level ${prefabType.requiredLevel} to build ${prefabType.name}!`, 'error');
      }
    }
  };

  // Show preview on grid hover
  const handleGridHover = (position: [number, number, number]) => {
    if (!isPlacementMode || !selectedPrefab) return;

    setPreviewPosition(position);
    
    // Check if position is valid
    const maxBounds = 24;
    const inBounds = Math.abs(position[0]) <= maxBounds && Math.abs(position[2]) <= maxBounds;
    
    const isOccupied = objects.some(obj => 
      Math.abs(obj.position[0] - position[0]) < 2 && 
      Math.abs(obj.position[2] - position[2]) < 2
    );
    
    setIsValidPosition(inBounds && !isOccupied);
  };

  if (!isPlacementMode || !selectedPrefab) {
    return null;
  }

  return (
    <>
      {/* Invisible interaction plane */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerMove={(e) => {
          const point = e.point;
          const gridX = Math.round(point.x);
          const gridZ = Math.round(point.z);
          handleGridHover([gridX, 1, gridZ]);
        }}
        onClick={(e) => {
          const point = e.point;
          const gridX = Math.round(point.x);
          const gridZ = Math.round(point.z);
          handleGridClick([gridX, 1, gridZ]);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      {/* Build preview */}
      {previewPosition && (
        <BuildPreview 
          position={previewPosition}
          prefabType={selectedPrefab}
          isValid={isValidPosition}
        />
      )}
    </>
  );
}