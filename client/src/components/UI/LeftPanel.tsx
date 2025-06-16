import { useWorldObjects } from "../../lib/stores/useWorldObjects";
import { useEducation } from "../../lib/stores/useEducation";
import { PREFAB_TYPES } from "../../types/education";

export function LeftPanel() {
  const { selectedPrefab, setSelectedPrefab, isPlacementMode, setPlacementMode } = useWorldObjects();
  const { student } = useEducation();
  
  const handlePrefabSelect = (prefabId: string) => {
    const prefabType = PREFAB_TYPES.find(p => p.id === prefabId);
    if (!prefabType) return;
    
    // Check if student has required level
    if (student.level < prefabType.requiredLevel) {
      alert(`You need level ${prefabType.requiredLevel} to place ${prefabType.name}`);
      return;
    }
    
    // Toggle placement mode
    if (selectedPrefab === prefabId && isPlacementMode) {
      setSelectedPrefab(null);
      setPlacementMode(false);
    } else {
      setSelectedPrefab(prefabId);
      setPlacementMode(true);
    }
  };
  
  const cancelPlacement = () => {
    setSelectedPrefab(null);
    setPlacementMode(false);
  };
  
  return (
    <div className="fixed left-4 top-4 bottom-4 w-64 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 p-4 z-50">
      <div className="text-white/90 font-semibold text-lg mb-6 text-center">
        🏗️ Build Objects
      </div>
      
      {isPlacementMode && (
        <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
          <div className="text-blue-200 text-sm mb-2">Placement Mode Active</div>
          <div className="text-blue-100 text-xs mb-3">Click on the grid to place your object</div>
          <button
            onClick={cancelPlacement}
            className="w-full px-3 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
      
      <div className="space-y-3">
        {PREFAB_TYPES.map((prefab) => {
          const isUnlocked = student.level >= prefab.requiredLevel;
          const isSelected = selectedPrefab === prefab.id;
          
          return (
            <button
              key={prefab.id}
              onClick={() => handlePrefabSelect(prefab.id)}
              disabled={!isUnlocked}
              className={`
                w-full p-3 rounded-lg border transition-all duration-200
                ${isSelected 
                  ? 'bg-blue-500/30 border-blue-400/50 text-blue-100' 
                  : isUnlocked 
                    ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white/90' 
                    : 'bg-gray-500/10 border-gray-500/20 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: isUnlocked ? prefab.color : '#666' }}
                />
                <div className="flex-1 text-left">
                  <div className="font-medium">{prefab.name}</div>
                  <div className="text-xs opacity-70">{prefab.description}</div>
                  {!isUnlocked && (
                    <div className="text-xs text-yellow-400 mt-1">
                      🔒 Level {prefab.requiredLevel} required
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-white/70 text-sm mb-2">Instructions:</div>
        <ul className="text-white/60 text-xs space-y-1">
          <li>• WASD to move Nina</li>
          <li>• A/D to turn left/right</li>
          <li>• Mouse wheel to zoom camera</li>
          <li>• Right-click drag to rotate view</li>
          <li>• Click placed objects to remove</li>
        </ul>
      </div>
    </div>
  );
}
