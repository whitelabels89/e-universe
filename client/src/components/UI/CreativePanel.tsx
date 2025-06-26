import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

export function CreativePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [blueprints, setBlueprints] = useState<any>({ shapes: {}, npcs: {} });

  const refreshBlueprints = () => {
    if (window.blueprintShapes && window.blueprintNPCs) {
      setBlueprints({
        shapes: { ...window.blueprintShapes },
        npcs: { ...window.blueprintNPCs }
      });
    }
  };

  const exportBlueprints = () => {
    if (window.creativeEngine) {
      const data = window.creativeEngine.exportBlueprints();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-creative-world.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const clearAll = () => {
    if (window.creativeEngine) {
      window.creativeEngine.clearAllCustomObjects();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true);
          refreshBlueprints();
        }}
        className="fixed bottom-20 right-4 z-40 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
        size="sm"
      >
        🎨 Creative Lab
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-20 right-4 z-40 w-80 max-h-96 bg-black/90 border-purple-500 text-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            🎨 Creative Lab
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="overflow-y-auto">
        <Tabs defaultValue="shapes" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="shapes" className="text-xs">
              📦 Shapes ({Object.keys(blueprints.shapes).length})
            </TabsTrigger>
            <TabsTrigger value="npcs" className="text-xs">
              🤖 NPCs ({Object.keys(blueprints.npcs).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="shapes" className="space-y-2 mt-3">
            <div className="text-xs text-gray-400 mb-2">Custom Shape Blueprints:</div>
            {Object.keys(blueprints.shapes).length === 0 ? (
              <div className="text-xs text-gray-500 italic">
                No custom shapes yet. Use define_shape() in Python!
              </div>
            ) : (
              Object.entries(blueprints.shapes).map(([name, shape]: [string, any]) => (
                <div key={name} className="bg-gray-800/50 rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{name}</span>
                    <Badge style={{ backgroundColor: shape.color }} className="text-xs">
                      {shape.color}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {shape.vertices?.length || 0} vertices • Height: {shape.height || 1}
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="npcs" className="space-y-2 mt-3">
            <div className="text-xs text-gray-400 mb-2">Custom NPC Blueprints:</div>
            {Object.keys(blueprints.npcs).length === 0 ? (
              <div className="text-xs text-gray-500 italic">
                No custom NPCs yet. Use define_npc() in Python!
              </div>
            ) : (
              Object.entries(blueprints.npcs).map(([name, npc]: [string, any]) => (
                <div key={name} className="bg-gray-800/50 rounded p-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{name}</span>
                    <Badge style={{ backgroundColor: npc.color }} className="text-xs">
                      {npc.color}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Scale: {npc.scale?.join('x') || '1x1x1'}
                  </div>
                  <div className="text-xs text-gray-300 mt-1 truncate">
                    "{npc.message}"
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-700">
          <Button
            onClick={refreshBlueprints}
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-gray-600 text-gray-300 hover:text-white"
          >
            🔄 Refresh
          </Button>
          <Button
            onClick={exportBlueprints}
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-gray-600 text-gray-300 hover:text-white"
          >
            💾 Export
          </Button>
          <Button
            onClick={clearAll}
            size="sm"
            variant="outline"
            className="flex-1 text-xs border-red-600 text-red-400 hover:text-red-300"
          >
            🗑️ Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}