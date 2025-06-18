import { useState } from "react";
import { useEnvironment } from "../../lib/stores/useEnvironment";
import { useBuildMode } from "../../lib/stores/useBuildMode";
import { useWorldObjects } from "../../lib/stores/useWorldObjects";
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
    console.log('Selected building type:', buildingId);
  };

  // Educational building types
  const educationalBuildings = [
    { id: 'school', name: 'School', color: '#4A90E2', description: 'Main educational building' },
    { id: 'coding-lab', name: 'Coding Lab', color: '#50C878', description: 'Programming workspace' },
    { id: 'house', name: 'House', color: '#FF6B6B', description: 'Residential building' }
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Card className="w-80 bg-black/80 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Building Palette</CardTitle>
          <CardDescription className="text-gray-300">
            Select buildings to place in {theme?.name || 'Current Environment'}
          </CardDescription>
        </CardHeader>
        
        <div className="p-4">
          <h3 className="text-sm font-semibold mb-3 text-yellow-400">Educational Buildings</h3>
          <div className="grid gap-2 mb-4">
            {educationalBuildings.map((building) => (
              <Button
                key={building.id}
                onClick={() => handleBuildingSelect(building.id)}
                variant={selectedBuildingType === building.id ? "default" : "outline"}
                className={`justify-start p-3 h-auto ${
                  selectedBuildingType === building.id
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center gap-3 w-full">
                  <div 
                    className="w-6 h-6 rounded flex-shrink-0"
                    style={{ backgroundColor: building.color }}
                  />
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{building.name}</div>
                    <div className="text-xs text-gray-400 truncate">{building.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          <Tabs value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-600">
              <TabsTrigger value="residential" className="text-xs data-[state=active]:bg-blue-600">
                🏠 Theme
              </TabsTrigger>
              <TabsTrigger value="commercial" className="text-xs data-[state=active]:bg-green-600">
                🏢 Commercial
              </TabsTrigger>
              <TabsTrigger value="decorative" className="text-xs data-[state=active]:bg-purple-600">
                🌳 Decorative
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedCategory} className="mt-4">
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {currentThemeBuildings.map((building: any) => (
                  <Button
                    key={building.id}
                    onClick={() => handleBuildingSelect(building.id)}
                    variant={selectedBuildingType === building.id ? "default" : "outline"}
                    className={`justify-start p-3 h-auto ${
                      selectedBuildingType === building.id
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div 
                        className="w-6 h-6 rounded flex-shrink-0"
                        style={{ backgroundColor: building.color }}
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{building.name}</div>
                        <div className="text-xs text-gray-400 truncate">{building.description}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-gray-600 text-gray-200">
                        Lv.{building.requiredLevel || 1}
                      </Badge>
                    </div>
                  </Button>
                ))}
                
                {currentThemeBuildings.length === 0 && (
                  <div className="text-center text-gray-400 py-4">
                    No buildings available for this environment
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
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
        console.log('Processing 3D model:', file.name);
      }
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-64 bg-black/80 border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-sm">Upload Buildings</CardTitle>
        </CardHeader>
        <div 
          className={`p-4 border-2 border-dashed m-4 rounded-lg transition-colors ${
            isDragging ? 'border-blue-400 bg-blue-900/20' : 'border-gray-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center text-gray-400 text-sm">
            Drop .glb/.gltf files here
          </div>
        </div>
      </Card>
    </div>
  );
}