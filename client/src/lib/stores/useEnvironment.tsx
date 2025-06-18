import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface EnvironmentTheme {
  id: string;
  name: string;
  description: string;
  emoji: string;
  
  // Visual Settings
  backgroundColor: string;
  fogColor: string;
  fogDensity: number;
  
  // Lighting
  ambientLightColor: string;
  ambientLightIntensity: number;
  directionalLightColor: string;
  directionalLightIntensity: number;
  
  // Sky/Background
  skyType: 'gradient' | 'image' | 'procedural';
  skyColors: string[];
  skyImage?: string;
  
  // Terrain
  terrainColor: string;
  terrainTexture?: string;
  
  // Unlocked status
  isUnlocked: boolean;
  requiredLevel: number;
}

export interface WeatherCondition {
  id: string;
  name: string;
  emoji: string;
  
  // Visual effects
  fogDensity: number;
  lightIntensity: number;
  
  // Particle effects
  hasParticles: boolean;
  particleType?: 'rain' | 'snow' | 'dust' | 'leaves';
  particleCount: number;
  
  // Sound effects
  ambientSound?: string;
  
  isUnlocked: boolean;
}

interface EnvironmentState {
  currentTheme: string;
  currentWeather: string;
  showEnvironmentPanel: boolean;
  
  themes: EnvironmentTheme[];
  weatherConditions: WeatherCondition[];
  
  // Actions
  setTheme: (themeId: string) => void;
  setWeather: (weatherId: string) => void;
  toggleEnvironmentPanel: () => void;
  unlockTheme: (themeId: string) => void;
  unlockWeather: (weatherId: string) => void;
  getCurrentTheme: () => EnvironmentTheme;
  getCurrentWeather: () => WeatherCondition;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const DEFAULT_THEMES: EnvironmentTheme[] = [
  {
    id: "grassland",
    name: "Green Meadows",
    description: "Peaceful grasslands with rolling hills",
    emoji: "🌾",
    backgroundColor: "#87CEEB",
    fogColor: "#B6E5D8",
    fogDensity: 0.01,
    ambientLightColor: "#FFF8DC",
    ambientLightIntensity: 0.6,
    directionalLightColor: "#FFF8DC",
    directionalLightIntensity: 1.0,
    skyType: "gradient",
    skyColors: ["#87CEEB", "#98FB98", "#F0E68C"],
    terrainColor: "#228B22",
    terrainTexture: "/textures/grass.png",
    isUnlocked: true,
    requiredLevel: 1
  },
  {
    id: "mountain",
    name: "Mountain Peaks",
    description: "Majestic mountains with crisp air",
    emoji: "🏔️",
    backgroundColor: "#4682B4",
    fogColor: "#B0C4DE",
    fogDensity: 0.02,
    ambientLightColor: "#E6E6FA",
    ambientLightIntensity: 0.7,
    directionalLightColor: "#F5F5DC",
    directionalLightIntensity: 1.2,
    skyType: "gradient",
    skyColors: ["#4682B4", "#87CEEB", "#E0E6FF"],
    terrainColor: "#696969",
    terrainTexture: "/textures/wood.jpg",
    isUnlocked: true,
    requiredLevel: 1
  },
  {
    id: "desert",
    name: "Golden Desert",
    description: "Vast sandy dunes under blazing sun",
    emoji: "🏜️",
    backgroundColor: "#DEB887",
    fogColor: "#F4A460",
    fogDensity: 0.015,
    ambientLightColor: "#FFE4B5",
    ambientLightIntensity: 0.8,
    directionalLightColor: "#FFA500",
    directionalLightIntensity: 1.5,
    skyType: "gradient",
    skyColors: ["#DEB887", "#F4A460", "#FFE4B5"],
    terrainColor: "#F4A460",
    terrainTexture: "/textures/sand.jpg",
    isUnlocked: true,
    requiredLevel: 0
  },
  {
    id: "island",
    name: "Tropical Island",
    description: "Paradise island surrounded by crystal waters",
    emoji: "🏝️",
    backgroundColor: "#00CED1",
    fogColor: "#AFEEEE",
    fogDensity: 0.005,
    ambientLightColor: "#F0FFFF",
    ambientLightIntensity: 0.9,
    directionalLightColor: "#FFE4B5",
    directionalLightIntensity: 1.3,
    skyType: "gradient",
    skyColors: ["#00CED1", "#40E0D0", "#AFEEEE"],
    terrainColor: "#DEB887",
    terrainTexture: "/textures/sand.jpg",
    isUnlocked: true,
    requiredLevel: 0
  },
  {
    id: "city",
    name: "Modern City",
    description: "Bustling urban environment with skyscrapers",
    emoji: "🏙️",
    backgroundColor: "#2F4F4F",
    fogColor: "#708090",
    fogDensity: 0.03,
    ambientLightColor: "#D3D3D3",
    ambientLightIntensity: 0.5,
    directionalLightColor: "#F5F5F5",
    directionalLightIntensity: 0.8,
    skyType: "gradient",
    skyColors: ["#2F4F4F", "#708090", "#D3D3D3"],
    terrainColor: "#696969",
    terrainTexture: "/textures/asphalt.png",
    isUnlocked: false,
    requiredLevel: 7
  },
  {
    id: "snow",
    name: "Winter Wonderland",
    description: "Snowy landscape with frosted trees",
    emoji: "❄️",
    backgroundColor: "#F0F8FF",
    fogColor: "#E6F3FF",
    fogDensity: 0.025,
    ambientLightColor: "#F0F8FF",
    ambientLightIntensity: 0.8,
    directionalLightColor: "#FFFAFA",
    directionalLightIntensity: 1.1,
    skyType: "gradient",
    skyColors: ["#F0F8FF", "#E6F3FF", "#FFFFFF"],
    terrainColor: "#FFFAFA",
    isUnlocked: false,
    requiredLevel: 10
  }
];

const DEFAULT_WEATHER: WeatherCondition[] = [
  {
    id: "clear",
    name: "Clear Sky",
    emoji: "☀️",
    fogDensity: 0.005,
    lightIntensity: 1.0,
    hasParticles: false,
    particleCount: 0,
    isUnlocked: true
  },
  {
    id: "cloudy",
    name: "Cloudy",
    emoji: "☁️",
    fogDensity: 0.015,
    lightIntensity: 0.7,
    hasParticles: false,
    particleCount: 0,
    isUnlocked: true
  },
  {
    id: "rain",
    name: "Rainy",
    emoji: "🌧️",
    fogDensity: 0.03,
    lightIntensity: 0.5,
    hasParticles: true,
    particleType: "rain",
    particleCount: 1000,
    ambientSound: "/sounds/rain.mp3",
    isUnlocked: true
  },
  {
    id: "snow",
    name: "Snowing",
    emoji: "🌨️",
    fogDensity: 0.025,
    lightIntensity: 0.8,
    hasParticles: true,
    particleType: "snow",
    particleCount: 500,
    isUnlocked: true
  },
  {
    id: "storm",
    name: "Storm",
    emoji: "⛈️",
    fogDensity: 0.05,
    lightIntensity: 0.3,
    hasParticles: true,
    particleType: "rain",
    particleCount: 2000,
    ambientSound: "/sounds/storm.mp3",
    isUnlocked: true
  },
  {
    id: "sunset",
    name: "Golden Sunset",
    emoji: "🌅",
    fogDensity: 0.01,
    lightIntensity: 0.9,
    hasParticles: false,
    particleCount: 0,
    isUnlocked: true
  }
];

const STORAGE_KEY = "environment-settings";

export const useEnvironment = create<EnvironmentState>()(
  subscribeWithSelector((set, get) => ({
    currentTheme: "grassland",
    currentWeather: "clear",
    showEnvironmentPanel: false,
    themes: DEFAULT_THEMES,
    weatherConditions: DEFAULT_WEATHER,
    
    setTheme: (themeId: string) => {
      const theme = get().themes.find(t => t.id === themeId);
      if (theme) {
        set({ currentTheme: themeId });
        get().saveToStorage();
        console.log("Environment theme changed to:", themeId);
      } else {
        console.error("Theme not found:", themeId);
      }
    },
    
    setWeather: (weatherId: string) => {
      const weather = get().weatherConditions.find(w => w.id === weatherId);
      if (weather && weather.isUnlocked) {
        set({ currentWeather: weatherId });
        get().saveToStorage();
        console.log("Weather changed to:", weatherId);
      } else {
        console.log("Weather is locked:", weatherId);
      }
    },
    
    toggleEnvironmentPanel: () => {
      set((state) => ({
        showEnvironmentPanel: !state.showEnvironmentPanel
      }));
    },
    
    unlockTheme: (themeId: string) => {
      set((state) => ({
        themes: state.themes.map(theme => 
          theme.id === themeId ? { ...theme, isUnlocked: true } : theme
        )
      }));
      get().saveToStorage();
      console.log("Theme unlocked:", themeId);
    },
    
    unlockWeather: (weatherId: string) => {
      set((state) => ({
        weatherConditions: state.weatherConditions.map(weather => 
          weather.id === weatherId ? { ...weather, isUnlocked: true } : weather
        )
      }));
      get().saveToStorage();
      console.log("Weather unlocked:", weatherId);
    },
    
    getCurrentTheme: () => {
      const { currentTheme, themes } = get();
      return themes.find(t => t.id === currentTheme) || themes[0];
    },
    
    getCurrentWeather: () => {
      const { currentWeather, weatherConditions } = get();
      return weatherConditions.find(w => w.id === currentWeather) || weatherConditions[0];
    },
    
    saveToStorage: () => {
      try {
        const { currentTheme, currentWeather, themes, weatherConditions } = get();
        const data = {
          currentTheme,
          currentWeather,
          themes,
          weatherConditions
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log("Environment settings saved");
      } catch (error) {
        console.error("Failed to save environment settings:", error);
      }
    },
    
    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          set({
            currentTheme: data.currentTheme || "grassland",
            currentWeather: data.currentWeather || "clear",
            themes: data.themes || DEFAULT_THEMES,
            weatherConditions: data.weatherConditions || DEFAULT_WEATHER
          });
          console.log("Environment settings loaded:", data.currentTheme, data.currentWeather);
        } else {
          // Set default values if no stored data
          set({
            currentTheme: "grassland",
            currentWeather: "clear",
            themes: DEFAULT_THEMES,
            weatherConditions: DEFAULT_WEATHER
          });
          console.log("Environment settings set to defaults");
        }
      } catch (error) {
        console.error("Failed to load environment settings:", error);
      }
    }
  }))
);