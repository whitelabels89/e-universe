import { useCampus } from "../../lib/stores/useCampus";
import { useBuildMode } from "../../lib/stores/useBuildMode";

export function LeftPanel() {
  const { isInsideBuilding } = useCampus();
  const { isBuildMode } = useBuildMode();

  // Simplified left panel - most functionality moved to navbar
  if (isInsideBuilding) {
    return (
      <div className="fixed left-4 top-20 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm z-40 max-w-64">
        <h3 className="font-bold mb-2">🏢 Inside Building</h3>
        <div className="text-xs text-white/70 space-y-1">
          <div>⌨️ WASD: Move around</div>
          <div>🖱️ Mouse: Look around</div>
          <div>🚪 ESC: Exit building</div>
        </div>
      </div>
    );
  }

  if (!isBuildMode) {
    return null; // Hide when not in build mode and not inside building
  }

  return (
    <div className="fixed left-4 top-20 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm z-40 max-w-64">
      <h3 className="font-bold mb-2">🏗️ Build Mode Active</h3>
      <div className="text-xs text-white/70 space-y-1">
        <div>Use the top navbar for build controls</div>
        <div>🖱️ Click: Place objects</div>
        <div>⌨️ WASD: Move character</div>
      </div>
    </div>
  );
}