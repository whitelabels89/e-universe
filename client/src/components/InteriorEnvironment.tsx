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
          <Box args={[1.2, 0.8, 0.1]} position={[0, 0.4, 0]}>
            <meshStandardMaterial color="#1a1a1a" />
          </Box>
          <Box args={[1.1, 0.7, 0.05]} position={[0, 0.4, 0.05]}>
            <meshStandardMaterial color="#00ff88" emissive="#004400" />
          </Box>
          <Cylinder args={[0.3, 0.3, 0.1]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#333333" />
          </Cylinder>
        </group>
      );

    case 'book':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          <Box args={[0.3, 1.5, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Box args={[0.3, 1.4, 0.2]} position={[0.1, 0, 0.1]}>
            <meshStandardMaterial color="#CD853F" />
          </Box>
        </group>
      );

    case 'robot':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          <Box args={[0.8, 1.2, 0.6]} position={[0, 0.6, 0]}>
            <meshStandardMaterial color="#FF6B35" />
          </Box>
          <Box args={[0.5, 0.5, 0.5]} position={[0, 1.5, 0]}>
            <meshStandardMaterial color="#FF6B35" />
          </Box>
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
          <Cylinder args={[0.3, 0.2, 0.4]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.05, 0.05, 1]} position={[0, 0.9, 0]}>
            <meshStandardMaterial color="#228B22" />
          </Cylinder>
          <Sphere args={[0.4, 0.2, 0.4]} position={[0, 1.3, 0]}>
            <meshStandardMaterial color="#32CD32" />
          </Sphere>
        </group>
      );

    case 'easel':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          <Cylinder args={[0.02, 0.02, 1.5]} position={[-0.3, 0.75, -0.3]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.02, 0.02, 1.5]} position={[0.3, 0.75, -0.3]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Box args={[0.8, 1, 0.02]} position={[0, 1, 0]}>
            <meshStandardMaterial color="#FFFAF0" />
          </Box>
        </group>
      );

    case 'desk':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          <Box args={[1.2, 0.05, 0.6]} position={[0, 0.75, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Cylinder args={[0.03, 0.03, 0.75]} position={[-0.5, 0.375, -0.25]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.75]} position={[0.5, 0.375, -0.25]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.75]} position={[-0.5, 0.375, 0.25]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.75]} position={[0.5, 0.375, 0.25]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
        </group>
      );

    case 'chair':
      return (
        <group position={position} rotation={rotation} scale={scale}>
          <Box args={[0.4, 0.05, 0.4]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Box args={[0.4, 0.6, 0.05]} position={[0, 0.8, -0.175]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[-0.15, 0.25, -0.15]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[0.15, 0.25, -0.15]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[-0.15, 0.25, 0.15]}>
            <meshStandardMaterial color="#8B4513" />
          </Cylinder>
          <Cylinder args={[0.03, 0.03, 0.5]} position={[0.15, 0.25, 0.15]}>
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

  const renderWallDetails = () => {
    switch (selectedBuilding.type) {
      case 'lab-coding':
        return (
          <group>
            {/* Tech walls */}
            <mesh position={[0, 4, -9.9]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#1a1a2e" />
            </mesh>
            
            {/* LED screens */}
            {Array.from({ length: 4 }, (_, i) => (
              <group key={`screen-${i}`}>
                <Box args={[3, 2, 0.1]} position={[-7.5 + i * 5, 5, -9.8]}>
                  <meshStandardMaterial color="#0066cc" emissive="#0033aa" emissiveIntensity={0.3} />
                </Box>
              </group>
            ))}

            {/* Side walls */}
            <mesh position={[-9.9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#2a2a3e" />
            </mesh>
            
            <mesh position={[9.9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#2a2a3e" />
            </mesh>

            {/* Server racks */}
            {Array.from({ length: 6 }, (_, i) => (
              <Box key={`server-${i}`} args={[0.8, 3, 0.3]} position={[-9.7, 2, -8 + i * 2.5]}>
                <meshStandardMaterial color="#333366" />
              </Box>
            ))}
          </group>
        );

      case 'library':
        return (
          <group>
            {/* Wooden walls */}
            <mesh position={[0, 4, -9.9]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>

            {/* Bookshelves */}
            {Array.from({ length: 6 }, (_, i) => (
              <group key={`bookshelf-${i}`}>
                <Box args={[3, 7, 0.4]} position={[-9 + i * 3, 3.5, -9.6]}>
                  <meshStandardMaterial color="#654321" />
                </Box>
                {/* Books */}
                {Array.from({ length: 15 }, (_, j) => (
                  <Box key={`book-${i}-${j}`} args={[0.15, 0.8, 0.3]} position={[-10.2 + i * 3 + (j % 8) * 0.3, 1 + Math.floor(j / 8) * 1.5, -9.4]}>
                    <meshStandardMaterial color={`hsl(${(i * 40 + j * 20) % 360}, 60%, ${40 + (j % 3) * 15}%)`} />
                  </Box>
                ))}
              </group>
            ))}

            {/* Side walls */}
            <mesh position={[-9.9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>

            <mesh position={[9.9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          </group>
        );

      case 'robotic':
        return (
          <group>
            {/* Metallic walls */}
            <mesh position={[0, 4, -9.9]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#36454F" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Robotic displays */}
            {Array.from({ length: 3 }, (_, i) => (
              <group key={`robot-${i}`} position={[-5 + i * 5, 2, -9.5]}>
                <Box args={[0.8, 0.5, 0.8]} position={[0, 0, 0]}>
                  <meshStandardMaterial color="#708090" metalness={0.9} roughness={0.1} />
                </Box>
                <Box args={[0.3, 2, 0.3]} position={[0, 1.5, 0]}>
                  <meshStandardMaterial color="#A9A9A9" metalness={0.8} roughness={0.2} />
                </Box>
              </group>
            ))}

            {/* Side walls */}
            <mesh position={[-9.9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#36454F" metalness={0.8} roughness={0.2} />
            </mesh>

            <mesh position={[9.9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#36454F" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );

      default:
        return (
          <group>
            <mesh position={[0, 4, -9.9]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#e8e8e8" />
            </mesh>
            
            <mesh position={[-9.9, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#e8e8e8" />
            </mesh>
            
            <mesh position={[9.9, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
              <planeGeometry args={[20, 8]} />
              <meshStandardMaterial color="#e8e8e8" />
            </mesh>
          </group>
        );
    }
  };

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
        <meshStandardMaterial 
          color={selectedBuilding.type === 'lab-coding' ? "#1a1a1a" : 
                selectedBuilding.type === 'library' ? "#654321" :
                selectedBuilding.type === 'robotic' ? "#2F4F4F" : "#f0f0f0"} 
        />
      </Box>

      {/* Detailed Walls */}
      {renderWallDetails()}

      {/* Ceiling */}
      <Box args={[20, 0.1, 20]} position={[0, 8, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Box>

      {/* Decorative Elements */}
      {environment.decorativeElements.map((element, index) => (
        <DecorativeElementMesh key={index} element={element} />
      ))}

      {/* Exit instruction text */}
      <Text
        position={[0, 2, 9]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        Press ESC to exit building
      </Text>
    </group>
  );
}