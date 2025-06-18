import { useState } from "react";
import { useEnvironment } from "../../lib/stores/useEnvironment";
import { useBuildMode } from "../../lib/stores/useBuildMode";
import { BUILDING_TEMPLATES } from "../BuildingSystem";
import { Button } from "./button";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Badge } from "./badge";

export function BuildingPalette() {
  const { getCurrentTheme } = useEnvironment();
  const { isBuildMode, selectedBuildingType, setSelectedBuildingType } = useBuildMode();
  const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial' | 'decorative'>('residential');
  const theme = getCurrentTheme();

  if (!isBuildMode) return null;

  const currentThemeBuildings = (BUILDING_TEMPLATES[selectedCategory] as any)[theme?.id || 'grassland'] || [];

  const handleBuildingSelect = (buildingId: string) => {
    if (selectedBuildingType === buildingId) {
      setSelectedBuildingType(null);
    } else {
      setSelectedBuildingType(buildingId);
    }
  };

  return (
    <div className="fixed left-4 top-24 w-80 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 z-50 max-h-[70vh] overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
          🏗️ Building Palette
        </h3>
        <Badge variant="outline" className="text-xs">
          Theme: {theme?.name || 'Default'}
        </Badge>
      </div>

      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="residential" className="text-xs">🏠 Home</TabsTrigger>
          <TabsTrigger value="commercial" className="text-xs">🏢 Business</TabsTrigger>
          <TabsTrigger value="decorative" className="text-xs">🌳 Decorative</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-2">
          <div className="text-white text-sm mb-3 flex items-center justify-between">
            <span>Available Buildings:</span>
            <Badge variant="secondary" className="text-xs">
              {currentThemeBuildings.length} items
            </Badge>
          </div>
          
          {currentThemeBuildings.map((building: any) => (
            <Card 
              key={building.id}
              className={`cursor-pointer transition-all hover:bg-gray-700 hover:scale-105 ${
                selectedBuildingType === building.id 
                  ? 'border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-600 bg-gray-800'
              }`}
              onClick={() => handleBuildingSelect(building.id)}
            >
              <CardHeader className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      🏗️
                      {building.name}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs mt-1">
                      {building.description}
                    </CardDescription>
                  </div>
                  {selectedBuildingType === building.id && (
                    <div className="text-blue-400 text-xs">✓ Selected</div>
                  )}
                </div>
                <div className="flex gap-1 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedCategory}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {theme?.name || 'Default'}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}

          {currentThemeBuildings.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-8 border border-gray-600 rounded-lg border-dashed">
              <div className="text-2xl mb-2">🏗️</div>
              <div>No buildings available</div>
              <div className="text-xs mt-1">Try switching themes or categories</div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-4 space-y-3">
        <div className="p-3 bg-gray-800 rounded border border-gray-600">
          <h4 className="text-white text-sm font-bold mb-2 flex items-center gap-2">
            💡 Building Controls:
          </h4>
          <div className="text-gray-300 text-xs space-y-1">
            <div className="flex justify-between">
              <span>Select:</span>
              <span className="text-white">Click building</span>
            </div>
            <div className="flex justify-between">
              <span>Place:</span>
              <span className="text-white">Click terrain</span>
            </div>
            <div className="flex justify-between">
              <span>Remove:</span>
              <span className="text-white">Right-click object</span>
            </div>
            <div className="flex justify-between">
              <span>Cancel:</span>
              <span className="text-white">ESC key</span>
            </div>
          </div>
        </div>

        <div className="p-3 bg-green-900/30 rounded border border-green-600">
          <h4 className="text-green-200 text-sm font-bold mb-2 flex items-center gap-2">
            🎯 Smart Features:
          </h4>
          <div className="text-green-300 text-xs space-y-1">
            <div>• Auto surface snapping</div>
            <div>• Collision detection</div>
            <div>• Theme adaptation</div>
            <div>• Physics simulation</div>
          </div>
        </div>

        <div className="p-3 bg-purple-900/30 rounded border border-purple-600">
          <h4 className="text-purple-200 text-sm font-bold mb-2 flex items-center gap-2">
            🎨 Customization:
          </h4>
          <div className="text-purple-300 text-xs space-y-1">
            <div>• Upload .glb/.gltf models</div>
            <div>• Custom textures</div>
            <div>• Multiple categories</div>
            <div>• Theme variations</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuildingUploader() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.name.endsWith('.glb') || file.name.endsWith('.gltf')) {
        console.log('3D Model uploaded:', file.name);
        // Handle 3D model upload
      } else if (file.type.startsWith('image/')) {
        console.log('Texture uploaded:', file.name);
        // Handle texture upload
      }
    });
  };

  return (
    <div className="fixed right-4 bottom-4 w-64 bg-black/90 backdrop-blur-sm border border-gray-600 rounded-lg p-4 z-50">
      <h3 className="text-white font-bold text-sm mb-3">📁 Upload Assets</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-900/30' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-gray-400 text-xs mb-2">
          Drag & Drop:
        </div>
        <div className="text-white text-xs space-y-1">
          <div>• .glb/.gltf models</div>
          <div>• .png/.jpg textures</div>
          <div>• Custom buildings</div>
        </div>
      </div>

      <Button 
        className="w-full mt-3 text-xs" 
        variant="outline"
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.multiple = true;
          input.accept = '.glb,.gltf,.png,.jpg,.jpeg';
          input.onchange = (e) => {
            const files = Array.from((e.target as HTMLInputElement).files || []);
            files.forEach(file => console.log('File selected:', file.name));
          };
          input.click();
        }}
      >
        Browse Files
      </Button>
    </div>
  );
}