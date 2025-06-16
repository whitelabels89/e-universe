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

  return (
    <group ref={meshRef} position={[position[0], position[1], position[2]]}>
      {/* Simple box preview */}
      <mesh>
        <boxGeometry args={[6, 8, 6]} />
        <meshStandardMaterial 
          color={prefab.color}
          transparent 
          opacity={opacity}
          wireframe={!isValid}
        />
      </mesh>
      
      {/* Build indicator */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4, 5, 16]} />
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
    setSelectedPrefab 
  } = useWorldObjects();
  
  const { student } = useEducation();
  const { playSuccess } = useAudio();
  
  const [hoverPosition, setHoverPosition] = useState<[number, number, number] | null>(null);
  const [isValidPlacement, setIsValidPlacement] = useState(true);

  const handleGridClick = (position: [number, number, number]) => {
    if (!selectedPrefab || !isPlacementMode) return;
    
    const prefab = PREFAB_TYPES.find(p => p.id === selectedPrefab);
    if (!prefab) return;

    // Check if player level is sufficient
    if (student.level < prefab.requiredLevel) {
      showNotification(`Level ${prefab.requiredLevel} required for ${prefab.name}`, 'error');
      return;
    }

    // Check if position is valid (not too close to other objects)
    const isValid = checkPlacementValidity(position);
    
    if (!isValid) {
      showNotification('Cannot place here - too close to other objects', 'error');
      return;
    }

    // Add the object
    addObject({
      type: prefab.type,
      position,
      isUnlocked: true,
      requiredLevel: prefab.requiredLevel
    });

    playSuccess();
    showNotification(`${prefab.name} placed successfully!`, 'success');
    
    // Exit placement mode
    setPlacementMode(false);
    setSelectedPrefab(null);
  };

  const handleGridHover = (position: [number, number, number]) => {
    if (!selectedPrefab || !isPlacementMode) return;
    
    setHoverPosition(position);
    setIsValidPlacement(checkPlacementValidity(position));
  };

  const checkPlacementValidity = (position: [number, number, number]) => {
    // Simple validity check - ensure not too close to world edges
    const [x, , z] = position;
    return Math.abs(x) < 20 && Math.abs(z) < 20;
  };

  if (!isPlacementMode || !selectedPrefab) return null;

  return (
    <>
      {/* Invisible plane for click detection */}
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={(e) => {
          const point = e.point;
          const gridX = Math.round(point.x);
          const gridZ = Math.round(point.z);
          handleGridHover([gridX, 2, gridZ]);
        }}
        onClick={(e) => {
          const point = e.point;
          const gridX = Math.round(point.x);
          const gridZ = Math.round(point.z);
          handleGridClick([gridX, 2, gridZ]);
        }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Build preview */}
      {hoverPosition && (
        <BuildPreview 
          position={hoverPosition} 
          prefabType={selectedPrefab}
          isValid={isValidPlacement}
        />
      )}
    </>
  );
}