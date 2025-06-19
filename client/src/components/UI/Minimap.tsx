import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { Card } from './card';
import { TerrainPhysics } from '../PhysicsWorld';
import * as THREE from 'three';

interface MinimapProps {
  playerPosition: [number, number, number];
  playerRotation: number;
  worldObjects?: Array<{
    position: [number, number, number];
    type: string;
  }>;
  size?: number;
  terrainSize?: number;
}

function MinimapTerrain({ size = 100 }: { size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useEffect(() => {
    if (!meshRef.current) return;
    
    // Create height map data for minimap
    const segments = 32; // Reduced for better performance
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const vertices = geometry.attributes.position.array as Float32Array;
    
    // Apply terrain heights with simplified calculation
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const z = vertices[i + 1];
      const height = TerrainPhysics.calculateTerrainHeight(x, z);
      vertices[i + 2] = height * 0.1; // Scale down significantly for minimap
    }
    
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    // Create terrain colors based on height
    const colors = new Float32Array(vertices.length);
    for (let i = 0; i < vertices.length; i += 3) {
      const height = vertices[i + 2] * 10; // Scale back up for color calculation
      
      if (height < -1) {
        // Water - blue
        colors[i] = 0.1;
        colors[i + 1] = 0.3;
        colors[i + 2] = 0.8;
      } else if (height < 1) {
        // Grass - green
        colors[i] = 0.2;
        colors[i + 1] = 0.5;
        colors[i + 2] = 0.1;
      } else if (height < 4) {
        // Hills - brown
        colors[i] = 0.4;
        colors[i + 1] = 0.3;
        colors[i + 2] = 0.1;
      } else {
        // Mountains - gray
        colors[i] = 0.5;
        colors[i + 1] = 0.5;
        colors[i + 2] = 0.5;
      }
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Clean up
    return () => {
      geometry.dispose();
    };
  }, [size]);
  
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 32, 32]} />
      <meshBasicMaterial vertexColors transparent opacity={0.8} />
    </mesh>
  );
}

function PlayerMarker({ 
  position, 
  rotation 
}: { 
  position: [number, number, number]; 
  rotation: number 
}) {
  return (
    <group position={[position[0], position[2], 0.5]}>
      {/* Player dot */}
      <mesh>
        <circleGeometry args={[1, 8]} />
        <meshBasicMaterial color="#ff4444" />
      </mesh>
      
      {/* Direction arrow */}
      <mesh rotation={[0, 0, -rotation]} position={[0, 1.5, 0.1]}>
        <coneGeometry args={[0.5, 2, 3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function ObjectMarkers({ 
  objects 
}: { 
  objects: Array<{ position: [number, number, number]; type: string }> 
}) {
  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'school': return '#4CAF50';
      case 'coding-lab': return '#2196F3';
      case 'house': return '#FF9800';
      default: return '#9E9E9E';
    }
  };
  
  return (
    <>
      {objects.map((obj, index) => (
        <mesh 
          key={index} 
          position={[obj.position[0], obj.position[2], 0.3]}
        >
          <boxGeometry args={[1.5, 1.5, 0.5]} />
          <meshBasicMaterial color={getMarkerColor(obj.type)} />
        </mesh>
      ))}
    </>
  );
}

const TERRAIN_LEGEND = [
  { color: '#2196F3', label: 'Water', description: 'Rivers and lakes' },
  { color: '#4CAF50', label: 'Grass', description: 'Low elevation plains' },
  { color: '#8D6E63', label: 'Hills', description: 'Medium elevation' },
  { color: '#9E9E9E', label: 'Mountains', description: 'High elevation peaks' }
];

const OBJECT_LEGEND = [
  { color: '#4CAF50', label: 'School', description: 'Educational buildings' },
  { color: '#2196F3', label: 'Coding Lab', description: 'Programming workspace' },
  { color: '#FF9800', label: 'House', description: 'Residential buildings' },
  { color: '#ff4444', label: 'Player', description: 'Your current position' }
];

export function Minimap({ 
  playerPosition, 
  playerRotation, 
  worldObjects = [], 
  size = 200,
  terrainSize = 100 
}: MinimapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  
  const displaySize = isExpanded ? size : size * 0.7;
  const cameraHeight = terrainSize * 0.8;
  
  return (
    <Card className="fixed top-4 right-4 z-30 bg-black/90 border-gray-700 overflow-visible">
      <div 
        className="relative cursor-pointer"
        style={{ width: displaySize, height: displaySize }}
        onClick={() => {
          if (isExpanded) {
            setShowLegend(!showLegend);
          } else {
            setIsExpanded(true);
          }
        }}
      >
        <Canvas>
          <OrthographicCamera
            makeDefault
            position={[0, 0, cameraHeight]}
            zoom={displaySize / terrainSize}
            near={0.1}
            far={cameraHeight * 2}
          />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={0.4} />
          
          {/* Terrain */}
          <MinimapTerrain size={terrainSize} />
          
          {/* World Objects */}
          <ObjectMarkers objects={worldObjects} />
          
          {/* Player */}
          <PlayerMarker position={playerPosition} rotation={playerRotation} />
        </Canvas>
        
        {/* Minimap border */}
        <div className="absolute inset-0 border-2 border-gray-500 rounded pointer-events-none" />
        
        {/* Compass */}
        <div className="absolute top-2 left-2 text-white text-xs">
          <div className="bg-black/50 rounded px-1">N</div>
        </div>
        
        {/* Scale indicator */}
        <div className="absolute bottom-2 right-2 text-white text-xs">
          <div className="bg-black/50 rounded px-1">
            {Math.round(terrainSize)}u
          </div>
        </div>
        
        {/* Expand/collapse hint */}
        <div className="absolute bottom-2 left-2 text-gray-400 text-xs">
          <div className="bg-black/50 rounded px-1">
            {isExpanded ? (showLegend ? '📖' : '🗺️') : '+'}
          </div>
        </div>
      </div>
      
      {/* Legend Panel - Only show when expanded and legend is toggled */}
      {isExpanded && showLegend && (
        <div className="absolute top-0 left-full ml-2 w-48 bg-black/95 border border-gray-700 rounded text-white text-xs z-40">
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Map Legend</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLegend(false);
                }}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Terrain</h4>
              <div className="space-y-1">
                {TERRAIN_LEGEND.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm border border-gray-600"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="text-white">{item.label}</div>
                      <div className="text-gray-400 text-xs">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-300 mb-2">Objects</h4>
              <div className="space-y-1">
                {OBJECT_LEGEND.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-sm border border-gray-600"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="text-white">{item.label}</div>
                      <div className="text-gray-400 text-xs">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Collapse button when expanded */}
      {isExpanded && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(false);
            setShowLegend(false);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full flex items-center justify-center text-white text-xs z-40"
        >
          ×
        </button>
      )}
    </Card>
  );
}