import { useEducation } from "../../lib/stores/useEducation";
import { useWorldObjects } from "../../lib/stores/useWorldObjects";

export function RightPanel() {
  const { student, addScore, setActiveModule } = useEducation();
  const { objects, clearAll } = useWorldObjects();
  
  const modules = [
    "Digital Literacy",
    "Basic Programming", 
    "Web Development",
    "Data Science",
    "AI Fundamentals"
  ];
  
  const handleAddScore = () => {
    addScore(50);
  };
  
  const handleModuleChange = (module: string) => {
    setActiveModule(module);
  };
  
  const getProgressPercentage = () => {
    const currentLevelProgress = student.totalScore % 100;
    return currentLevelProgress;
  };
  
  return (
    <div className="fixed right-4 top-4 bottom-4 w-72 bg-black/20 backdrop-blur-md rounded-lg border border-white/10 p-4 z-50">
      {/* Student Profile Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <span className="text-2xl">👧</span>
        </div>
        <h2 className="text-white text-xl font-bold">{student.name}</h2>
        <div className="text-blue-300 text-sm">Educational Explorer</div>
      </div>
      
      {/* Level & Progress */}
      <div className="mb-6 p-4 bg-white/10 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/90 font-medium">Level {student.level}</span>
          <span className="text-white/70 text-sm">{student.totalScore} pts</span>
        </div>
        
        <div className="w-full bg-gray-600/50 rounded-full h-2 mb-2">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        
        <div className="text-white/60 text-xs text-center">
          {100 - getProgressPercentage()} points to next level
        </div>
      </div>
      
      {/* Active Module */}
      <div className="mb-6">
        <div className="text-white/90 font-medium mb-2">Active Module</div>
        <select 
          value={student.activeModule}
          onChange={(e) => handleModuleChange(e.target.value)}
          className="w-full p-2 bg-white/10 border border-white/20 rounded text-white/90 text-sm"
        >
          {modules.map((module) => (
            <option key={module} value={module} className="bg-gray-800">
              {module}
            </option>
          ))}
        </select>
      </div>
      
      {/* Unlocked Areas */}
      <div className="mb-6">
        <div className="text-white/90 font-medium mb-2">Unlocked Areas</div>
        <div className="space-y-1">
          {student.unlockedAreas.map((area) => (
            <div key={area} className="flex items-center space-x-2 text-sm">
              <span className="text-green-400">✓</span>
              <span className="text-white/80 capitalize">{area.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* World Statistics */}
      <div className="mb-6">
        <div className="text-white/90 font-medium mb-2">World Stats</div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Objects Placed:</span>
            <span className="text-white/90">{objects.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Tasks Completed:</span>
            <span className="text-white/90">{student.completedTasks.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Exploration:</span>
            <span className="text-white/90">{Math.round((student.unlockedAreas.length / 3) * 100)}%</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleAddScore}
          className="w-full px-4 py-2 bg-green-500/80 hover:bg-green-500 text-white rounded text-sm transition-colors"
        >
          Complete Task (+50 pts)
        </button>
        
        <button
          onClick={clearAll}
          className="w-full px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded text-sm transition-colors"
        >
          Clear All Objects
        </button>
      </div>
      
      {/* Achievement Hints */}
      <div className="mt-4 p-3 bg-purple-500/20 rounded-lg border border-purple-400/30">
        <div className="text-purple-200 text-xs font-medium mb-1">💡 Hint</div>
        <div className="text-purple-100 text-xs">
          {student.level < 2 
            ? "Reach level 2 to unlock the Coding Lab!" 
            : "Great! You can now place all objects. Keep exploring!"
          }
        </div>
      </div>
    </div>
  );
}
