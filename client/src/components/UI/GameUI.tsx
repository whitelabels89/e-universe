import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { AvatarCustomizationPanel } from "./AvatarCustomizationPanel";
import { NotificationSystem } from "./NotificationSystem";

export function GameUI() {
  return (
    <>
      <LeftPanel />
      <RightPanel />
      <AvatarCustomizationPanel />
      <NotificationSystem />
      
      {/* Top Status Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 px-6 py-2 z-50">
        <div className="text-white/90 text-sm font-medium">
          🌟 3D Educational World - Explore, Learn, Build!
        </div>
      </div>
      
      {/* Bottom Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 px-4 py-2 z-50">
        <div className="text-white/70 text-xs text-center">
          WASD to move • A/D to turn • Mouse wheel to zoom • Right-click drag to rotate camera • Click to place buildings
        </div>
      </div>
    </>
  );
}
