import { useCampus } from "../../lib/stores/useCampus";
import { useEducation } from "../../lib/stores/useEducation";
import { useState } from "react";

export function CampusUI() {
  const { buildings, isInsideBuilding, selectedBuilding, exitBuilding } = useCampus();
  const { student } = useEducation();
  const [showCampusDetails, setShowCampusDetails] = useState(false);

  if (isInsideBuilding && selectedBuilding) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-black/80 border border-white/20 text-white max-w-md rounded-lg p-4">
          <div className="mb-3">
            <h2 className="text-xl font-bold">{selectedBuilding.name}</h2>
            <p className="text-gray-300 text-sm">
              {selectedBuilding.description}
            </p>
          </div>
          <div className="space-y-3">
            <div className="text-sm">
              <p>Selamat datang di {selectedBuilding.name}!</p>
              <p className="text-gray-400 mt-1">
                Gunakan WASD untuk bergerak di dalam ruangan.
              </p>
            </div>
            
            <button 
              onClick={exitBuilding}
              className="w-full bg-red-600/20 border border-red-400 text-white hover:bg-red-600/40 rounded px-4 py-2 text-sm"
            >
              🚪 Keluar dari Bangunan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <button 
        onClick={() => setShowCampusDetails(!showCampusDetails)}
        className="bg-blue-600/80 hover:bg-blue-600 border border-blue-400 text-white rounded-lg p-3 mb-2 text-sm font-medium"
      >
        🏫 Virtual Campus {showCampusDetails ? '▼' : '▲'}
      </button>

      {/* Details Panel */}
      {showCampusDetails && (
        <div className="bg-black/80 border border-white/20 text-white max-w-sm rounded-lg p-4">
          <div className="mb-3">
            <h2 className="text-lg font-bold">🏫 Virtual Campus</h2>
            <p className="text-gray-300 text-sm">
              Level {student.level} - {student.name}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-300 mb-3">
              Klik bangunan untuk masuk dan belajar!
            </p>
            
            {/* Available Buildings */}
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-green-400">Bangunan Tersedia:</h4>
              {buildings
                .filter(b => b.isUnlocked && student.level >= b.requiredLevel)
                .map(building => (
                  <div key={building.id} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: building.color }}
                    />
                    <span className="text-xs">{building.name}</span>
                  </div>
                ))
              }
            </div>

            {/* Locked Buildings */}
            {buildings.some(b => !b.isUnlocked || student.level < b.requiredLevel) && (
              <div className="space-y-1 mt-3">
                <h4 className="text-sm font-semibold text-yellow-400">Bangunan Terkunci:</h4>
                {buildings
                  .filter(b => !b.isUnlocked || student.level < b.requiredLevel)
                  .map(building => (
                    <div key={building.id} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded opacity-50"
                        style={{ backgroundColor: building.color }}
                      />
                      <span className="text-xs text-gray-500">{building.name}</span>
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        Level {building.requiredLevel}
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}