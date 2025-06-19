import { LeftPanel } from "./LeftPanel";
import { ResponsiveCustomizationInterface } from "./ResponsiveCustomizationInterface";
import { TouchOptimizedControls } from "./TouchOptimizedControls";
import { EnvironmentPanel } from "./EnvironmentPanel";
import { NotificationSystem } from "./NotificationSystem";
import { useUI } from "../../lib/stores/useUI";

export function GameUI() {
  return (
    <>
      <LeftPanel />
      <ResponsiveCustomizationInterface />
      <TouchOptimizedControls 
        onMove={(direction, active) => {
          // Handle movement controls
          console.log(`Mobile control: ${direction} ${active ? 'pressed' : 'released'}`);
        }}
        onRun={(active) => {
          console.log(`Run mode: ${active ? 'enabled' : 'disabled'}`);
        }}
        onJump={() => {
          console.log('Jump action');
        }}
        onInteract={() => {
          console.log('Interact action');
        }}
        onCameraToggle={() => {
          console.log('Camera toggle');
        }}
      />
      <EnvironmentPanel />
      <NotificationSystem />
      

      
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
