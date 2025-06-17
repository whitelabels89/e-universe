import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Box, Sphere, Cylinder, Text } from "@react-three/drei";
import { DecorativeElement, INTERIOR_ENVIRONMENTS } from "../types/campus";
import { useCampus } from "../lib/stores/useCampus";
import * as THREE from "three";

interface DecorativeElementMeshProps {
  element: DecorativeElement;
}

function DecorativeElementMesh({ element }: DecorativeElementMeshProps) {
  const { type, position, rotation, scale, color } = element;
  const defaultColor = color || getDefaultColor(type);

  switch (type) {
    case 'computer':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Monitor */}
          <Box args={[1.2, 0.8, 0.1]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          {/* Screen */}
          <Box args={[1.1, 0.7, 0.05]} position={[0, 0.4, 0.05]}>
            <meshStandardMaterial color="#00ff88" emissive="#004400" />
          </Box>
          {/* Base */}
          <Cylinder args={[0.3, 0.3, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#333333" />
          </Cylinder>
        </group>
      );

    case 'book':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Book stack */}
          <Box args={[0.3, 1.5, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Box args={[0.3, 1.4, 0.2]} position={[0.1, 0, 0.1]}>
            <meshStandardMaterial color="#CD853F" />
          </Box>
          <Box args={[0.3, 1.3, 0.2]} position={[0.2, 0, 0.2]}>
            <meshStandardMaterial color="#DEB887" />
          </Box>
        </group>
      );

    case 'robot':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Body */}
          <Box args={[0.8, 1.2, 0.6]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#FF6B35" />
          </Box>
          {/* Head */}
          <Box args={[0.5, 0.5, 0.5]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#FF6B35" />
          </Box>
          {/* Eyes */}
          <Sphere args={[0.08]} position={[-0.15, 1.5, 0.2]}>
            <meshStandardMaterial color="#00ffff" emissive="#0088ff" />
          </Sphere>
          <Sphere args={[0.08]} position={[0.15, 1.5, 0.2]}>
            <meshStandardMaterial color="#00ffff" emissive="#0088ff" />
          </Sphere>
        </group>
      );

    case 'plant':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Pot */}
          <Cylinder args={[0.3, 0.2, 0.4]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          {/* Stem */}
          <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.9, 0]}>
            <meshStandardMaterial color="#228B22" />
          </Cylinder>
          {/* Leaves */}
          <Sphere args={[0.4, 0.2, 0.4]} position={[0, 1.3, 0]}>
            <meshStandardMaterial color="#32CD32" />
          </Sphere>
        </group>
      );

    case 'easel':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Legs */}
          <Cylinder args={[0.02, 0.02, 1.5]} position={[-0.3, 0.75, -0.3]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.02, 0.02, 1.5]} position={[0.3, 0.75, -0.3]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.02, 0.02, 1]} position={[0, 0.5, 0.3]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          {/* Canvas */}
          <Box args={[0.8, 0.6, 0.05]} position={[0, 1.2, 0]}>
            <meshStandardMaterial color="#FFFAF0" />
          </Box>
        </group>
      );

    case 'desk':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Top */}
          <Box args={[2, 0.1, 1]} position={[0, 0.8, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          {/* Legs */}
          <Cylinder args={[0.05, 0.05, 0.8]} position={[-0.9, 0.4, -0.4]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.8]} position={[0.9, 0.4, -0.4]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.8]} position={[-0.9, 0.4, 0.4]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 0.8]} position={[0.9, 0.4, 0.4]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
        </group>
      );

    case 'chair':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          {/* Seat */}
          <Box args={[0.5, 0.05, 0.5]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          {/* Back */}
          <Box args={[0.5, 0.6, 0.05]} position={[0, 0.8, -0.2]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          {/* Legs */}
          <Cylinder args={[0.03, 0.03, 0.5]} position={[-0.2, 0.25, -0.2]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[0.2, 0.25, -0.2]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[-0.2, 0.25, 0.2]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[0.2, 0.25, 0.2]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
        </group>
      );

    default:
      return null;
  }
}

function getDefaultColor(type: string): string {
  const colors: Record<string, string> = {
    computer: '#1a1a1a',
    book: '#8B4513',
    robot: '#FF6B35',
    plant: '#32CD32',
    easel: '#8B4513',
    desk: '#8B4513',
    chair: '#8B4513'
  };
  return colors[type] || '#ffffff';
}

export function InteriorEnvironment() {
  const { currentInterior, selectedBuilding, exitBuilding } = useCampus();
  const { scene, camera } = useThree();
  const fogRef = useRef<THREE.Fog>();

  useEffect(() => {
    if (!currentInterior) return;

    const environment = INTERIOR_ENVIRONMENTS[currentInterior];
    if (!environment) return;

    // Set background color
    scene.background = new THREE.Color(environment.backgroundColor);
    
    // Set fog
    const fog = new THREE.Fog(environment.fogColor, 10, 50);
    scene.fog = fog;
    fogRef.current = fog;

    return () => {
      // Reset to default outdoor environment
      scene.background = new THREE.Color("#87CEEB");
      scene.fog = new THREE.Fog("#87CEEB", 20, 100);
    };
  }, [currentInterior, scene]);

  if (!currentInterior || !selectedBuilding) {
    return null;
  }

  const environment = INTERIOR_ENVIRONMENTS[currentInterior];
  if (!environment) {
    return null;
  }

  return (
    <group>
      {/* Interior Lighting */}
      <ambientLight intensity={environment.ambientLightIntensity} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.8}
        color={environment.directionalLightColor}
        castShadow
      />

      {/* Floor */}
      <Box args={[20, 0.1, 20]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Box>

      {/* Walls */}
      <Box args={[20, 8, 0.2]} position={[0, 4, -10]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[20, 8, 0.2]} position={[0, 4, 10]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[0.2, 8, 20]} position={[-10, 4, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>
      <Box args={[0.2, 8, 20]} position={[10, 4, 0]}>
        <meshStandardMaterial color="#e0e0e0" />
      </Box>

      {/* Ceiling */}
      <Box args={[20, 0.1, 20]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Decorative Elements */}
      {environment.decorativeElements.map((element, index) => (
        <DecorativeElementMesh
          key={`${currentInterior}-element-${index}`}
          element={element}
        />
      ))}

      {/* Exit Door */}
      <group position={[0, 0, 9.5]}>
        <Box args={[2, 3, 0.2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#8B4513" />
        </Box>
        <Text
          position={[0, 3.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          onClick={exitBuilding}
        >
          📤 Exit Building
        </Text>
      </group>

      {/* Building Title */}
      <Text
        position={[0, 7, 0]}
        fontSize={1.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {selectedBuilding.name}
      </Text>
    </group>
  );
}