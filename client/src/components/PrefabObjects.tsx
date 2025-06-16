import { useRef, useState } from "react";
import { useWorldObjects } from "../lib/stores/useWorldObjects";
import { useEducation } from "../lib/stores/useEducation";
import { PREFAB_TYPES, WorldObject } from "../types/education";
import * as THREE from "three";

interface PrefabObjectProps {
  object: WorldObject;
  onRemove?: (id: string) => void;
}

function PrefabObject({ object, onRemove }: PrefabObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const prefabType = PREFAB_TYPES.find(p => p.type === object.type);
  if (!prefabType) return null;
  
  const handleClick = (event: THREE.Event) => {
    event.stopPropagation();
    if (onRemove) {
      onRemove(object.id);
    }
  };
  
  const scale = hovered ? 1.1 : 1;
  const opacity = object.isUnlocked ? 1 : 0.5;
  
  return (
    <group position={object.position}>
      {/* Main building structure */}
      <mesh 
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={[scale, scale, scale]}
      >
        {object.type === 'school' && (
          <>
            <boxGeometry args={[1.5, 1, 1.5]} />
            <meshLambertMaterial color={prefabType.color} transparent opacity={opacity} />
          </>
        )}
        
        {object.type === 'coding-lab' && (
          <>
            <boxGeometry args={[1.2, 1.5, 1.2]} />
            <meshLambertMaterial color={prefabType.color} transparent opacity={opacity} />
          </>
        )}
        
        {object.type === 'house' && (
          <>
            <boxGeometry args={[1, 0.8, 1]} />
            <meshLambertMaterial color={prefabType.color} transparent opacity={opacity} />
          </>
        )}
      </mesh>
      
      {/* Roof for house */}
      {object.type === 'house' && (
        <mesh position={[0, 0.9, 0]} castShadow scale={[scale, scale, scale]}>
          <coneGeometry args={[0.8, 0.6, 4]} />
          <meshLambertMaterial color="#8D6E63" transparent opacity={opacity} />
        </mesh>
      )}
      
      {/* Door/entrance */}
      <mesh position={[0, -0.2, 0.76]} castShadow scale={[scale, scale, scale]}>
        <boxGeometry args={[0.3, 0.6, 0.1]} />
        <meshLambertMaterial color="#5D4037" transparent opacity={opacity} />
      </mesh>
      
      {/* Lock indicator for locked objects */}
      {!object.isUnlocked && (
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshBasicMaterial color="#F44336" />
        </mesh>
      )}
      
      {/* Object label */}
      <mesh position={[0, 2, 0]} scale={[scale, scale, scale]}>
        <planeGeometry args={[2, 0.4]} />
        <meshBasicMaterial 
          color="white" 
          transparent 
          opacity={hovered ? 0.9 : 0.7} 
        />
      </mesh>
      
      {/* Interaction hint when hovered */}
      {hovered && (
        <mesh position={[0, -1, 0]}>
          <planeGeometry args={[1.5, 0.3]} />
          <meshBasicMaterial color="#FF5722" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
}

export function PrefabObjects() {
  const { objects, removeObject } = useWorldObjects();
  const { student } = useEducation();
  
  return (
    <group>
      {objects.map((object) => (
        <PrefabObject 
          key={object.id} 
          object={object} 
          onRemove={removeObject}
        />
      ))}
    </group>
  );
}
