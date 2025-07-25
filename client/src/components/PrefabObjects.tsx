import { useRef, useState } from "react";
import { useWorldObjects } from "../lib/stores/useWorldObjects";
import { useEducation } from "../lib/stores/useEducation";
import { useGLTF } from "@react-three/drei";
import { PREFAB_TYPES, WorldObject } from "../types/education";
import * as THREE from "three";

interface PrefabObjectProps {
  object: WorldObject;
  onRemove?: (id: string) => void;
}

function PrefabObject({ object, onRemove }: PrefabObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load 3D models with error handling
  const schoolGLTF = useGLTF('/models/school_building.glb');
  const codingLabGLTF = useGLTF('/models/coding_lab.glb');
  const houseGLTF = useGLTF('/models/house.glb');
  
  const schoolModel = schoolGLTF?.scene;
  const codingLabModel = codingLabGLTF?.scene;
  const houseModel = houseGLTF?.scene;
  
  const prefabType = PREFAB_TYPES.find(p => p.type === object.type);
  if (!prefabType) return null;
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove(object.id);
    }
  };
  
  const scale = hovered ? 1.05 : 1;
  const opacity = object.isUnlocked ? 1 : 0.6;
  
  // Select appropriate 3D model
  let model3D;
  switch (object.type) {
    case 'school':
      model3D = schoolModel;
      break;
    case 'coding-lab':
      model3D = codingLabModel;
      break;
    case 'house':
      model3D = houseModel;
      break;
    default:
      return null;
  }

  return (
    <group 
      ref={groupRef}
      position={[object.position[0], 0, object.position[2]]}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* 3D Building Model */}
      {model3D ? (
        <primitive 
          object={model3D.clone()} 
          scale={[10, 10, 10]} 
          position={[0, 5, 0]}
          castShadow
          receiveShadow
        />
      ) : (
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[8, 12, 8]} />
          <meshStandardMaterial color={prefabType.color} />
        </mesh>
      )}
      
      {/* Lock indicator for locked objects */}
      {!object.isUnlocked && (
        <mesh position={[0, 8, 0]}>
          <sphereGeometry args={[0.8]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}
      
      {/* Building type label */}
      <mesh position={[0, 12, 0]}>
        <planeGeometry args={[8, 1.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export function PrefabObjects() {
  const { objects, removeObject } = useWorldObjects();
  const { student } = useEducation();

  const handleRemoveObject = (id: string) => {
    removeObject(id);
    console.log(`Removed object with ID: ${id}`);
  };

  if (objects.length === 0) {
    return null;
  }

  return (
    <group>
      {objects.map((object) => (
        <PrefabObject
          key={object.id}
          object={object}
          onRemove={handleRemoveObject}
        />
      ))}
    </group>
  );
}

// Preload all building models for better performance
useGLTF.preload('/models/school_building.glb');
useGLTF.preload('/models/coding_lab.glb');
useGLTF.preload('/models/house.glb');