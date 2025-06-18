import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useBuildMode } from "../lib/stores/useBuildMode";
import * as THREE from "three";

interface GridWorldProps {
  size?: number;
  onGridClick?: (position: [number, number, number]) => void;
}

export function GridWorld({ size = 80, onGridClick }: GridWorldProps) {
  const groundRef = useRef<THREE.Mesh>(null);
  const { isBuildMode, setPreviewPosition, selectedBuildingType } = useBuildMode();
  
  // Load grass texture
  const grassTexture = useTexture("/textures/grass.png");
  
  // Configure texture tiling
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(size, size);
  
  // Handle ground clicks for object placement
  const handleClick = (event: any) => {
    event.stopPropagation();
    const point = event.point;
    
    // Snap to grid
    const gridX = Math.round(point.x);
    const gridZ = Math.round(point.z);
    const gridY = 2; // Place objects above ground
    
    if (isBuildMode && selectedBuildingType) {
      // In build mode, place building
      if (onGridClick) {
        onGridClick([gridX, 0, gridZ]); // Use ground level for buildings
      }
      setPreviewPosition(null); // Clear preview after placement
    } else if (!isBuildMode && onGridClick) {
      // Normal mode
      onGridClick([gridX, gridY, gridZ]);
    }
  };

  const handlePointerMove = (event: any) => {
    if (!isBuildMode || !selectedBuildingType) return;
    
    const point = event.point;
    
    // Snap to grid for preview
    const gridX = Math.round(point.x);
    const gridZ = Math.round(point.z);
    
    setPreviewPosition([gridX, 0, gridZ]);
  };

  const handlePointerLeave = () => {
    if (isBuildMode) {
      setPreviewPosition(null);
    }
  };
  
  return (
    <group>
      {/* Main ground plane - disabled collision */}
      <mesh 
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]}
        receiveShadow
        onClick={handleClick}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <planeGeometry args={[size, size]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>
      
      {/* Grid lines for visual reference */}
      <gridHelper args={[size, size, "#4CAF50", "#81C784"]} position={[0, 0.01, 0]} />
      
      {/* Boundary markers */}
      {Array.from({ length: size + 1 }, (_, i) => {
        const pos = (i - size / 2);
        return (
          <group key={`boundary-${i}`}>
            {/* X-axis markers */}
            <mesh position={[pos, 0.05, size / 2]} >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial color="#2196F3" />
            </mesh>
            <mesh position={[pos, 0.05, -size / 2]} >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial color="#2196F3" />
            </mesh>
            
            {/* Z-axis markers */}
            <mesh position={[size / 2, 0.05, pos]} >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial color="#FF5722" />
            </mesh>
            <mesh position={[-size / 2, 0.05, pos]} >
              <boxGeometry args={[0.1, 0.1, 0.1]} />
              <meshBasicMaterial color="#FF5722" />
            </mesh>
          </group>
        );
      })}
      
      {/* World center marker - removed to avoid visual constraint */}
    </group>
  );
}
