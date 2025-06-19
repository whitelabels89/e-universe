import { useEffect, useRef, useState } from 'react';
import { Button } from './UI/button';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { Textarea } from './UI/textarea';

interface PythonEditorProps {
  onExecute?: (code: string) => void;
  isVisible?: boolean;
}

export function PythonEditor({ onExecute, isVisible = false }: PythonEditorProps) {
  const [code, setCode] = useState(`# Welcome to the Creative Game Engine!
# Define a new shape and spawn it
define_shape("trapezoid", {
  "vertices": [[0,0], [2,0], [1.5,1], [0.5,1]],
  "color": "orange"
})
spawn_custom("trapezoid", x=0, y=0, z=0)

# Define a custom NPC
define_npc("dino_guard", {
  "mesh": "/models/nina_avatar.glb",
  "scale": [2,2,2],
  "message": "Aku penjaga dari masa lalu!"
})
spawn_npc("dino_guard", x=3, y=0, z=0)
`);

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
    <div className="fixed left-4 top-20 w-96 max-h-[80vh] z-50">
      <Card className="bg-black/90 border-blue-500/30 text-white">
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
            
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm bg-gray-900 border-gray-600 text-green-400 h-64 resize-none"
              placeholder="Write your Python code here..."
            />
          </div>

          {/* Output Console */}
          <div className="space-y-2">
            <span className="text-sm text-gray-300">📺 Output</span>
            <div className="bg-gray-900 border border-gray-600 rounded p-3 h-32 overflow-y-auto font-mono text-xs">
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