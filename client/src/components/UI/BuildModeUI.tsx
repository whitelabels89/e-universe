import { useBuildMode, ViewMode } from "../../lib/stores/useBuildMode";
import { CAMPUS_BUILDINGS } from "../../types/campus";

export function BuildModeUI() {
  const { 
    isBuildMode, 
    viewMode, 
    selectedBuildingType,
    toggleBuildMode, 
    setViewMode, 
    setSelectedBuildingType 
  } = useBuildMode();

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Build Mode Toggle */}
      <button 
        onClick={toggleBuildMode}
        className={`mb-3 px-4 py-2 rounded-lg font-medium text-sm ${
          isBuildMode 
            ? 'bg-orange-600 hover:bg-orange-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isBuildMode ? '🔨 Exit Build Mode' : '🏗️ Build Mode'}
      </button>

      {/* Build Mode Panel */}
      {isBuildMode && (
        <div className="bg-black/80 border border-white/20 text-white rounded-lg p-4 max-w-xs">
          {/* View Mode Selector */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Camera View</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { mode: 'free' as ViewMode, label: 'Free View', icon: '🎥' },
                { mode: 'top' as ViewMode, label: '2D Top', icon: '🗺️' },
                { mode: 'bird' as ViewMode, label: 'Bird View', icon: '🦅' },
                { mode: 'normal' as ViewMode, label: 'Normal', icon: '👁️' }
              ].map(({ mode, label, icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-xs rounded ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Building Type Selector */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">Building Type</h3>
            <div className="space-y-1">
              {CAMPUS_BUILDINGS.map((building) => (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuildingType(
                    selectedBuildingType === building.type ? null : building.type
                  )}
                  className={`w-full text-left px-3 py-2 text-xs rounded flex items-center gap-2 ${
                    selectedBuildingType === building.type
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: building.color }}
                  />
                  {building.name}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-400">
            <p className="mb-1">1. Select camera view</p>
            <p className="mb-1">2. Choose building type</p>
            <p className="mb-1">3. Click grid to place</p>
            <p>Ghost preview shows placement</p>
          </div>

          {/* Scene Builder Link */}
          <a
            href="/scene-builder.html"
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 px-3 py-2 text-xs rounded bg-purple-600 hover:bg-purple-700 text-center"
          >
            🚧 Open Scene Builder
          </a>
        </div>
      )}
    </div>
  );
}