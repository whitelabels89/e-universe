import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useAudio } from "./lib/stores/useAudio";
import { useEducation } from "./lib/stores/useEducation";
import { useWorldObjects } from "./lib/stores/useWorldObjects";
import { useAvatarCustomization } from "./lib/stores/useAvatarCustomization";
import { useCampus } from "./lib/stores/useCampus";
import "@fontsource/inter";

// Import our game components
import { Avatar } from "./components/Avatar";
import { AnimatedAvatar } from "./components/AnimatedAvatar";
import { FollowCamera } from "./components/FollowCamera";
import { GridWorld } from "./components/GridWorld";
import { PrefabObjects } from "./components/PrefabObjects";
import { Terrain } from "./components/Terrain";
import { BuildSystem } from "./components/BuildSystem";
import { GameUI } from "./components/UI/GameUI";
import { AdaptiveLayoutManager } from "./components/UI/AdaptiveLayoutManager";
import { CampusUI } from "./components/UI/CampusUI";
import { BuildModeUI } from "./components/UI/BuildModeUI";
import { CameraControlsInfo } from "./components/UI/CameraControlsInfo";
import { MobileControls } from "./components/UI/MobileControls";
import { TopNavbar } from "./components/UI/TopNavbar";
import { CampusBuildings } from "./components/CampusBuildings";
import { InteriorEnvironment } from "./components/InteriorEnvironment";
import { EnvironmentRenderer } from "./components/EnvironmentRenderer";
import { BuildModeCamera } from "./components/BuildModeCamera";
import { BuildPreviewGhost } from "./components/BuildPreviewGhost";
import { PREFAB_TYPES } from "./types/education";

// Define control keys for the game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  leftward = 'leftward',
  rightward = 'rightward',
  jump = 'jump',
  run = 'run'
}

const keyMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.leftward, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.rightward, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.jump, keys: ['Space'] },
  { name: Controls.run, keys: ['ShiftLeft', 'ShiftRight'] },
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
  const { loadFromStorage: loadAvatarCustomization } = useAvatarCustomization();
  const { isInsideBuilding } = useCampus();

  // Avatar transform state for camera following
  const [avatarPosition, setAvatarPosition] = useState<[number, number, number]>([0, 2, 0]);
  const [avatarRotation, setAvatarRotation] = useState(0);
  const [avatarMoving, setAvatarMoving] = useState(false);
  const controlsRef = useRef<any>(null);

  // Load saved data on app start
  useEffect(() => {
    loadFromStorage();
    loadAvatarCustomization();
    console.log("Educational World App initialized");
  }, [loadFromStorage, loadAvatarCustomization]);

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

  const handleAvatarMove = (
    pos: [number, number, number],
    rot: number,
    moving: boolean,
  ) => {
    setAvatarPosition(pos);
    setAvatarRotation(rot);
    setAvatarMoving(moving);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KeyboardControls map={keyMap}>
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{
            position: [0, 15, 20],
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
            {isInsideBuilding ? (
              /* Interior Environment */
              <>
                <InteriorEnvironment />
                <AnimatedAvatar onMove={handleAvatarMove} />
              </>
            ) : (
              /* Outdoor Campus */
              <>
                {/* Realistic Terrain */}
                <Terrain size={50} />
                
                {/* World Grid */}
                <GridWorld size={50} onGridClick={handleGridClick} />
                
                {/* Campus Buildings */}
                <CampusBuildings />
                
                {/* Build Preview Ghost */}
                <BuildPreviewGhost />
                
                {/* Player Avatar */}
                <AnimatedAvatar onMove={handleAvatarMove} />
                
                {/* Placed Objects */}
                <PrefabObjects />
                
                {/* Build System */}
                <BuildSystem />
              </>
            )}
          </Suspense>

          {/* Build Mode Camera Controller */}
          <BuildModeCamera />

          {/* Camera follow component */}
          <FollowCamera
            position={avatarPosition}
            rotation={avatarRotation}
            moving={avatarMoving}
            controls={controlsRef}
          />

          {/* Camera Controls - Enhanced for better drag control */}
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            mouseButtons={{ 
              LEFT: THREE.MOUSE.ROTATE,
              RIGHT: THREE.MOUSE.ROTATE 
            }}
            screenSpacePanning={false}
            touches={{ 
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_ROTATE 
            }}
            maxDistance={isInsideBuilding ? 12 : 40}
            minDistance={isInsideBuilding ? 2 : 5}
            maxPolarAngle={Math.PI / 2.1}
            minPolarAngle={Math.PI / 8}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={isInsideBuilding ? 1.0 : 0.8}
            zoomSpeed={1.2}
            autoRotate={false}
          />
        </Canvas>

        {/* Top Navigation Bar */}
        <TopNavbar />

        {/* UI Overlay */}
        <GameUI />
        <CampusUI />
        <MobileControls />
      </KeyboardControls>
    </div>
  );
}

export default App;
