import { useState } from 'react';
import { Card, CardContent } from './card';
import { Button } from './button';
import { TerrainPhysics } from '../PhysicsWorld';

interface DebugPanelProps {
  position: [number, number, number];
  isJumping: boolean;
  velocity: number;
}

export function DebugPanel({ position, isJumping, velocity }: DebugPanelProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-30 bg-gray-800/90 text-white text-xs"
        size="sm"
      >
        Debug
      </Button>
    );
  }

  const terrainHeight = TerrainPhysics.getGroundHeight(position);
  const terrainType = TerrainPhysics.getTerrainType(position);
  const jumpMultiplier = TerrainPhysics.getJumpMultiplier(terrainType);

  return (
    <Card className="fixed bottom-4 left-4 z-30 w-64 bg-black/90 border-gray-700 text-white text-xs">
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Debug Info</h3>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-1 h-6"
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-1">
          <div>Position: ({position[0].toFixed(2)}, {position[1].toFixed(2)}, {position[2].toFixed(2)})</div>
          <div>Terrain Height: {terrainHeight.toFixed(2)}</div>
          <div>Height Diff: {(position[1] - terrainHeight).toFixed(2)}</div>
          <div>Terrain: {terrainType} (×{jumpMultiplier})</div>
          <div>Jumping: {isJumping ? 'Yes' : 'No'}</div>
          <div>Velocity: {velocity.toFixed(2)}</div>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <div className={`text-xs ${
            Math.abs(position[1] - terrainHeight) < 0.2 ? 'text-green-400' : 'text-red-400'
          }`}>
            Ground Status: {Math.abs(position[1] - terrainHeight) < 0.2 ? 'Properly Positioned' : 'Floating/Sinking'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}