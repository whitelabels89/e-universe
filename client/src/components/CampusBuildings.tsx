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
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { student } = useEducation();
  
  const isAccessible = building.isUnlocked && student.level >= building.requiredLevel;
  const displayColor = isAccessible ? building.color : '#666666';

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  const renderBuildingDetails = () => {
    switch (building.type) {
      case 'lab-coding':
        return (
          <group>
            {/* Main building */}
            <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
              <meshStandardMaterial color={displayColor} transparent={!isAccessible} opacity={isAccessible ? 1 : 0.6} />
            </Box>
            {/* Pyramid roof */}
            <mesh position={[0, building.size[1] + 0.5, 0]}>
              <coneGeometry args={[building.size[0] * 0.7, 1, 4]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Windows */}
            {Array.from({ length: 3 }, (_, i) => (
              <Box key={i} args={[0.1, 1, 0.8]} position={[building.size[0]/2 + 0.05, building.size[1] / 2, -building.size[2]/2 + (i+1) * building.size[2]/4]}>
                <meshStandardMaterial color="#87CEEB" />
              </Box>
            ))}
            {/* Door */}
            <Box args={[0.1, building.size[1]/2, 1]} position={[building.size[0]/2 + 0.05, building.size[1]/4, 0]}>
              <meshStandardMaterial color="#654321" />
            </Box>
          </group>
        );
        
      case 'library':
        return (
          <group>
            {/* Main building */}
            <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
              <meshStandardMaterial color={displayColor} transparent={!isAccessible} opacity={isAccessible ? 1 : 0.6} />
            </Box>
            {/* Classical columns */}
            {Array.from({ length: 4 }, (_, i) => (
              <mesh key={i} position={[building.size[0]/2 + 0.3, building.size[1] / 2, -building.size[2]/2 + (i+1) * building.size[2]/5]}>
                <cylinderGeometry args={[0.2, 0.2, building.size[1] * 1.2]} />
                <meshStandardMaterial color="#F5F5DC" />
              </mesh>
            ))}
            {/* Large arched windows */}
            {Array.from({ length: 2 }, (_, i) => (
              <Box key={i} args={[0.1, 2, 1.5]} position={[building.size[0]/2 + 0.05, building.size[1] / 2 + 0.3, -building.size[2]/4 + i * building.size[2]/2]}>
                <meshStandardMaterial color="#87CEEB" />
              </Box>
            ))}
          </group>
        );
        
      case 'robotic':
        return (
          <group>
            {/* Main building */}
            <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
              <meshStandardMaterial color={displayColor} transparent={!isAccessible} opacity={isAccessible ? 1 : 0.6} />
            </Box>
            {/* Tech antenna */}
            <mesh position={[0, building.size[1] + 1.5, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 3]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
            {/* Satellite dish */}
            <mesh position={[0, building.size[1] + 2.8, 0]} rotation={[Math.PI/4, 0, 0]}>
              <cylinderGeometry args={[0.8, 0.1, 0.1]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
            {/* LED strips */}
            {Array.from({ length: 4 }, (_, i) => (
              <Box key={i} args={[0.05, 0.1, building.size[2] * 0.9]} position={[building.size[0]/2 + 0.05, building.size[1]/2 - building.size[1]/3 + (i+1) * building.size[1]/5, 0]}>
                <meshStandardMaterial color="#00FF00" emissive="#00FF00" emissiveIntensity={0.3} />
              </Box>
            ))}
          </group>
        );
        
      case 'garden':
        return (
          <group>
            {/* Greenhouse structure */}
            <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
              <meshStandardMaterial color={displayColor} transparent opacity={building.isUnlocked ? 0.7 : 0.3} />
            </Box>
            {/* Arched roof frame */}
            <mesh position={[0, building.size[1] + 0.2, 0]} rotation={[0, 0, Math.PI/2]}>
              <torusGeometry args={[building.size[1]/2 + 0.2, 0.1, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Garden beds */}
            {Array.from({ length: 4 }, (_, i) => (
              <Box key={i} args={[1, 0.2, 1]} position={[-building.size[0]/4 + (i%2) * building.size[0]/2, 0.1, -building.size[2]/4 + Math.floor(i/2) * building.size[2]/2]}>
                <meshStandardMaterial color="#8B4513" />
              </Box>
            ))}
            {/* Plants */}
            {Array.from({ length: 8 }, (_, i) => (
              <mesh key={i} position={[-building.size[0]/4 + (i%4) * building.size[0]/4, 0.4, -building.size[2]/4 + Math.floor(i/4) * building.size[2]/2]}>
                <coneGeometry args={[0.2, 0.6, 8]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            ))}
          </group>
        );
        
      case 'farm':
        return (
          <group>
            {/* Barn structure */}
            <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
              <meshStandardMaterial color={displayColor} transparent={!isAccessible} opacity={isAccessible ? 1 : 0.6} />
            </Box>
            {/* Barn roof */}
            <Box args={[building.size[0] + 0.2, 0.1, building.size[2] + 0.4]} position={[0, building.size[1] + 0.3, 0]}>
              <meshStandardMaterial color="#8B0000" />
            </Box>
            {/* Barn doors */}
            <Box args={[0.1, building.size[1] * 0.8, building.size[2] * 0.6]} position={[building.size[0]/2 + 0.05, building.size[1] / 2, 0]}>
              <meshStandardMaterial color="#654321" />
            </Box>
            {/* Silo */}
            <mesh position={[building.size[0]/2 + 2, building.size[1] / 2, building.size[2]/2 + 1]}>
              <cylinderGeometry args={[0.8, 0.8, building.size[1] * 1.2]} />
              <meshStandardMaterial color="#C0C0C0" />
            </mesh>
            <mesh position={[building.size[0]/2 + 2, building.size[1] + 0.3, building.size[2]/2 + 1]}>
              <coneGeometry args={[0.8, 0.6]} />
              <meshStandardMaterial color="#8B0000" />
            </mesh>
          </group>
        );
        
      case 'studio-art':
        return (
          <group>
            {/* Main studio */}
            <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
              <meshStandardMaterial color={displayColor} transparent={!isAccessible} opacity={isAccessible ? 1 : 0.6} />
            </Box>
            {/* Large skylight */}
            <Box args={[building.size[0] * 0.8, 0.1, building.size[2] * 0.8]} position={[0, building.size[1] + 0.05, 0]}>
              <meshStandardMaterial color="#87CEEB" transparent opacity={0.8} />
            </Box>
            {/* Art supply containers on window sill */}
            {Array.from({ length: 6 }, (_, i) => (
              <mesh key={i} position={[building.size[0]/2 + 0.15, building.size[1] / 2, -building.size[2]/2 + (i+1) * building.size[2]/7]}>
                <cylinderGeometry args={[0.05, 0.05, 0.3]} />
                <meshStandardMaterial color={`hsl(${i * 60}, 70%, 50%)`} />
              </mesh>
            ))}
          </group>
        );
        
      default:
        return (
          <Box args={building.size} position={[0, building.size[1] / 2, 0]}>
            <meshStandardMaterial color={displayColor} transparent={!isAccessible} opacity={isAccessible ? 1 : 0.6} />
          </Box>
        );
    }
  };

  return (
    <group 
      ref={meshRef}
      position={building.position}
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
      {renderBuildingDetails()}

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