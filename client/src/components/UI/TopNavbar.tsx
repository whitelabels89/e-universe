import React, { useState } from "react";
import { Button } from "./button";
import { Separator } from "./separator";
import { useCampus } from "../../lib/stores/useCampus";
import { useEducation } from "../../lib/stores/useEducation";
import { useBuildMode } from "../../lib/stores/useBuildMode";
import { useWorldObjects } from "../../lib/stores/useWorldObjects";
import { useAvatarCustomization } from "../../lib/stores/useAvatarCustomization";
import { useEnvironment } from "../../lib/stores/useEnvironment";
import { useUniverseSettings } from "../../lib/stores/useUniverseSettings";
import { 
  User, Building2, Settings, Gamepad2, Home, BookOpen, Trophy, Coins, 
  Menu, ChevronDown, ChevronUp, MoreHorizontal, Palette, School,
  Hammer, Square, Circle, Triangle, Star, Target, Mountain
} from "lucide-react";
import { PREFAB_TYPES } from "../../types/education";

interface TopNavbarProps {
  onPythonToggle?: () => void;
}

export function TopNavbar({ onPythonToggle }: TopNavbarProps = {}) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isNavbarVisible, setIsNavbarVisible] = useState<boolean>(true);
  const [isNavbarMinimized, setIsNavbarMinimized] = useState<boolean>(false);
  const [showBuildMenu, setShowBuildMenu] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showEnvironmentMenu, setShowEnvironmentMenu] = useState<boolean>(false);
  
  const { 
    currentInterior, 
    selectedBuilding,
    isInsideBuilding 
  } = useCampus();
  
  const { 
    isBuildMode, 
    toggleBuildMode,
    viewMode,
    setViewMode,
    selectedBuildingType,
    setSelectedBuildingType
  } = useBuildMode();
  
  const { 
    student,
    addScore,
    setActiveModule
  } = useEducation();

  const {
    selectedPrefab,
    setSelectedPrefab,
    isPlacementMode,
    setPlacementMode,
    objects,
    clearAll
  } = useWorldObjects();

  const {
    customization,
    toggleCustomizationPanel,
    startWizard
  } = useAvatarCustomization();

  const {
    toggleEnvironmentPanel,
    getCurrentTheme,
    getCurrentWeather,
    setTheme,
    setWeather
  } = useEnvironment();

  const {
    settings,
    updateUniverseName,
    updateUniverseSubtitle,
    loadFromStorage: loadUniverseSettings
  } = useUniverseSettings();

  // Load settings on component mount
  React.useEffect(() => {
    loadUniverseSettings();
  }, [loadUniverseSettings]);

  const tabs = [
    {
      id: "home",
      label: "Home",
      icon: <Home className="w-4 h-4" />,
      description: "Main View"
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-4 h-4" />,
      description: "Student Profile"
    },
    {
      id: "building",
      label: "Build Mode",
      icon: <Building2 className="w-4 h-4" />,
      description: "Build & Edit",
      active: isBuildMode
    },
    {
      id: "game",
      label: "Games",
      icon: <Gamepad2 className="w-4 h-4" />,
      description: "Mini Games"
    },
    {
      id: "library",
      label: "Learning",
      icon: <BookOpen className="w-4 h-4" />,
      description: "Study Materials"
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Trophy className="w-4 h-4" />,
      description: "Progress & Rewards"
    },
    {
      id: "environment",
      label: "Environment",
      icon: <Mountain className="w-4 h-4" />,
      description: "World Themes"
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      description: "Game Settings"
    }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    
    // Close all menus first
    setShowBuildMenu(false);
    setShowProfileMenu(false);
    setShowSettingsMenu(false);
    setShowEnvironmentMenu(false);
    
    if (tabId === "building") {
      if (!isBuildMode) {
        toggleBuildMode();
      }
      setShowBuildMenu(true);
    } else if (tabId === "profile") {
      setShowProfileMenu(true);
    } else if (tabId === "environment") {
      setShowEnvironmentMenu(true);
    } else if (tabId === "settings") {
      setShowSettingsMenu(true);
    } else if (isBuildMode && tabId !== "building") {
      toggleBuildMode();
    }
  };

  const handlePrefabSelect = (prefabId: string) => {
    const prefabType = PREFAB_TYPES.find(p => p.id === prefabId);
    if (!prefabType) return;
    
    if (student.level < prefabType.requiredLevel) {
      alert(`You need level ${prefabType.requiredLevel} to place ${prefabType.name}`);
      return;
    }
    
    if (selectedPrefab === prefabId && isPlacementMode) {
      setSelectedPrefab(null);
      setPlacementMode(false);
    } else {
      setSelectedPrefab(prefabId);
      setPlacementMode(true);
    }
  };

  if (isNavbarMinimized) {
    return (
      <div className="fixed top-2 left-2 z-50">
        <Button
          onClick={() => setIsNavbarMinimized(false)}
          className="bg-gray-900/80 hover:bg-gray-800 text-white p-2"
          size="sm"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 min-w-0">
        {/* Menu Button Only */}
        <div className="flex items-center flex-shrink-0">
          <Button
            onClick={() => setIsNavbarMinimized(true)}
            className="bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white p-1"
            size="sm"
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
        </div>

        {/* Scrollable Navigation with Title */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
          <div className="flex items-center gap-3 min-w-max">
            {/* Universe Title */}
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-800/50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
              <div className="flex flex-col min-w-0">
                <input
                  type="text"
                  value={settings.universeName}
                  onChange={(e) => updateUniverseName(e.target.value)}
                  className="text-sm font-bold text-white bg-transparent border-none focus:outline-none focus:bg-white/10 rounded px-1 transition-all"
                  placeholder="Universe"
                  maxLength={15}
                  style={{ width: `${Math.max(6, settings.universeName.length * 0.6)}rem` }}
                />
                <input
                  type="text"
                  value={settings.universeSubtitle}
                  onChange={(e) => updateUniverseSubtitle(e.target.value)}
                  className="text-xs text-gray-400 bg-transparent border-none focus:outline-none focus:bg-white/10 rounded px-1 transition-all"
                  placeholder="Subtitle"
                  maxLength={12}
                  style={{ width: `${Math.max(4, settings.universeSubtitle.length * 0.6)}rem` }}
                />
              </div>
            </div>

            {/* Separator */}
            <div className="w-px h-6 bg-gray-600 flex-shrink-0"></div>

            {/* Python Editor Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onPythonToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-white hover:bg-white/10"
            >
              <span>🐍</span>
              <span className="hidden sm:inline">Python</span>
            </Button>

            {/* Navigation Tabs */}
            {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id || tab.active ? "default" : "ghost"}
              size="sm"
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                activeTab === tab.id || tab.active 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
              title={tab.description}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
              {tab.active && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">
                  Active
                </span>
              )}
            </Button>
            ))}
          </div>
        </div>

        {/* User Info & Status */}
        <div className="flex items-center gap-4">
          {/* Current Location */}
          <div className="text-sm text-gray-300">
            {isInsideBuilding && selectedBuilding ? (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{selectedBuilding.name}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Campus Outdoor</span>
              </div>
            )}
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-700" />

          {/* Student Stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-white font-medium">
                Level {student.level}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">
                {student.totalScore}
              </span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8 bg-gray-700" />

          {/* Profile Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {student.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">{student.name}</div>
              <div className="text-gray-400 text-xs">{student.activeModule}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menus */}
      {showBuildMenu && (
        <div className="absolute top-full left-4 mt-2 bg-gray-900 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-80 z-50 shadow-xl">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Build Mode Controls
          </h3>
          
          {/* View Mode Selection */}
          <div className="mb-4">
            <label className="text-gray-200 text-sm mb-2 block font-medium">View Mode:</label>
            <div className="flex gap-2">
              {(['free', 'top'] as const).map((mode) => (
                <Button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  variant={viewMode === mode ? "default" : "outline"}
                  size="sm"
                  className={`capitalize ${
                    viewMode === mode 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  {mode}
                </Button>
              ))}
            </div>
          </div>

          {/* Build Objects */}
          <div className="mb-4">
            <label className="text-gray-200 text-sm mb-2 block font-medium">Build Objects:</label>
            <div className="grid grid-cols-3 gap-2">
              {PREFAB_TYPES.map((prefab) => (
                <Button
                  key={prefab.id}
                  onClick={() => handlePrefabSelect(prefab.id)}
                  size="sm"
                  className={`text-xs p-2 h-auto flex flex-col items-center gap-1 ${
                    selectedPrefab === prefab.id 
                      ? "bg-green-600 text-white border-green-600" 
                      : student.level >= prefab.requiredLevel
                      ? "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                      : "bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed"
                  }`}
                  disabled={student.level < prefab.requiredLevel}
                >
                  {prefab.type === 'school' && <School className="w-4 h-4" />}
                  {prefab.type === 'coding-lab' && <Hammer className="w-4 h-4" />}
                  {prefab.type === 'house' && <Home className="w-4 h-4" />}
                  <span className="text-white">{prefab.name}</span>
                  <span className="text-xs text-gray-300">Lv.{prefab.requiredLevel}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setPlacementMode(false)} 
              size="sm" 
              className="bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              Cancel Placement
            </Button>
            <Button 
              onClick={clearAll} 
              size="sm" 
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Clear All Objects
            </Button>
          </div>
        </div>
      )}

      {showProfileMenu && (
        <div className="absolute top-full right-4 mt-2 bg-gray-900 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-80 max-w-96 max-h-[70vh] overflow-y-auto z-50 shadow-xl md:min-w-80 sm:min-w-72 sm:right-2">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Student Profile
          </h3>
          
          {/* Profile Info */}
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">👧</span>
            </div>
            <h2 className="text-white text-xl font-bold">{customization.name}</h2>
            <div className="text-blue-300 text-sm">Educational Explorer</div>
          </div>

          {/* Experience & Progress */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Level {student.level}</span>
              <span className="text-gray-300 text-sm">{student.totalScore} XP</span>
            </div>
            <div className="w-full bg-gray-600/50 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(student.totalScore % 100)}%` }}
              />
            </div>
            <div className="text-gray-300 text-xs">
              {student.totalScore % 100}/100 XP to Level {student.level + 1}
            </div>
          </div>

          {/* Learning Module */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <h4 className="text-white font-medium mb-2">Active Module</h4>
            <div className="text-gray-300 text-sm mb-2">{student.activeModule}</div>
            <Button 
              onClick={() => setActiveModule("Web Development")} 
              size="sm" 
              className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Change Module
            </Button>
          </div>

          {/* Achievements */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <h4 className="text-white font-medium mb-2">Recent Achievements</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-300">First Building Placed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-gray-300">Library Visitor</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-purple-500" />
                <span className="text-gray-300">Learning Explorer</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-gray-300">Goal Setter</span>
              </div>
            </div>
          </div>

          {/* Student Stats */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <h4 className="text-white font-medium mb-2">Student Statistics</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center">
                <div className="text-white font-bold text-lg">{objects.length}</div>
                <div className="text-gray-300 text-xs">Buildings Built</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">12</div>
                <div className="text-gray-300 text-xs">Lessons Completed</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">8</div>
                <div className="text-gray-300 text-xs">Days Active</div>
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-lg">4</div>
                <div className="text-gray-300 text-xs">Achievements</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                  toggleCustomizationPanel();
                } else {
                  startWizard();
                }
              }} 
              size="sm" 
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Palette className="w-4 h-4" />
              {window.innerWidth <= 768 ? "Customize" : "Avatar Wizard"}
            </Button>
            <Button 
              onClick={toggleCustomizationPanel} 
              size="sm" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white hidden md:flex"
            >
              <User className="w-4 h-4" />
              Quick Edit
            </Button>
            <Button 
              onClick={() => addScore(50)} 
              size="sm" 
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              +50 XP
            </Button>
          </div>
        </div>
      )}

      {showEnvironmentMenu && (
        <div className="absolute top-full right-4 mt-2 bg-gray-900 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-80 z-50 shadow-xl">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Mountain className="w-4 h-4" />
            Environment Control
          </h3>
          
          {/* Current Environment Display */}
          <div className="mb-4 p-3 bg-white/10 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-lg"
                style={{ backgroundColor: getCurrentTheme()?.backgroundColor || "#87CEEB" }}
              >
                {getCurrentTheme()?.emoji || "🌾"}
              </div>
              <div>
                <div className="text-white font-medium text-sm">{getCurrentTheme()?.name || "Green Meadows"}</div>
                <div className="text-gray-300 text-xs">{getCurrentWeather()?.emoji || "☀️"} {getCurrentWeather()?.name || "Clear Sky"}</div>
              </div>
            </div>
          </div>

          {/* Quick Theme Buttons */}
          <div className="space-y-2 mb-4">
            <h4 className="text-gray-300 text-sm font-medium">Quick Themes:</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "grassland", emoji: "🌾", name: "Grass" },
                { id: "mountain", emoji: "🏔️", name: "Mountain" },
                { id: "desert", emoji: "🏜️", name: "Desert" }
              ].map((theme) => (
                <Button
                  key={theme.id}
                  size="sm"
                  className="bg-gray-700 text-gray-200 hover:bg-gray-600 text-xs p-2 flex flex-col items-center"
                  onClick={() => {
                    console.log("Quick theme button clicked:", theme.id);
                    setTheme(theme.id);
                    setShowEnvironmentMenu(false);
                  }}
                >
                  <span className="text-lg">{theme.emoji}</span>
                  <span className="text-xs">{theme.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <Button 
            onClick={toggleEnvironmentPanel}
            size="sm" 
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            Open Environment Panel
          </Button>
        </div>
      )}

      {showSettingsMenu && (
        <div className="absolute top-full right-4 mt-2 bg-gray-900 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-60 z-50 shadow-xl">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Game Settings
          </h3>
          
          <div className="space-y-2">
            <Button 
              size="sm" 
              className="w-full justify-start bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              Audio Settings
            </Button>
            <Button 
              size="sm" 
              className="w-full justify-start bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              Graphics Quality
            </Button>
            <Button 
              size="sm" 
              className="w-full justify-start bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              Controls Setup
            </Button>
            <Button 
              size="sm" 
              className="w-full justify-start bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
            >
              Language
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}