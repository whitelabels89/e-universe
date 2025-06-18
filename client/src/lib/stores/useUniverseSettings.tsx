import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface UniverseSettings {
  universeName: string;
  universeSubtitle: string;
  playerName: string;
  schoolName: string;
  customTheme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

interface UniverseSettingsState {
  settings: UniverseSettings;
  
  // Actions
  updateUniverseName: (name: string) => void;
  updateUniverseSubtitle: (subtitle: string) => void;
  updatePlayerName: (name: string) => void;
  updateSchoolName: (name: string) => void;
  updateCustomTheme: (theme: Partial<UniverseSettings["customTheme"]>) => void;
  resetToDefault: () => void;
  saveToStorage: () => void;
  loadFromStorage: () => void;
}

const DEFAULT_SETTINGS: UniverseSettings = {
  universeName: "Education Universe",
  universeSubtitle: "Universe",
  playerName: "Student",
  schoolName: "Virtual Academy",
  customTheme: {
    primaryColor: "#4A90E2",
    secondaryColor: "#50C878",
    accentColor: "#FF6B6B"
  }
};

const STORAGE_KEY = "universe-settings";

export const useUniverseSettings = create<UniverseSettingsState>()(
  subscribeWithSelector((set, get) => ({
    settings: DEFAULT_SETTINGS,
    
    updateUniverseName: (universeName: string) => {
      set((state) => ({
        settings: { ...state.settings, universeName }
      }));
      get().saveToStorage();
    },
    
    updateUniverseSubtitle: (universeSubtitle: string) => {
      set((state) => ({
        settings: { ...state.settings, universeSubtitle }
      }));
      get().saveToStorage();
    },
    
    updatePlayerName: (playerName: string) => {
      set((state) => ({
        settings: { ...state.settings, playerName }
      }));
      get().saveToStorage();
    },
    
    updateSchoolName: (schoolName: string) => {
      set((state) => ({
        settings: { ...state.settings, schoolName }
      }));
      get().saveToStorage();
    },
    
    updateCustomTheme: (theme: Partial<UniverseSettings["customTheme"]>) => {
      set((state) => ({
        settings: {
          ...state.settings,
          customTheme: { ...state.settings.customTheme, ...theme }
        }
      }));
      get().saveToStorage();
    },
    
    resetToDefault: () => {
      set({ settings: DEFAULT_SETTINGS });
      get().saveToStorage();
    },
    
    saveToStorage: () => {
      try {
        const { settings } = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        console.log("Universe settings saved:", settings);
      } catch (error) {
        console.error("Failed to save universe settings:", error);
      }
    },
    
    loadFromStorage: () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const settings = JSON.parse(stored);
          set({ settings: { ...DEFAULT_SETTINGS, ...settings } });
          console.log("Universe settings loaded:", settings);
        }
      } catch (error) {
        console.error("Failed to load universe settings:", error);
        set({ settings: DEFAULT_SETTINGS });
      }
    }
  }))
);