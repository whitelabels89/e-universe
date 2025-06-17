import { useMemo } from "react";
import { Box } from "@react-three/drei";
import { useBuildMode } from "../lib/stores/useBuildMode";
import { CAMPUS_BUILDINGS } from "../types/campus";
import * as THREE from "three";

export function BuildPreviewGhost() {
  const { previewPosition, selectedBuildingType, isBuildMode } = useBuildMode();

  const buildingData = useMemo(() => {
    if (!selectedBuildingType) return null;
    return CAMPUS_BUILDINGS.find(b => b.type === selectedBuildingType);
  }, [selectedBuildingType]);

  if (!isBuildMode || !previewPosition || !buildingData) {
    return null;
  }

  return (
    <group position={previewPosition}>
      {/* Ghost building preview */}
      <Box
        args={buildingData.size}
        position={[0, buildingData.size[1] / 2, 0]}
      >
        <meshStandardMaterial 
          color={buildingData.color}
          transparent
          opacity={0.5}
          wireframe={true}
        />
      </Box>
      
      {/* Foundation indicator */}
      <Box
        args={[buildingData.size[0] + 0.5, 0.1, buildingData.size[2] + 0.5]}
        position={[0, -0.05, 0]}
      >
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.3}
        />
      </Box>
    </group>
  );
}