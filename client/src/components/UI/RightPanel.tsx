import { useEducation } from "../../lib/stores/useEducation";
import { useWorldObjects } from "../../lib/stores/useWorldObjects";

export function RightPanel() {
  const { student } = useEducation();
  const { objects } = useWorldObjects();
  
  return (
    <div className="fixed right-4 top-20 bg-black/60 backdrop-blur-sm rounded-lg p-3 text-white text-sm z-40 max-w-64">
      <h3 className="font-bold mb-2">📊 Campus Status</h3>
      <div className="text-xs text-white/70 space-y-1">
        <div className="flex justify-between">
          <span>Objects Placed:</span>
          <span className="text-white">{objects.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Current Level:</span>
          <span className="text-white">{student.level}</span>
        </div>
        <div className="flex justify-between">
          <span>Active Module:</span>
          <span className="text-white text-xs">{student.activeModule}</span>
        </div>
      </div>
    </div>
  );
}