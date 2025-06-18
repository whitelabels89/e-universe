import { useEffect, useState } from 'react';
import { Badge } from './badge';
import { TerrainPhysics } from '../PhysicsWorld';

interface TerrainIndicatorProps {
  position: [number, number, number];
}

const TERRAIN_COLORS: Record<string, string> = {
  grass: 'bg-green-600',
  stone: 'bg-gray-600',
  sand: 'bg-yellow-600',
  water: 'bg-blue-600',
  mud: 'bg-amber-800',
  rock: 'bg-stone-600',
  dirt: 'bg-amber-700',
  asphalt: 'bg-gray-800',
  wood: 'bg-amber-600',
  trampoline: 'bg-purple-600',
  bouncy: 'bg-pink-600',
  ice: 'bg-cyan-400',
  concrete: 'bg-gray-700',
  metal: 'bg-zinc-600',
  rubber: 'bg-red-600',
  quicksand: 'bg-orange-800',
  lava: 'bg-red-800',
};

const TERRAIN_DESCRIPTIONS: Record<string, string> = {
  grass: 'Normal jumping',
  stone: 'Slightly reduced jump',
  sand: 'Heavy, reduced jump',
  water: 'No jumping possible',
  mud: 'Very heavy, poor jump',
  rock: 'Reduced jump height',
  dirt: 'Slightly reduced jump',
  asphalt: 'Enhanced jump',
  wood: 'Normal jumping',
  trampoline: 'Super bounce!',
  bouncy: 'High bounce',
  ice: 'Slippery but good jump',
  concrete: 'Normal jumping',
  metal: 'Enhanced jump',
  rubber: 'Good bounce',
  quicksand: 'Extremely difficult',
  lava: 'Too dangerous to jump',
};

export function TerrainIndicator({ position }: TerrainIndicatorProps) {
  const [currentTerrain, setCurrentTerrain] = useState('grass');
  const [jumpMultiplier, setJumpMultiplier] = useState(1.0);

  useEffect(() => {
    const terrain = TerrainPhysics.getTerrainType(position);
    const multiplier = TerrainPhysics.getJumpMultiplier(terrain);
    
    if (terrain !== currentTerrain) {
      setCurrentTerrain(terrain);
      setJumpMultiplier(multiplier);
    }
  }, [position, currentTerrain]);

  const getMultiplierColor = (multiplier: number) => {
    if (multiplier === 0) return 'text-red-400';
    if (multiplier < 0.7) return 'text-orange-400';
    if (multiplier < 1.0) return 'text-yellow-400';
    if (multiplier > 1.5) return 'text-green-400';
    return 'text-white';
  };

  return (
    <div className="fixed top-4 left-4 z-30 space-y-2">
      <Badge 
        className={`${TERRAIN_COLORS[currentTerrain] || 'bg-gray-600'} text-white px-3 py-1`}
      >
        {currentTerrain.charAt(0).toUpperCase() + currentTerrain.slice(1)}
      </Badge>
      
      <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
        <div className="flex items-center gap-2">
          <span>Jump:</span>
          <span className={getMultiplierColor(jumpMultiplier)}>
            {jumpMultiplier === 0 ? 'Disabled' : `${(jumpMultiplier * 100).toFixed(0)}%`}
          </span>
        </div>
        <div className="text-gray-300 text-xs mt-1">
          {TERRAIN_DESCRIPTIONS[currentTerrain] || 'Unknown terrain'}
        </div>
      </div>
    </div>
  );
}