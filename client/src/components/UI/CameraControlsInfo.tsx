import { useState } from "react";
import { useCampus } from "../../lib/stores/useCampus";

export function CameraControlsInfo() {
  const [showInfo, setShowInfo] = useState(false);
  const { isInsideBuilding } = useCampus();

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40">
      <button 
        onClick={() => setShowInfo(!showInfo)}
        className="bg-gray-700/80 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
      >
        🎮 Controls {showInfo ? '▼' : '▲'}
      </button>

      {showInfo && (
        <div className="mt-2 bg-black/90 border border-white/20 text-white rounded-lg p-3 max-w-xs text-xs">
          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-yellow-400">Character Movement:</h4>
              <p>W - Move Forward</p>
              <p>S - Move Backward</p>
              <p>A - Turn Left</p>
              <p>D - Turn Right</p>
              <p>Shift - Run (hold)</p>
              <p>Space - Jump</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-blue-400">Camera Control:</h4>
              <p>Left Click + Drag - Rotate Camera</p>
              <p>Right Click + Drag - Rotate Camera</p>
              <p>Mouse Wheel - Zoom In/Out</p>
              <p>Middle Click - Disabled (prevents lock)</p>
              <p>Camera follows character when moving</p>
            </div>

            <div>
              <h4 className="font-semibold text-green-400">Mobile Controls:</h4>
              <p>Touch screen to show virtual controls</p>
              <p>Virtual joystick - Movement & rotation</p>
              <p>JUMP button - Jump action</p>
              <p>RUN button - Toggle running mode</p>
            </div>

            {isInsideBuilding && (
              <div>
                <h4 className="font-semibold text-green-400">Indoor Mode:</h4>
                <p>Closer camera for better interior view</p>
                <p>Limited zoom range</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}