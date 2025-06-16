import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import { useEducation } from "./lib/stores/useEducation";
import { useWorldObjects } from "./lib/stores/useWorldObjects";
import "@fontsource/inter";

// Import our game components
import { Avatar } from "./components/Avatar";
import { GridWorld } from "./components/GridWorld";
import { PrefabObjects } from "./components/PrefabObjects";
import { GameUI } from "./components/UI/GameUI";
import { PREFAB_TYPES } from "./types/education";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward'
}

const keyMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.leftward, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.rightward, keys: ['KeyD', 'ArrowRight'] },
];

// Lighting component
function Lights() {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light for shadows and depth */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />
    </>
  );
}

// Loading fallback component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-600 to-purple-700 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-white text-2xl font-bold mb-4">🌍 Loading Educational World...</div>
        <div className="text-white/70">Preparing your 3D learning environment</div>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

// Main App component
function App() {
  const { student } = useEducation();
  const { 
    selectedPrefab, 
    isPlacementMode, 
    addObject, 
    setPlacementMode, 
    setSelectedPrefab,
    loadFromStorage 
  } = useWorldObjects();

  // Load saved objects on app start
  useEffect(() => {
    loadFromStorage();
    console.log("Educational World App initialized");
  }, [loadFromStorage]);

  // Handle grid clicks for object placement
  const handleGridClick = (position: [number, number, number]) => {
    if (!isPlacementMode || !selectedPrefab) return;
    
    const prefabType = PREFAB_TYPES.find(p => p.id === selectedPrefab);
    if (!prefabType) return;
    
    // Check if student can place this object
    const isUnlocked = student.level >= prefabType.requiredLevel;
    
    // Add object to world
    addObject({
      type: prefabType.type,
      position,
      isUnlocked,
      requiredLevel: prefabType.requiredLevel
    });
    
    // Exit placement mode
    setPlacementMode(false);
    setSelectedPrefab(null);
    
    console.log(`Placed ${prefabType.name} at position:`, position);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={keyMap}>
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{
            position: [0, 5, 8],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
          style={{ background: 'linear-gradient(to bottom, #87CEEB, #98FB98)' }}
        >
          {/* Sky background */}
          <color attach="background" args={["#87CEEB"]} />
          
          {/* Fog for depth */}
          <fog attach="fog" args={["#87CEEB", 20, 100]} />

          {/* Lighting setup */}
          <Lights />

          {/* 3D Scene Components */}
          <Suspense fallback={null}>
            {/* World Grid */}
            <GridWorld size={10} onGridClick={handleGridClick} />
            
            {/* Player Avatar */}
            <Avatar position={[0, 0.5, 0]} />
            
            {/* Placed Objects */}
            <PrefabObjects />
          </Suspense>

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={20}
            minDistance={3}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 0, 0]}
          />
        </Canvas>

        {/* UI Overlay */}
        <GameUI />
      </KeyboardControls>
    </div>
  );
}

export default App;
