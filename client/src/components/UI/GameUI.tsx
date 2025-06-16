import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { AvatarCustomizationPanel } from "./AvatarCustomizationPanel";

export function GameUI() {
  return (
    <>
      <LeftPanel />
      <RightPanel />
      <AvatarCustomizationPanel />
      
      {/* Top Status Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 px-6 py-2 z-50">
        <div className="text-white/90 text-sm font-medium">
          🌟 3D Educational World - Explore, Learn, Build!
        </div>
      </div>
      
      {/* Bottom Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 px-4 py-2 z-50">
        <div className="text-white/70 text-xs text-center">
          Use WASD to move Nina • Mouse to look around • Click objects in left panel to place them
        </div>
      </div>
    </>
  );
}
