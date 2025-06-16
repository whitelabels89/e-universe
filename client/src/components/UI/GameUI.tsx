import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { AvatarCustomizationPanel } from "./AvatarCustomizationPanel";
import { NotificationSystem } from "./NotificationSystem";
import { useUI } from "../../lib/stores/useUI";

export function GameUI() {
  const { showLeftPanel, showRightPanel, toggleLeftPanel, toggleRightPanel } = useUI();

  return (
    <>
      {showLeftPanel && <LeftPanel />}
      {showRightPanel && <RightPanel />}
      <AvatarCustomizationPanel />
      <NotificationSystem />
      
      {/* Panel Toggle Buttons */}
      <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
        <button
          onClick={toggleLeftPanel}
          className="bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg border border-white/20 p-2 text-white transition-colors"
          title="Toggle Left Panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <button
          onClick={toggleRightPanel}
          className="bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-lg border border-white/20 p-2 text-white transition-colors"
          title="Toggle Right Panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>
      
      {/* Top Status Bar */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 px-6 py-2 z-40">
        <div className="text-white/90 text-sm font-medium">
          3D Educational World - Explore, Learn, Build!
        </div>
      </div>
      
      {/* Bottom Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 px-4 py-2 z-40">
        <div className="text-white/70 text-xs text-center">
          WASD to move • A/D to turn • Mouse wheel to zoom • Right-click drag to rotate camera • Click to place buildings
        </div>
      </div>
    </>
  );
}
