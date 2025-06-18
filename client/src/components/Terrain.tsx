import { useMemo } from "react";
import { useTexture } from "@react-three/drei";
import { useEnvironment } from "../lib/stores/useEnvironment";
import * as THREE from "three";

interface TerrainProps {
  size?: number;
}

export function Terrain({ size = 80 }: TerrainProps) {
  const { getCurrentTheme, currentTheme } = useEnvironment();
  const theme = getCurrentTheme();
  
  const grassTexture = useTexture("/textures/grass.png");
  const sandTexture = useTexture("/textures/sand.jpg");
  const asphaltTexture = useTexture("/textures/asphalt.png");
  
  // Select texture based on current theme
  const currentTexture = useMemo(() => {
    if (!theme) return grassTexture;
    
    console.log("Terrain - Current theme:", theme.id, theme.name);
    
    switch (theme.id) {
      case 'desert':
      case 'island':
        return sandTexture;
      case 'city':
        return asphaltTexture;
      default:
        return grassTexture;
    }
  }, [theme?.id, grassTexture, sandTexture, asphaltTexture]);

  // Configure textures for high-quality tiled look
  [grassTexture, sandTexture, asphaltTexture].forEach(texture => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(size / 1.5, size / 1.5); // Optimal tiling density
    texture.magFilter = THREE.LinearFilter; // Smooth but crisp
    texture.minFilter = THREE.LinearMipmapLinearFilter; // High quality scaling
    texture.anisotropy = 16; // Maximum anisotropy for crisp distant textures
  });

  // Get terrain color based on theme
  const terrainColor = useMemo(() => {
    if (!theme) return "#228B22";
    console.log("Terrain - Using color:", theme.terrainColor, "for theme:", theme.name);
    return theme.terrainColor || "#228B22";
  }, [theme?.terrainColor, theme?.name]);

  // Generate heightmap for terrain
  const heightData = useMemo(() => {
    const width = size;
    const height = size;
    const data = new Float32Array(width * height);
    
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const x = (i / width) * 8 - 4;
        const z = (j / height) * 8 - 4;
        
        // Create varied terrain with multiple noise functions
        let elevation = 0;
        
        // Base terrain with gentle hills
        elevation += Math.sin(x * 0.5) * Math.cos(z * 0.3) * 2;
        
        // Add mountain ranges
        const mountainDistance1 = Math.sqrt((x + 15) ** 2 + (z - 10) ** 2);
        const mountainDistance2 = Math.sqrt((x - 18) ** 2 + (z + 15) ** 2);
        
        if (mountainDistance1 < 8) {
          elevation += (8 - mountainDistance1) * 6;
        }
        if (mountainDistance2 < 6) {
          elevation += (6 - mountainDistance2) * 8;
        }
        
        // Add hills
        elevation += Math.sin(x * 0.8) * Math.cos(z * 0.6) * 3;
        elevation += Math.sin(x * 1.2) * Math.cos(z * 0.9) * 2;
        
        // Create valleys for rivers
        const riverPath1 = Math.abs(Math.sin(x * 0.3) * 5 - z);
        const riverPath2 = Math.abs(Math.cos(z * 0.2) * 6 - x + 10);
        
        if (riverPath1 < 2) {
          elevation -= (2 - riverPath1) * 2;
        }
        if (riverPath2 < 2.5) {
          elevation -= (2.5 - riverPath2) * 1.5;
        }
        
        // Ocean area (lower elevation)
        if (x < -20 || z > 20) {
          elevation = Math.min(elevation, -3);
        }
        
        data[i + j * width] = elevation;
      }
    }
    
    return data;
  }, [size]);

  return (
    <group>
      {/* Main terrain base - clean flat terrain */}
      <mesh 
        receiveShadow 
        position={[0, -0.1, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        userData={{ isTerrain: true }}
      >
        <planeGeometry args={[size * 1.2, size * 1.2, 128, 128]} />
        <meshLambertMaterial 
          map={currentTexture}
          color={terrainColor}
        />
      </mesh>
      
      {/* Terrain chunks for varied height */}
      <TerrainChunks size={size} theme={theme} currentTexture={currentTexture} terrainColor={terrainColor} />
      
      {/* Water bodies */}
      <WaterBodies size={size} theme={theme} />
      
      {/* Distant islands */}
      <DistantIslands theme={theme} />
      
      {/* Trees and vegetation */}
      <Vegetation size={size} heightData={heightData} theme={theme} />
    </group>
  );
}

function TerrainChunks({ size, theme, currentTexture, terrainColor }: { 
  size: number; 
  theme: any; 
  currentTexture: any; 
  terrainColor: string; 
}) {
  const chunks = useMemo(() => {
    const chunkSize = 8;
    const chunks = [];
    
    for (let x = -size/2; x < size/2; x += chunkSize) {
      for (let z = -size/2; z < size/2; z += chunkSize) {
        // Create more stable terrain based on theme
        let height = 0;
        
        if (theme?.id === 'desert') {
          // Desert dunes - smoother, higher variation
          height = Math.sin(x * 0.05) * Math.cos(z * 0.08) * 3 + 
                   Math.sin(x * 0.1) * 1.5 + 
                   Math.cos(z * 0.12) * 2;
          height = Math.max(0.5, height); // Keep above water level
        } else if (theme?.id === 'island') {
          // Tropical terrain - gentle hills with consistent elevation
          const distanceFromCenter = Math.sqrt(x * x + z * z);
          height = Math.max(2, 4 - distanceFromCenter * 0.02) + 
                   Math.sin(x * 0.1) * Math.cos(z * 0.1) * 1.5;
        } else if (theme?.id === 'mountain') {
          // Mountain terrain - high peaks
          height = Math.sin(x * 0.08) * Math.cos(z * 0.06) * 4 + 
                   Math.abs(Math.sin(x * 0.15)) * 3;
        } else {
          // Default grassland - gentle rolling hills
          height = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2 + 
                   Math.sin(x * 0.2) * 0.5;
        }
        
        chunks.push({ x, z, height: Math.max(0.2, height), size: chunkSize });
      }
    }
    
    return chunks;
  }, [size, theme]);

  return (
    <group>
      {chunks.map((chunk, index) => (
        <mesh 
          key={index} 
          position={[chunk.x + chunk.size/2, chunk.height/2 + 0.1, chunk.z + chunk.size/2]}
          receiveShadow
          castShadow
          userData={{ isTerrain: true }}
        >
          <boxGeometry args={[chunk.size - 0.1, chunk.height, chunk.size - 0.1]} />
          <meshLambertMaterial 
            map={currentTexture}
            color={terrainColor}
          />
        </mesh>
      ))}
    </group>
  );
}

function WaterBodies({ size, theme }: { size: number; theme: any }) {
  const waterColor = useMemo(() => {
    if (!theme) return "#1E40AF";
    switch (theme.id) {
      case 'island':
        return "#0891B2"; // Tropical blue
      case 'desert':
        return "#0369A1"; // Deep oasis blue
      case 'snow':
        return "#7DD3FC"; // Ice blue
      case 'city':
        return "#1E293B"; // Dark urban water
      default:
        return "#1E40AF"; // Default blue
    }
  }, [theme]);

  const waterBodies = useMemo(() => {
    const bodies = [];
    
    // Central river system - clean rectangular sections  
    for (let i = 0; i < 15; i++) {
      const t = i / 15;
      const x = Math.sin(t * Math.PI * 1.5) * 18;
      const z = (t - 0.5) * size * 0.5;
      bodies.push({ 
        x, 
        z, 
        width: 6, 
        length: 5, 
        height: -0.8, // Deeper water to avoid terrain conflicts
        type: 'river' 
      });
    }
    
    // Strategic lakes - rectangular for clean look
    const lakes = [
      { x: -25, z: -20, width: 16, length: 20, height: -1.0, type: 'lake' },
      { x: 30, z: 15, width: 14, length: 18, height: -1.0, type: 'lake' },
      { x: -10, z: 25, width: 12, length: 16, height: -1.0, type: 'lake' }
    ];
    
    return [...bodies, ...lakes];
  }, [size, theme]);

  return (
    <group>
      {waterBodies.map((water, index) => (
        <mesh key={index} position={[water.x, water.height, water.z]} receiveShadow>
          <boxGeometry args={[water.width, 0.3, water.length]} />
          <meshPhongMaterial 
            color={waterColor}
            transparent 
            opacity={0.85}
            shininess={100}
            reflectivity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

function DistantIslands({ theme }: { theme: any }) {
  const islands = useMemo(() => {
    const islandData = [];
    
    // Create distant islands at various distances
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = 120 + Math.random() * 80;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const size = 15 + Math.random() * 25;
      const height = 3 + Math.random() * 8;
      
      islandData.push({ x, z, size, height });
    }
    
    return islandData;
  }, []);

  const islandColor = useMemo(() => {
    if (!theme) return "#22C55E";
    switch (theme.id) {
      case 'desert':
        return "#F59E0B";
      case 'snow':
        return "#F1F5F9";
      case 'island':
        return "#10B981";
      default:
        return "#22C55E";
    }
  }, [theme]);

  return (
    <group>
      {islands.map((island, index) => (
        <group key={index} position={[island.x, 0, island.z]}>
          {/* Island base */}
          <mesh position={[0, island.height/2, 0]}>
            <boxGeometry args={[island.size, island.height, island.size]} />
            <meshLambertMaterial color={islandColor} />
          </mesh>
          
          {/* Small mountain on island */}
          <mesh position={[0, island.height + 2, 0]}>
            <coneGeometry args={[island.size * 0.3, 4]} />
            <meshLambertMaterial color={islandColor} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Vegetation({ size, heightData, theme }: { size: number; heightData: Float32Array; theme: any }) {
  const { treePositions, rockPositions, structures } = useMemo(() => {
    const trees = [];
    const rocks = [];
    const structures = [];
    
    // Generate features based on theme with grid-aligned positions
    const featureCount = theme?.id === 'city' ? 25 : theme?.id === 'desert' ? 15 : 40;
    
    for (let i = 0; i < featureCount; i++) {
      // Grid-aligned positions for cleaner look
      const gridX = Math.floor((Math.random() - 0.5) * size * 0.7 / 4) * 4;
      const gridZ = Math.floor((Math.random() - 0.5) * size * 0.7 / 4) * 4;
      const baseHeight = 1; // Fixed height above terrain
      
      // Avoid water areas
      const isNearWater = Math.abs(gridX) < 25 && Math.abs(gridZ) < 30 && 
                         Math.sin(gridX * 0.1) * 15 > gridZ - 10 && 
                         Math.sin(gridX * 0.1) * 15 < gridZ + 10;
      
      if (!isNearWater) {
        // Calculate proper height based on terrain chunks
        let terrainHeight = 2; // Base height above terrain chunks
        if (theme?.id === 'desert') {
          terrainHeight = Math.sin(gridX * 0.05) * Math.cos(gridZ * 0.08) * 3 + 3;
        } else if (theme?.id === 'island') {
          const distanceFromCenter = Math.sqrt(gridX * gridX + gridZ * gridZ);
          terrainHeight = Math.max(4, 6 - distanceFromCenter * 0.02);
        } else if (theme?.id === 'mountain') {
          terrainHeight = Math.sin(gridX * 0.08) * Math.cos(gridZ * 0.06) * 4 + 5;
        }
        
        if (theme?.id === 'desert') {
          if (Math.random() < 0.4) {
            trees.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'cactus' });
          } else {
            rocks.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'boulder' });
          }
        } else if (theme?.id === 'city') {
          if (Math.random() < 0.8) {
            structures.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'building' });
          }
        } else if (theme?.id === 'snow') {
          if (Math.random() < 0.7) {
            trees.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'pine' });
          } else {
            rocks.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'snowrock' });
          }
        } else if (theme?.id === 'island') {
          trees.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'palm' });
        } else {
          trees.push({ x: gridX, z: gridZ, height: terrainHeight, type: 'oak' });
        }
      }
    }
    
    return { treePositions: trees, rockPositions: rocks, structures };
  }, [size, theme]);

  return (
    <group>
      {treePositions.map((tree, index) => (
        <Tree key={`tree-${index}`} position={[tree.x, tree.height, tree.z]} type={tree.type} />
      ))}
      {rockPositions.map((rock, index) => (
        <Rock key={`rock-${index}`} position={[rock.x, rock.height, rock.z]} type={rock.type} />
      ))}
      {structures.map((structure, index) => (
        <Structure key={`structure-${index}`} position={[structure.x, structure.height, structure.z]} type={structure.type} />
      ))}
    </group>
  );
}

function Tree({ position, type }: { position: [number, number, number]; type: string }) {
  // Trees will auto-snap to ground surface
  const userData = { 
    needsGroundSnap: true, 
    heightOffset: 0,
    isCollidable: true, 
    collisionRadius: type === 'palm' ? 0.6 : type === 'pine' ? 0.4 : 0.5,
    alignToSurface: false // Disable surface alignment for better performance
  };
  
  if (type === 'cactus') {
    return (
      <group position={position} userData={userData}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 3]} />
          <meshLambertMaterial color="#228B22" />
        </mesh>
        <mesh position={[0.8, 2, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 1.5]} />
          <meshLambertMaterial color="#228B22" />
        </mesh>
      </group>
    );
  } else if (type === 'palm') {
    return (
      <group position={position} userData={userData}>
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.4, 4]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        {[0, 1, 2, 3, 4].map(i => (
          <mesh key={i} position={[Math.cos(i * 1.2) * 2, 4, Math.sin(i * 1.2) * 2]} rotation={[0, i * 1.2, Math.PI / 4]} castShadow>
            <boxGeometry args={[3, 0.5, 0.1]} />
            <meshLambertMaterial color="#32CD32" />
          </mesh>
        ))}
      </group>
    );
  } else if (type === 'pine') {
    return (
      <group position={position} userData={userData}>
        <mesh position={[0, 1, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.3, 2]} />
          <meshLambertMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow>
          <coneGeometry args={[1.5, 3]} />
          <meshLambertMaterial color="#006400" />
        </mesh>
      </group>
    );
  }
  
  // Default oak tree
  return (
    <group position={position} userData={userData}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <sphereGeometry args={[1.5]} />
        <meshLambertMaterial color="#228B22" />
      </mesh>
    </group>
  );
}

function Rock({ position, type }: { position: [number, number, number]; type: string }) {
  const color = type === 'snowrock' ? "#F0F8FF" : "#696969";
  
  return (
    <group 
      position={position} 
      userData={{ 
        needsGroundSnap: true,
        heightOffset: 0.4,
        isCollidable: true, 
        collisionRadius: 0.8,
        alignToSurface: false // Disable for performance
      }}
    >
      <mesh castShadow>
        <dodecahedronGeometry args={[0.8]} />
        <meshLambertMaterial color={color} />
      </mesh>
    </group>
  );
}

function Structure({ position, type }: { position: [number, number, number]; type: string }) {
  if (type === 'building') {
    return (
      <group 
        position={position} 
        userData={{ 
          needsGroundSnap: true,
          heightOffset: 0,
          isCollidable: true, 
          collisionRadius: 1.5 
        }}
      >
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[2, 4, 2]} />
          <meshLambertMaterial color="#708090" />
        </mesh>
        <mesh position={[0, 4.5, 0]} castShadow>
          <boxGeometry args={[2.2, 1, 2.2]} />
          <meshLambertMaterial color="#2F4F4F" />
        </mesh>
      </group>
    );
  }
  
  return null;
}