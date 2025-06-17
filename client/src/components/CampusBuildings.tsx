import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box } from "@react-three/drei";
import { Building } from "../types/campus";
import { useCampus } from "../lib/stores/useCampus";
import { useEducation } from "../lib/stores/useEducation";
import * as THREE from "three";

interface BuildingMeshProps {
  building: Building;
  onEnter: (buildingId: string) => void;
}

function BuildingMesh({ building, onEnter }: BuildingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { student } = useEducation();
  
  const isAccessible = building.isUnlocked && student.level >= building.requiredLevel;
  const displayColor = isAccessible ? building.color : '#666666';

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group position={building.position}>
      {/* Main Building */}
      <Box
        ref={meshRef}
        args={building.size}
        position={[0, building.size[1] / 2, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => {
          if (isAccessible) {
            onEnter(building.id);
          } else {
            console.log(`Building ${building.name} is locked. Required level: ${building.requiredLevel}`);
          }
        }}
      >
        <meshStandardMaterial 
          color={displayColor} 
          transparent={!isAccessible}
          opacity={isAccessible ? 1 : 0.6}
        />
      </Box>

      {/* Building Name */}
      <Text
        position={[0, building.size[1] + 2, 0]}
        fontSize={1}
        color={isAccessible ? "#ffffff" : "#cccccc"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {building.name}
      </Text>

      {/* Level Requirement Indicator */}
      {!isAccessible && (
        <Text
          position={[0, building.size[1] + 0.5, 0]}
          fontSize={0.5}
          color="#ff6666"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          🔒 Level {building.requiredLevel} Required
        </Text>
      )}

      {/* Door */}
      <Box
        args={[1.5, 2.5, 0.2]}
        position={[0, 1.25, building.size[2] / 2 + 0.1]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>

      {/* Door Handle */}
      <Box
        args={[0.1, 0.1, 0.1]}
        position={[0.5, 1.25, building.size[2] / 2 + 0.2]}
      >
        <meshStandardMaterial color="#FFD700" />
      </Box>
    </group>
  );
}

export function CampusBuildings() {
  const { buildings, enterBuilding } = useCampus();

  const handleEnterBuilding = (buildingId: string) => {
    enterBuilding(buildingId);
  };

  return (
    <group>
      {buildings.map((building) => (
        <BuildingMesh
          key={building.id}
          building={building}
          onEnter={handleEnterBuilding}
        />
      ))}
    </group>
  );
}