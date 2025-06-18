import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { TerrainPhysics } from './PhysicsWorld';

interface TerrainVisualizerProps {
  size?: number;
}

export function TerrainVisualizer({ size = 100 }: TerrainVisualizerProps) {
  const grassTexture = useTexture('/textures/grass.png');
  const sandTexture = useTexture('/textures/sand.jpg');
  const asphaltTexture = useTexture('/textures/asphalt.png');
  const woodTexture = useTexture('/textures/wood.jpg');

  // Create terrain patches based on terrain detection
  const terrainPatches = useMemo(() => {
    const patches = [];
    const patchSize = 4;
    
    for (let x = -size/2; x < size/2; x += patchSize) {
      for (let z = -size/2; z < size/2; z += patchSize) {
        const centerPos: [number, number, number] = [x + patchSize/2, 0, z + patchSize/2];
        const terrainType = TerrainPhysics.getTerrainType(centerPos);
        const jumpMultiplier = TerrainPhysics.getJumpMultiplier(terrainType);
        
        patches.push({
          position: centerPos,
          terrainType,
          jumpMultiplier,
          key: `${x}-${z}`
        });
      }
    }
    
    return patches;
  }, [size]);

  const getTerrainColor = (terrainType: string, jumpMultiplier: number) => {
    const colors: Record<string, string> = {
      grass: '#4ade80',
      stone: '#6b7280',
      sand: '#fbbf24',
      water: '#3b82f6',
      mud: '#92400e',
      rock: '#57534e',
      dirt: '#a3a3a3',
      asphalt: '#1f2937',
      wood: '#d97706',
      trampoline: '#a855f7',
      bouncy: '#ec4899',
      ice: '#06b6d4',
      concrete: '#4b5563',
      metal: '#71717a',
      rubber: '#dc2626',
      quicksand: '#ea580c',
      lava: '#dc2626',
    };
    
    return colors[terrainType] || '#6b7280';
  };

  const getTerrainTexture = (terrainType: string) => {
    switch (terrainType) {
      case 'grass':
      case 'dirt':
        return grassTexture;
      case 'sand':
      case 'quicksand':
        return sandTexture;
      case 'asphalt':
      case 'concrete':
        return asphaltTexture;
      case 'wood':
        return woodTexture;
      default:
        return null;
    }
  };

  return (
    <group>
      {terrainPatches.map((patch) => {
        const texture = getTerrainTexture(patch.terrainType);
        const color = getTerrainColor(patch.terrainType, patch.jumpMultiplier);
        const emissiveIntensity = patch.terrainType === 'trampoline' ? 0.2 : 
                                  patch.terrainType === 'bouncy' ? 0.1 : 0;
        
        return (
          <mesh 
            key={patch.key}
            position={[patch.position[0], -0.01, patch.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[3.8, 3.8]} />
            <meshStandardMaterial
              map={texture}
              color={color}
              emissive={patch.terrainType === 'lava' ? '#ff4444' : 
                       patch.jumpMultiplier > 1.5 ? '#440088' : '#000000'}
              emissiveIntensity={emissiveIntensity}
              transparent={patch.terrainType === 'water'}
              opacity={patch.terrainType === 'water' ? 0.7 : 1.0}
            />
          </mesh>
        );
      })}
      
      {/* Special effect markers for bounce pads */}
      {terrainPatches
        .filter(patch => patch.terrainType === 'trampoline')
        .map((patch) => (
          <group key={`effect-${patch.key}`} position={patch.position}>
            {/* Animated ring effect */}
            <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.5, 2, 16]} />
              <meshStandardMaterial 
                color="#a855f7" 
                emissive="#a855f7" 
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        ))}
    </group>
  );
}