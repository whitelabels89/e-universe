import React, { useState, useEffect } from "react";
import { useAvatarCustomization } from "../../lib/stores/useAvatarCustomization";
import { useEnvironment } from "../../lib/stores/useEnvironment";
import { useUniverseSettings } from "../../lib/stores/useUniverseSettings";
import { useEducation } from "../../lib/stores/useEducation";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { Button } from "./button";
import { Separator } from "./separator";
import { 
  X, User, Palette, Mountain, Settings, Save, RotateCcw, 
  Smartphone, Eye, Heart, Shirt, Sparkles, Monitor
} from "lucide-react";

interface TabContent {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export function MobileCustomizationDrawer() {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("avatar");
  const [isVisible, setIsVisible] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const {
    customization,
    showCustomizationPanel,
    toggleCustomizationPanel,
    updateCustomization,
    saveCustomization
  } = useAvatarCustomization();

  const {
    getCurrentTheme,
    getCurrentWeather,
    setTheme,
    setWeather,
    themes,
    weatherConditions
  } = useEnvironment();

  const {
    settings,
    updateUniverseName,
    updateUniverseSubtitle,
    updatePlayerName
  } = useUniverseSettings();

  const { student } = useEducation();

  useEffect(() => {
    setIsVisible(showCustomizationPanel && isMobile);
  }, [showCustomizationPanel, isMobile]);

  // Touch handling for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY) return;
    const touchY = e.touches[0].clientY;
    const diff = touchStartY - touchY;

    // If swiping down significantly, close drawer
    if (diff < -100) {
      toggleCustomizationPanel();
      setTouchStartY(null);
    }
  };

  // Avatar Customization Tab
  const AvatarTab = () => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <User className="w-4 h-4" />
          Basic Information
        </h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Character Name</label>
            <input
              type="text"
              value={customization.name}
              onChange={(e) => updateCustomization({ name: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter character name"
            />
          </div>
          
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Nickname</label>
            <input
              type="text"
              value={customization.nickname}
              onChange={(e) => updateCustomization({ nickname: e.target.value })}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              placeholder="Enter nickname"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Appearance
        </h3>
        
        {/* Body Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Body Color</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                "#FFDBAC", "#F1C27D", "#E0AC69", "#C68642",
                "#8D5524", "#654321", "#FFCC80", "#FFB74D"
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => updateCustomization({ bodyColor: color, headColor: color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    customization.bodyColor === color ? "border-white scale-110" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Hair Color</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                "#8D6E63", "#5D4037", "#3E2723", "#FFE082",
                "#FF8A65", "#A1887F", "#000000", "#795548"
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => updateCustomization({ hairColor: color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    customization.hairColor === color ? "border-white scale-110" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Hair Style */}
        <div>
          <label className="text-gray-300 text-sm mb-2 block">Hair Style</label>
          <div className="grid grid-cols-3 gap-2">
            {["short", "medium", "long"].map((style) => (
              <button
                key={style}
                onClick={() => updateCustomization({ hairStyle: style as any })}
                className={`p-3 rounded-lg border transition-all capitalize ${
                  customization.hairStyle === style
                    ? "border-blue-500 bg-blue-600/20 text-blue-300"
                    : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clothing */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Shirt className="w-4 h-4" />
          Clothing
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gray-300 text-sm mb-2 block">Style</label>
            <div className="space-y-2">
              {["casual", "formal", "sporty"].map((style) => (
                <button
                  key={style}
                  onClick={() => updateCustomization({ clothingStyle: style as any })}
                  className={`w-full p-3 rounded-lg border transition-all capitalize ${
                    customization.clothingStyle === style
                      ? "border-blue-500 bg-blue-600/20 text-blue-300"
                      : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-2 block">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                "#FF6B6B", "#4ECDC4", "#45B7D1",
                "#96CEB4", "#FFEAA7", "#DDA0DD",
                "#98D8C8", "#F7DC6F"
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => updateCustomization({ clothingColor: color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    customization.clothingColor === color ? "border-white scale-110" : "border-gray-600"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personality */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Personality
        </h3>
        
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "creative", label: "Creative", emoji: "🎨" },
            { id: "logical", label: "Logical", emoji: "🧠" },
            { id: "social", label: "Social", emoji: "👥" },
            { id: "adventurous", label: "Adventurous", emoji: "🗺️" }
          ].map((personality) => (
            <button
              key={personality.id}
              onClick={() => updateCustomization({ personality: personality.id as any })}
              className={`p-3 rounded-lg border transition-all ${
                customization.personality === personality.id
                  ? "border-purple-500 bg-purple-600/20 text-purple-300"
                  : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              <div className="text-lg mb-1">{personality.emoji}</div>
              <div className="text-sm">{personality.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Environment Tab
  const EnvironmentTab = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <Mountain className="w-4 h-4" />
        World Themes
      </h3>

      <div className="space-y-4">
        {themes.filter(theme => theme.isUnlocked || student.level >= theme.requiredLevel).map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              getCurrentTheme()?.id === theme.id
                ? "border-blue-500 bg-blue-600/20"
                : "border-gray-600 bg-gray-800 hover:bg-gray-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: theme.backgroundColor }}
              >
                {theme.emoji}
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium">{theme.name}</h4>
                <p className="text-gray-300 text-sm">{theme.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <h3 className="text-white font-semibold flex items-center gap-2 mt-8">
        <Sparkles className="w-4 h-4" />
        Weather Effects
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {weatherConditions.filter(weather => weather.isUnlocked).map((weather) => (
          <button
            key={weather.id}
            onClick={() => setWeather(weather.id)}
            className={`p-4 rounded-lg border transition-all ${
              getCurrentWeather()?.id === weather.id
                ? "border-yellow-500 bg-yellow-600/20 text-yellow-300"
                : "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <div className="text-2xl mb-2">{weather.emoji}</div>
            <div className="text-sm font-medium">{weather.name}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // Universe Settings Tab
  const UniverseTab = () => (
    <div className="space-y-6">
      <h3 className="text-white font-semibold flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Universe Settings
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-gray-300 text-sm mb-1 block">Universe Name</label>
          <input
            type="text"
            value={settings.universeName}
            onChange={(e) => updateUniverseName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter universe name"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Universe Subtitle</label>
          <input
            type="text"
            value={settings.universeSubtitle}
            onChange={(e) => updateUniverseSubtitle(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter subtitle"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm mb-1 block">Player Name</label>
          <input
            type="text"
            value={settings.playerName}
            onChange={(e) => updatePlayerName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Enter player name"
          />
        </div>

        {/* Quick Theme Colors */}
        <div className="mt-6">
          <label className="text-gray-300 text-sm mb-2 block">Theme Colors</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              "#4A90E2", "#50C878", "#FF6B6B", "#FFA500",
              "#9B59B6", "#1ABC9C", "#E74C3C", "#F39C12"
            ].map((color) => (
              <button
                key={color}
                onClick={() => {
                  // Update theme color (this would need to be implemented in the store)
                  console.log("Theme color selected:", color);
                }}
                className="w-12 h-12 rounded-lg border-2 border-gray-600 hover:border-white transition-all"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs: TabContent[] = [
    {
      id: "avatar",
      label: "Avatar",
      icon: <User className="w-4 h-4" />,
      component: <AvatarTab />
    },
    {
      id: "environment",
      label: "World",
      icon: <Mountain className="w-4 h-4" />,
      component: <EnvironmentTab />
    },
    {
      id: "universe",
      label: "Universe",
      icon: <Settings className="w-4 h-4" />,
      component: <UniverseTab />
    }
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={toggleCustomizationPanel}
      />
      
      {/* Drawer */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-xl max-h-[90vh] flex flex-col"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {/* Handle */}
        <div className="flex-shrink-0 w-12 h-1 bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
        
        {/* Header */}
        <div className="flex-shrink-0 px-4 pb-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-bold">Customize</h2>
            <Button
              onClick={toggleCustomizationPanel}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-1 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
        
        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex gap-3">
            <Button
              onClick={() => {
                // Reset to defaults
                console.log("Reset to defaults");
              }}
              variant="outline"
              className="flex-1 text-gray-300 border-gray-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={() => {
                saveCustomization();
                toggleCustomizationPanel();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}