import React, { useEffect } from "react";
import { useEnvironment } from "../../lib/stores/useEnvironment";
import { useEducation } from "../../lib/stores/useEducation";
import { Button } from "@/components/ui/button";
import { X, Mountain, Sun, Cloud, Unlock, Lock } from "lucide-react";

export function EnvironmentPanel() {
  const { student } = useEducation();
  const {
    showEnvironmentPanel,
    currentTheme,
    currentWeather,
    themes,
    weatherConditions,
    setTheme,
    setWeather,
    toggleEnvironmentPanel,
    getCurrentTheme,
    getCurrentWeather,
    loadFromStorage
  } = useEnvironment();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  if (!showEnvironmentPanel) return null;

  const activeTheme = getCurrentTheme();
  const activeWeather = getCurrentWeather();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Mountain className="w-6 h-6 text-blue-400" />
              <h2 className="text-white text-2xl font-bold">Environment Settings</h2>
            </div>
            <button
              onClick={toggleEnvironmentPanel}
              className="text-white/70 hover:text-white text-2xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Current Selection Preview */}
          <div className="flex items-center gap-4 p-4 bg-white/10 rounded-lg">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: activeTheme.backgroundColor }}
            >
              {activeTheme.emoji}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">{activeTheme.name}</h3>
              <p className="text-gray-300 text-sm">{activeTheme.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl">{activeWeather.emoji}</span>
                <span className="text-gray-300 text-sm">{activeWeather.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Environment Themes */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mountain className="w-5 h-5 text-blue-400" />
                <h3 className="text-white text-lg font-bold">World Themes</h3>
              </div>
              
              <div className="grid gap-3">
                {themes.map((theme) => {
                  const isLocked = !theme.isUnlocked && student.level < theme.requiredLevel;
                  const isActive = currentTheme === theme.id;
                  
                  return (
                    <button
                      key={theme.id}
                      onClick={() => !isLocked && setTheme(theme.id)}
                      disabled={isLocked}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isActive
                          ? 'border-blue-400 bg-blue-600/20'
                          : isLocked
                          ? 'border-gray-600 bg-gray-800/30 cursor-not-allowed opacity-60'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                          style={{ 
                            backgroundColor: isLocked ? '#666' : theme.backgroundColor,
                            background: isLocked ? '#666' : `linear-gradient(135deg, ${theme.backgroundColor}, ${theme.skyColors[1] || theme.backgroundColor})`
                          }}
                        >
                          {theme.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{theme.name}</h4>
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : theme.isUnlocked ? (
                              <Unlock className="w-4 h-4 text-green-400" />
                            ) : null}
                          </div>
                          <p className="text-gray-300 text-sm">{theme.description}</p>
                          {isLocked && (
                            <p className="text-yellow-400 text-xs mt-1">
                              Requires Level {theme.requiredLevel}
                            </p>
                          )}
                        </div>
                        {isActive && (
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Weather Conditions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sun className="w-5 h-5 text-yellow-400" />
                <h3 className="text-white text-lg font-bold">Weather</h3>
              </div>
              
              <div className="grid gap-3">
                {weatherConditions.map((weather) => {
                  const isLocked = !weather.isUnlocked;
                  const isActive = currentWeather === weather.id;
                  
                  return (
                    <button
                      key={weather.id}
                      onClick={() => !isLocked && setWeather(weather.id)}
                      disabled={isLocked}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isActive
                          ? 'border-yellow-400 bg-yellow-600/20'
                          : isLocked
                          ? 'border-gray-600 bg-gray-800/30 cursor-not-allowed opacity-60'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xl">
                          {weather.emoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{weather.name}</h4>
                            {isLocked ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Unlock className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-300 mt-1">
                            <span>Light: {Math.round(weather.lightIntensity * 100)}%</span>
                            <span>Fog: {Math.round(weather.fogDensity * 1000)}</span>
                            {weather.hasParticles && (
                              <span>Effects: {weather.particleType}</span>
                            )}
                          </div>
                          {isLocked && (
                            <p className="text-yellow-400 text-xs mt-1">
                              Complete challenges to unlock
                            </p>
                          )}
                        </div>
                        {isActive && (
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Weather Info */}
              <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-400/30">
                <h4 className="text-blue-200 font-medium mb-2">Weather Effects</h4>
                <div className="text-blue-200 text-sm space-y-1">
                  <div>• Changes lighting and visibility</div>
                  <div>• Adds atmospheric particles</div>
                  <div>• Includes ambient sounds</div>
                  <div>• Affects gameplay dynamics</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 border-t border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-gray-300 text-sm">
              Current Level: {student.level} • Unlocked Themes: {themes.filter(t => t.isUnlocked).length}/{themes.length}
            </div>
            <Button
              onClick={toggleEnvironmentPanel}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Apply Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}