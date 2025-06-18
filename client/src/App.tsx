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
import { CameraTutorial } from "./components/UI/CameraTutorial";
import { TutorialHints } from "./components/UI/TutorialHints";
import { TerrainIndicator } from "./components/UI/TerrainIndicator";
import { TerrainVisualizer } from "./components/TerrainVisualizer";
import { DebugPanel } from "./components/UI/DebugPanel";
import { MobileControls } from "./components/UI/MobileControls";
import { TopNavbar } from "./components/UI/TopNavbar";
import { CampusBuildings } from "./components/CampusBuildings";
import { InteriorEnvironment } from "./components/InteriorEnvironment";
import { EnvironmentRenderer } from "./components/EnvironmentRenderer";
import { BuildModeCamera } from "./components/BuildModeCamera";
import { BuildPreviewGhost } from "./components/BuildPreviewGhost";
import { BuildingSystem } from "./components/BuildingSystem";
import { PhysicsWorld } from "./components/PhysicsWorld";
import { PythonEditor } from "./components/PythonEditor";
import { PythonBridge } from "./components/PythonBridge";
import { DynamicSky } from "./components/DynamicSky";
import { TimeOfDayController } from "./components/TimeOfDayController";
import { TimeControls } from "./components/UI/TimeControls";
import { InteractiveCameraController } from "./components/InteractiveCameraController";
import { CameraControls } from "./components/UI/CameraControls";
import { PREFAB_TYPES } from "./types/education";

// Define control keys for the game
enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  jump = "jump",
  run = "run",
}

const keyMap = [
  { name: Controls.forward, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.backward, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.leftward, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rightward, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.jump, keys: ["Space"] },
  { name: Controls.run, keys: ["ShiftLeft", "ShiftRight"] },
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
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
    </>
  );
}

// Loading fallback component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-600 to-purple-700 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="text-white text-2xl font-bold mb-4">
          🌍 Loading Educational World...
        </div>
        <div className="text-white/70">
          Preparing your 3D learning environment
        </div>
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
    loadFromStorage,
  } = useWorldObjects();
  const { loadFromStorage: loadAvatarCustomization } = useAvatarCustomization();
  const { isInsideBuilding } = useCampus();

  // Avatar transform state for camera following
  const [avatarPosition, setAvatarPosition] = useState<
    [number, number, number]
  >([0, 2, 0]);
  const [avatarRotation, setAvatarRotation] = useState(0);
  const [avatarMoving, setAvatarMoving] = useState(false);
  const [avatarJumping, setAvatarJumping] = useState(false);
  const [avatarVelocity, setAvatarVelocity] = useState(0);
  const [isPythonEditorOpen, setIsPythonEditorOpen] = useState(false);
  const [pythonExecutor, setPythonExecutor] = useState<
    ((code: string) => void) | null
  >(null);
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

    const prefabType = PREFAB_TYPES.find((p) => p.id === selectedPrefab);
    if (!prefabType) return;

    // Check if student can place this object
    const isUnlocked = student.level >= prefabType.requiredLevel;

    // Add object to world
    addObject({
      type: prefabType.type,
      position,
      isUnlocked,
      requiredLevel: prefabType.requiredLevel,
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
    jumping?: boolean,
    velocity?: number
  ) => {
    setAvatarPosition(pos);
    setAvatarRotation(rot);
    setAvatarMoving(moving);
    if (jumping !== undefined) setAvatarJumping(jumping);
    if (velocity !== undefined) setAvatarVelocity(velocity);
  };

  const handlePythonExecute = (code: string) => {
    if (pythonExecutor) {
      pythonExecutor(code);
    }
  };

  const togglePythonEditor = () => {
    setIsPythonEditorOpen(!isPythonEditorOpen);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <KeyboardControls map={keyMap}>
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{
            position: [0, 6, 8],
            fov: 45,
            near: 0.1,
            far: 80,
          }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            pixelRatio: Math.min(window.devicePixelRatio, 1),
          }}
          style={{ background: "linear-gradient(to bottom, #87CEEB, #98FB98)" }}
        >
          {/* Dynamic Sky and Lighting System */}
          <DynamicSky />
          
          {/* Time of Day Controller */}
          <TimeOfDayController />

          {/* Physics World Wrapper */}
          <PhysicsWorld>
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
                  <Terrain size={100} />
                  
                  {/* Terrain Visualizer for Jump Zones */}
                  <TerrainVisualizer size={100} />

                  {/* World Grid */}
                  <GridWorld size={100} onGridClick={handleGridClick} />

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
          </PhysicsWorld>

          {/* Build Mode Camera Controller */}
          <BuildModeCamera />

          {/* Python Bridge for 3D World Control */}
          <PythonBridge
            onCodeExecute={(executor) => setPythonExecutor(() => executor)}
          />

          {/* Interactive Camera Controller */}
          <InteractiveCameraController
            targetPosition={avatarPosition}
            targetRotation={avatarRotation}
            moving={avatarMoving}
          />
        </Canvas>

        {/* Top Navigation Bar */}
        <TopNavbar onPythonToggle={togglePythonEditor} />

        {/* UI Overlay */}
        <TerrainIndicator position={avatarPosition} />
        <DebugPanel 
          position={avatarPosition} 
          isJumping={avatarJumping}
          velocity={avatarVelocity}
        />
        <GameUI />
        <CampusUI />
        <MobileControls />

        {/* Python Editor Panel */}
        <PythonEditor
          isVisible={isPythonEditorOpen}
          onExecute={handlePythonExecute}
        />
        
        {/* Time of Day Controls */}
        <TimeControls />
        
        {/* Camera Controls */}
        <CameraControls />
      </KeyboardControls>
    </div>
  );
}

export default App;
