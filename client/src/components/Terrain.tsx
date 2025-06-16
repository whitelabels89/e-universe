import { useMemo } from "react";
import * as THREE from "three";

interface TerrainProps {
  size?: number;
}

export function Terrain({ size = 50 }: TerrainProps) {
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
          elevation += (8 - mountainDistance1) * 3;
        }
        if (mountainDistance2 < 6) {
          elevation += (6 - mountainDistance2) * 4;
        }
        
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

  // Create terrain geometry
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
    const vertices = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < vertices.length; i += 3) {
      const x = Math.floor(i / 3) % size;
      const z = Math.floor(i / 3 / size);
      vertices[i + 1] = heightData[x + z * size]; // Y coordinate
    }
    
    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 2);
    
    return geometry;
  }, [heightData, size]);

  return (
    <group>
      {/* Main terrain */}
      <mesh geometry={terrainGeometry} receiveShadow>
        <meshLambertMaterial 
          color="#4a5d23" 
          wireframe={false}
        />
      </mesh>
      
      {/* Water bodies */}
      <WaterBodies size={size} />
      
      {/* Trees and vegetation */}
      <Vegetation size={size} heightData={heightData} />
    </group>
  );
}

function WaterBodies({ size }: { size: number }) {
  return (
    <group>
      {/* River 1 */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <planeGeometry args={[60, 4]} />
        <meshLambertMaterial color="#1e6091" transparent opacity={0.8} />
      </mesh>
      
      {/* River 2 */}
      <mesh position={[10, 0.1, 0]} rotation={[0, 0, Math.PI / 6]} receiveShadow>
        <planeGeometry args={[50, 3]} />
        <meshLambertMaterial color="#1e6091" transparent opacity={0.8} />
      </mesh>
      
      {/* Lake */}
      <mesh position={[15, 0.1, 15]} receiveShadow>
        <circleGeometry args={[8, 32]} />
        <meshLambertMaterial color="#0066cc" transparent opacity={0.9} />
      </mesh>
      
      {/* Ocean */}
      <mesh position={[-30, -1, 0]} receiveShadow>
        <planeGeometry args={[20, size]} />
        <meshLambertMaterial color="#003d6b" transparent opacity={0.9} />
      </mesh>
      
      <mesh position={[0, -1, 30]} receiveShadow>
        <planeGeometry args={[size, 20]} />
        <meshLambertMaterial color="#003d6b" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Vegetation({ size, heightData }: { size: number; heightData: Float32Array }) {
  const trees = useMemo(() => {
    const treePositions = [];
    
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * size * 0.8;
      const z = (Math.random() - 0.5) * size * 0.8;
      
      // Get terrain height at this position
      const gridX = Math.floor((x / size + 0.5) * size);
      const gridZ = Math.floor((z / size + 0.5) * size);
      const heightIndex = Math.max(0, Math.min(gridX + gridZ * size, heightData.length - 1));
      const y = heightData[heightIndex] || 0;
      
      // Only place trees on suitable terrain (not in water)
      if (y > 0.5 && y < 8) {
        treePositions.push([x, y, z]);
      }
    }
    
    return treePositions;
  }, [size, heightData]);

  return (
    <group>
      {trees.map((position, index) => (
        <Tree key={index} position={position as [number, number, number]} />
      ))}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  const treeHeight = 3 + Math.random() * 4;
  const trunkHeight = treeHeight * 0.3;
  const crownHeight = treeHeight * 0.7;
  
  return (
    <group position={position}>
      {/* Tree trunk */}
      <mesh position={[0, trunkHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.3, trunkHeight, 8]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>
      
      {/* Tree crown */}
      <mesh position={[0, trunkHeight + crownHeight / 2, 0]} castShadow>
        <coneGeometry args={[1.5 + Math.random(), crownHeight, 8]} />
        <meshLambertMaterial color="#228B22" />
      </mesh>
    </group>
  );
}