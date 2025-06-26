import { useEffect, useRef, useState } from 'react';
import { Button } from './UI/button';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Textarea } from './UI/textarea';

interface PythonEditorProps {
  onExecute?: (code: string) => void;
  isVisible?: boolean;
}

const defaultCode = `# 🎮 Creative Game Engine - Build Your World!
# Create custom shapes, NPCs, and entire worlds with Python!

print("🚀 Welcome to Creative Game Engine!")
print("Let's create amazing custom objects!")

# 📦 Create custom shapes
define_shape("trapezoid", {
  "vertices": [[0,0], [2,0], [1.5,1], [0.5,1]],
  "color": "orange",
  "height": 1.5
})

define_shape("star", {
  "vertices": [[0,1], [0.2,0.2], [1,0], [0.3,-0.2], [0.5,-1], [0,-0.3], [-0.5,-1], [-0.3,-0.2], [-1,0], [-0.2,0.2]],
  "color": "gold",
  "height": 0.5
})

define_shape("rocket", {
  "vertices": [[0,0], [0.5,0], [0.4,2], [0.2,2.5], [0,3], [-0.2,2.5], [-0.4,2], [-0.5,0]],
  "color": "silver",
  "height": 0.8
})

# 🤖 Create custom NPCs
define_npc("dino_guard", {
  "scale": [2, 2, 2],
  "message": "Aku penjaga dari masa lalu! Rawr!",
  "color": "darkgreen"
})

define_npc("robot_helper", {
  "scale": [1.5, 1.5, 1.5],
  "message": "Beep boop! Aku robot penolong!",
  "color": "cyan"
})

define_npc("fairy_guide", {
  "scale": [0.8, 0.8, 0.8],
  "message": "✨ Aku peri yang akan membimbing perjalananmu!",
  "color": "pink"
})

# 🎯 Spawn your creations (auto-positioned in front of you!)
spawn_custom("trapezoid")
spawn_custom("star") 
spawn_custom("rocket")

spawn_npc("dino_guard")
spawn_npc("robot_helper")
spawn_npc("fairy_guide")

# Or specify exact positions if needed:
# spawn_custom("trapezoid", x=0, y=1, z=0)
# 
# Or use helper functions for positioning:
# pos = get_spawn_position_front(5)  # 5 units in front
# spawn_npc("special_npc", x=pos[0], y=pos[1], z=pos[2])

# 📋 List your blueprints
list_blueprints()

# 🌍 Environment & traditional objects
set_theme("grassland")
spawn_box(color="red")    # Auto-positioned!
spawn_sphere(color="blue")  # Auto-positioned!

print("🎨 Your creative world is ready!")
print("Try creating more shapes and NPCs!")

# 💡 Ideas to try:
# - Create a house shape with windows
# - Make a wizard NPC with special powers
# - Design a spaceship or castle
# - Build an entire village with custom NPCs!`;

export function PythonEditor({ onExecute, isVisible = false }: PythonEditorProps) {
  const [code, setCode] = useState(defaultCode);

  const [output, setOutput] = useState<string[]>([
    '🐍 Python 3D Editor Ready',
    '💡 Write code to control the 3D world',
    '🚀 Click Run to execute your script'
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunScript = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    addOutput('🏃 Executing Python script...');
    
    try {
      // Execute the Python code
      if (onExecute) {
        onExecute(code);
      }
      
      // Simulate Python execution feedback
      addOutput('✅ Script executed successfully!');
      addOutput('🎮 3D world updated');
      
    } catch (error) {
      addOutput(`❌ Error: ${error}`, 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const addOutput = (message: string, type: 'normal' | 'error' = 'normal') => {
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${message}`;
    setOutput(prev => [...prev.slice(-10), formattedMessage]); // Keep last 10 messages
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-4 top-20 w-[500px] h-[85vh] z-50 overflow-y-auto">
      <Card className="bg-black/90 border-blue-500/30 text-white"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#4B5563 #1F2937'
            }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-blue-400 flex items-center gap-2">
            🐍 Python 3D Editor
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Code Editor */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">📝 main.py</span>
              <Button
                onClick={handleRunScript}
                disabled={isRunning}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRunning ? '⏳ Running...' : '▶ Run Script'}
              </Button>
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-80 font-mono text-sm bg-gray-900 border border-gray-600 text-green-400 resize-none p-3 rounded focus:outline-none focus:border-blue-500"
              style={{ 
                overflow: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: '#4B5563 #1F2937'
              }}
              placeholder="Write your Python code here..."
              spellCheck={false}
            />
          </div>

          {/* Output Console */}
          <div className="space-y-2">
            <span className="text-sm text-gray-300">📺 Output</span>
            <div className="bg-gray-900 border border-gray-600 rounded p-3 h-32 overflow-y-auto font-mono text-xs"
                 style={{
                   scrollbarWidth: 'thin',
                   scrollbarColor: '#4B5563 #1F2937'
                 }}>
              {output.map((line, index) => (
                <div key={index} className="text-gray-300 mb-1">
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => setCode(`# Clear the 3D world
clear_scene()
print("🧹 World cleared!")`)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              🧹 Clear World
            </Button>
            <Button
              onClick={() => setCode(`# Reset to default
spawn_box(0, 1, 0, 'red')
spawn_sphere(2, 1, 0, 'blue')
set_background('darkblue')
print("🔄 World reset!")`)}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              🔄 Reset
            </Button>
          </div>

          {/* Keyboard Shortcut Info */}
          <div className="text-xs text-gray-500 text-center">
            💡 Pro tip: Use Ctrl+Enter to run script
          </div>
        </CardContent>
      </Card>
    </div>
  );
}